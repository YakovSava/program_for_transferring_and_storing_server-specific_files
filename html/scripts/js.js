// const parser = new DOMParser();
var autorizeVar = false;
var autorizeData = [];

function div(val, by){
	return (val - val % by) / by;
}

function cookieToJSON(cookie) {
	return JSON.parse(cookie.slice(7));
}

function JSONToCookie(cookieJSON) {
	return `cookie=${JSON.stringify(cookieJSON)};`
}

function sendCookie(cookie) {
	document.cookie = JSONToCookie(cookie);
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
	try {
		let urlData = JSON.parse(decodeURIComponent(document.location.search.slice(1)));
		return urlData.visitor;
	} catch {
		return false;
	}
}

function ScaleImage(Img){

	var Size = 100000, nW = Img.naturalWidth, nH = Img.naturalHeight, W = nW, H = nH, Scale = 1;

	if((W * H) > Size){

	while((W * H) > Size){ Scale -= 0.01; W = nW * Scale; H = nH * Scale; }
	} else {
		while ((W * H) < Size){ Scale += 0.01; W = nW * Scale; H = nH * Scale; }
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
				[0, 2],
				[1, 1000],
				[1, 1000]
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

// function copyToClipboard(textToCopy) {
// 	if (navigator.clipboard) {
// 		navigator.clipboard.writeText(textToCopy)
// 		alert('Текст скоыпирован в буфер обмена!');
// 	} else {
// 		alert('Ваш браузер не поддерживает копирование в буфер обмена!');
// 	}
// }

function shareLink() {
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

	var data = {
		visitor: true,
		filters: result
	}

	window.location.href = `${document.location.protocol}//${document.location.host}/?${JSON.stringify(data)}`;
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

		var imgs = document.querySelectorAll('img');
		for (let i = 0; i < imgs.length; i++) {
			imgs[i].onload = function(){
				ScaleImage(this)
			}
		}
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

	var adminDiv = document.getElementById('to-admin');
	if (response2.admin) {
		adminDiv.innerHTML = `<a class="btn btn-secondary" href="${document.location.protocol}//${document.location.host}/admin">Manager panel</a>`;
	}
	adminDiv.innerHTML += `<button class="btn btn-secondary" onclick="shareLink()">Гостевая страница</button>`
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

		var adminDiv = document.getElementById('to-admin');
		if (response2.admin) {
			adminDiv.innerHTML = `<a class="btn btn-secondary" href="${document.location.protocol}//${document.location.host}/admin">Manager panel</a>`;
		}
		adminDiv.innerHTML += `<button class="btn btn-secondary" onclick="shareLink()">Гостевая страница</button>`

		var inputs = document.querySelectorAll('input');

		for (let i = 0; i < inputs.length-2; i += 2) {
			inputs[i].value = response2.values[div(i, 2)][0];
			inputs[i+1].value = response2.values[div(i, 2)][1];
		}

		let data = {
			user: "apiKey",
			password: "Igor Gygabyte moment",
			filters: [
				[0, 1000],
				[0, 1000],
				[0, 1000]
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
			}
		}
	}
}

async function helloVisitor() {
	let visitorData = JSON.parse(decodeURIComponent(document.location.search.slice(1)));

	let filterPanel = document.getElementById('table__form');
	filterPanel.parentNode.removeChild(filterPanel);

	let data = {
			user: "apiKey",
			password: "Igor Gygabyte moment",
			filters: visitorData.filters
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

		var imgs = document.querySelectorAll('img');
		for (let i = 0; i < imgs.length; i++) {
			imgs[i].onload = function(){
				ScaleImage(this)
			}
		}
	}
}

let sendButton = document.getElementById('btn-autorize');
sendButton.addEventListener('click', function() {
	autorize()
		.then();
});

var inputFields = document.querySelectorAll('input');
for (let i = 0; i < inputFields.length; i++) {
	if ((inputFields[i].id !== 'username') && (inputFields[i].id !== 'password')) {
		inputFields[i].addEventListener('change', function() {
			sendFilters().then();
		});
	}
}

if (checkVisitor()) {
	helloVisitor()
		.then();
} else {
	checkCookie()
		.then();
}
