from aiohttp.web import Response, RouteTableDef, Request
from plugins.html import Pagenator

routes = RouteTableDef()
get = Pagenator()

@routes.get('/styles/')
async def styles_handler(request:Request):
    data = await get.get_css(str(request.url).split('/')[-1])
    return Response(**data)

@routes.get('/script/')
async def script_handler(request:Request):
    data = await get.get_js(str(request.url).split('/')[-1])
    return Response(**data)

@routes.get('/png/')
async def image_handler(request:Request):
    path = str(request.url).split('/')
    data = await get.get_pic(path[-2], path[-1])
    return Response(**data)