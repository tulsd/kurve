import asyncio
import websockets
import json

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
    # --------------------------------------------------------------------------------------------------------------
    # Register players

    # Generate new id
    player_id = 1
    if(len(players) > 0):
        player_id = max(players) + 1

    # Store new player
    players[player_id] = websocket
    print('DEBUG: Player ' + str(player_id) + ' connected')

    try:
        # ----------------------------------------------------------------------------------------------------------
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

    finally:
        # ----------------------------------------------------------------------------------------------------------
        # Unregister players
        for player_id, player_websocket in players.items():
            if player_websocket == websocket:
                print('DEBUG: Player ' + str(player_id) + ' disconnected')
                del players[player_id]
                break

# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# Start server
server = websockets.serve(connectionHandler, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()
