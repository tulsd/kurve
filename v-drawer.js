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
    context.moveTo(from[0], from[1]);
    context.lineTo(to[0], to[1]);
    context.stroke();
  }
}