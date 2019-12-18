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
  drawPixel(canvasData, canvasWidth, x, y, r, g, b, a)
  {
    var index = (x + y * canvasWidth) * 4;

    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
  }

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
    let context = this.canvas_.getContext("2d");

    // Get intersection points
    let direction_radians_left = (direction - 90) * Math.PI / 180;
    let direction_radians_right = (direction + 90) * Math.PI / 180;
    let leftmostpoint_x  = location[0] + (thickness / 2) * Math.cos(direction_radians_left);
    let leftmostpoint_y  = location[1] - (thickness / 2) * Math.sin(direction_radians_left);
    let rightmostpoint_x  = location[0] + (thickness / 2) * Math.cos(direction_radians_right);
    let rightmostpoint_y  = location[1] - (thickness / 2) * Math.sin(direction_radians_right);
    let leftmostpoint = [leftmostpoint_x, leftmostpoint_y];
    let rightmostpoint = [rightmostpoint_x, rightmostpoint_y];

    // Get rectangle behind head
    let padding = 5;
    let direction_radians = direction * Math.PI / 180;
    let rectangle_point_a_x = leftmostpoint[0] - padding - (thickness + padding) * Math.cos((-1) * direction_radians);
    let rectangle_point_a_y = leftmostpoint[1] + padding - (thickness + padding) * Math.sin((-1) * direction_radians);
    let rectangle_point_b_x = rightmostpoint[0] + padding - (thickness + padding) * Math.cos((-1) * direction_radians);
    let rectangle_point_b_y = rightmostpoint[1] + (thickness + padding) * Math.sin((-1) * direction_radians);
    let rectangle_point_c_x = rightmostpoint[0] + padding;
    let rectangle_point_c_y = rightmostpoint[1] + padding;
    let rectangle_point_d_x = leftmostpoint[0] - padding;
    let rectangle_point_d_y = leftmostpoint[1] + padding;
    let rectangle_point_a = [rectangle_point_a_x, rectangle_point_a_y];
    let rectangle_point_b = [rectangle_point_b_x, rectangle_point_b_y];
    let rectangle_point_c = [rectangle_point_c_x, rectangle_point_c_y];
    let rectangle_point_d = [rectangle_point_d_x, rectangle_point_d_y];
    let rectangle = [rectangle_point_a, rectangle_point_b, rectangle_point_c, rectangle_point_d];

    /*var canvasData = context.getImageData(0, 0, this.canvas_.width, this.canvas_.height);
    this.drawPixel(canvasData, this.canvas_.width, rectangle_point_a[0]+10, rectangle_point_a[1]+10, 255, 0, 0, 255)
    this.drawPixel(canvasData, this.canvas_.width, rectangle_point_b[0]+10, rectangle_point_b[1]+10, 255, 0, 0, 255)
    this.drawPixel(canvasData, this.canvas_.width, rectangle_point_c[0]+10, rectangle_point_c[1]+10, 255, 0, 0, 255)
    this.drawPixel(canvasData, this.canvas_.width, rectangle_point_d[0]+10, rectangle_point_d[1]+10, 255, 0, 0, 255)
    context.putImageData(canvasData, 0, 0);*/

    console.log("direction: ", direction)
    console.log("direction_radians_left: ", direction_radians_left)
    console.log("direction_radians_right: ", direction_radians_right)
    console.log("thickness: ", thickness)
    console.log("location: ", location)
    console.log("leftmostpoint: ", leftmostpoint)
    console.log("rightmostpoint: ", rightmostpoint)
    console.log("rectangle:", rectangle)

    // Get intersecting colors

    /*var w1 = rectangle_point_a[0] - rectangle_point_b[0];
    var w2 = rectangle_point_a[1] - rectangle_point_b[1];
    var width = Math.sqrt(w1*w1 + w2*w2);

    var h1 = rectangle_point_a[0] - rectangle_point_b[0];
    var h2 = rectangle_point_d[1] - rectangle_point_d[1];
    var height = Math.sqrt(h1*h1 + h1*h1);
    context.fillRect(rectangle_point_a[0], rectangle_point_a[1], width, height);*/


    let color_middle    = context.getImageData(location[0], location[1], 1, 1).data;
    let color_left    = context.getImageData(leftmostpoint[0], leftmostpoint[1], 1, 1).data;
    let color_right    = context.getImageData(rightmostpoint[0], rightmostpoint[1], 1, 1).data;

    let own_color_rgb = this.hexToRGB(own_color)
    console.log("own_color_rgb: ", own_color_rgb)
    console.log("own_color_rgb.r: ", own_color_rgb.r)
    console.log("own_color_rgb.g: ", own_color_rgb.g)
    console.log("own_color_rgb.b: ", own_color_rgb.b)

    console.log(color_middle)
    console.log(color_left)
    console.log(color_right)

    // Check color
    if 
    (
      // Black canvas is fine
      (
        (color_middle[0] == 0 && color_middle[1] == 0 && color_middle[2] == 0) &&
        (color_left[0] == 0 && color_left[1] == 0 && color_left[2] == 0) &&
        (color_right[0] == 0 && color_right[1] == 0 && color_right[2] == 0)
      )
      ||
      // Own color is fine only when intersection results due to rotation curve
      // TODO: Should not be fine when you intersect yourself at a later point
      (
        (color_middle[0] == own_color_rgb.r && color_middle[1] == own_color_rgb.g && color_middle[2] == own_color_rgb.b) &&
        (color_left[0] == own_color_rgb.r && color_left[1] == own_color_rgb.g && color_left[2] == own_color_rgb.b) &&
        (color_right[0] == own_color_rgb.r && color_right[1] == own_color_rgb.g && color_right[2] == own_color_rgb.b)
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
