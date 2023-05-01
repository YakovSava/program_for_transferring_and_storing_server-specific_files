from os import mkdir
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
with open('tokens.toml', 'r', encoding='utf-8') as file:
    data = loads(file.read())

for username, data in list(data.items()):
    if (username in ['sessions', 'apiKey']):
        continue
    if data['status'] == 1:  # architechtor
        path = f'/files/{username}'
    elif (data['status'] == 2) or (data['status'] == 3):  # Manager OR Admin
        path = 'files/'
    if not isdir(path):
        mkdir(path)
    authorizer.add_user(username, data['password'], path, perm='elradfmwMT')

server = FTPServer(('127.0.0.1', 2121), handler)

server.max_cons = 256
server.max_cons_per_ip = 5


def get_file_size() -> int:
    return handler.files_size


def starter():
    server.serve_forever()


if __name__ == '__main__':
    starter()
