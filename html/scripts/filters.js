async function getList() {
	var array2d = [
		[document.getElementById('input1').value, document.getElementById('input2').value],
		[document.getElementById('input3').value, document.getElementById('input4').value],
		[document.getElementById('input5').value, document.getElementById('input6').value]
	];
	var data = {
		username: 'apiKey',
		password: '******',
		filters: array2d
	};

	var response = await fetch(`/api?method=getFilesList&data=${JSON.stringify(data)}`);

	var backend_response = await response.json();

	// Тут надо просто таблицу сделать
}