from os import mkdir, listdir, getcwd
from os.path import isdir, join
from sass import compile
from aiofiles import open as aiopen


def _split_a_string(string: str) -> dict:
    raw_path_parameters = string.rsplit('-', 4)
    path_parameters = {
        'initials': raw_path_parameters[0],
        'floors': eval(raw_path_parameters[1].replace(',', '.')),
        'size': list(map(
            float,
            (raw_path_parameters[2].replace(',', '.').replace('х', 'x').split('x')))),
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

    async def get_pic(self, *paths: tuple[str]) -> dict:
        async with aiopen(join('files', *paths), 'rb') as file:
            return {
                'body': await file.read(),
                'content_type': ('image/png' if paths[-1].endswith('.png') else 'image/jpeg')
            }

    async def get_files_and_paths(self, filters: list = None) -> list[dict]:
        final_listdir = []
        for architector_dir in listdir('files'):
            if isdir(join('files', architector_dir)):
                for project_dir in listdir(join('files', architector_dir)):
                    parameters = _split_a_string(project_dir)
                    # print(f"{filters[1][0]} <= {parameters['size']} <= {filters[1][1]}", [filters[1][0], filters[1][0]] <= parameters['size'] <= [filters[1][1], filters[1][1]])
                    if (
                            (filters[0][0] <= parameters['floors'] <= filters[0][1]) and
                            (filters[1][0] <= parameters['size'][0] <= filters[1][1]) and
                            (filters[1][0] <= parameters['size'][1] <= filters[1][1]) and
                            (filters[2][0] <= parameters['area'] <= filters[2][1])
                    ):
                        final_listdir.append({
                            'project': project_dir,
                            'autor': architector_dir,
                            'files': self._get_files_in_directory(
                                listdir(join('files', architector_dir, project_dir)),
                                architector_dir=architector_dir,
                                project_dir=project_dir
                            )
                        })
        return final_listdir

    def _get_files_in_directory(self, files: list[str] | tuple[str], architector_dir:str=None, project_dir:str=None) -> dict:
        file_list = {}

        for file in files:
            if file.endswith((".jpg", ".png", ".jpeg")):
                if file.startswith("3") and file.endswith((".jpg", ".png", ".jpeg")):
                    file_list['a3d'] = join('png', architector_dir, project_dir, file).replace('\\', '/')
                elif not file.startswith("3") and file.endswith((".jpg", ".png", ".jpeg")):
                    file_list['two'] = join('png', architector_dir, project_dir, file).replace('\\', '/')
            if len(file_list) == 2:
                break
        return file_list

    async def get_two_picture(self, path:str) -> dict:
        _, architector_path, project_path = path.split('/')
        files = listdir(getcwd()+'/files'+path)
        _files_in_directory = self._get_files_in_directory(files, architector_dir=architector_path, project_dir=project_path)
        return {
            'a3d': _files_in_directory['a3d'],
            'other': _files_in_directory['two']
        }
