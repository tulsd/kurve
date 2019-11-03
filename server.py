import asyncio
import websockets
import json
import http.server
import socketserver
import _thread

# ######################################################################################################################
# Settings

setting_port_server_http        = 8000
setting_port_server_websocket   = 8765

# ######################################################################################################################
# HTTP server

# Thread function
def http_server_thread():
    handler_http = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", setting_port_server_http), handler_http) as httpd:
        print("DEBUG: HTTP-Server at port", setting_port_server_http)
        httpd.serve_forever()

# Create thread
try:
   _thread.start_new_thread(http_server_thread, ())
except:
   print ("DEBUG: HTTP-Server died")

# ######################################################################################################################
# Websocket server

# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# Global states

players = {}

# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# Main message handler function

def messageHandler(player_id, player_websocket, message):

    # Unpack message
    m_type = message['type']

    # Handle message
    if m_type == 'RequestPlayerId':
        print('DEBUG: RequestPlayerId from player ' + str(player_id))
        destination = 'sender'
        response    = {'type': 'PlayerId', 'destination': player_id, 'content': player_id}
        return destination, response

    elif m_type == 'RequestRemotePlayerHello':
        print('DEBUG: RequestRemotePlayerHello from player ' + str(player_id))
        destination = 'everyone-but-sender'
        response    = {'type': 'RemotePlayerHello', 'destination': 'everyone-but-' + str(player_id), 'content': player_id}
        return destination, response

    elif m_type == 'RequestStartGame':
        print('DEBUG: RequestStratGame from player ' + str(player_id))
        destination = 'everyone'
        response    = {'type': 'StartGame', 'destination': 'everyone', 'content': player_id}
        return destination, response

    elif m_type == 'RequestPositionUpdate':
        print('DEBUG: RequestPositionUpdate from player ' + str(player_id))
        destination = 'everyone-but-sender'
        response    = {'type': 'PositionUpdate', 'destination': 'everyone-but-' + str(player_id), 'content': message['content']}
        return destination, response

    else:
        print('DEBUG: Unknown message from player ' + str(player_id))
        destination = 'void'
        response    = {}
        return destination, response

# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# Main connection handler function

async def connectionHandler(websocket, path):

    # ------------------------------------------------------------------------------------------------------------------
    # Register players

    # Generate new id
    player_id = 1
    if(len(players) > 0):
        for possible_player_id in range(1, 5):
            if(possible_player_id not in players.keys()):
                player_id = possible_player_id
                break

    # todo handle more than 4 players

    # Store new player
    players[player_id] = websocket
    print('DEBUG: Player ' + str(player_id) + ' connected')
    print('DEBUG: Player ' + str(player_id) + ' registered')

    try:

        # --------------------------------------------------------------------------------------------------------------
        # Handle messages

        while True:
            json_string_in = await websocket.recv()
            destination, response = messageHandler(player_id, websocket, json.loads(json_string_in))

            if(destination == 'sender'):
                await websocket.send(json.dumps(response))

            elif(destination == 'everyone-but-sender'):
                player_keys = players.keys()
                for loop_payer_id in players:
                    if player_id != loop_payer_id:
                        loop_player_websocket = players[loop_payer_id]
                        await loop_player_websocket.send(json.dumps(response))

            elif(destination == 'everyone'):
                player_keys = players.keys()
                for loop_payer_id in players:
                    loop_player_websocket = players[loop_payer_id]
                    await loop_player_websocket.send(json.dumps(response))

    except websockets.exceptions.ConnectionClosed:
        print('DEBUG: Player ' + str(player_id) + ' disconnected')


    finally:

        # --------------------------------------------------------------------------------------------------------------
        # Unregister players

        print('DEBUG: Player ' + str(player_id) + ' unregistered')
        for player_id, player_websocket in players.items():
            if player_websocket == websocket:
                del players[player_id]
                break

# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# Start server

server = websockets.serve(connectionHandler, "localhost", setting_port_server_websocket)
asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()
