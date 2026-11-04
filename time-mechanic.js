// AI assistance: OpenAI Codex helped implement and check this project mechanic.
// One clock controls both the automatic cycle and the visitor's intervention.
// API references: https://p5js.org/reference/p5/millis/
// https://p5js.org/reference/p5/lerpColor/
// Supplementary API: millis() reads elapsed milliseconds. The world clock uses
// this real-time reading to calculate cycle progress and compensate for pauses.
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
    // Background symbols use the same three-world blend as the colour palettes.
    this.worldWeights = [1, 0, 0];
    this.paletteKeys = [
      "skyTop", "skyBottom", "hill", "water", "waterLight", "cloud",
      "cloudShadow", "navy", "blue", "lightBlue", "coral", "coralLight",
      "gold", "goldLight", "door", "star"
    ];

    // The same blue, coral and gold building remains recognisable in each world.
    this.paradisePalette = this.makePalette({
      skyTop: "#BBDFF3",
      skyBottom: "#F1F3F1",
      hill: "#9FC4C5",
      water: "#76B9D1",
      waterLight: "#D0EDF2",
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
      skyTop: "#D39495",
      skyBottom: "#F7D8A0",
      hill: "#567A63",
      water: "#4D8988",
      waterLight: "#B2D6BB",
      cloud: "#FFE4BF",
      cloudShadow: "#D4A89D",
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
      skyTop: "#130F22",
      skyBottom: "#713544",
      hill: "#2B192C",
      water: "#281D35",
      waterLight: "#AD564F",
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
    let firstWorld = 0;
    let nextWorld = 1;
    let blend = 0;

    // At 60 seconds, Paradise and Earth each hold for 10 seconds, then change for 5.
    const stableTime = this.phaseDuration * 2 / 3;
    const changeTime = this.phaseDuration - stableTime;

    if (this.phaseIndex === 0) {
      blend = constrain((phaseTime - stableTime) / changeTime, 0, 1);
    } else if (this.phaseIndex === 1) {
      firstPalette = this.earthPalette;
      nextPalette = this.hellPalette;
      firstWorld = 1;
      nextWorld = 2;
      blend = constrain((phaseTime - stableTime) / changeTime, 0, 1);
    } else if (this.phaseIndex === 2) {
      firstPalette = this.hellPalette;
      nextPalette = this.hellPalette;
      firstWorld = 2;
      nextWorld = 2;
    } else if (this.phaseIndex === 3) {
      // Return uses its full stage to move from the dark world back to daylight.
      firstPalette = this.hellPalette;
      nextPalette = this.paradisePalette;
      firstWorld = 2;
      nextWorld = 0;
      blend = this.phaseProgress;
    }

    // Colours share one transition amount so the whole scene changes together.
    for (let i = 0; i < this.paletteKeys.length; i++) {
      const name = this.paletteKeys[i];
      this.palette[name] = lerpColor(firstPalette[name], nextPalette[name], blend);
    }
    for (let i = 0; i < this.worldWeights.length; i++) this.worldWeights[i] = 0;
    this.worldWeights[firstWorld] += 1 - blend;
    this.worldWeights[nextWorld] += blend;
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
