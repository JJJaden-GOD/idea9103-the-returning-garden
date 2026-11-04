// AI assistance: OpenAI Codex helped implement the requested background designs.
// Course techniques: a class, arrays, loops, conditions, rect(), dist(), sin()
// and lerp(). All symbols are drawn as small rectangles, without image assets.
// API references: https://p5js.org/reference/p5/rect/
// https://p5js.org/reference/p5/lerp/

class WorldDetails {
  constructor() {
    this.weights = [1, 0, 0];
    this.time = 0;
  }

  update(clock, easing) {
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] = lerp(this.weights[i], clock.worldWeights[i], easing);
    }
    // This reads the existing world clock, so Pause cycle also stills the embers.
    this.time = clock.cycleProgress * TWO_PI;
  }

  display(horizon) {
    push();
    noStroke();
    if (this.weights[0] > 0.005) this.drawParadise(this.weights[0], horizon);
    if (this.weights[1] > 0.005) this.drawEarth(this.weights[1], horizon);
    if (this.weights[2] > 0.005) this.drawHell(this.weights[2], horizon);
    pop();
  }

  useColour(rgb, opacity) {
    fill(rgb[0], rgb[1], rgb[2], 255 * opacity);
  }

  drawDisc(x, y, block, colour, opacity, ring) {
    this.useColour(colour, opacity);
    for (let row = -10; row <= 10; row++) {
      for (let column = -10; column <= 10; column++) {
        let distance = dist(column, row, 0, 0);
        if (distance <= 10 && (!ring || distance > 7)) {
          rect(x + column * block, y + row * block, block, block);
        }
      }
    }
  }

  drawParadise(opacity, horizon) {
    let block = max(2, floor(min(width * 0.007, height * 0.009)));
    let x = floor(width * 0.83 / block) * block;
    let y = floor(height * 0.19 / block) * block;
    // A hollow stepped halo and four small rays distinguish the celestial sky.
    this.drawDisc(x, y, block, [255, 248, 208], opacity, true);
    this.useColour([255, 255, 247], opacity);
    rect(x - block, y - 16 * block, 3 * block, 4 * block);
    rect(x - block, y + 13 * block, 3 * block, 4 * block);
    rect(x - 16 * block, y - block, 4 * block, 3 * block);
    rect(x + 13 * block, y - block, 4 * block, 3 * block);

    // Sparse light dust floats in the two wings, away from the tower.
    for (let i = 0; i < 14; i++) {
      let side = i % 2;
      let px = width * (0.07 + (i % 7) * 0.039);
      if (side === 1) px = width - px;
      let py = height * (0.12 + (i % 5) * 0.085);
      py += sin(this.time + i * 1.7) * block * 2;
      this.useColour([255, 255, 241], opacity * (0.55 + 0.3 * sin(this.time + i)));
      rect(round(px / block) * block, round(py / block) * block, block, block);
    }

    // Two floating terraces suggest a weightless garden above the shore.
    for (let i = 0; i < 2; i++) {
      let px = width * (i === 0 ? 0.16 : 0.84);
      let py = horizon - height * (i === 0 ? 0.13 : 0.07);
      this.useColour([228, 242, 231], opacity);
      rect(px - 9 * block, py, 18 * block, 2 * block);
      this.useColour([177, 210, 211], opacity);
      rect(px - 6 * block, py + 2 * block, 12 * block, 2 * block);
      rect(px - 3 * block, py + 4 * block, 6 * block, 2 * block);
      this.useColour([255, 246, 200], opacity);
      rect(px - 5 * block, py - block, 10 * block, block);
    }
  }

  drawEarth(opacity, horizon) {
    let block = max(2, floor(min(width * 0.007, height * 0.009)));
    let x = floor(width * 0.83 / block) * block;
    let y = floor(height * 0.19 / block) * block;
    this.drawDisc(x, y, block, [255, 211, 125], opacity, false);
    this.useColour([255, 235, 170], opacity);
    rect(x - 7 * block, y - 5 * block, 15 * block, block);
    rect(x - 9 * block, y - block, 19 * block, block);

    // Fruit shrubs and flowers occupy the narrow strip of land on either side.
    for (let i = 0; i < 4; i++) {
      let px = width * (0.09 + (i % 2) * 0.14);
      if (i > 1) px = width - px;
      let py = horizon + height * (0.03 + (i % 2) * 0.015);
      this.useColour([61, 86, 56], opacity);
      rect(px - block, py, 2 * block, 6 * block);
      this.useColour([113, 151, 86], opacity);
      rect(px - 4 * block, py - 4 * block, 8 * block, 5 * block);
      rect(px - 6 * block, py - block, 12 * block, 3 * block);
      this.useColour([232, 130, 99], opacity);
      rect(px - 3 * block, py - 2 * block, 2 * block, 2 * block);
      rect(px + 2 * block, py, 2 * block, 2 * block);
      let flowerX = px + (i % 2 === 0 ? 8 : -8) * block;
      this.useColour([240, 196, 207], opacity);
      rect(flowerX - block, py + 4 * block, 3 * block, block);
      rect(flowerX, py + 3 * block, block, 3 * block);
      this.useColour([250, 224, 142], opacity);
      rect(flowerX, py + 4 * block, block, block);
    }
  }

  drawHell(opacity, horizon) {
    let block = max(2, floor(min(width * 0.007, height * 0.009)));
    let x = floor(width * 0.83 / block) * block;
    let y = floor(height * 0.19 / block) * block;
    this.drawDisc(x, y, block, [185, 62, 73], opacity, false);
    this.useColour([116, 38, 58], opacity);
    rect(x - 6 * block, y - 5 * block, 4 * block, 3 * block);
    rect(x + 2 * block, y + block, 5 * block, 4 * block);

    for (let i = 0; i < 6; i++) {
      let px = width * (0.025 + (i % 3) * 0.09);
      if (i > 2) px = width - px;
      let peak = horizon - height * (0.04 + (i % 3) * 0.035);
      this.useColour([31, 18, 34], opacity);
      rect(px - 4 * block, peak, 8 * block, horizon - peak + 8 * block);
      rect(px - 2 * block, peak - 4 * block, 4 * block, 5 * block);
      this.useColour([64, 30, 47], opacity);
      rect(px - 4 * block, peak + 3 * block, 2 * block, 5 * block);
      this.useColour([229, 100, 66], opacity);
      rect(px, horizon, block, 3 * block);
      rect(px + block, horizon + 2 * block, 2 * block, block);
      rect(px + 2 * block, horizon + 3 * block, block, 3 * block);
    }

    // A fixed loop recycles small rising embers, without adding particle objects.
    for (let i = 0; i < 18; i++) {
      let progress = (this.time * 0.38 + i * 0.137) % 1;
      let px = width * (0.06 + (i % 6) * 0.041);
      if (i % 2 === 1) px = width - px;
      px += sin(this.time * 2 + i) * block * 2;
      let py = horizon - progress * height * 0.4;
      this.useColour(i % 3 === 0 ? [255, 195, 111] : [235, 111, 81], opacity * (1 - progress));
      rect(round(px / block) * block, round(py / block) * block, block, 2 * block);
    }
  }
}
