# Verification record

Review round 3, checked on 4 November 2026 in Chrome, with the project served from a local HTTP server. This round checks volume, visible size mapping and global pause. Unchanged clock calculations retain the earlier boundary checks. These observations do not cover every browser or device.

The current scope is a desktop browser. Window resizing is retained for the course requirement. Earlier narrow-screen experiments are outside this review scope.

## Browser observations

| Check | Observed result |
|---|---|
| Initial load | The artwork, local font and controls load. The upper-left caption is absent. A Volume slider appears below the speaker. No new console errors were captured. |
| Natural world changes | After entering Earth, Hell and Return appeared naturally, followed by Paradise. Nine class-level boundary cases separately checked the 60000 ms cycle and the three background weights. |
| World background designs | Paradise has a halo, light dust and floating terraces; Earth has a warm sun, fruit shrubs and flowers; Hell has a red moon, dark rocks, lava marks and embers. They fade using the same clock as the palettes. |
| Keyboard and paused input | P uses the global pause helper. E and R leave paused progress unchanged, and the restart button is disabled while paused. |
| Pause and resume | With sound enabled, pause changes actual playback to paused. Two canvas captures two seconds apart are identical, and progress remains unchanged. |
| Transition freeze | Pausing during the Earth-to-Hell transition at about second 27 produces identical canvas captures 1.8 seconds apart, including colour easing and cloud motion. |
| Scaled tower intervention | After settling at both volume extremes, clicking visible tower pixels changes Paradise to Earth. Hit testing follows the displayed scale. |
| Background click | Clicking the sky outside the tower leaves the phase unchanged. |
| Sound preference | Turning sound off while globally paused leaves it off after resume. Turning it on while paused stays silent until resume. The speaker icon represents the enabled preference; its accessible description reports actual playback. |
| Icon controls | Pause bars become a play triangle while paused. SVG children and action names remain intact. |
| Volume and visible size | The native slider reaches 0% and 100%. Captures while the track is playing show a large size difference; a colour-contour estimate in this sample gives about 290 versus 395 pixels in tower height. This is an approximate screenshot observation, not a calibrated scale measurement. |
| Volume during pause | Changing 100% to 0% while paused leaves the canvas identical. Resuming applies the new size gradually and permits silent playback at zero gain. |
| Audio response | Two captures during playback show a small change in the tower's rendered geometry. The numeric scale bounds were checked separately at class level. |
| Desktop layout | At 1540 by 740, the canvas is approximately 1118 by 533 pixels. The title, artwork and progress all have centre x = 770. The three icons are vertically arranged in a separate right sidebar. |
| Desktop window resize | At 1024 by 768, the canvas is approximately 734 by 553 pixels and the artwork and progress centre x = 512. No horizontal or vertical overflow occurs. At 1540 by 684, page height stays 684 and the progress bottom is 666. |
| Rounded progress | The track is a continuous 9-pixel pill with rounded ends and a rounded fill. The earlier quarter-stage dividers have been removed. |
| Typography and compact interface | The visible page contains the title, artwork, bottom world labels/progress, three icons and the volume slider. It has no phase caption inside the artwork or routine instruction paragraphs. |
| Resize during loading | A guard handles resize events before the castle is constructed. No new console errors appeared during the recorded reload, interaction and resize checks after the fix. |

Phase screenshots are in `screenshots/`. This round captured Earth at about second 17, Hell at second 32 and Return at second 52. `volume-low.png` and `volume-high.png` show the actual 0% and 100% slider cases with music enabled. `reference-v2.png` is the AI-assisted concept reference, not a screenshot of the running sketch.

## Code and asset checks

The project uses a fixed cloud array, a single world clock and separate mechanic scripts. Earlier clock tests covered nine transition boundaries. This round's mocked audio tests cover pending-start pause, pause/resume with a stored cursor, preference changes while paused, rapid toggles, missing audio, rejected starts and failed gain updates. They also confirm that a post-gain reading is not multiplied by volume again.

The new formula is `0.82 + 0.24 * volume + 0.10 * constrain(level / 0.24, 0, 1)`, eased by 0.10 and limited to 0.82–1.16. Mocked values settle at 0.82 for zero volume, 1.06 for maximum volume with sound off, 0.99 for volume 0.5 and level 0.12, and at most 1.16 for peaks. Global pause holds level and scale exactly. A 0.68-canvas-height baseline and 0.84 bottom anchor keep the maximum tower within the frame.

Resume-from-position uses the bundled SoundFile pause/play behaviour and was checked in source and mocked cursor tests; no numerical browser measurement of the audio cursor is claimed. Pixel comparison checks rendered visual freezing and accessible playback descriptions reflect the file's playing state. The tests do not demonstrate physical audio output on every device.

The WAV contains 60 seconds of mono 16-bit PCM audio at 22050 Hz. Its measured peak is approximately 0.72 of full scale, without clipped samples. The audio is original mathematical synthesis made with AI assistance, as disclosed in the README.

## Limits

Safari, Firefox and a hosted GitHub version have not been verified. Mobile use is outside the project scope. Global pause freezes the complete scene and music; sound preference and volume can be configured while paused, with visual changes deferred until resume. Restarting the cycle does not rewind audio or regenerate clouds and is unavailable while paused.
