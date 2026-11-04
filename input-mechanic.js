// AI assistance: OpenAI Codex helped implement and check this project mechanic.
// Input changes the clock's position; WorldClock remains responsible for colour.
function handleGardenPointer() {
  if (!sceneStarted) {
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
    // The visitor can switch sound without changing the world's time.
    audioMechanic.toggle();
    updateInterface();
    return false;
  }

  if (key === "r" || key === "R") {
    worldClock.reset();
    interventionGlow = 0;
    updateInterface();
  } else if (key === "p" || key === "P") {
    worldClock.togglePause();
    updateInterface();
  } else if (key === "e" || key === "E") {
    // E offers the same repeatable intervention without needing a pointer.
    worldClock.enterEarth();
    interventionGlow = 1;
    updateInterface();
  }
}
