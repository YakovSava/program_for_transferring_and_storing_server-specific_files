const parser = new DOMParser();

async function autorize() {
	username = document.getElementById('username');
	password = document.getElementById('password');

	data = {
		user: 'apiKey',
		password: '******',
		autorize: {
			username: username,
			password: password
		}
	};

	response = await fetch(`/api?method=autorize&data=${JSON.stringify(data)}`);

	json = await response.json();

	if (json.response) {
		data = {
			user: 'apiKey',
			password: '******'
		}

		response = await fetch(`/api?method=getAutorizePage&data=${JSON.stringify(data)}`)
		html_page = parser.parseFromString(await response.text(), 'text/html');

		document.documentElement.innerHTML = '';
		document.documentElement.appendChild(html_page);
	} else {
		alert('Неверный логин или пароль!');
	}
}