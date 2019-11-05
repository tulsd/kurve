class Player
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Notes
  // Positive x is right
  // Positive y is down
  // Vector up is [0,-1]

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(id, fieldsize, collision_detector, drawer, communicator, logger)
  {
    // General setup
    this.id_                  = id;
    this.is_local_            = false;
    this.fieldsize_           = fieldsize;
    this.collision_detector_  = collision_detector;
    this.drawer_              = drawer;
    this.communicator_        = communicator;
    this.logger_              = logger;

    // Id setup
    if(this.id_ == 'local')
    {
      this.is_local_ = true;
      this.communicator_.registerToMessageType('PlayerId', this);
      this.communicator_.sendMessage('RequestPlayerId', 'Server', undefined);
    }

    // Position and movement
    this.alive_               = true;
    this.startpositions_      = [[100, 100], [this.fieldsize_[0] - 100, 100],
                                 [this.fieldsize_[0] - 100, this.fieldsize_[1] -100], [100, this.fieldsize_[1] - 100]];
    this.startposition_       = [this.fieldsize_[0]/2, this.fieldsize_[1]/2];
    this.position_head_old_   = this.startposition_;
    this.position_head_       = this.startposition_;
    this.startdirections_     = [135, -135, -45, 45];
    this.direction_           = 0;    // In degrees
    this.speed_               = 50;   // In pixels per second
    this.turnrate_            = 90;    // In degrees per second

    // Remote position queue
    this.remote_update_queue_ = [];

    // Optics
    this.colors_              = ['#ff0000', '#00ff00', '#0000ff', '#fffff00']
    this.color_               = '#000000';
    this.thickness_           = 5;
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods for handling messages

  handleMessage(message)
  {
    switch(message.type)
    {
      case 'PlayerId':
        this.id_                  = message.content;
        this.color_               = this.colors_[this.id_ % this.colors_.length];
        this.startposition_       = this.startpositions_[this.id_ % this.startpositions_.length];
        this.position_head_old_   = this.startposition_;
        this.position_head_       = this.startposition_;
        this.direction_           = this.startdirections_[this.id_ % this.startdirections_.length];
        this.sendMessageRemotePlayerHello();
        break;

      case 'PositionUpdate':
        this.position_head_old_   = message.content.position_head_old;
        this.position_head_       = message.content.position_head;
        this.color_               = message.content.color;
        this.thickness_           = message.content.thickness;
        this.remote_update_queue_.push(message.content);
        break;

      default:
        this.logger_.log(1, 'Unknown message type')
        break;
    }
  }

  sendMessageRemotePlayerHello()
  {
    this.communicator_.sendMessage('RequestRemotePlayerHello', 'Global', this.id_);
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods for updating player

  updateAllIfAlive(direction, delta_ms)
  {
    if(this.alive_)
    {
      this.updateDirection(delta_ms, direction);
      this.updatePosition(delta_ms);
      this.updateDraw();
      this.updateNetwork();
    }
  }

  updateDirection(delta_ms, direction)
  {
    switch(direction)
    {
      case 'left':
        this.direction_ -= this.turnrate_ * (delta_ms / 1000);
        break;

      case 'right':
        this.direction_ += this.turnrate_ * (delta_ms / 1000);
        break;

      default:
        // Do not change direction
        break;
    }
  }

  updatePosition(delta_ms)
  {
    // Store old position
    this.position_head_old_ = [this.position_head_[0], this.position_head_[1]];

    // Calculate new position
    let vector_up = [0, -1];
    let direction_radians = this.direction_ * Math.PI / 180;
    let vector_forward_x = Math.cos(direction_radians) * vector_up[0] - Math.sin(direction_radians) * vector_up[1];
    let vector_forward_y = Math.sin(direction_radians) * vector_up[0] + Math.cos(direction_radians) * vector_up[1];

    let potential_new_position_x = this.position_head_[0] + vector_forward_x * this.speed_ * (delta_ms / 1000);
    let potential_new_position_y = this.position_head_[1] + vector_forward_y * this.speed_ * (delta_ms / 1000);

    let potential_new_position = [potential_new_position_x, potential_new_position_y];

    // Check if new position collides with obstacles
    if(this.collision_detector_.collisionAtLocation(potential_new_position))
    {
      this.alive_ = false;
    };

    // Check if new position clloides with border and update to new position
    let border_detection = this.collision_detector_.borderAtLocation(potential_new_position);
    this.position_head_ = border_detection[0];

    // If collided with border
    if(border_detection[1])
    {
      this.position_head_old_ = [this.position_head_[0], this.position_head_[1]]; // Deep copy
    }
  }

  updateDraw()
  {
    this.drawer_.drawLineFromTo(this.position_head_old_, this.position_head_, this.color_, this.thickness_);
  }

  updateRemoteDraws()
  {
    while(this.remote_update_queue_.length > 0)
    {
      let draw = this.remote_update_queue_.shift();
      this.drawer_.drawLineFromTo(draw.position_head_old, draw.position_head, draw.color, draw.thickness);
    }
  }

  updateNetwork()
  {
    let message = {
      player: this.id_,
      position_head_old: this.position_head_old_,
      position_head: this.position_head_,
      color: this.color_,
      thickness: this.thickness_
    };
    this.communicator_.sendMessage('RequestPositionUpdate', 'Global', message);
  }
}
