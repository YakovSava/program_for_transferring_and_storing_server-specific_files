const parser = new DOMParser();
var autorizeVar = false;
var autorizeData = [];

// document.cookie = 'cookie={"autorize": ["admin", "admin"], "values": [0, 3456, 0, 5678, 0, 45678]};';

function div(val, by){
	return (val - val % by) / by;
}

function cookieToJSON(cookie) {
	// console.log(cookie.slice(7));
	return JSON.parse(cookie.slice(7));
}

function JSONToCookie(cookieJSON) {
	return `cookie=${JSON.stringify(cookieJSON)};`
}

function sendCookie(cookie) {
	document.cookie = JSONToCookie(cookie);
}

function resizeImage(width, height, n) {
	console.log(width, height);
	if (height <= n) {
		return [width, height];
	}
	while (height > n) {
		width -= 1;
		height -= 1;
	}
	console.log('SET!', width, height);
	return [width, height];
}

function destroyGrid() {
	let imagesGridElement = document.querySelector('.main__images');

	imagesGridElement.innerHTML = 'По данным фильтрам ничего не найдено!';
}

function popUp() {
	document.querySelector(".background").classList.toggle("blur");
	document.querySelector(".pop-up-autorize").classList.toggle("active");
}

function popUpClose() {
	document.querySelector(".background").classList.remove("blur");
	document.querySelector(".pop-up-autorize").classList.remove("active");
}

function checkVisitor() {
	console.log(document.location.search.split('/')[0].slice(6).replace('%22', '"').replace('%22', '"').replace('%22', '"').replace('%22', '"').replace('%22', '"'));
	let urlData = JSON.parse(document.location.search.split('/')[0].slice(6).replace('%22', '"').replace('%22', '"').replace('%22', '"').replace('%22', '"').replace('%22', '"'));
	return true;
}

function ScaleImage(Img){

	var Size=100000, nW=Img.naturalWidth, nH=Img.naturalHeight, W=nW, H=nH, Scale=1;

	if((W*H)>Size){

	while((W*H)>Size){ Scale-=0.01; W=nW*Scale; H=nH*Scale; }
	} else {
		while ((W*H)<Size){ Scale+=0.01; W=nW*Scale; H=nH*Scale; }
	} 

	Img.width = Math.round(W); Img.height=Math.round(H);

}

async function cookieAutorize(autorize) {
	autorizeData = autorize;
	let data = {
		user: 'apiKey',
		password: 'Igor Gygabyte moment',
		cookie: {
			autorize: autorize,
			values: [
				[1, 1],
				[1, 1],
				[1, 1]
			]
		}
	};

	await fetch(`api?method=saveCookie&data=${JSON.stringify(data)}`);

	sendCookie(data.cookie);
}

async function cookieFilters(filters) {
	let data = {
		user: 'apiKey',
		password: 'Igor Gygabyte moment',
		cookie: {
			autorize: autorizeData,
			values: filters
		}
	};

	// console.log(data)
	await fetch(`api?method=saveCookie&data=${JSON.stringify(data)}`);

	sendCookie(data.cookie);
}

async function sendFilters() {
	destroyGrid();
	if (autorizeVar) {
		let i = -1;
		let filterArray = [];
		let result = [];
		while (i < 5) {
			i++
			let filter = Number(document.querySelectorAll("input")[i].value);
			filterArray.push(filter);
		}
		while (filterArray.length) {
			result.push(filterArray.splice(0, 2));
		}
		if (result.includes(0)) {
			alert("Заполните все поля используя числа");
		} else {
			let data = {
				user: "apiKey",
				password: "Igor Gygabyte moment",
				filters: result
			};
			let resp = await fetch(`api?method=getFilesList&data=${JSON.stringify(data)}`);
			let response = await resp.json();

			await cookieFilters(result);
	
			var imgContainer = document.querySelector('.main__images');
			var text = '';

			// console.log(response.response);
	
			for (let i = 0; i < response.response.length; i++) {
				if (i % 3 === 0) {
					text += '<div class="main__image_block">'
				}
				text += `<div class="main__image">
		<img src="${response.response[i].files.a3d}" width="350px" height="350px" id="img_${i}" onmouseover="this.src='${response.response[i].files.two}';" onmouseout="this.src='${response.response[i].files.a3d}';">
		<a href="/picture/${response.response[i].autor}/${response.response[i].project}">${response.response[i].project} от ${response.response[i].autor}</a>
	</div>`;
				imgContainer.innerHTML = text;

				if (i % 3 === 2) {
					text += '</div>'
				}
			}
			let title = document.getElementById('table__title');

			title.innerHTML = `Поиск по фильтру (отображено ${response.response.length} результатов)`;
		};
	} else {
		alert('Вы не авторизованы!');
	}
};


async function autorize() {
	let username = document.getElementById('username').value;
	let password = document.getElementById('password').value;

	let data = {
		user: 'apiKey',
		password: 'Igor Gygabyte moment',
		autorize: {
			username: username,
			password: password
		}
	};

	let response = await fetch(`api?method=autorize&data=${JSON.stringify(data)}`);

	let json = await response.json();

	if (json.response) {
		autorizeVar = true;
		document.querySelector(".background").classList.remove("blur");
		document.querySelector(".pop-up-autorize").classList.remove("active");

		let btn = document.getElementById('btn btn-dark header__btn_1');
		btn.innerHTML = "Вы вошли!";


		await cookieAutorize([username, password]);
	} else {
		alert('Неверный логин или пароль!');
	}

	if (response.admin) {
		var adminDiv = document.getElementById('to-admin');
		adminDiv.innerHTML = `<a class="btn btn-secondary" href="${document.location.protocol}//${document.location.host}/admin">Manager panel</a>`
	}
}

async function checkCookie() {
	let data = {
		user: 'apiKey',
		password: 'Igor Gygabyte moment',
		cookie: cookieToJSON(document.cookie)
	};

	var resp = await fetch(`api?method=checkCookies&data=${JSON.stringify(data)}`);
	var response = await resp.json();

	if (response.response) {
		let data2 = {
			user: 'apiKey',
			password: 'Igor Gygabyte moment',
			cookie: cookieToJSON(document.cookie)
		};

		var resp2 = await fetch(`api?method=checkCookies&data=${JSON.stringify(data2)}`);
		let response2 = await resp2.json();

		autorizeVar = true;
		autorizeData = data2.cookie.autorize;

		let btn = document.getElementById('btn btn-dark header__btn_1');
		btn.innerHTML = "Вы вошли!";

		if (response2.admin) {
			var adminDiv = document.getElementById('to-admin');
			adminDiv.innerHTML = `<a class="btn btn-secondary" href="${document.location.protocol}//${document.location.host}/admin">Manager panel</a>`;
		}

		var inputs = document.querySelectorAll('input');

		for (let i = 0; i < inputs.length-2; i += 2) {
			inputs[i].value = response2.values[div(i, 2)][0];
			inputs[i+1].value = response2.values[div(i, 2)][1];
		}

		let data = {
			user: "apiKey",
			password: "Igor Gygabyte moment",
			filters: [
				[0, 123456789],
				[0, 123456789],
				[0, 123456789]
			]
		};
		let resp = await fetch(`api?method=getFilesList&data=${JSON.stringify(data)}`);
		let response = await resp.json();

		var imgContainer = document.querySelector('.main__images');
		var text = '';

		for (let i = 0; i < response.response.length; i++) {
			if (i % 3 === 0) {
				text += '<div class="main__image_block">'
			}
			text += `<div class="main__image">
	<img src="${response.response[i].files.a3d}" id="img_${i}" onmouseover="this.src='${response.response[i].files.two}';" onmouseout="this.src='${response.response[i].files.a3d}';">
	<a href="/picture/${response.response[i].autor}/${response.response[i].project}">${response.response[i].project} от ${response.response[i].autor}</a>
</div>`;
			imgContainer.innerHTML = text;

			if (i % 3 === 2) {
				text += '</div>'
			}
		}
		let title = document.getElementById('table__title');

		title.innerHTML = `Поиск по фильтру (отображено ${response.response.length} результатов)`;

		var imgs = document.querySelectorAll('img');
		for (let i = 0; i < imgs.length; i++) {
			imgs[i].onload = function(){
				ScaleImage(this)
				// if ((this.old_width != undefined) && (this.old_height != undefined)) {
				// 	this.width = this.old_width;
				// 	this.height = this.old_height;
				// }

				// var width = this.width;
				// var height = this.height;

				// // this.width = div(width, 3);
				// // this.height = div(height, 3);

				// let _temp = resizeImage(this.width, this.height, 100);

				// this.width = _temp[0];
				// this.height = _temp[1];

				// this.old_width = _temp[0];
				// this.old_height = _temp[1];
			}
		}
	}
}

let sendButton = document.getElementById('btn-autorize');
sendButton.addEventListener('click', function() {
	autorize()
		.then()
		.catch(console.error)
});

var inputFields = document.querySelectorAll('input');
for (let i = 0; i < inputFields.length; i++) {
	if ((inputFields[i].id !== 'username') || (inputFields[i].id !== 'password')) {
		inputFields[i].addEventListener('change', function() {
			sendFilters().then()
		});
	}
}

if (true) {
	checkCookie()
		.then();
}

checkVisitor()