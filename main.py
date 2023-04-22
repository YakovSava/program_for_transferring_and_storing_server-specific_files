from threading import Thread
from aiohttp.web import Application, RouteTableDef, run_app, Response, Request
from plugins.session import routes as session_routes
from plugins.static import routes as static_routes
from plugins.html import Pagenator as Binder
from plugins.ftp import starter

app = Application()
routes = RouteTableDef()
bind = Binder()

@routes.get('/')
async def main_page(request: Request):
    data = await bind.get_page('index.html')
    return Response(**data)


if __name__ == '__main__':
    th = Thread(target=starter)
    th.start()

    app.add_routes(routes)
    app.add_routes(session_routes)
    app.add_routes(static_routes)

    run_app(app, host='127.0.0.1', port=80)
