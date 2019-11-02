class Player
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Notes
  // Positive x is right
  // Positive y is down
  // Vector up is [0,-1]

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(id, fieldsize, startposition, drawer, communicator)
  {
    // General setup
    this.id_            = id;
    this.is_local_      = false;
    this.fieldsize_     = fieldsize;
    this.drawer_        = drawer;
    this.communicator_  = communicator;

    // Id setup
    if(this.id_ == 'local')
    {
      this.is_local_ = true;
      this.communicator_.registerToMessageType('PlayerId', 'local');
      this.communicator_.sendMessage('RequestPlayerId', 'Server', undefined);
    }

    // Position and movement
    this.position_head_old_ = startposition;
    this.position_head_     = startposition;
    this.direction_         = 0;
    this.speed_             = 1;
    this.turnrate_          = 0.1;

    // Optics
    this.color_     = '#ff0000';
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
        this.communicator_.unregisterFromMessageType('PlayerId', 'local');
        break;

      default:
        console.log('DEBUG: Unknown message type')
        break;
    }
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods for updating player

  updateAll(direction)
  {
    this.updateDirection(direction);
    this.updatePosition();
    this.updateExport();
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

  updateExport()
  {
    this.drawer_.drawLineFromTo(this.position_head_old_, this.position_head_, this.color_, this.thickness_);
    this.communicator_.sendMessage('RequestPositionUpdate', 'Global',
                                   {player: this.id_, position: this.position_head_});
  }
}
