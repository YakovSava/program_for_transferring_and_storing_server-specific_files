import asyncio

from os import listdir
from os.path import isdir, exists
from typing import Literal, AnyStr
from aiofiles import open as aiopen

class BinderGetter:

    def __init__(self,
        path:str='/'
    ):
        self._path = path

    async def read(self, filename:str, binary:bool=False) -> Literal[str, bytes]:
        if binary:
            async with aiopen(filename, 'r', encoding='utf-8') as file:
                return await file.read()
        else:
            async with aiopen(filename, 'rb') as file:
                return await file.read()

    async def write(self, filename:str, data:AnyStr, binary:bool=False) -> None:
        if binary:
            async with aiopen(filename, 'r', encoding='utf-8') as file:
                await file.write(data)
        else:
            async with aiopen(filename, 'rb') as file:
                await file.write(data)
class Binder:

    def __init__(self,
            loop:asyncio.AbstractEventLoop=asyncio.get_event_loop(),
            getter:BinderGetter=BinderGetter,
            path:str='/'
        ):
        self._getter = getter(path=path)
        self._loop = loop
        self._path = path

    def __getattr__(self, name:str):
        if hasattr(self._getter, name):
            return getattr(self._getter, name)