class AudioPlayer
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor() { }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods
  
  playSound(soundfile)
  {
    // Uses the HTMLAudioElement interface, which provides access to the
    // properties of <audio> elements, as well as manipulate them
    let audio = new Audio(soundfile);
    audio.play();
  }

  playGameEndSound()
  {
    this.playSound('assets/sfx-game-over.mp3')
  }

}
