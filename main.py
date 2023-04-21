from threading import Thread
from aiohttp.web import Application, RouteTableDef, run_app, Response, Request
from plugins.binder import Binder
from plugins.session import routes as session_routes
from plugins.ftp import starter

app = Application()
routes = RouteTableDef()
binder = Binder(path='/base')


@routes.get('/')
async def main_page(request: Request):
    return Response(body="Server running!")



if __name__ == '__main__':
    th = Thread(target=starter)
    th.start()

    app.add_routes(routes)
    app.add_routes(session_routes)
    run_app(app, host='127.0.0.1', port=80)
