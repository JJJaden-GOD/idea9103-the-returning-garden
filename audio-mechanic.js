/*
 * AI assistance: OpenAI Codex helped draft this class from the project brief.
 * It analyses the supplied original WAV with p5.sound; it never opens a microphone.
 * userStartAudio() returns a promise, so its success callback waits for the browser
 * to allow playback after the user's click or key press.
 * API reference: https://v1.p5js.org/reference/p5.Amplitude/getLevel/
 * The WAV is original AI-assisted synthesis; see README for its provenance.
 * Supplementary audio-start/error handling:
 * https://v1.p5js.org/reference/p5/userStartAudio/
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
 */

class AudioMechanic {
  constructor(soundFile) {
    this.soundFile = soundFile;
    this.amplitude = new p5.Amplitude();
    this.level = 0;
    this.breathScale = 1;
    this.playing = false;
    this.starting = false;
    this.status = "Sound unavailable";

    if (this.soundFile) {
      this.amplitude.setInput(this.soundFile);
    }
    if (this.isReady()) {
      this.status = "Sound ready";
    }
  }

  isReady() {
    if (!this.soundFile) {
      return false;
    }
    return this.soundFile.isLoaded();
  }

  // Call this only from a mouse or keyboard event, never from draw() or setup().
  toggle() {
    if (!this.isReady()) {
      this.status = "Sound unavailable";
      return;
    }
    if (this.starting) {
      return;
    }

    this.starting = true;
    let mechanic = this;
    try {
      userStartAudio().then(function() {
        try {
          if (mechanic.soundFile.isPlaying()) {
            mechanic.soundFile.pause();
            mechanic.playing = false;
            mechanic.level = 0;
            mechanic.status = "Sound paused";
          } else {
            mechanic.soundFile.setLoop(true);
            mechanic.soundFile.play();
            mechanic.playing = true;
            mechanic.status = "Sound playing";
          }
        } catch (error) {
          mechanic.status = "Sound error - retry";
        }
        mechanic.starting = false;
      }, function() {
        mechanic.starting = false;
        mechanic.status = "Sound blocked - retry";
      });
    } catch (error) {
      this.starting = false;
      this.status = "Sound error - retry";
    }
  }

  update() {
    let targetScale = 1;
    this.level = 0;
    this.playing = this.isReady() && this.soundFile.isPlaying();

    if (this.playing) {
      this.level = constrain(this.amplitude.getLevel(), 0, 1);

      // Remove a quiet baseline so the supplied pad can both settle and expand.
      // Clamp the response so a musical peak can only produce a gentle breath.
      let energy = constrain((this.level - 0.07) * 5.2, 0, 1);
      targetScale = 0.985 + energy * 0.05;
    }

    // A paused file may leave analyser history behind: use a neutral target instead.
    // This also lets the castle relax back to normal without snapping on pause.
    this.breathScale = lerp(this.breathScale, targetScale, 0.08);
    this.breathScale = constrain(this.breathScale, 0.985, 1.035);
  }

  getStatus() {
    return this.status;
  }
}
