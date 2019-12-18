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

  writeMessage(message)
  {
    var context = this.canvas_.getContext('2d');
    context.clearRect(0, 0, 500, 25);
    context.font = '16pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
  }

  getMousePos(evt)
  {
    var rect = this.canvas_.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

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
    //context.lineJoin = round;
    context.beginPath();

    context.moveTo(from[0], from[1]);

    //Smoother line
    //Source: https://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas/7058606#7058606

    var x = (from[0] + to[0]) / 2;
    var y = (from[1] + to[1]) / 2;

    // curve through the last two points
    context.quadraticCurveTo(from[0], from[1], x, y);
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
