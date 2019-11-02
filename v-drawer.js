class Drawer
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(svg, polyline)
  {
    this.svg_ = svg;
    this.polyline_ = polyline;
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods

  drawLineFromTo(from, to)
  {
    let point = this.svg_.createSVGPoint();
    point.x = to[0];
    point.y = to[1];
    this.polyline_.points.appendItem(point);
  }
}