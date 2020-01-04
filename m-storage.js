class Storage
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor()
  {
    this.local_storage_ = window.localStorage;

    // Storage items
    this.win_count_ = parseInt(this.local_storage_.getItem('win_count'));
    this.win_count_ = (this.win_count_ == null || this.win_count_ == "NaN") ? 0 : this.win_count_;
    this.local_storage_.setItem('win_count', this.win_count_);
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods
  

}
