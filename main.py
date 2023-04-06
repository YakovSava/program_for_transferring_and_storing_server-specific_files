import asyncio

from aiohttp.web import Application, RouteTableDef, run_app, Response, json_response, Request

app = Application()
routes = RouteTableDef()

@routes.get('/')
async def main_page(request:Request):
    return Response(status=418)

@routes.get('/file?')
async def get_file(request:Request):
    return Response(body=f'{str(request.url).split("?")[-1]}')

@routes.get('/service?')
async def service_path(request:Request):
    pass