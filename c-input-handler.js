class InputHandler
{
  constructor(left_key = 'ArrowLeft', right_key = 'ArrowRight')
  {
    // Members
    this.left_key = left_key;
    this.right_key = right_key;

    console.log(this.left_key)
    this.left_active = false;
    this.right_active = false;

    // Event listeners
    let event_target = this;
    document.addEventListener('keydown', function(e){event_target.keyDownHandler.call(event_target, e);});
    document.addEventListener('keyup', function(e){event_target.keyUpHandler.call(event_target, e);});
  }

  keyDownHandler(e)
  {
    if(e.code == this.left_key)
      this.left_active = true;

    if(e.code == this.right_key)
      this.right_active = true;
  }

  keyUpHandler(e)
  {
    if(e.code == this.left_key)
      this.left_active = false;

    if(e.code == this.right_key)
      this.right_active = false;
  }

  getDirection()
  {
    if(this.left_active == true && this.right_active == false)
      return 'left';

    if(this.right_active == true && this.left_active == false)
      return 'right';

    return 'straight';
  }
}
