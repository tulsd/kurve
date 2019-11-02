class Game
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor()
  {
    // Settings
    this.server_url_          = 'localhost';
    this.server_port_         = '8765';
    this.frametime_           = 1/25 * 1000; // 25 FPS
    this.fieldsize_           = [1000, 1000];

    // States
    this.state_               = 'Lobby';

    // Players
    this.players_             = {};

    // Essentials
    this.communicator_        = new Communicator(this.server_url_, this.server_port_, this.players_);
    this.input_handler_       = new InputHandler();
    this.collision_detector_  = new CollisionDetector(document.getElementById('canvas'));
    this.drawer_              = new Drawer(document.getElementById('canvas'));

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
      this.players_.local = new Player('local', this.fieldsize_, [500, 500], this.collision_detector_, this.drawer_,
                                       this.communicator_);

      // Create other players
      // TODO

      // Call run function periodically
      let event_target = this;
      window.setInterval(function(){event_target.runGame.call(event_target);}, this.frametime_);
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
    this.players_.local.updateAllIfAlive(this.input_handler_.getDirection());
  }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Execute

let game = new Game();
