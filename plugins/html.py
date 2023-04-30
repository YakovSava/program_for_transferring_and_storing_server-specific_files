from os import mkdir, listdir
from os.path import isdir, join
from sass import compile
from aiofiles import open as aiopen


class Pagenator:

    def __init__(self):
        if not isdir('html/'):
            mkdir('html')
        self._path = 'html'

    async def get_page(self, page_name: str) -> dict:
        async with aiopen(join(self._path, page_name), 'r', encoding='utf-8') as file:
            return {
                'body': await file.read(),
                'content_type': 'text/html'
            }

    async def get_css(self, css_filename: str) -> dict:
        async with aiopen(join(self._path, 'styles', css_filename), 'r', encoding='utf-8') as file:
            return {
                'body': await file.read(),
                'content_type': 'text/css'
            }

    async def get_sass(self, scss_filename:str) -> dict:
        async with aiopen(join(self._path, 'styles', scss_filename), 'r', encoding='utf-8') as file:
            return {
                'body': compile(string=await file.read()),
                'content_type': 'text/css'
            }

    async def get_js(self, js_filename: str) -> dict:
        async with aiopen(join(self._path, 'scripts', js_filename), 'r', encoding='utf-8') as file:
            return {
                'body': await file.read(),
                'content_type': 'text/javascript'
            }

    async def get_pic(self, path: str, filename: str) -> dict:
        async with aiopen(join(self._path, path, filename), 'rb') as file:
            return {
                'body': await file.read(),
                'content_type': ('image/png' if filename.endswith('.png') else 'image/jpeg')
            }

    async def get_files_and_paths(self, filters:list=None) -> list[list]:
        final_listdir = {}
        for dir in listdir('files'):
            if isdir(join('files', dir)):
                for dir2 in listdir(dir):
                    final_listdir[dir2] = []
                    if isdir(join('files', dir, dir2)):
                        raw_path_parameters = dir2.split('-')
                        path_parameters = {
                            'initials': raw_path_parameters[0],
                            'floors': int(raw_path_parameters[1]),
                            'size': eval((raw_path_parameters[2]
                                     .replace('x', '*')
                                     .replace('х', '*'))),
                            'area': int(raw_path_parameters[3]),
                            'surname':raw_path_parameters[4]
                        }

                        if (filters is None):
                            for files in dir2:
                                if files.endswith(('.png', '.jpg', '.jpeg')):
                                    final_listdir[dir2].append([dir, join('png', dir, dir2, files)])
                        else:
                            if (filters[0][0] > path_parameters['floors'] > filters[0][1])\
                                    and (filters[1][0] > path_parameters['size'] > filters[1][1])\
                                    and (filters[2][0] > path_parameters['area'] > filters[2][1]):
                                for files in dir2:
                                    if files.endswith(('.png', '.jpg', '.jpeg')):
                                        final_listdir[dir2].append(dir, join('png', dir, dir2, files))
        return final_listdir
