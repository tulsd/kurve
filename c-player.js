class Player
{
  // Positive x is right
  // Positive y is down
  // Vector up is [0,-1]

  constructor(id, fieldsize, startposition, drawer)
  {
    // General setup
    this.id = id;
    this.fieldsize = fieldsize;
    this.drawer = drawer;

    // Position and movement
    this.position_head = startposition;
    this.direction = 0;
    this.speed = 1;
    this.turnrate = 0.1;
  }

  updateAll(direction)
  {
    this.updateDirection(direction);
    this.updatePosition();
    this.updateDraw();
  }

  updateDirection(direction)
  {
    switch(direction)
    {
      case 'left':
        this.direction -= this.turnrate;
        break;

      case 'right':
        this.direction += this.turnrate;
        break;

      default:
        // Do not change direction
        break;
    }
  }

  updatePosition()
  {
    let vector_up = [0,-1];
    let potential_new_position_x = this.position_head[0] + ((Math.cos(this.direction) * vector_up[0] - Math.sin(this.direction) * vector_up[1]) * this.speed);
    let potential_new_position_y = this.position_head[1] + ((Math.sin(this.direction) * vector_up[0] + Math.cos(this.direction) * vector_up[1]) * this.speed);

    if(potential_new_position_x < 0)
      this.position_head[0] = this.fieldsize[0];

    else if(potential_new_position_x > this.fieldsize[0])
      this.position_head[0] = 0;

    else
      this.position_head[0] = potential_new_position_x;


    if(potential_new_position_y < 0)
      this.position_head[1] = this.fieldsize[1];

    else if(potential_new_position_y > this.fieldsize[1])
      this.position_head[1] = 0;

    else
      this.position_head[1] = potential_new_position_y;
  }

  updateDraw()
  {
    this.drawer.drawLineFromTo([0,0], this.position_head);
  }
}
