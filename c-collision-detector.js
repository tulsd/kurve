class CollisionDetector
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(canvas, fieldsize)
  {
    this.canvas_    = canvas;
    this.fieldsize_ = fieldsize;
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods

  // Maybe move this to util file?
  hexToRGB(hex)
  {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  collisionAtLocation(location, direction, thickness, own_color)
  {
    // Get intersection points
    let direction_radians = direction * Math.PI / 180;
    let leftmostpoint_x  = location[0] + (thickness / 2) * Math.cos(direction_radians);
    let leftmostpoint_y  = location[1] + (thickness / 2) * Math.sin(direction_radians);
    let rightmostpoint_x  = location[0] - (thickness / 2) * Math.cos(direction_radians);
    let rightmostpoint_y  = location[1] - (thickness / 2) * Math.sin(direction_radians);

    console.log("direction: ", direction)
    console.log("thickness: ", thickness)
    console.log("location_x: ", location[0])
    console.log("location_y: ", location[1])
    console.log("leftmostpoint_x: ", leftmostpoint_x)
    console.log("leftmostpoint_y: ", leftmostpoint_y)
    console.log("rightmostpoint_x: ", rightmostpoint_x)
    console.log("rightmostpoint_y: ", rightmostpoint_y)

    // Get intersecting colors
    let context = this.canvas_.getContext("2d");
    let data    = context.getImageData(location[0], location[1], 1, 1).data;
    let data1    = context.getImageData(leftmostpoint_x, leftmostpoint_y, 1, 1).data;
    let data2    = context.getImageData(rightmostpoint_x, rightmostpoint_y, 1, 1).data;

    let own_color_rgb = this.hexToRGB(own_color)
    console.log("own_color_rgb: ", own_color_rgb)

    console.log(data)
    console.log(data1)
    console.log(data2)

    // Check color
    if 
    (
      // Black canvas is fine
      (
        (data[0] == 0 && data[1] == 0 && data[2] == 0) &&
        (data1[0] == 0 && data1[1] == 0 && data1[2] == 0) &&
        (data2[0] == 0 && data2[1] == 0 && data2[2] == 0)
      )
      ||
      // Own color is fine only when intersection results due to rotation curve
      // TODO: Should not be fine when you intersect yourself at a later point
      (
        (data[0] == own_color_rgb[0] && data[1] == own_color_rgb[1] && data[2] == own_color_rgb[2]) &&
        (data1[0] == own_color_rgb[0] && data1[1] == own_color_rgb[1] && data1[2] == own_color_rgb[2]) &&
        (data2[0] == own_color_rgb[0] && data2[1] == own_color_rgb[1] && data2[2] == own_color_rgb[2])
      )
    )
    {
      return false;
    }
    else
    {
      console.log("COLLISION")
      return true;
    }
  }

  borderAtLocation(location)
  {
    let collided_with_border = false;
    let new_position = [location[0], location[1]]; // Deep copy

    // Check if new position is out of bounds (x)
    if(location[0] < 0)
    {
      collided_with_border = true;
      new_position[0] = this.fieldsize_[0];
    }

    else if(location[0] > this.fieldsize_[0])
    {
      collided_with_border = true;
      new_position[0] = 0;
    }

    // Check if new position is out of bounds (y)
    if(location[1] < 0)
    {
      collided_with_border = true;
      new_position[1] = this.fieldsize_[1];
    }

    else if(location[1] > this.fieldsize_[1])
    {
      collided_with_border = true;
      new_position[1] = 0;
    }

    return [new_position, collided_with_border];
  }
}
