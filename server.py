import asyncio
import websockets
import json
import pprint

# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# Global states
playercounter = 0
players = {}

# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# Main server handler function
async def handler(websocket, path):
    # --------------------------------------------------------------------------------------------------------------
    # Register players

    # Generate new id
    new_player_id = 1
    if(len(players) > 0):
        new_player_id = max(players) + 1

    # Store new player
    players[new_player_id] = websocket
    print('DEBUG: New player (' + str(new_player_id) + ') connected')

    try:
        # ----------------------------------------------------------------------------------------------------------
        # Handle messages
        #await asyncio.wait([ws.send("Hello!") for id, ws in players])
        #await asyncio.sleep(10)
        await websocket.wait_closed()

    finally:
        # ----------------------------------------------------------------------------------------------------------
        # Unregister players
        for player_id, player_websocket in players.items():
            if player_websocket == websocket:
                print('DEBUG: Player (' + str(new_player_id) + ') disconnected')
                del players[player_id]
                break

# ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# Start server
server = websockets.serve(handler, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()
