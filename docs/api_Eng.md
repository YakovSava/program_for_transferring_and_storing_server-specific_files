# List of API methods, how to access them and why no one will read it?
On this page, API methods will be provided, how to pass parameters in them, code examples.
Notes:
- The domain name in the examples is not used here. I.e. the name in the example should be: `http://yourip.com/api?method=...&data=...`, however, only `/api?method=...&data=...` will be specified in the examples
- Examples will be for programming languages *Python* and *JavaScript*

## Let's move from words to deeds
### Simple *API* request
`/api?method=test&data={'user': 'apiKey', 'password': '******************'}` - let's take it apart in parts:
- `/api?` - Indicate that we are contacting to the API
- `method=test` - Specifying the method
- `data={'user': 'apiKey', 'password': '******************'}` - We specify the data. The API access key is issued individually to each person
<blockquote> THE METHOD AND THE DATA MUST NECESSARILY BE SEPARATED BY AN AMPERSAND! (&) </blockquote>
<blockquote> Each API request must contain your username and password </blockquote>

The server should respond to this test request as follows: `{'response': 1}`

#### Code examples
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

### Getting a list of files and links to images
`/api?method=getFilesList&data={'user': 'apiKey', 'password': '******************'}`
Let's analyze this line in more detail:
`getFilesList` is a method that obviously returns JSON, inside which the following data is located:
```json
{"response": [
  [["architector name", "path name"], "png/path/to/png"],
  [["architector name 2", "path name"], "png/path/to/png2"],
  [["architector name 3", "path name"], "png/path/to/png3"]
]}
```

Here we get:
- `architect name` - The name of the architect whose directory contains this directory
- `path name` - Directory with all the main files 
- `png/path/to/png` - Link to the image to be inserted into src

#### Code examples
```python
from requests import get

data = get(".../api?method=getFilesList&data={'user': 'apiKey', 'password': '******************'}").json()
print(data['response']) # [[["architector name", "path name"], "png/path/to/png"], [["architector name 2", "path name"], "png/path/to/png2"], [["architector name 3", "path name"], "png/path/to/png3"]] 
```

```javascript
var xhr = new XMLHttpRequest();

xhr.open('GET', ".../api?method=getFilesList&data={'user': 'apiKey', 'password': '******************'}", false);
xhr.send();

if (xhr.readyState === 4 && xhr.status === 200) {
    let data = JSON.parse(xhr.responseText);
    console.log(data.response); // [[["architector name", "path name"], "png/path/to/png"], [["architector name 2", "path name"], "png/path/to/png2"], [["architector name 3", "path name"], "png/path/to/png3"]] 
}
```

### Deleting or adding a new worker
<blockquote> These 2 methods are in the same category because they differ very little from each other (at least in the API) </blockquote>

#### Adding a worker:
<blockquote> ONLY A USER OF LEVEL 2 OR MORE CAN ADD! </blockquote>

`/api?method=addNewWorker&data={'user': 'apiKey', 'password': '******************', 'new': ['UserName', 'UserPassword', 1]}`
Some specific data is already being transmitted here, let's look at them:
```json lines
    "new": ["UserName", "UserPassword", 1]
```
What's what and how to figure it out? It's very simple!
- `UserName` - It will obviously be thought that this is the username and you will be absolutely right!
- `userPassword` is also an obvious thing, it is the password of a new user
- `1` - And here everything is not as simple as you might think. There is already access to the file, there are 3 in total:
- 1 `Architect` - has access to an individual directory called his UserName
- 2 `Manager` - has access to all folders, as well as to the control panel
- 3 `Admin` - the same as `Manager', but taka also has access to the source code

#### Deleting a worker
<blockquote> ONLY A USER OF LEVEL 2 OR MORE CAN ADD! </blockquote>

`/api?method=deleteWorker&data={'user': 'apiKey', 'password': '******************', 'delete': ['UserName', 'UserPassword']}`
It's completely the same here... Except for the number

### Code examples
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

## Getting the size of uploaded files
`/api?method=getfilesize&data={'user': 'apiKey', 'password': '******************'}`
This method (`getfilesize`) returns the number of files uploaded by all users. The response will be the following line:
``json
{
    "response": 56782 // The response is returned in bytes
}
``

### Code examples
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

## Some mistakes:
- `{"error": "Access denied!"}` There is no access to the method
- `{"error": "Invalid method!"}` Invalid method or incorrectly written method
- `{"error": "Wrong password!"}` Invalid password (when deleting a worker)
- `{"error": "This worker not exists!"}` The worker record does not exist (when deleted)
- `{"error": "This worker exists!"}` The record already exists (when added)

## The tree required for the directory `html/`
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
```