class Drawer
{
  constructor(svg, polyline)
  {
    this.svg = svg;
    this.polyline = polyline;
  }

  drawLineFromTo(from, to)
  {
    console.log(this);
    let point = this.svg.createSVGPoint();
    point.x = to[0];
    point.y = to[1];
    this.polyline.points.appendItem(point);
  }
}