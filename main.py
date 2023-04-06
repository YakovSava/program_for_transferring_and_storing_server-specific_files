#  import asyncio

from aiohttp.web import Application, RouteTableDef, run_app, Response, json_response, Request

app = Application()
routes = RouteTableDef()

@routes.get('/')
async def main_page(request:Request):
    return Response(body='A'+('a'*(100*100)))

@routes.get('/file?')
async def get_file(request:Request):
    return Response(body=f'{str(request.url).split("?")[-1]}')

@routes.get('/service?')
async def service_path(request:Request):
    return json_response(data={'response': 'test'})

if __name__ == '__main__':
    app.add_routes(routes)
    run_app(app, host='localhost', port=80)