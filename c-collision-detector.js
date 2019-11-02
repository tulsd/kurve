class CollisionDetector
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(canvas)
  {
    this.canvas_ = canvas;
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
      console.log('collision');
      return true;
    }
  }
}