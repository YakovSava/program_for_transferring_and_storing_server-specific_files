from os import mkdir
from os.path import exists, isdir
from aiofiles import open as aiopen

class Paginator:

    def __init__(self):
        if not isdir('html/'):
            mkdir('html')

    async def get_page(self, page_name:str) -> dict:
