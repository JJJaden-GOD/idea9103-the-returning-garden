// AI assistance: OpenAI Codex helped implement and check this project mechanic.
// Input changes the clock's position; WorldClock remains responsible for colour.
function handleGardenPointer() {
  if (!sceneStarted || worldClock.paused) {
    return;
  }

  if (castle.contains(mouseX, mouseY)) {
    worldClock.enterEarth();
    interventionGlow = 1;
    updateInterface();
  }
}

function handleGardenKey() {
  if (!sceneStarted) {
    return;
  }

  if (key === " ") {
    // During global pause, this changes the sound preference but stays silent.
    toggleGardenSound();
    return false;
  }

  if (key === "p" || key === "P") {
    toggleGardenPause();
    return;
  }

  // A paused frame stays still until the visitor resumes the garden.
  if (worldClock.paused) return;

  if (key === "r" || key === "R") {
    worldClock.reset();
    interventionGlow = 0;
    updateInterface();
  } else if (key === "e" || key === "E") {
    // E offers the same repeatable intervention without needing a pointer.
    worldClock.enterEarth();
    interventionGlow = 1;
    updateInterface();
  }
}
