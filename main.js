let communicator    = new Communicator();
let input_handler   = new InputHandler();
let drawer          = new Drawer(document.getElementById('svg'), document.getElementById('polyline'));
let player1         = new Player(1, [1000, 1000], [500, 500], drawer, communicator);

function main()
{
    player1.updateAll(input_handler.getDirection());
}

window.setInterval(main, 4000);