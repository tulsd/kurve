import asyncio
import websockets
import json

# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# Global states
players = {}

# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# Main message handler function
def messageHandler(player_id, message):
    print('DEBUG: Got message from player ' + str(player_id))

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
            message = await websocket.recv()
            messageHandler(player_id, message)

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
