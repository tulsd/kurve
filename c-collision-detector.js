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

  collisionAtLocation(location)
  {
    // Get color
    let context = this.canvas_.getContext("2d");
    let data    = context.getImageData(location[0], location[1], 1, 1).data;

    // Check color
    if(data[0] == 0 && data[1] == 0 && data[2] == 0)
    {
      return false;
    }
    else
    {
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