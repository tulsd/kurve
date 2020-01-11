class PowerUp
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(type, drawer)
  {
    this.type_ = type;
    this.drawer_ = drawer;
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods
  sendMessageWallInactive()
  {
    this.communicator_.sendMessage('WallInactiveTime', 'Global', 1000);
  }
  addWallInactiveTime(seconds)
  {
    this.wall_inactive_for_ += seconds;
    this.drawer_.clearBorder();
    this.checkTime(seconds);
  }

  checkTime(seconds)
  {
    if(this.wallTimeout == undefined)
    {
      let that = this;
      this.wallTimeout = setTimeout(function(){

        that.wall_inactive_for_ -= seconds;

        if(that.wall_inactive_for_ > 0)
        {
          that.wallTimeout = undefined;
          that.checkTime(that.wall_inactive_for_);
        } else {
          that.drawer_.drawBorder();
          that.wallTimeout = undefined;
        }

      }, seconds);
    }
  }
}