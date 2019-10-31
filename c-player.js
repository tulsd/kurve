class PlayerLine
{
  // Positive x is right
  // Positive y is up
  // Vector up is [0,1]

  constructor(id, svg, polyline)
  {
    this.id = id;
    this.svg = svg;
    this.polyline = polyline;

    // Current position of head of the line
    this.position_head = [250, 250];

    // Current direction line is headed at
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
    let vector_up = [0,1];
    this.position_head[0] += (Math.cos(this.direction) * vector_up[0] - Math.sin(this.direction) * vector_up[1]) * this.speed;
    this.position_head[1] += (Math.sin(this.direction) * vector_up[0] + Math.cos(this.direction) * vector_up[1]) * this.speed;
  }

  updateDraw()
  {
    let point = this.svg.createSVGPoint();
    point.x = this.position_head[0];
    point.y = this.position_head[1];
    this.polyline.points.appendItem(point);
  }
}
