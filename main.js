// Global state
let state = 'Lobby';

// Create essentials
let communicator    = new Communicator();
let input_handler   = new InputHandler();
let drawer          = new Drawer(document.getElementById('svg'), document.getElementById('polyline'));

// Create player self
let player          = new Player(undefined, [1000, 1000], [500, 500], drawer, communicator);

// Create other players
// TODO

// Run game
function main()
{
    player1.updateAll(input_handler.getDirection());
}

window.setInterval(main, 4000);