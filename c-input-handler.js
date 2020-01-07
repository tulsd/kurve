class InputHandler
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(game, left_key = 'ArrowLeft', right_key = 'ArrowRight', start_key = 'Space')
  {
    // Members
    this.left_key_      = left_key;
    this.right_key_     = right_key;
    this.start_key_     = start_key;
    this.left_active_   = false;
    this.right_active_  = false;
    this.game_          = game;

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

    else if(e.code == this.start_key_)
    {
      if(this.game_.state_ == 'Lobby')
      {
        this.game_.requestStartGame();
      }
      else if(this.game_.state_ =='LobbyGameOver')
      {
        this.game_.requestResetGame();
      }
      this.consumeEvent(e);
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
}
