function hasNumber(myString) {
  return /\d/.test(myString);
}

function validate(JSONResponse) {
	try {
		return JSONResponse.response;
	} catch {
		alert(`Ошибка отправки ответа: ${JSONResponse.error}`);
	}
}

async function addWorker(workerNumber) {
	let username = document.getElementById(`username${workerNumber}`).value;
	let password = document.getElementById(`password${workerNumber}`).value;
	let status = document.getElementById(`status${workerNumber}`).value;

	if (hasNumber(status)) {
	
		var data = {
			user: 'apiKey',
			password: 'Igor Gygabyte moment',
			new: [username, password, status]
		};
	
		let resp = await fetch(`api?method=addWorker&data=${JSON.stringify(data)}`);
		let response = validate(await resp.json());
	} else {
		alert('Введите в статус число, пожалуйста!');
	}
}

async function deleteWorker(workerNumber) {
	let username = document.getElementById(`username${workerNumber}`).value;
	let password = document.getElementById(`password${workerNumber}`).value;
	let status = document.getElementById(`status${workerNumber}`).value;

	if (hasNumber(status)) {
	
		var data = {
			user: 'apiKey',
			password: 'Igor Gygabyte moment',
			new: [username, password]
		};
	
		let resp = await fetch(`api?method=deleteWorker&data=${JSON.stringify(data)}`);
		let response = validate(await resp.json());

		var toDelete = document.getElementById(`form${workerNumber}`);
		toDelete.remove();
	} else {
		alert('Введите в статус число, пожалуйста!');
	}
}

async function setter() {
	var addTo = document.getElementById('main-div');

	var data = {
		user: 'apiKey',
		password: 'Igor Gygabyte moment'
	};
	var resp = await fetch(`api?method=getWorkers&data=${JSON.stringify(data)}`);
	var response = (await resp.json()).response;

	text = '';
	for (let i = 0; i < response.length; i++) {
		text += `<div id="form${i}" class="form">
		<form>
			<input type="text" id="username${i}" value="${response[i][0]}">
			<input type="text" id="password${i}" value="${response[i][1]}">
			<input type="value" id="status${i}" value="${response[i][2]}">
		</form>
		<button class="btn btn-primary" onclick="addWorker(${i})">Добавить</button>
		<button class="btn btn-primary" onclick="deleteWorker(${i})">Удалить</button>
	</div>`;
	};

	addTo.innerHTML = text;
}

setter()
	.then()