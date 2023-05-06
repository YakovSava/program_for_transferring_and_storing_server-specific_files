const parser = new DOMParser();
var autorizeVar = false;
var autorizeData = [];

function div(val, by){
    return (val - val % by) / by;
}

function getCookie() {
	var obj = {};
	var cookies = document.cookie.split(/;/);
	for (var i = 0, len = cookies.length; i < len; i++) {
		var cookie = cookies[i].split(/=/);
		obj[cookie[0]] = cookie[1];
	}
	return obj;
}

function sendCookie(cookieObj) {
	var cookieStr = Object.keys(cookieObj).map(function(key) {
		return key + '=' + cookieObj[key];
	}).join(';');
	
	document.cookie = cookieStr;
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

	await fetch(`api?method=saveCookie&data=${JSON.stringify(data)}`);

	sendCookie(data.cookie);
}

async function sendFilters() {
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
				// console.log(response.response[0][i][1])
					text += `<div class="main__image">
		<img src="${response.response[i].files.a3d}" width="350px" height="350px" id="img_${i}" onmouseover="this.src='${response.response[i].files.two}';" onmouseout="this.src='${response.response[i].files.a3d}';">
		<a href="#">${response.response[i].project} от ${response.response[i].autor}</a>
	</div>`;
					imgContainer.innerHTML = text;
			}
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

		var adminDiv = document.getElementById('to-admin');
		adminDiv.innerHTML = `<a class="btn btn-secondary" href="${document.location.protocol}//${document.location.host}/admin">Manager panel</a>`

		await cookieAutorize([username, password]);
	} else {
		alert('Неверный логин или пароль!');
	}
}

function popUp() {
	document.querySelector(".background").classList.toggle("blur");
	document.querySelector(".pop-up-autorize").classList.toggle("active");
}

function popUpClose() {
	document.querySelector(".background").classList.remove("blur");
	document.querySelector(".pop-up-autorize").classList.remove("active");
}

async function checkCookie() {
	let data = {
		user: 'apiKey',
		password: 'Igor Gygabyte moment',
		cookie: getCookie()
	};

	var resp = await fetch(`api?method=checkCookies&data=${JSON.stringify(data)}`);
	let response = await resp.json();

	if (response.response) {
		let data2 = {
			user: 'apiKey',
			password: 'Igor Gygabyte moment',
			cookie: getCookie()
		};

		var resp2 = await fetch(`api?method=checkCookies&data=${JSON.stringify(data2)}`);
		let response2 = await resp2.json();

		autorizeVar = true;

		let btn = document.getElementById('btn btn-dark header__btn_1');
		btn.innerHTML = "Вы вошли!";

		var adminDiv = document.getElementById('to-admin');
		adminDiv.innerHTML = `<a class="btn btn-secondary" href="${document.location.protocol}//${document.location.host}/admin">Manager panel</a>`;

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

			// await cookieFilters(data.filters);
	
			var imgContainer = document.querySelector('.main__images');
			var text = '';

			// console.log(response.response);
	
			for (let i = 0; i < response.response.length; i++) {
				// console.log(response.response[0][i][1])
					text += `<div class="main__image">
		<img src="${response.response[i].files.a3d}" width="350px" height="350px" id="img_${i}" onmouseover="this.src='${response.response[i].files.two}';" onmouseout="this.src='${response.response[i].files.a3d}';">
		<a href="#">${response.response[i].project} от ${response.response[i].autor}</a>
	</div>`;
					imgContainer.innerHTML = text;
			}
	}
}

let sendButton = document.getElementById('btn-autorize');
sendButton.addEventListener('click', function() {
	autorize()
		.then()
		.catch(console.error)
});

checkCookie()
	.then()