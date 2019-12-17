class Drawer
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(canvas)
  {
    this.canvas_ = canvas;
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods

  clear()
  {
    let context = this.canvas_.getContext("2d");
    context.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
  }

  drawLineFromTo(from, to, color, thickness)
  {
    let context = this.canvas_.getContext("2d");
    context.strokeStyle = color;
    context.lineWidth = thickness;
    context.beginPath();
    console.log(from[0]);
    console.log(to[0]);
    console.log(to[1]);
    console.log("----")
    context.moveTo(from[0], from[1]);

    // curve through the last two points
    context.quadraticCurveTo(from[0], from[1], to[0], to[1]);

    context.stroke();
  }

  drawBorder()
  {
    let context = this.canvas_.getContext("2d");
    context.strokeStyle = '#00ffff';
    context.lineWidth = 6;
    context.strokeRect(0, 0, this.canvas_.width, this.canvas_.height);
  }

  clearBorder()
  {
    let context = this.canvas_.getContext("2d");
    context.clearRect(0, 0, this.canvas_.width, 3);
    context.clearRect(0, 0, 3, this.canvas_.height);
    context.clearRect(0, this.canvas_.height - 3, this.canvas_.width, this.canvas_.height);
    context.clearRect(this.canvas_.width - 3, 0, this.canvas_.width, this.canvas_.height);
  }
}