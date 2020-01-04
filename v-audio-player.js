class AudioPlayer
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(container_audio)
  {
    this.container_audio_ = container_audio;
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods
  
  playSound(soundfile)
  {
    let audio = new Audio(soundfile);
    audio.play();
  }

  playVictorySound()
  {
    // TODO: Use better victory sound instead of placeholder
    this.playSound('assets/sfx-powerup-appear.mp3')
  }

}
