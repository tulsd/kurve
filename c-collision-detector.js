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
  checkIfPointWithinRectangle(point, rectangle)
  {
    // https://math.stackexchange.com/a/190373/223129
    // (0<AM*AB<AB*AB) AND (0<AM*AD<AD*AD) <=> M is within ABCD
    let m = point;
    let a = rectangle[0];
    let b = rectangle[1];
    let c = rectangle[2];
    let d = rectangle[3];

    let am = [0, 0];
    am[0] = a[0] * m[0];
    am[1] = a[1] * m[1];
    let ab = [0, 0];
    ab[0] = a[0] * b[0];
    ab[1] = a[1] * b[1];
    let ad = [0, 0];
    ad[0] = a[0] * d[0];
    ad[1] = a[1] * d[1];

    let am_ab = am[0] * ab[0] + am[1] * ab[1];
    let ab_ab = ab[0] * ab[0] + ab[1] * ab[1];
    let am_ad = am[0] * ad[0] + am[1] * ad[1];
    let ad_ad = ad[0] * ad[0] + ad[1] * ad[1];

    if (
      ((0 < am_ab) && (am_ab < ab_ab)) &&
      ((0 < am_ad) && (am_ad < ad_ad))
    )
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  // Unused - Can be removed
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

    // Get rectangle in front of head
    let padding = 0; // Optional padding - Increase or decrease size of rectangle
    let direction_radians = direction * Math.PI / 180;
    let rectangle_height = thickness / 3;
    let rectangle_point_a_x = leftmostpoint[0] - padding + (rectangle_height + padding) * Math.cos((-1) * direction_radians);
    let rectangle_point_a_y = leftmostpoint[1] + padding + (rectangle_height + padding) * Math.sin((-1) * direction_radians);
    let rectangle_point_b_x = rightmostpoint[0] + padding + (rectangle_height + padding) * Math.cos((-1) * direction_radians);
    let rectangle_point_b_y = rightmostpoint[1] + padding + (rectangle_height + padding) * Math.sin((-1) * direction_radians);
    let rectangle_point_c_x = rightmostpoint[0] + padding;
    let rectangle_point_c_y = rightmostpoint[1] + padding;
    let rectangle_point_d_x = leftmostpoint[0] - padding;
    let rectangle_point_d_y = leftmostpoint[1] + padding;
    let rectangle_point_a = [rectangle_point_a_x, rectangle_point_a_y];
    let rectangle_point_b = [rectangle_point_b_x, rectangle_point_b_y];
    let rectangle_point_c = [rectangle_point_c_x, rectangle_point_c_y];
    let rectangle_point_d = [rectangle_point_d_x, rectangle_point_d_y];
    let rectangle = [rectangle_point_a, rectangle_point_b, rectangle_point_c, rectangle_point_d];

    // Draw debug rectangle to collide with
    context.fillStyle = '#f00';
    context.beginPath();
    context.moveTo(764.6136471375994, 209.9679291896031);
    context.lineTo(816.120340696868, 248.79225482395702);
    context.lineTo(769.5311499356433, 286.6002870950792);
    context.lineTo(718.0244563763747, 247.77596146072526);
    context.closePath();
    context.fill();

    console.log("direction: ", direction)
    console.log("direction_radians_left: ", direction_radians_left)
    console.log("direction_radians_right: ", direction_radians_right)
    console.log("thickness: ", thickness)
    console.log("rectangle_height: ", rectangle_height)
    console.log("location: ", location)
    console.log("leftmostpoint: ", leftmostpoint)
    console.log("rightmostpoint: ", rightmostpoint)
    console.log("rectangle:", rectangle)

    // Get intersecting colors
    let color_middle    = context.getImageData(location[0], location[1], 1, 1).data;
    let color_left    = context.getImageData(leftmostpoint[0], leftmostpoint[1], 1, 1).data;
    let color_right    = context.getImageData(rightmostpoint[0], rightmostpoint[1], 1, 1).data;
    // TODO: Sometimes an off-by one color is retreived, e.g. 254 instead of
    // 255, and some transparency value other than 255. Could be circumvented by
    // rounding retreived colors up to the known colors (i.e. possible line colors
    // for players)

    let own_color_rgb = this.hexToRGB(own_color)
    console.log("own_color_rgb: ", own_color_rgb)
    console.log("own_color_rgb.r: ", own_color_rgb.r)
    console.log("own_color_rgb.g: ", own_color_rgb.g)
    console.log("own_color_rgb.b: ", own_color_rgb.b)

    console.log("color_middle: ", color_middle)
    console.log("color_left: ", color_left)
    console.log("color_right: ", color_right)

    // Check color
    if (
      // Black canvas is fine
      (color_middle[0] == 0 && color_middle[1] == 0 && color_middle[2] == 0) &&
      (color_left[0] == 0 && color_left[1] == 0 && color_left[2] == 0) &&
      (color_right[0] == 0 && color_right[1] == 0 && color_right[2] == 0)
    )
    {
      return false;
    }
    else if (
      // Own color is fine only when intersection results due to rotation curve
      (color_middle[0] == own_color_rgb.r && color_middle[1] == own_color_rgb.g && color_middle[2] == own_color_rgb.b) ||
      (color_left[0] == own_color_rgb.r && color_left[1] == own_color_rgb.g && color_left[2] == own_color_rgb.b) ||
      (color_right[0] == own_color_rgb.r && color_right[1] == own_color_rgb.g && color_right[2] == own_color_rgb.b)
    )
    {
      // Collision point lies in front of the head -> Call collision
      if (this.checkIfPointWithinRectangle(leftmostpoint, rectangle))
      {
        console.log("COLLISION")
        return true;
      }
      else if (this.checkIfPointWithinRectangle(rightmostpoint, rectangle))
      {
        console.log("COLLISION")
        return true;
      }
      
      // Collision point does not lie in front of the head -> Collision due to
      // self-intersection in curve
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
