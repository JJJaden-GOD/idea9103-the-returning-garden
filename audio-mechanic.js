/*
 * AI assistance: OpenAI Codex helped draft this class from the project brief.
 * It analyses the supplied original WAV with p5.sound; it never opens a microphone.
 * The user's sound choice, actual playback and whole-scene pause are separate.
 * userStartAudio() waits for the browser to allow a user's playback request.
 * API reference: https://v1.p5js.org/reference/p5.Amplitude/getLevel/
 * https://v1.p5js.org/reference/p5.SoundFile/setVolume/
 * https://v1.p5js.org/reference/p5.SoundFile/pause/
 * The WAV is original AI-assisted synthesis; see README for its provenance.
 * Supplementary audio-start/error handling:
 * https://v1.p5js.org/reference/p5/userStartAudio/
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
 */

class AudioMechanic {
  constructor(soundFile) {
    this.soundFile = soundFile;
    this.amplitude = new p5.Amplitude();
    this.enabled = false;
    this.globalPaused = false;
    this.volume = 0.6;
    this.appliedVolume = -1;
    this.level = 0;
    this.breathScale = 0.82 + 0.24 * this.volume;
    this.playing = false;
    this.starting = false;
    this.status = "Sound unavailable";

    if (this.isReady()) {
      this.status = "Sound off";
    }
    if (this.soundFile) {
      this.amplitude.setInput(this.soundFile);
      this.setVolume(this.volume);
    }
  }

  isReady() {
    if (!this.soundFile) {
      return false;
    }
    return this.soundFile.isLoaded();
  }

  // A second click can change the intent even while the browser is starting audio.
  // Call this from a mouse or keyboard event, never from draw() or setup().
  toggle() {
    this.enabled = !this.enabled;
    if (!this.isReady()) {
      this.enabled = false;
      this.status = "Sound unavailable";
      return;
    }

    if (!this.enabled) {
      if (this.pausePlayback()) {
        this.status = "Sound off";
      }
    } else if (this.globalPaused) {
      // Remember the choice without allowing sound to break the global pause.
      this.status = "Sound enabled while paused";
    } else {
      this.requestStart();
    }
  }

  // The shared pause button calls this; it never changes the user's sound choice.
  setGlobalPaused(paused) {
    if (this.globalPaused === paused) {
      return;
    }
    this.globalPaused = paused;
    if (this.globalPaused) {
      this.pausePlayback();
      if (this.enabled) {
        this.status = "Sound paused";
      }
    } else if (this.enabled) {
      // Resuming is also a user action, so it can safely unlock browser audio.
      this.requestStart();
    }
  }

  setVolume(value) {
    this.volume = constrain(value, 0, 1);
    if (this.isReady() && this.volume !== this.appliedVolume) {
      try {
        // Write the gain once per change, not every frame or every play request.
        this.soundFile.setVolume(this.volume, 0.05);
        this.appliedVolume = this.volume;
      } catch (error) {
        this.enabled = false;
        this.pausePlayback();
        this.status = "Sound error - retry";
      }
    }
  }

  requestStart() {
    if (!this.enabled || this.globalPaused || this.starting) {
      return;
    }
    if (!this.isReady()) {
      this.enabled = false;
      this.status = "Sound unavailable";
      return;
    }
    if (this.soundFile.isPlaying()) {
      this.playing = true;
      this.status = "Sound playing";
      return;
    }

    this.starting = true;
    this.status = "Sound starting";
    let mechanic = this;
    try {
      userStartAudio().then(function() {
        mechanic.starting = false;
        // Read the latest flags, so a pending request cannot undo a later pause.
        if (!mechanic.enabled || mechanic.globalPaused) {
          return;
        }
        try {
          mechanic.setVolume(mechanic.volume);
          if (!mechanic.enabled) {
            return;
          }
          mechanic.soundFile.setLoop(true);
          if (!mechanic.soundFile.isPlaying()) {
            mechanic.soundFile.play();
          }
          mechanic.playing = mechanic.soundFile.isPlaying();
          mechanic.status = "Sound playing";
        } catch (error) {
          mechanic.enabled = false;
          mechanic.pausePlayback();
          mechanic.status = "Sound error - retry";
        }
      }, function() {
        mechanic.starting = false;
        mechanic.enabled = false;
        mechanic.playing = false;
        mechanic.status = "Sound blocked - retry";
      });
    } catch (error) {
      this.starting = false;
      this.enabled = false;
      this.playing = false;
      this.status = "Sound error - retry";
    }
  }

  pausePlayback() {
    try {
      if (this.isReady() && this.soundFile.isPlaying()) {
        // pause() preserves the file cursor; stop() would restart the music.
        this.soundFile.pause();
      }
      this.playing = this.isReady() && this.soundFile.isPlaying();
      return true;
    } catch (error) {
      this.enabled = false;
      this.status = "Sound error - retry";
      return false;
    }
  }

  update() {
    this.playing = this.isReady() && this.soundFile.isPlaying();
    if (this.globalPaused) {
      // Hold the last visual samples as well as the file position while paused.
      return;
    }

    this.level = 0;
    if (this.playing) {
      // This analyser is after the file's volume gain: do not multiply by volume.
      this.level = constrain(this.amplitude.getLevel(), 0, 1);
    }

    // Volume sets a clearly visible base size, even with sound switched off.
    // The measured music adds a smaller breath on top of that deliberate mapping.
    let energy = constrain(this.level / 0.24, 0, 1);
    let targetScale = 0.82 + 0.24 * this.volume + 0.10 * energy;
    this.breathScale = lerp(this.breathScale, targetScale, 0.10);
    this.breathScale = constrain(this.breathScale, 0.82, 1.16);
  }

  getStatus() {
    return this.status;
  }
}
