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

	console.log(pictures.response.other);
	text = `<a href="/${pictures.response.a3d}">
		<img src="/${pictures.response.a3d}">
	</a>`;
	for (let i = 0; i < pictures.response.other.length; i++) {
		text += `<a href="/${pictures.response.other[i]}">
		<img src="/${pictures.response.other[i]}">
	</a>`
	}
	element.innerHTML = text
}

setPhoto().then();