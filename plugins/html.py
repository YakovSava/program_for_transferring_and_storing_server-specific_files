from os import mkdir
from os.path import isdir, join
from aiofiles import open as aiopen

class Pagenator:

    def __init__(self):
        if not isdir('html/'):
            mkdir('html')
        self._path = 'html'

    async def get_page(self, page_name:str) -> dict:
        async with aiopen(join(self._path, page_name), 'r', encoding='utf-8') as file:
            return {
                'body': await file.read(),
                'content-type': 'text/html'
            }

    async def get_css(self, css_filename:str) -> dict:
        async with aiopen(join(self._path, css_filename), 'r', encoding='utf-8') as file:
            return {
                'body': await file.read(),
                'content-type': 'text/css'
            }

    async def get_js(self, js_filename: str) -> dict:
        async with aiopen(join(self._path, js_filename), 'r', encoding='utf-8') as file:
            return {
                'body': await file.read(),
                'content-type': 'text/javascript'
            }

    async def get_pic(self, path:str, filename:str) -> dict:
        async with aiopen(join(self._path, path,  filename), 'rb') as file:
            return {
                'body': await file.read(),
                'content-type': ('image/png' if filename.endswith('.png') else 'image/jpeg')
            }