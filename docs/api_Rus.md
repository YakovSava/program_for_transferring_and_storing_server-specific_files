# Список методов API, как к ним обращаться и почему это никто не прочтёт?
На данной странице, будут предоставлены методы API, как в них передавать параметры, примеры кода.
Примечания:
- Тут не используется доменное имя в примерах. Т.е. имя в примере должно быть: `http://yourip.com/api?method=...&data=...`, однако в примерах будут указываться лишь `/api?method=...&data=...`
- Примеры будут для языков программирования *Python* и *JavaScript*

## Перейдём от слов к делу
### Простой *API* запрос
`/api?method=test&data={'user': 'apiKey', 'password': '******************'}` - разберём по частям:
- `/api?` - Указываем что обращаемся к API
- `method=test` - Указываем метод
- `data={'user': 'apiKey', 'password': '******************'}` - Указываем данные. Ключ доступа к API выдаётся индивидуальный каждому человеку
<blockquote> МЕТОД И ДАННЫЕ ОБЯЗАТЕЛЬНО ДЖОЛЖНЫ БЫТЬ РАЗДЕЛЕНЫ АМПЕРСАНДОМ! (&) </blockquote>
<blockquote> В каждом запросе API должен быть находиться ваш логин и пароль </blockquote>

Сервер на данный тестовый запрос должен ответить следующее: `{'response': 1}`

#### Примеры кода
```python
from requests import get

data = get(".../api?method=test&data={'user': 'apiKey', 'password': '******************'}").json()
print(data['response']) # 1
```

```javascript
var xhr = new XMLHttpRequest();

xhr.open('GET', ".../api?method=test&data={'user': 'apiKey', 'password': '******************'}", false);
xhr.send();

if (xhr.readyState === 4 && xhr.status === 200) {
    let data = JSON.parse(xhr.responseText);
    console.log(data.response); // 1
}

```

### Получение списка файлов и ссылок на картинки
`/api?method=getFilesList&data={'user': 'apiKey', 'password': '******************', 'filters': [[1.5,1.5],[2,7],[1,5]]}`
Разберём эту строку подробнее:
`getFilesList` - Это метод который, очевидно, возвращает JSON, внутри которого находятся следующие данные:
```json
{"response": {
    "architector": ["filename", "png/path/to/png"],
    "architector2": ["filename2", "png/path/to/png2"], 
    "architector3": ["filename3", "png/path/to/png3"]
  }
}
```

Здесь мы получаем:
- `architector name` - Имя архитектора внутри директории которого есть данная директория
- `path name` - Директория со всеми основными файлами 
- `png/path/to/png` - Ссылка на картинку которую необходимо вставить в src

#### Примеры кода
```python
from requests import get

data = get(".../api?method=getFilesList&data={'user': 'apiKey', 'password': '******************', 'filters': [[1.5,1.5],[2,7],[1,5]]}").json()
print(data['response']) # [[["architector name", "path name"], "png/path/to/png"], [["architector name 2", "path name"], "png/path/to/png2"], [["architector name 3", "path name"], "png/path/to/png3"]] 
```

```javascript
var xhr = new XMLHttpRequest();

xhr.open('GET', ".../api?method=getFilesList&data={'user': 'apiKey', 'password': '******************', 'filters': [[1.5,1.5],[2,7],[1,5]]}", false);
xhr.send();

if (xhr.readyState === 4 && xhr.status === 200) {
    let data = JSON.parse(xhr.responseText);
    console.log(data.response); // [[["architector name", "path name"], "png/path/to/png"], [["architector name 2", "path name"], "png/path/to/png2"], [["architector name 3", "path name"], "png/path/to/png3"]] 
}
```

### Удаление или добавление нового рабочего
<blockquote> Эти 2 метода находятся в одной категории ибо очень слабо друг от друга отличаются (по крайней мере в API) </blockquote>

#### Добавление рабочего:
<blockquote> ДОБАВЛЯТЬ МОЖЕТ ТОЛЬКО ПОЛЬЗОВАТЕЛЬ 2 И БОЛЕЕ УРОВНЯ! </blockquote>

`/api?method=addNewWorker&data={'user': 'apiKey', 'password': '******************', 'new': ['UserName', 'UserPassword', 1]}`
Тут уже передаются какие-то специфические данные, давайте их рассмотрим:
```json lines
    "new": ["UserName", "UserPassword", 1]
```
Что тут что и как тут разобраться? Всё очень просто!
- `UserName` - Очевидно будет подумать что это имя пользователя и вы будете абсолютно правы!
- `UserPassword` - Так же очевидная вещь, это пароль нового пользователя
- `1` - А тут уже всё не так просто как можно подумать. Тут уже идёт доступность к файлу, всего есть 3:
    - 1 `Архитектор` - имеет доступ к индивидуальной директории которая носит название его UserName
    - 2 `Менеджер` - имеет доступ ко всем папкам, а так же к панели управления
    - 3 `Админ` - тоже самое что и `Менеджер`, но така же имеет доступ к исходному коду

#### Удаление рабочего
<blockquote> ДОБАВЛЯТЬ МОЖЕТ ТОЛЬКО ПОЛЬЗОВАТЕЛЬ 2 И БОЛЕЕ УРОВНЯ! </blockquote>

`/api?method=deleteWorker&data={'user': 'apiKey', 'password': '******************', 'delete': ['UserName', 'UserPassword']}`
Тут полностью тоже самое... Кроме цифры

### Примеры кода
```Python
from requests import get

data = get(".../api?method=addNewWorker&data={'user': 'apiKey', 'password': '******************', 'new': ['UserName', 'UserPassword', 1]}").json()
print(data['response']) # 1
data = get(".../api?method=deleteWorker&data={'user': 'apiKey', 'password': '******************', 'delete': ['UserName', 'UserPassword']}").json()
print(data['response']) # 1
```

```javascript
var xhr = new XMLHttpRequest();

xhr.open('GET', ".../api?method=addNewWorker&data={'user': 'apiKey', 'password': '******************', 'new': ['UserName', 'UserPassword', 1]}", false);
xhr.send();

if (xhr.readyState === 4 && xhr.status === 200) {
    let data = JSON.parse(xhr.responseText);
    console.log(data.response); // 1
}

xhr.open('GET', ".../api?method=deleteWorker&data={'user': 'apiKey', 'password': '******************', 'delete': ['UserName', 'UserPassword']}", false);
xhr.send();

if (xhr.readyState === 4 && xhr.status === 200) {
    let data = JSON.parse(xhr.responseText);
    console.log(data.response); // 1
}
```

## Получение размера загруженных файлов
`/api?method=getFileSizes&data={'user': 'apiKey', 'password': '******************'}`
Данный метод (`getFileSizes`) возвращает количество загруженных файлов всеми пользователями. Ответом будет следующая строка:
```json
{
  "response": 56782 // Ответ возвращается в байтах
}
```

### Примеры кода
```Python
from requests import get

data = get(".../api?method=getFileSizes&data={'user': 'apiKey', 'password': '******************'}").json()
print(data['response']) # 56782
```

```javascript
var xhr = new XMLHttpRequest();

xhr.open('GET', ".../api?method=getFileSizes&data={'user': 'apiKey', 'password': '******************'}", false);
xhr.send();

if (xhr.readyState === 4 && xhr.status === 200) {
    let data = JSON.parse(xhr.responseText);
    console.log(data.response); // 56782
}
```

## Некоторые ошибки:
- `{"error": "Access denied!"}` Нет доступа к методу
- `{"error": "Invalid method!"}` Неверный метод или неверно написанный метод
- `{"error": "Wrong password!"}` Неверный пароль (при удалении рабочего)
- `{"error": "This worker not exists!"}` Запись рабочего не существует (при удалении)
- `{"error": "This worker exists!"}` Запись уже существует (при добавлении)

## Древо необходимое для директории `html/`
```
html/
│   index.html
│
├───scripts/
│       script1.js
│       script2.js
│       script3.js
│       script4.js
│       script5.js
│
└───styles/
        style.css
        reset.scss
        locker.scss
```