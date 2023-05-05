const parser = new DOMParser();
var autorizeVar = false;


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
	
			var imgContainer = document.querySelector('.main__images');
			var text = '';

			console.log(response.response);
	
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

let sendButton = document.getElementById('btn-autorize');
sendButton.addEventListener('click', function() {
	autorize()
		.then()
		.catch(console.error)
});


// <div class="main__image">
//   <img src="img/exmp.png" alt="" width="350px" height="350px" id="img_0">
//   <a href="#">example</a>
// </div>