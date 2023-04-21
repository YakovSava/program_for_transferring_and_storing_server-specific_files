# from hashlib import sha256
from toml import loads, dumps
from typing import NoReturn
from aiohttp.web import RouteTableDef, Request, Response, json_response
from aiofiles import open as aiopen
from plugins.html import Pagenator

routes = RouteTableDef()
page = Pagenator()

def _protector(data:str) -> str:
    def _check_cruck(string:str) -> bool:
        try: loads(string)
        except: return True
        else: return False

    tmp = data.split('\n')
    while _check_cruck(data):
        data = '\n'.join(tmp[:-1])
        tmp = tmp[:-1]
    return data

async def _get_token_file() -> dict:
    async with aiopen('../tokens.toml', 'r', encoding='utf-8') as file:
        try: return loads(await file.read())
        except: return loads(_protector(await file.read()))

async def _set_token_file(datas:dict) -> NoReturn:
    async with aiopen('../tokens.toml', 'r', encoding='utf-8') as file:
        await file.write(dumps(datas))

@routes.get('/user')
async def main_user(request:Request):
    '''
    url path:
    http://your_ip.com/user?<username>&<session token>
    '''
    user, token = str(request.url).split('?')[1].split('&')
    all_tokens = await _get_token_file()
    if token in all_tokens['sessions']['name']:
        await page.get_page('index.html')

@routes.get('/api')
async def api_page(request:Request):
    '''
    url path:
    http://your_ip.com/api?method=<method>&data=<data>
    '''
    def _join_string(string:str) -> dict:
        string = '"' + (string
                    .replace('=', '"="')
                    .replace('&', '", "')
                    .replace('"{', '{')
                )
        '''
        Input:
            method=exampleMethod&data={'aaa': 'bbb'}
        Output:
            {
                'method': 'exampleMethod',
                'data': {
                    'aaa': 'bbb'
                }
            }
        '''
        return eval(f'dict({string})')
    data = str(request.url).split('?')[1]
    data = _join_string(data)
    user, password = data['data']['user'], data['data']['password']
    tokens = await _get_token_file()
    if tokens.get(user) is not None:
        if tokens[user]['password'] == password: # sha256(password.encode()).hexdigest()
            if data['method'] == 'getFilesList':
                '''
                Response:
                    {'response': [
                        [['architector', 'filename'], 'png/path/to/png'],
                        [['architector2', 'filename2'], 'png/path/to/png2'],
                        [['architector3', 'filename3'], 'png/path/to/png3']
                    ]}
                '''
                return json_response(data={'response': await page.get_files_and_paths()})
            elif data['method'] == 'test':
                return json_response(data={'response': 'Ok!'})
            elif data['method'] == 'addNewWorker':
                '''
                Data example:
                    {
                        'method': 'addNewWorker',
                        'data': {
                            'user': 'apiKey',
                            'password': '**************************',
                            'new': ['NewUserName', 'NewUserPassword', userStatus(1)]
                                // 1 - architector
                                // 2 - manager
                                // 3 - admin
                        }
                    }
                '''
                new_user_name, new_user_password, new_user_status = data['data']['new']
                tokens = await _get_token_file()
                if tokens.get(new_user_name) is not None:
                    return json_response(data={'error': 'This worker exists!'})
                tokens[new_user_name] = {'password': new_user_password, 'status': new_user_status} # sha256(new_user_password.encode()).hexdigest()
                await _set_token_file(tokens)
                return json_response(data={'response': 1})
            elif data['method'] == 'deleteWorker':
                '''
                Example data:
                    {
                        'method': 'addNewWorker',
                        'data': {
                            'user': 'apiKey',
                            'password': '**************************',
                            'delete': ['UserName', 'UserPassword']
                    }
                '''
                user_name, user_password = data['data']['delete']
                tokens = await _get_token_file()
                if tokens.get(user_name) is not None:
                    return json_response(data={'error': 'This worker not exists!'})
                if user_password != tokens[user_name]['password']: # sha256(user_password.encode()).hexdigest()
                    return json_response(data={'error': 'Wrong password!'})
                del tokens[user_name]
                await _set_token_file(tokens)
                return json_response(data={'response': 1})
            else:
                return json_response(data={'error': 'Invalid method!'})
        else:
            return json_response(data={'error': 'Access denied!'})
    else:
        return json_response(data={'error': 'Access denied!'})