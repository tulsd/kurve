class Player
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Notes
  // Positive x is right
  // Positive y is down
  // Vector up is [0,-1]

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(id, fieldsize, collision_detector, drawer, communicator, ui_handler, logger)
  {
    // General setup
    this.id_                  = id;
    this.is_local_            = false;
    this.fieldsize_           = fieldsize;
    this.collision_detector_  = collision_detector;
    this.drawer_              = drawer;
    this.communicator_        = communicator;
    this.ui_handler           = ui_handler;
    this.logger_              = logger;
    this.draw_queue_          = [];

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
    this.turnrate_            = 90;   // In degrees per second

    // Optics
    this.colors_              = ['#ff0000', '#00ff00', '#0000ff', '#fffff00']
    this.color_               = '#000000';
    this.thickness_           = 50;

    if(this.id_ != 'local')
    {
      this.color_             = this.colors_[this.id_ % this.colors_.length];
    }

    // Special effects: Holes
    this.last_hole_           = Date.now();
    this.hole_length_         = 20;                   // Length of holes in pixels
    this.hole_distance_       = 300;                  // Typical distance between holes in pixels
    this.hole_distance_diff_  = 150                   // Number of pixels added or removed to/from typical hole distance
    this.hole_distance_calc_  = this.hole_distance_;  // Actual calculated hole distance for next hole
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods for handling messages

  handleMessage(message)
  {
    switch(message.type)
    {
      case 'PlayerId':
        this.id_                = message.content;
        this.color_             = this.colors_[this.id_ % this.colors_.length];
        this.startposition_     = this.startpositions_[this.id_ % this.startpositions_.length];
        this.position_head_old_ = this.startposition_;
        this.position_head_     = this.startposition_;
        this.direction_         = this.startdirections_[this.id_ % this.startdirections_.length];
        this.sendMessageRemotePlayerHello();
        this.ui_handler.updatePlayerCards();
        this.draw_queue_.push(this.generateDrawStartPositionRequest());
        this.drawPendingDrawRequests();
        break;

      case 'PositionUpdate':
        this.position_head_old_ = message.content.draw_request.position_head_old;
        this.position_head_     = message.content.draw_request.position_head;
        this.color_             = message.content.draw_request.color;
        this.thickness_         = message.content.draw_request.thickness;
        this.draw_queue_.push(message.content.draw_request);
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
  // Methods: Updatingplayer

  updateAllIfAlive(delta_ms, direction)
  {
    if(this.alive_)
    {
      this.updateDirection(delta_ms, direction);
      this.updatePosition(delta_ms);
      this.handleEffectHoles(delta_ms);
      this.storeAndSendDrawRequest();
      this.drawPendingDrawRequests();
    }
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods: Updatingplayer: Direction and position

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
    if(this.collision_detector_.collisionAtLocation(potential_new_position, this.direction_, this.thickness_, this.color_))
    {
      this.alive_ = false;
      this.communicator_.sendMessage('RequestRemotePlayerDeath', 'Global', this.id_);
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

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods: Updatingplayer: Draw and network

  generateDrawStartPositionRequest()
  {
    let draw_request = {
      position_head_old:  this.position_head_old_,
      position_head:      [this.position_head_[0] + this.thickness_, this.position_head_[1] + this.thickness_],
      color:              this.color_,
      thickness:          this.thickness_
    };

    return draw_request;
  }

  generateDrawRequest()
  {
    let draw_request = {
      position_head_old:  this.position_head_old_,
      position_head:      this.position_head_,
      color:              this.color_,
      thickness:          this.thickness_
    };

    return draw_request;
  }

  sendDrawRequest(draw_request)
  {
    let message_content = {
      player: this.id_,
      draw_request: draw_request
    };
    this.communicator_.sendMessage('RequestPositionUpdate', 'Global', message_content);
  }

  storeAndSendDrawRequest()
  {
    let draw_request = this.generateDrawRequest();
    this.draw_queue_.push(draw_request);
    this.sendDrawRequest(draw_request);
  }

  drawPendingDrawRequests()
  {
    while(this.draw_queue_.length > 0)
    {
      let draw_request = this.draw_queue_.shift();
      this.drawer_.drawLineFromTo(draw_request.position_head_old, draw_request.position_head, draw_request.color,
                                  draw_request.thickness);
    }
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods: Special effects
  handleEffectHoles(delta_ms)
  {
    // Distance in pixels from the beginning of the last hole
    let distance_last_hole = this.speed_ * (Date.now() - this.last_hole_) / 1000;

    // Draw hole aka draw nothing
    if(distance_last_hole < this.hole_length_)
    {
      this.color_ = '#00000000';
    }
    else
    {
      this.color_ = this.colors_[this.id_ % this.colors_.length];
    }

    // Start new hole
    if(distance_last_hole > this.hole_distance_calc_)
    {
      // Calculate new hole distance
      let min = Math.ceil(this.hole_distance_ - this.hole_distance_diff_);
      let max = Math.floor(this.hole_distance_ + this.hole_distance_diff_);
      this.hole_distance_calc_ = Math.floor(Math.random() * (max - min + 1)) + min;

      // Start new hole now
      this.last_hole_ = Date.now();
    }
  }
}
