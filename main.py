#  import asyncio

from aiohttp.web import Application, RouteTableDef, run_app, Response, json_response, Request
from plugins.binder import Binder

app = Application()
routes = RouteTableDef()
binder = Binder(path='/base')


@routes.get('/')
async def main_page(request: Request):
    return Response(body="Server running!")



if __name__ == '__main__':
    app.add_routes(routes)
    run_app(app, host='localhost', port=80)
