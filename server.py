import asyncio
import websockets
import json

# TODO Handle connection close

async def mainLoop(websocket, path):
    while True:
        # Get message
        json_string_in = await websocket.recv()
        print('< ' + json_string_in)
        message_in = json.loads(json_string_in)

        # Handle message
        # TODO

        # Send message
        json_string_out = json.dumps(message_in)
        print('> ' + json_string_out)
        await websocket.send(json_string_out)

server = websockets.serve(mainLoop, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()
