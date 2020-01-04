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

  playGameEndSound()
  {
    this.playSound('assets/sfx-game-over.mp3')
  }

}
