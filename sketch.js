// ChatGPT assisted the implementation and documentation of this project.
// Course techniques: preload/setup/draw, arrays, functions, classes, rect,
// lerp/lerpColor, coordinate transforms and windowResized. See README sources.
// Supplementary APIs: deltaTime measures elapsed frame time for smooth motion;
// pixelDensity(1) limits the output resolution, and parent/elt place and label
// the canvas in the HTML interface. These are explained as extensions in README.
// https://p5js.org/reference/p5/deltaTime/
// https://developer.mozilla.org/en-US/docs/Web/API/Document

let castle;
let worldClock;
let cloudSystem;
let worldDetails;
let audioMechanic;
let soundtrack;
let soundReady = false;
let sceneStarted = false;
let interventionGlow = 0;
let scenePalette = {};
let lastPhase = -1;
let lastSoundPlaying = false;
let lastAudioStatus = '';

const paletteKeys = ['skyTop', 'skyBottom', 'hill', 'water', 'waterLight',
  'cloud', 'cloudShadow', 'navy', 'blue', 'lightBlue', 'coral', 'coralLight',
  'gold', 'goldLight', 'door', 'star'];

function preload() {
  soundtrack = loadSound('assets/audio/garden-loop.wav',
    function () { soundReady = true; },
    function () { soundReady = false; });
}

function setup() {
  let canvas = createCanvas(getGardenWidth(), getGardenHeight());
  canvas.parent('canvas-host');
  canvas.elt.setAttribute('role', 'img');
  canvas.elt.setAttribute('aria-label', 'A blue pixel tower above a quiet lake. Click the tower or press E to return the world to Earth.');
  canvas.elt.setAttribute('tabindex', '0');
  pixelDensity(1);
  frameRate(60);
  noStroke();
  castle = new Castle();
  worldClock = new WorldClock(60000);
  cloudSystem = new CloudSystem(3);
  worldDetails = new WorldDetails();
  audioMechanic = new AudioMechanic(soundReady ? soundtrack : null);
  for (let key of paletteKeys) scenePalette[key] = worldClock.palette[key];
  updateCastleLayout();
  connectControls();
  updateInterface();
}

function draw() {
  let seconds = min(deltaTime / 1000, 0.1);
  if (sceneStarted) worldClock.update();
  audioMechanic.update();

  // Easing the shared palette also makes a manual jump to Earth feel gentle.
  let blend = min(deltaTime / 550, 1);
  for (let key of paletteKeys) {
    scenePalette[key] = lerpColor(scenePalette[key], worldClock.palette[key], blend);
  }
  let horizon = height * 0.61;
  drawLandscape(scenePalette, horizon);
  worldDetails.update(worldClock, blend);
  worldDetails.display(horizon);
  if (sceneStarted) cloudSystem.update(worldClock.phaseIndex, seconds);
  cloudSystem.display(scenePalette, horizon);
  drawWater(scenePalette);

  let doorwayLight = constrain(audioMechanic.level * 2.0 + interventionGlow * 0.7, 0, 0.75);
  castle.display(scenePalette, audioMechanic.breathScale, doorwayLight);
  interventionGlow = lerp(interventionGlow, 0, min(deltaTime / 1100, 1));
  drawReflection(scenePalette);

  cursor(sceneStarted && castle.contains(mouseX, mouseY) ? HAND : ARROW);
  updateProgress();
  if (worldClock.phaseIndex !== lastPhase || audioMechanic.playing !== lastSoundPlaying || audioMechanic.getStatus() !== lastAudioStatus) updateInterface();
}

function getGardenWidth() {
  return max(260, document.getElementById('canvas-host').clientWidth);
}

function getGardenHeight() {
  return min(760, max(getGardenWidth() < 650 ? 440 : 520, windowHeight * 0.72));
}

function updateCastleLayout() {
  // The bottom-centre anchor prevents breathing from moving the tower's base.
  let castleHeight = height * 0.78;
  castle.setLayout(width * 0.5, height * 0.84, castleHeight / castle.rows);
}

function drawLandscape(palette, horizon) {
  let band = 8;
  for (let y = 0; y < height; y += band) {
    fill(lerpColor(palette.skyTop, palette.skyBottom, y / height));
    rect(0, y, width, band);
  }
  // Low, stepped banks leave the central tower and the sky uncluttered.
  let step = max(8, floor(width / 95));
  fill(palette.hill);
  for (let x = 0; x < width; x += step) {
    let ripple = sin(x / width * TWO_PI * 1.4) * height * 0.017;
    let bankY = floor((horizon + ripple) / 4) * 4;
    rect(x, bankY, step, height - bankY);
  }
}

function drawWater(palette) {
  let top = height * 0.705;
  fill(palette.water);
  rect(0, top, width, height - top);
  let time = sceneStarted ? worldClock.cycleProgress * TWO_PI : 0;
  fill(palette.waterLight);
  for (let i = 0; i < 17; i++) {
    let x = (i * width * 0.081 + sin(i * 2.3 + time) * 13) % width;
    let y = top + height * (0.018 + (i % 6) * 0.035);
    let length = 9 + (i % 4) * 8;
    rect(floor(x / 3) * 3, floor(y / 3) * 3, length, 2);
  }
}

function drawReflection(palette) {
  // Short flat marks imply a reflection without duplicating the whole image.
  let unit = castle.unit;
  let startY = castle.baseY + 6;
  for (let i = 0; i < 5; i++) {
    fill(lerpColor(palette.blue, palette.water, 0.72 + i * 0.05));
    let span = (28 - i * 4) * unit;
    let offset = sin(worldClock.cycleProgress * TWO_PI + i) * unit * 2;
    rect(width / 2 - span / 2 + offset, startY + i * unit * 1.5, span, max(2, unit / 2));
  }
}

function startGarden() {
  if (!sceneStarted) {
    sceneStarted = true;
    worldClock.reset();
  }
}

function connectControls() {
  document.getElementById('enter-button').addEventListener('click', function () {
    if (!sceneStarted) startGarden();
    else worldClock.reset();
    interventionGlow = 0;
    updateInterface();
  });
  document.getElementById('sound-button').addEventListener('click', function () {
    startGarden();
    audioMechanic.toggle();
    updateInterface();
  });
  document.getElementById('pause-button').addEventListener('click', function () {
    worldClock.togglePause();
    updateInterface();
  });
}

function updateInterface() {
  lastPhase = worldClock.phaseIndex;
  lastSoundPlaying = audioMechanic.playing;
  lastAudioStatus = audioMechanic.getStatus();
  document.getElementById('phase-number').textContent = '0' + (worldClock.phaseIndex + 1);
  document.getElementById('phase-name').textContent = worldClock.label.toUpperCase();
  document.getElementById('paused-label').hidden = !worldClock.paused;
  document.getElementById('enter-button').textContent = sceneStarted ? 'Restart cycle' : 'Enter garden ↗';
  let soundButton = document.getElementById('sound-button');
  soundButton.textContent = audioMechanic.playing ? 'Sound on' : 'Enable sound';
  soundButton.setAttribute('aria-pressed', String(audioMechanic.playing));
  let pauseButton = document.getElementById('pause-button');
  pauseButton.disabled = !sceneStarted;
  pauseButton.textContent = worldClock.paused ? 'Resume cycle' : 'Pause cycle';
  pauseButton.setAttribute('aria-pressed', String(worldClock.paused));
  let audioNote = document.getElementById('audio-note');
  audioNote.hidden = soundReady;
  audioNote.textContent = soundReady ? '' : 'Sound unavailable. The garden can continue silently.';
  if (lastAudioStatus.indexOf('error') !== -1 || lastAudioStatus.indexOf('blocked') !== -1) {
    audioNote.hidden = false;
    audioNote.textContent = 'Sound could not start. Select Enable sound to retry.';
  }
  let labels = document.querySelectorAll('.journey-labels span');
  for (let i = 0; i < labels.length; i++) labels[i].classList.toggle('current', i === worldClock.phaseIndex);
}

function updateProgress() {
  document.getElementById('cycle-progress').style.width = worldClock.cycleProgress * 100 + '%';
  document.getElementById('cycle-track').setAttribute('aria-valuenow', String(floor(worldClock.cycleProgress * 60)));
  let darkPhase = worldClock.phaseIndex === 2 ||
    worldClock.phaseIndex === 1 && worldClock.phaseProgress > 0.85 ||
    worldClock.phaseIndex === 3 && worldClock.phaseProgress < 0.5;
  document.querySelector('.artwork').style.setProperty('--caption-colour', darkPhase ? '#d6c9b6' : '#415e54');
}

function mousePressed() {
  // DOM control clicks can also reach p5; only accept coordinates on the canvas.
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) handleGardenPointer();
}

function keyPressed() {
  if (document.activeElement.tagName === 'BUTTON' && key === ' ') return;
  return handleGardenKey();
}

function windowResized() {
  // A viewport resize can arrive before preload() and setup() finish.
  if (!castle) return;
  resizeCanvas(getGardenWidth(), getGardenHeight());
  updateCastleLayout();
}
