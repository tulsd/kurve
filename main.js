class Game
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor()
  {
    // Settings
    this.log_level_           = 1;                        // 0 - 2
    this.server_url_          = self.location.hostname;   // URL to the websocket server
    this.server_port_         = '8080';                   // Port of the websocket server
    this.framerate_           = 15;                       // In frames per second
    this.frametime_           = 1/this.framerate_ * 1000; // In milliseconds
    this.fieldsize_           = [1000, 1000];             // Size of the playing field
    this.max_players_         = 4;                        // Maximum number of players

    // States
    this.state_               = 'Lobby';
    this.wall_inactive_for_   = 0;
    this.last_update_         = undefined;

    // Players
    this.players_local_       = [undefined];
    this.players_remote_      = [];

    // Essentials
    this.logger_              = new Logger(this.log_level_);
    this.communicator_        = new Communicator(this.server_url_, this.server_port_, this.logger_);
    this.input_handler_       = new InputHandler(this);
    this.collision_detector_  = new CollisionDetector(document.getElementById('canvas'), this.fieldsize_);
    this.ui_handler_          = new UiHandler(document.getElementById('container-player-cards'), this.players_local_,
                                              this.players_remote_);
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
        let remote_player_hello_id = message.content;

        // Check if remote player is local player
        let remote_player_not_known = true;
        if(this.players_local_[0].id_ == remote_player_hello_id)
        {
          remote_player_not_known = false;
        }

        // Check if remote player already known
        this.players_remote_.forEach(function(player_remote)
        {
          if(player_remote.id_ == remote_player_hello_id)
          {
            remote_player_not_known = false;
          }
        });

        // If not known
        if(remote_player_not_known)
        {
          let new_player_remote = new Player(remote_player_hello_id, this.fieldsize_, this.collision_detector_,
                                             this.drawer_, this.communicator_, this.ui_handler_, this.logger_);
          this.players_remote_.push(new_player_remote);
          this.communicator_.registerToMessageType('PositionUpdate', new_player_remote);
          this.players_local_[0].sendMessageRemotePlayerHello();
          this.ui_handler_.updatePlayerCards();
        }
        break;

      case 'StartGame':
        this.startGame();
        break;

      case 'WallInactiveTime':
        this.addWallInactiveTime(message.content);
        break;

      case 'Audio':
        break;

      case 'RemotePlayerDeath':
        // Get remote player id
        let remote_player_death_id = message.content;

        // Set remote player alive state
        this.players_remote_.forEach(function(player_remote)
        {
          if(player_remote.id_ == remote_player_death_id)
          {
            player_remote.alive_ = false;
          }
        });

        // Check win condition
        this.checkWinCondition();
        break;

      case 'RemotePlayerGoodbye':
        // Get remote player id
        let remote_player_id = message.content;

        console.log(message);


        // Check if remote player known
        let i = 0;
        let that = this;
        this.players_remote_.forEach(function(player_remote)
        {
          if(player_remote.id_ == remote_player_id)
          {
            if(that.state_ == 'Game')
            {
              player_remote.alive_ = false;
              that.checkWinCondition();
            }

            that.players_remote_.splice(i, 1);
            that.communicator_.unregisterFromMessageType('PositionUpdate', remote_player_id);
            that.ui_handler_.resetPlayerCards();
            that.ui_handler_.updatePlayerCards();
          }
          i++;
        });
        break;

      case 'EndGame':
        let winner_player_id = message.content;
        let game_end_message = "Game over. You lose.";
        if(this.players_local_[0].id_ == winner_player_id)
        {
          game_end_message = "You win."
        }
        alert(game_end_message)

      default:
        this.logger_.log(1, 'Unknown message type')
        break;
    }
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods for game logic

  addWallInactiveTime(seconds)
  {
    this.wall_inactive_for_ += seconds;
  }

  checkWinCondition()
  {
    // Check if all other players dead
    let all_other_players_dead = true;

    this.players_remote_.forEach(function(player_remote)
    {
      if(player_remote.alive_ == true)
      {
        all_other_players_dead = false;
      }
    });

    // If all other players dead - Game ends and this player wins.
    if(all_other_players_dead)
    {
      this.communicator_.sendMessage('RequestEndGame', 'Global', undefined);
    }
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods for game operation

  setupGame()
  {
    // Check connection
    if(this.communicator_.connection_open_)
    {
      this.logger_.log(1, 'Creating game');

      // Draw border
      this.drawer_.drawBorder();

      // Listen to creation of other players
      this.communicator_.registerToMessageType('RemotePlayerHello', this);
      this.communicator_.registerToMessageType('RemotePlayerDeath', this);
      this.communicator_.registerToMessageType('RemotePlayerGoodbye', this);

      // Create local player
      this.players_local_[0] = new Player('local', this.fieldsize_, this.collision_detector_, this.drawer_,
                                         this.communicator_, this.ui_handler_, this.logger_);

      // Listen to start and end of the game
      this.communicator_.registerToMessageType('StartGame', this);
      this.communicator_.registerToMessageType('EndGame', this);

      // Call run function periodically
      let event_target = this;
    }
    else
    {
      this.logger_.log(1, 'Could not create game, network not ready, retrying');

      // Call create function one more time in one second
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
    this.drawer_.clear();
    this.drawer_.drawBorder();
    let event_target = this;
    window.setInterval(function(){event_target.runGame.call(event_target);}, this.frametime_);
  }

  runGame()
  {
    // Calculate delta to last iteration
    let now = Date.now();
    let delta_ms = now - this.last_update_;
    this.last_update_ = now;

    // Update local and remote players
    this.players_local_[0].updateAllIfAlive(delta_ms, this.input_handler_.getDirection());
    this.players_remote_.forEach(
      function(player_remote)
      {
        player_remote.drawPendingDrawRequests();
      }
    );
  }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Execute

let game = new Game();
