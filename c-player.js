class Player
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Notes
  // Positive x is right
  // Positive y is down
  // Vector up is [0,-1]

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(id, fieldsize, startposition, collision_detector, drawer, communicator)
  {
    // General setup
    this.id_                  = id;
    this.is_local_            = false;
    this.fieldsize_           = fieldsize;
    this.collision_detector_  = collision_detector;
    this.drawer_              = drawer;
    this.communicator_        = communicator;

    // Id setup
    if(this.id_ == 'local')
    {
      this.is_local_ = true;
      this.communicator_.registerToMessageType('PlayerId', this);
      this.communicator_.sendMessage('RequestPlayerId', 'Server', undefined);
    }

    // Position and movement
    this.alive_ = true;
    this.position_head_old_ = startposition;
    this.position_head_     = startposition;
    this.direction_         = 0;
    this.speed_             = 2;
    this.turnrate_          = 0.1;

    // Optics
    this.colors_    = ['#ff0000', '#00ff00', '#0000ff', '#fffff00']
    this.color_     = '#000000';
    this.thickness_ = 5;
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods for handling messages

  handleMessage(message)
  {
    switch(message.type)
    {
      case 'PlayerId':
        this.id_ = message.content;
        this.color_ = this.colors_[this.id_ % this.colors_.length];
        this.sendMessageRemotePlayerHello();
        break;

      case 'PositionUpdate':
        this.position_head_old_ = message.content.position_head_old;
        this.position_head_     = message.content.position_head;
        this.color_             = message.content.color;
        this.thickness_         = message.content.thickness;
        break;

      default:
        console.log('DEBUG: Unknown message type')
        break;
    }
  }

  sendMessageRemotePlayerHello()
  {
    this.communicator_.sendMessage('RequestRemotePlayerHello', 'Global', this.id_);
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods for updating player

  updateAllIfAlive(direction)
  {
    if(this.alive_)
    {
      this.updateDirection(direction);
      this.updatePosition();
      this.updateDraw();
      this.updateNetwork();
    }
  }

  updateDirection(direction)
  {
    switch(direction)
    {
      case 'left':
        this.direction_ -= this.turnrate_;
        break;

      case 'right':
        this.direction_ += this.turnrate_;
        break;

      default:
        // Do not change direction
        break;
    }
  }

  updatePosition()
  {
    // Store old position
    this.position_head_old_ = [this.position_head_[0], this.position_head_[1]];

    // Calculate new position
    let vector_up = [0,-1];
    let potential_new_position_x = this.position_head_[0] + ((Math.cos(this.direction_) * vector_up[0] - Math.sin(this.direction_) * vector_up[1]) * this.speed_);
    let potential_new_position_y = this.position_head_[1] + ((Math.sin(this.direction_) * vector_up[0] + Math.cos(this.direction_) * vector_up[1]) * this.speed_);

    // Check if new position collides with obstacles
    if(this.collision_detector_.collisionAtLocation([potential_new_position_x, potential_new_position_y]))
    {
      this.alive_ = false;
    };

    // Check if new position is out of bounds (x)
    if(potential_new_position_x < 0)
      this.position_head_[0] = this.fieldsize_[0];

    else if(potential_new_position_x > this.fieldsize_[0])
      this.position_head_[0] = 0;

    else
      this.position_head_[0] = potential_new_position_x;

    // Check if new position is out of bounds (y)
    if(potential_new_position_y < 0)
      this.position_head_[1] = this.fieldsize_[1];

    else if(potential_new_position_y > this.fieldsize_[1])
      this.position_head_[1] = 0;

    else
      this.position_head_[1] = potential_new_position_y;
  }

  updateDraw()
  {
    console.log(this.position_head_old_);
    this.drawer_.drawLineFromTo(this.position_head_old_, this.position_head_, this.color_, this.thickness_);
  }

  updateNetwork()
  {
    this.communicator_.sendMessage('RequestPositionUpdate', 'Global', {player: this.id_,
                                   position_head_old: this.position_head_old_, position_head: this.position_head_,
                                   color: this.color_, thickness: this.thickness_});
  }
}
