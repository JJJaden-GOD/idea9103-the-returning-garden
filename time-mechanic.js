// AI assistance: OpenAI Codex helped implement and check this project mechanic.
// One clock controls both the automatic cycle and the visitor's intervention.
class WorldClock {
  constructor(duration = 60000) {
    this.duration = duration;
    this.phaseDuration = this.duration / 4;
    this.startedAt = millis();
    this.pausedAt = 0;
    this.paused = false;

    this.phaseIndex = 0;
    this.phaseProgress = 0;
    this.cycleProgress = 0;
    this.label = "Paradise";
    this.phaseNames = ["Paradise", "Earth", "Hell", "Return"];
    this.paletteKeys = [
      "skyTop", "skyBottom", "hill", "water", "waterLight", "cloud",
      "cloudShadow", "navy", "blue", "lightBlue", "coral", "coralLight",
      "gold", "goldLight", "door", "star"
    ];

    // The same blue, coral and gold building remains recognisable in each world.
    this.paradisePalette = this.makePalette({
      skyTop: "#D7EFED",
      skyBottom: "#F2F2D7",
      hill: "#87B5A0",
      water: "#78B9C1",
      waterLight: "#BCE1D7",
      cloud: "#FFF9DD",
      cloudShadow: "#C7DECE",
      navy: "#173758",
      blue: "#2E6598",
      lightBlue: "#75B4D8",
      coral: "#BA5944",
      coralLight: "#EF9070",
      gold: "#C6A15B",
      goldLight: "#F4DA91",
      door: "#142E3E",
      star: "#FFFADE"
    });

    this.earthPalette = this.makePalette({
      skyTop: "#91BEB3",
      skyBottom: "#CBD6A0",
      hill: "#56886B",
      water: "#4D9999",
      waterLight: "#9ECEBB",
      cloud: "#E6E7C4",
      cloudShadow: "#A3BFAD",
      navy: "#183C51",
      blue: "#316E87",
      lightBlue: "#76B0B2",
      coral: "#B96D5B",
      coralLight: "#DB996D",
      gold: "#A98C50",
      goldLight: "#DBC285",
      door: "#102F3D",
      star: "#F4E1AA"
    });

    this.hellPalette = this.makePalette({
      skyTop: "#191C35",
      skyBottom: "#44304D",
      hill: "#30283B",
      water: "#252E4D",
      waterLight: "#50516D",
      cloud: "#72616F",
      cloudShadow: "#42354F",
      navy: "#17263E",
      blue: "#29465F",
      lightBlue: "#687A8E",
      coral: "#813C49",
      coralLight: "#B56358",
      gold: "#796049",
      goldLight: "#B39566",
      door: "#101526",
      star: "#D29A83"
    });

    this.palette = {};
    this.update();
  }

  makePalette(hexValues) {
    const result = {};
    for (let i = 0; i < this.paletteKeys.length; i++) {
      const name = this.paletteKeys[i];
      result[name] = color(hexValues[name]);
    }
    return result;
  }

  update() {
    // A paused clock reads its frozen time instead of the current frame's time.
    let currentTime = millis();
    if (this.paused) {
      currentTime = this.pausedAt;
    }

    const elapsed = (currentTime - this.startedAt) % this.duration;
    this.cycleProgress = elapsed / this.duration;
    this.phaseIndex = floor(elapsed / this.phaseDuration);
    const phaseTime = elapsed % this.phaseDuration;
    this.phaseProgress = phaseTime / this.phaseDuration;
    this.label = this.phaseNames[this.phaseIndex];

    let firstPalette = this.paradisePalette;
    let nextPalette = this.earthPalette;
    let blend = 0;

    // At 60 seconds, Paradise and Earth each hold for 10 seconds, then change for 5.
    const stableTime = this.phaseDuration * 2 / 3;
    const changeTime = this.phaseDuration - stableTime;

    if (this.phaseIndex === 0) {
      blend = constrain((phaseTime - stableTime) / changeTime, 0, 1);
    } else if (this.phaseIndex === 1) {
      firstPalette = this.earthPalette;
      nextPalette = this.hellPalette;
      blend = constrain((phaseTime - stableTime) / changeTime, 0, 1);
    } else if (this.phaseIndex === 2) {
      firstPalette = this.hellPalette;
      nextPalette = this.hellPalette;
    } else if (this.phaseIndex === 3) {
      // Return uses its full stage to move from the dark world back to daylight.
      firstPalette = this.hellPalette;
      nextPalette = this.paradisePalette;
      blend = this.phaseProgress;
    }

    // Colours share one transition amount so the whole scene changes together.
    for (let i = 0; i < this.paletteKeys.length; i++) {
      const name = this.paletteKeys[i];
      this.palette[name] = lerpColor(firstPalette[name], nextPalette[name], blend);
    }
  }

  reset() {
    let currentTime = millis();
    if (this.paused) {
      currentTime = this.pausedAt;
    }
    this.startedAt = currentTime;
    this.update();
  }

  enterEarth() {
    let currentTime = millis();
    if (this.paused) {
      currentTime = this.pausedAt;
    }
    // Reposition this same timeline; repeated clicks always restart Earth.
    this.startedAt = currentTime - this.phaseDuration;
    this.update();
  }

  togglePause() {
    const currentTime = millis();
    if (this.paused) {
      // Exclude the paused interval so resuming continues from the frozen frame.
      this.startedAt += currentTime - this.pausedAt;
      this.paused = false;
    } else {
      this.pausedAt = currentTime;
      this.paused = true;
    }
    this.update();
  }
}
