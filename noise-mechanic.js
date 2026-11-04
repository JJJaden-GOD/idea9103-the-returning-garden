/*
 * AI assistance: OpenAI Codex helped draft this class from the project brief.
 * Course techniques: classes, arrays, for loops, random(), noise(), lerp(),
 * constrain(), and rectangle drawing. Review and explain each method before use.
 */

class CloudSystem {
  constructor(count = 3) {
    this.clouds = [];
    this.phaseSpeed = 0.8;

    // Keep a fixed number of clouds, so the animation cannot grow an array forever.
    let cloudCount = constrain(floor(count), 1, 8);
    for (let i = 0; i < cloudCount; i++) {
      let side = i % 2;
      let startX = random(0.11, 0.22);
      if (side === 1) {
        startX = random(0.78, 0.89);
      }

      // Separate vertical bands keep the two left clouds from merging together.
      let verticalBand = i % 3;
      let startY = random(0.14 + verticalBand * 0.16, 0.20 + verticalBand * 0.16);
      let offset = random(100, 1000);
      this.clouds.push({
        side: side,
        baseX: startX,
        baseY: startY,
        x: startX,
        y: startY,
        size: random(0.07, 0.105),
        speed: random(0.035, 0.065),
        noiseOffset: offset,
        startNoiseX: noise(offset),
        startNoiseY: noise(offset + 50),
        time: 0
      });
    }
  }

  update(phaseIndex, deltaSeconds) {
    // Limit a delayed frame so switching tabs does not advance the sky abruptly.
    let seconds = constrain(deltaSeconds, 0, 0.1);
    let stage = constrain(phaseIndex, 0, 3);
    let desiredSpeed = 0.7 + stage * 0.15;
    this.phaseSpeed = lerp(this.phaseSpeed, desiredSpeed, seconds * 0.8);

    for (let i = 0; i < this.clouds.length; i++) {
      let cloud = this.clouds[i];
      cloud.time += seconds * cloud.speed * this.phaseSpeed;

      // Adjacent noise samples create connected motion, unlike new random positions.
      let driftX = noise(cloud.noiseOffset + cloud.time) - cloud.startNoiseX;
      let driftY = noise(cloud.noiseOffset + 50 + cloud.time * 0.7) - cloud.startNoiseY;
      cloud.x = cloud.baseX + driftX * 0.11;
      cloud.y = constrain(cloud.baseY + driftY * 0.12, 0.1, 0.56);

      // Leave the middle of the sky open so the castle silhouette stays legible.
      if (cloud.side === 0) {
        cloud.x = constrain(cloud.x, 0.075, 0.26);
      } else {
        cloud.x = constrain(cloud.x, 0.74, 0.925);
      }
    }
  }

  display(palette, horizonY) {
    let lightColour = "#fff7df";
    let shadowColour = "#d6dfdc";
    if (palette && palette.cloud) {
      lightColour = palette.cloud;
    }
    if (palette && palette.cloudShadow) {
      shadowColour = palette.cloudShadow;
    }

    let skyHeight = constrain(horizonY, height * 0.3, height * 0.85);
    push();
    noStroke();
    for (let i = 0; i < this.clouds.length; i++) {
      let cloud = this.clouds[i];
      let block = max(2, round(min(width * cloud.size / 14, skyHeight * 0.035)));
      let x = round(cloud.x * width / block) * block;
      let y = round(cloud.y * skyHeight / block) * block;
      y = constrain(y, block * 2, skyHeight - block * 5);

      // Stepped rectangles keep the clouds in the same pixel language as the castle.
      fill(shadowColour);
      rect(x - 6 * block, y + block, 12 * block, 3 * block);
      fill(lightColour);
      rect(x - 7 * block, y + block, 14 * block, 2 * block);
      rect(x - 5 * block, y, 10 * block, 2 * block);
      rect(x - 3 * block, y - block, 5 * block, 2 * block);
      fill(shadowColour);
      rect(x - 4 * block, y + 3 * block, 8 * block, block);
    }
    pop();
  }

  reset() {
    this.phaseSpeed = 0.8;
    for (let i = 0; i < this.clouds.length; i++) {
      let cloud = this.clouds[i];
      cloud.time = 0;
      cloud.x = cloud.baseX;
      cloud.y = cloud.baseY;
    }
  }
}
