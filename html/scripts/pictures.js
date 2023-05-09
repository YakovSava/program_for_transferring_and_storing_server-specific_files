async function getPhoto() {
	var data = {
		username: 'apiKey',
		password: 'Igor Gygabyte moment',
		path: document.location.pathname
	}

	let resp = await fetch(`api?method=getPic?data=${JSON.stringify(data)}`);
	return await resp.json();
}

async function setPhoto() {
	var element = document.getElementById('two-pic');
	var pictures = await getPhoto()

	element.innerHTML = `<a href="${pictures.a3d}">
		<img src="${pictures.a3d}">
	</a><a href="${pictures.other}">
		<img src="${pictures.other}">
	</a>`;
}

setPhoto().then()