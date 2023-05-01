async function sendFilters() {
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
    if (filterArray.includes(0)) {
        alert("Заполните все поля используя числа");
    } else {
        let promise = fetch(``)
    }
}

for (var i = 0; i < array.length; i++) {
    var img = document.createElement("img");

    img.src = array[i][0][1];
    img.alt = array[i][1];
}

let response = await fetch(`.../api?method=getFilesList&data={'user': 'apiKey', 'password': '******************', 'filters': ${JSON.stringify(result)}`);

if (response.ok) { // если HTTP-статус в диапазоне 200-299
  // получаем тело ответа (см. про этот метод ниже)
  let json = await response.json();
} else {
  alert("Ошибка HTTP: " + response.status);
}