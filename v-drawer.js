class Drawer
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(svg, polyline)
  {
    this.svg = svg;
    this.polyline = polyline;
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods

  drawLineFromTo(from, to)
  {
    let point = this.svg.createSVGPoint();
    point.x = to[0];
    point.y = to[1];
    this.polyline.points.appendItem(point);
  }
}