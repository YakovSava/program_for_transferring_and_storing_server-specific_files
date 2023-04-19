from toml import loads, dumps
from typing import NoReturn
from aiohttp.web import RouteTableDef, Request, Response, json_response
from aiofiles import open as aiopen
from plugins.html import Pagenator

routes = RouteTableDef()

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
    async with aiopen('tokens.toml', 'r', encoding='utf-8') as file:
        try: return loads(await file.read())
        except: return loads(_protector(await file.read()))

async def _set_token_file(datas:dict) -> NoReturn:
    async with aiopen('tokens.toml', 'r', encoding='utf-8') as file:
        await file.write(dumps(datas))

@routes.get('/user')
async def main_user(request:Request):
    '''
    url path:
    http://your_ip.com/user?<username>&<session token>
    '''
    user, token = str(request.url).split('?')[1].split('&')
    all_tokens = await _get_token_file()
    if token in all_tokens['sessions']:
