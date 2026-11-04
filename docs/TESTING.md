# Verification record

Review round 2, checked on 4 November 2026 in Chrome, with the project served from a local HTTP server. Layout and icon observations below are from this round; unchanged world and audio mechanisms also retain the earlier checks. These observations do not cover every browser or device.

The current scope is a desktop browser. Window resizing is retained for the course requirement. Earlier narrow-screen experiments are outside this review scope.

## Browser observations

| Check | Observed result |
|---|---|
| Initial load | The artwork and controls load from local project files. No console errors were captured. |
| Natural world changes | After entering Earth, Hell and Return appeared naturally, followed by Paradise. Nine class-level boundary cases separately checked the 60000 ms cycle and the three background weights. |
| World background designs | Paradise has a halo, light dust and floating terraces; Earth has a warm sun, fruit shrubs and flowers; Hell has a red moon, dark rocks, lava marks and embers. They fade using the same clock as the palettes. |
| Keyboard E and R | E changes the phase to Earth; R returns the world timeline to Paradise. |
| Pause and resume | P and the pause button change the paused state. A paused timeline remains paused after a tower intervention. |
| Repeated tower intervention | Three consecutive clicks on the visible central shaft leave the phase at Earth, without an immediate automatic reversal. |
| Background click | Clicking the sky outside the tower leaves the phase unchanged. |
| Sound gesture | Selecting the speaker button starts playback, shows the sound-wave icon and changes its accessible name to Turn sound off. A second click pauses sound and restores the crossed speaker and Turn sound on name. |
| Icon controls | The circular-arrow button starts the garden and then restarts the clock. Pause bars become a play triangle while paused. Each button retains its SVG children, shows exactly one icon and has matching hover and accessible names. |
| Native keyboard activation | Space on the focused sound button toggles it once per activation, without triggering the global shortcut twice. |
| Audio response | Two captures during playback show a small change in the tower's rendered geometry. The numeric scale bounds were checked separately at class level. |
| Desktop layout | At 1540 by 740, the canvas is approximately 1118 by 533 pixels. The title, artwork and progress all have centre x = 770. The three icons are vertically arranged in a separate right sidebar. |
| Desktop window resize | At 1024 by 768, the canvas is approximately 734 by 553 pixels and the artwork and progress centre x = 512. No horizontal or vertical overflow occurs. At 1540 by 684, page height stays 684 and the progress bottom is 666. |
| Rounded progress | The track is a continuous 9-pixel pill with rounded ends and a rounded fill. The earlier quarter-stage dividers have been removed. |
| Typography and compact interface | The local Oxanium font loaded on desktop. The visible page contains the title, phase, progress labels and three buttons, with no routine interaction paragraphs. |
| Resize during loading | A guard handles resize events before the castle is constructed. No new console errors appeared during the recorded reload, interaction and resize checks after the fix. |

Phase screenshots are in `screenshots/`. This round captured Earth at about second 17, Hell at second 32 and Return at second 52. `reference-v2.png` is the AI-assisted concept reference, not a screenshot of the running sketch.

## Code and asset checks

The project uses a fixed cloud array, a single world clock, a bounded breathing scale, a local audio file and separate JavaScript files for the four mechanics. Nine transition cases checked world weights at 0, 10, 12.5, 15, 27.5, 30, 45, 52.5 and 60 seconds, plus paused Earth intervention and restart. Earlier class-level checks covered audio scale bounds, a neutral paused target, unavailable audio and rejected audio-start promises. These checks supplement browser interaction; they do not demonstrate physical audio output or performance on every device.

The WAV contains 60 seconds of mono 16-bit PCM audio at 22050 Hz. Its measured peak is approximately 0.72 of full scale, without clipped samples. The audio is original mathematical synthesis made with AI assistance, as disclosed in the README.

## Limits

Safari, Firefox and a hosted GitHub version have not been verified. Mobile use is outside the project scope. The world pause freezes the timeline, light dust and embers; cloud drift and enabled sound continue by design. Restarting the cycle does not rewind the audio or regenerate the clouds.
