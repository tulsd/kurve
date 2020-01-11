class InputHandler
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(game, left_key = 'ArrowLeft', right_key = 'ArrowRight', start_key = 'Space', border_key='KeyB')
  {
    // Members
    this.left_key_      = left_key;
    this.right_key_     = right_key;
    this.start_key_     = start_key;
    this.left_active_   = false;
    this.right_active_  = false;
    this.game_          = game;
    this.start_pressed_ = false;
    this.border_key_    = border_key;

    // Event listeners
    let event_target = this;
    document.addEventListener('keydown', function(e) {
      event_target.keyDownHandler.call(event_target, e);
    });
    document.addEventListener('keyup', function(e) {
      event_target.keyUpHandler.call(event_target, e);
    });
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods for handling keypresses

  consumeEvent(e) {
    e.preventDefault();
    e.stopPropagation();  
  }

  keyDownHandler(e)
  {
    if(e.code == this.left_key_) {
      this.left_active_ = true;
      this.consumeEvent(e);  
    }

    else if(e.code == this.right_key_) {
      this.right_active_ = true;
      this.consumeEvent(e);  
    }

    else if(e.code == this.start_key_ && this.start_pressed_ == false)
    {
      this.start_pressed_ = true;
      game.requestStartGame();
      this.consumeEvent(e);  
    }
    else if(e.code == this.border_key_)
    {
      console.log("b pressed")
      game.sendMessageWallInactive();
    }
  }

  keyUpHandler(e)
  {
    if(e.code == this.left_key_) {
      this.left_active_ = false;
      this.consumeEvent(e);
    }

    if(e.code == this.right_key_) {
      this.right_active_ = false;
      this.consumeEvent(e);
    }
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods for exporting state of keypresses

  getDirection()
  {
    if(this.left_active_ == true && this.right_active_ == false)
      return 'left';

    if(this.right_active_ == true && this.left_active_ == false)
      return 'right';

    return 'straight';
  }

  pollController()
  {
    var gamepads = navigator.getGamepads();
    var controller = gamepads[0];
    if(controller != undefined)
    {
      var axis = controller.axes[2].toFixed(4);

      //Move left if axis is lower 0
      if(axis < -0.2)
      {
        this.right_active_ = false;
        this.left_active_ = true;
      }//Move right if axis is higher 0
      else if(axis > 0.2)
      {
        this.left_active_ = false;
        this.right_active_ = true;
      } else { // reset for moving in a straight line
        this.left_active_ = false;
        this.right_active_ = false;
      }
    }
  }
}



