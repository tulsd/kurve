class Game
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor()
  {
    // Settings
    this.server_url_          = 'localhost';
    this.server_port_         = '8765';
    this.framerate_           = 20;                       // In frames per second
    this.frametime_           = 1/this.framerate_ * 1000; // In milliseconds
    this.fieldsize_           = [1000, 1000];
    this.max_players_         = 2;

    // States
    this.state_               = 'Lobby';
    this.last_update_         = undefined;

    // Players
    this.player_local_
    this.players_remote_      = [];

    // Essentials
    this.communicator_        = new Communicator(this.server_url_, this.server_port_);
    this.input_handler_       = new InputHandler(this);
    this.collision_detector_  = new CollisionDetector(document.getElementById('canvas'));
    this.drawer_              = new Drawer(document.getElementById('canvas'));

    // Create game
    this.setupGame();
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods for handling messages

  handleMessage(message)
  {
    switch(message.type)
    {
      case 'RemotePlayerHello':
        // Get remote player id
        let remote_player_id = message.content;

        // Check if already known
        let remote_player_not_known = true;
        this.players_remote_.forEach(function(player_remote)
        {
          if(player_remote.id_ == remote_player_id)
          {
            remote_player_not_known = false;
          }
        });

        // If not known
        if(remote_player_not_known)
        {
          let new_player_remote = new Player(remote_player_id, this.fieldsize_, this.collision_detector_,
                                             this.drawer_, this.communicator_);
          this.players_remote_.push(new_player_remote);
          this.communicator_.registerToMessageType('PositionUpdate', new_player_remote);
          this.player_local_.sendMessageRemotePlayerHello();
        }
        break;

      case 'StartGame':
        this.startGame();
        break;

      default:
        console.log('DEBUG: Unknown message type')
        break;
    }
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods for game logic

  setupGame()
  {
    // Check connection
    if(this.communicator_.connection_open_)
    {
      console.log('DEBUG: Network ready, starting game');

      // Create local player
      this.player_local_ = new Player('local', this.fieldsize_, this.collision_detector_, this.drawer_,
                                       this.communicator_);

      // Create other players
      this.communicator_.registerToMessageType('RemotePlayerHello', this);
      this.communicator_.registerToMessageType('StartGame', this);

      // Call run function periodically
      let event_target = this;
    }
    else
    {
      console.log('DEBUG: Network not ready, retrying');

      // Call create function one more time
      let event_target = this;
      window.setTimeout(function(){event_target.setupGame.call(event_target);}, 1000);
    }
  }

  requestStartGame()
  {
    this.communicator_.sendMessage('RequestStartGame', 'Global', undefined);
  }

  startGame()
  {
    this.state_ = 'Game';
    this.last_update_ = Date.now();
    let event_target = this;
    window.setInterval(function(){event_target.runGame.call(event_target);}, this.frametime_);
  }

  runGame()
  {
    let now = Date.now();
    let delta_ms = now - this.last_update_;
    this.last_update_ = now;
    this.player_local_.updateAllIfAlive(this.input_handler_.getDirection(), delta_ms);
    this.players_remote_.forEach(function(player_remote)
    {
      player_remote.updateDraw();
    });
  }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Execute

let game = new Game();
