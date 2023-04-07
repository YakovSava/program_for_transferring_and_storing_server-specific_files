#  import asyncio

from aiohttp.web import Application, RouteTableDef, run_app, Response, json_response, Request
from plugins.binder import Binder

app = Application()
routes = RouteTableDef()
binder = Binder(path='/files')

@routes.get('/')
async def main_page(request:Request):
    return Response(body='A'+('a'*(100*100)))

@routes.get('/file?')
async def get_file(request:Request):
    file_bytes_data = await binder.get_file(await binder.get_file(str(request.url).split('?')[-1]))
    return Response(body=file_bytes_data)

@routes.get('/service?')
async def service_path(request:Request):
    return Response(body='Aaaaa')

if __name__ == '__main__':
    app.add_routes(routes)
    run_app(app, host='localhost', port=80)