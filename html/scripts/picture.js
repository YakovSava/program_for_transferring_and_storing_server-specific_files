async function getPhoto() {
	var data = {
		user: 'apiKey',
		password: 'Igor Gygabyte moment',
		path: document.location.pathname.slice(8)
	};

	let resp = await fetch(`/api?method=getPic&data=${JSON.stringify(data)}`);
	return await resp.json();
}

async function setPhoto() {
	var element = document.getElementById('two-pic');
	var pictures = await getPhoto();

	console.log(pictures);
	element.innerHTML = `<a href="/${pictures.response.a3d}">
		<img src="/${pictures.response.a3d}" width="1500px" height="1500">
	</a><a href="/${pictures.response.other}">
		<img src="/${pictures.response.other}" width="1500" height="1500">
	</a>`;
}

setPhoto().then();