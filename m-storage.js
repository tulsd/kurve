class Storage
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor()
  {
    this.local_storage_ = window.localStorage;

    // Storage items
    this.win_count_ = parseInt(this.local_storage_.getItem('win_count'));
    this.win_count_ = isNaN(this.win_count_) ? -1 : this.win_count_;
    this.increaseWinCount();

    this.units_traveled_ = parseInt(this.local_storage_.getItem('units_traveled'));
    this.units_traveled_ = isNaN(this.units_traveled_) ? 0 : this.units_traveled_;
    this.increaseUnitsTraveled(0);
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods
  
  increaseUnitsTraveled(additionalUnits) {
    this.units_traveled_ += additionalUnits;
    this.local_storage_.setItem('units_traveled', this.units_traveled_);
  }

  increaseWinCount() {
    this.win_count_++;
    this.local_storage_.setItem('win_count', this.win_count_);
  }
}
