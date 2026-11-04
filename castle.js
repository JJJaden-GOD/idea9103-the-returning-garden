// AI acknowledgement: ChatGPT helped translate the approved V2 concept into
// a logical pixel grid. The geometry is original code, not an imported image.
// Source inspiration: Bosch, The Garden of Earthly Delights, central blue tower.

class Castle {
  constructor() {
    this.columns = 48;
    this.rows = 128;
    this.pixels = [];
    this.centreX = 0;
    this.baseY = 0;
    this.unit = 1;
    this.breathScale = 1;
    this.colourKeys = {
      N: 'navy', B: 'blue', L: 'lightBlue', C: 'coral',
      R: 'coralLight', G: 'gold', Y: 'goldLight', D: 'door'
    };

    for (let row = 0; row < this.rows; row++) {
      let line = [];
      for (let column = 0; column < this.columns; column++) line.push('.');
      this.pixels.push(line);
    }
    this.buildSphere();
    this.buildTower();
  }

  // A helper fills grid cells; display() will draw each cell using rect().
  paintRect(x, y, w, h, colour) {
    for (let row = y; row < y + h; row++) {
      for (let column = x; column < x + w; column++) {
        if (row >= 0 && row < this.rows && column >= 0 && column < this.columns) {
          this.pixels[row][column] = colour;
        }
      }
    }
  }

  buildSphere() {
    // Measuring distance for every grid cell creates a stair-stepped sphere.
    // The large blue clusters deliberately replace the AI preview's gradients.
    for (let row = 84; row < 128; row++) {
      for (let column = 2; column < 46; column++) {
        let distance = dist(column, row, 23.5, 105);
        if (distance < 21.5) {
          let shade = 'N';
          if (distance < 19.5 && column > 6 && row < 124) shade = 'B';
          this.pixels[row][column] = shade;
        }
      }
    }
    this.paintRect(28, 89, 5, 2, 'L');
    this.paintRect(30, 91, 5, 3, 'L');
    this.paintRect(33, 94, 4, 3, 'L');
    this.paintRect(35, 97, 3, 2, 'L');
    this.paintRect(3, 107, 42, 1, 'G');
    this.paintRect(5, 108, 38, 1, 'Y');
    this.paintRect(21, 117, 6, 1, 'G');
    this.paintRect(20, 118, 8, 1, 'G');
    this.paintRect(19, 119, 2, 8, 'G');
    this.paintRect(27, 119, 2, 8, 'G');
    this.paintRect(21, 119, 6, 1, 'D');
    this.paintRect(20, 120, 8, 7, 'D');
  }

  buildTower() {
    // Central shaft, fluting and a gold cup-shaped connection to the sphere.
    this.paintRect(17, 54, 14, 30, 'N');
    this.paintRect(19, 56, 10, 27, 'B');
    this.paintRect(19, 56, 1, 25, 'L');
    this.paintRect(23, 56, 2, 25, 'L');
    this.paintRect(28, 56, 1, 25, 'L');
    this.paintRect(14, 80, 3, 2, 'G');
    this.paintRect(31, 80, 3, 2, 'G');
    this.paintRect(16, 82, 3, 2, 'G');
    this.paintRect(29, 82, 3, 2, 'G');
    this.paintRect(18, 84, 12, 2, 'Y');

    // Draw both side ornaments from the same local recipe to keep symmetry.
    for (let side = 0; side < 2; side++) {
      let x = side === 0 ? 8 : 34;
      this.paintRect(x + 2, 48, 1, 6, 'C');
      this.paintRect(x + 1, 54, 3, 5, 'C');
      this.paintRect(x + 2, 55, 1, 3, 'R');
      this.paintRect(x, 59, 5, 3, 'B');
      this.paintRect(x + 1, 59, 3, 2, 'L');
      this.paintRect(x, 64, 5, 2, 'Y');
      this.paintRect(x + 1, 66, 3, 11, 'C');
      this.paintRect(x, 76, 5, 7, 'C');
      this.paintRect(x - 1, 80, 7, 5, 'C');
      this.paintRect(x + 1, 69, 1, 12, 'R');
      this.paintRect(x, 81, 3, 3, 'R');
      this.paintRect(side === 0 ? x + 4 : x - 2, 69, 4, 2, 'G');
    }

    this.paintRect(15, 53, 18, 2, 'G');
    this.paintRect(16, 53, 16, 1, 'Y');
    this.paintRect(20, 28, 8, 17, 'N');
    this.paintRect(22, 29, 2, 14, 'L');
    this.paintRect(17, 31, 3, 7, 'C');
    this.paintRect(28, 31, 3, 7, 'C');
    this.paintRect(17, 33, 2, 3, 'R');
    this.paintRect(29, 33, 2, 3, 'R');
    this.paintRect(17, 38, 3, 8, 'L');
    this.paintRect(28, 38, 3, 8, 'L');

    // The coral ring recalls the open, vessel-like middle of the source tower.
    for (let row = 42; row < 53; row++) {
      for (let column = 18; column < 30; column++) {
        let distance = dist(column, row, 23.5, 47.5);
        if (distance < 6) this.pixels[row][column] = 'C';
        if (distance < 4) this.pixels[row][column] = 'L';
      }
    }
    this.paintRect(20, 44, 2, 5, 'R');
    this.paintRect(16, 26, 16, 2, 'N');
    this.paintRect(17, 25, 14, 2, 'L');
    this.paintRect(18, 23, 12, 2, 'C');
    this.paintRect(20, 20, 8, 3, 'C');
    this.paintRect(21, 15, 6, 5, 'C');
    this.paintRect(22, 10, 4, 5, 'C');
    this.paintRect(23, 4, 2, 6, 'C');
    this.paintRect(23, 1, 1, 3, 'C');
    this.paintRect(23, 11, 1, 8, 'R');
    this.paintRect(22, 20, 3, 2, 'R');
  }

  setLayout(x, baseY, unit) {
    this.centreX = x;
    this.baseY = baseY;
    this.unit = unit;
  }

  display(palette, breathScale, lightAmount) {
    this.breathScale = breathScale;
    push();
    translate(this.centreX, this.baseY);
    scale(breathScale);
    noStroke();
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        let token = this.pixels[row][column];
        if (token !== '.') {
          let pixelColour = palette[this.colourKeys[token]];
          if (token === 'D') pixelColour = lerpColor(palette.door, palette.gold, lightAmount);
          fill(pixelColour);
          rect((column - this.columns / 2) * this.unit,
            (row - this.rows) * this.unit, this.unit + 0.05, this.unit + 0.05);
        }
      }
    }
    pop();
  }

  // Hit-testing the stored grid ignores transparent corners around the tower.
  contains(pointerX, pointerY) {
    let size = this.unit * this.breathScale;
    let column = floor((pointerX - this.centreX) / size + this.columns / 2);
    let row = floor((pointerY - this.baseY) / size + this.rows);
    return row >= 0 && row < this.rows && column >= 0 && column < this.columns && this.pixels[row][column] !== '.';
  }
}
