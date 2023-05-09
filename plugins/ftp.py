from os import makedirs
from os.path import isdir, getsize
from toml import loads
from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer


class FTPAccounant(FTPHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.files_size = 0

    def on_file_sent(self, file: str) -> None:
        self.files_size += getsize(file)
        return super().on_file_sent(file)


authorizer = DummyAuthorizer()
handler = FTPAccounant
handler.authorizer = authorizer
handler.banner = "Добро пожаловать на сервер!"

def add_new_worker(username, password, status):
    path = f'files/{username}' # if architector
    if not isdir(path):
        makedirs(path)
    if (status == 2) and (status == 3):  # Manager
        path = 'files/'
    if (status == 3):
        path = '.'
    authorizer.add_user(username, password, path, perm='elradfmwMT')

with open('tokens.toml', 'r', encoding='utf-8') as file:
    data = loads(file.read())

for username, data in list(data.items()):
    if (username in ['sessions', 'apiKey']):
        continue
    add_new_worker(username, data['password'], data['status'])

server = FTPServer(('192.168.100.9', 2121), handler)

server.max_cons = 256
server.max_cons_per_ip = 5

def get_file_size() -> int:
    return handler.files_size


def starter():
    server.serve_forever()


if __name__ == '__main__':
    starter()
