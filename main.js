class Game
{
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Setup
    constructor()
    {
        // Settings
        this.server_url_  = 'localhost';
        this.server_port_ = '8765';

        // States
        this.state_ = 'Lobby';

        // Essentials
        this.communicator_  = new Communicator(this.server_url_, this.server_port_);
        this.input_handler_ = new InputHandler();
        this.drawer_        = new Drawer(document.getElementById('svg'), document.getElementById('polyline'));

        // Players
        this.player_local_ = undefined;
        this.players_remote_ = [];

        // Create game
        this.createGame();
    }

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // Methods
    createGame()
    {
        // Check connection
        if(this.communicator_.connection_open_)
        {
            console.log('DEBUG: Network ready, starting game');

            // Create local player
            this.player_local_ = new Player(undefined, [1000, 1000], [500, 500], this.drawer_, this.communicator_);

            // Create other players
            // TODO

            // Call run function periodically
            let event_target = this;
            window.setInterval(function(){event_target.runGame.call(event_target);}, 4000);
        }
        else
        {
            console.log('DEBUG: Network not ready, retrying');

            // Call create function one more time
            let event_target = this;
            window.setTimeout(function(){event_target.createGame.call(event_target);}, 1000);
        }
    }

    runGame()
    {
        this.player_local_.updateAll(this.input_handler_.getDirection());
    }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Execute
let game = new Game();
