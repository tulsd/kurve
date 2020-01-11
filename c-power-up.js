class PowerUp
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(game)
  {
    this.game_        = game;
    this.wallTimeout  = undefined;
    this.wall_inactive_for_   = 0;
    this.used = false;
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods
  sendMessageWallInactive()
  {
    if(this.used == false)
    {
      let message_content = {
        player: this.game_.players_local_[0].id_,
        duration: 7000
      };
      this.game_.communicator_.sendMessage('WallInactiveTime', 'Global', message_content);
      this.used = true;
    }
  }

  addWallInactiveTime(message)
  {
    this.game_.ui_handler_.updateWallUsed(message.player);
    this.wall_inactive_for_ += message.duration;
    this.game_.drawer_.clearBorder();
    this.checkTime(message.duration);
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
          that.game_.drawer_.drawBorder();
          that.wallTimeout = undefined;
        }

      }, seconds);
    }
  }
}