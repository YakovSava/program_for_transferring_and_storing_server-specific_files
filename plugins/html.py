from os import mkdir, listdir
from os.path import isdir, join
from sass import compile
from aiofiles import open as aiopen

def _split_a_string(string:str) -> dict:
    raw_path_parameters = string.rsplit('-', 4)
    path_parameters = {
        'initials': raw_path_parameters[0],
        'floors': eval(raw_path_parameters[1].replace(',', '.')),
        'size': eval((raw_path_parameters[2]
                      .replace('x', '*')
                      .replace('х', '*')
                      .replace(',', '.'))),
        'area': eval(raw_path_parameters[3].replace(',', '.')),
        'surname': raw_path_parameters[4]
    }

    return path_parameters

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

    async def get_sass(self, scss_filename: str) -> dict:
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

    async def get_pic(self, *paths:tuple[str]) -> dict:
        async with aiopen(join('files', *paths), 'rb') as file:
            return {
                'body': await file.read(),
                'content_type': ('image/png' if paths[-1].endswith('.png') else 'image/jpeg')
            }

    async def get_files_and_paths(self, filters: list=None) -> list[list]:
        final_listdir = []
        for architector_dir in listdir('files'):
            if isdir(join('files', architector_dir)):
                for project_dir in listdir(join('files', architector_dir)):
                    for files in listdir(join('files', architector_dir, project_dir)):
                        parameters = _split_a_string(project_dir)
                        # print(parameters, filters)
                        if (
                            (filters[0][0] < parameters['floors'] < filters[0][1]) and
                            (filters[1][0] < parameters['size'] < filters[1][1]) and
                            (filters[2][0] < parameters['area'] < filters[2][1])
                        ):
                            final_listdir.append([
                                [[architector_dir, project_dir], join('png', architector_dir, project_dir, files)]
                            ])
        return final_listdir