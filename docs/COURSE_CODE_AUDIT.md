# Course-to-code audit — The Returning Garden

Audit date: 4 November 2026. Completed internal English audit; source code was not changed during this audit.

## Finding

The artwork is substantially grounded in the semester's JavaScript and p5.js teaching. Its rectangle drawing, arrays, loops, classes, random values, Perlin noise, audio amplitude, easing, coordinate transforms and keyboard/mouse input all have identifiable course precedents. The tower, world sequence and background symbols are the project's own applications of those ideas.

It would be inaccurate to describe **every line or API as having been taught in class**. The implementation also uses several p5 convenience APIs, browser DOM/accessibility features, asynchronous audio-start/error handling and presentation CSS for which an actual classroom example was not located. The offline Python soundtrack producer is a separate, extra-course asset-production tool.

An extension is not automatically prohibited. Week 5 explicitly distinguishes learning and explaining an extension from using unexplained generated code. The Final brief requires extra-course techniques to be explained and referenced in the README and corresponding code comments. A link to an official API reference verifies a source; it does not prove classroom coverage or the student's understanding.

## Scope and evidence standard

Reviewed the complete authored runtime source: `sketch.js`, `castle.js`, `time-mechanic.js`, `noise-mechanic.js`, `audio-mechanic.js`, `input-mechanic.js`, the newly added `world-details.js`, `index.html` and `style.css`. Also inspected the offline soundtrack-generation script to distinguish it from browser code. No browser QA or Git operations formed part of this audit.

The current delivery scope is **desktop only**. Window resizing remains supported because the course requires the artwork to scale when the browser window changes. This does not assert mobile or touch support.

Evidence comes from the saved current Canvas page bodies and code, the offline export's decoded page HTML, the eleven PDF text files, and the existing full-page visual-review notes for the PDF/code screenshots. These materials were previously read and visually checked; the present audit revisits relevant examples and searches for exact API occurrences. An unsuccessful text search is reported as **not located in the available teaching evidence**, not proof that a lecturer never mentioned it orally. External videos, live class discussion and unrecorded explanations are outside this evidence base.

The PDFs have reused filenames and old covers. The current Canvas module topic is used for the teaching week; the original PDF filename and physical PDF page number are preserved below. In particular, `Week 7 - Canvas.pdf` teaches the current Week 6 p5 topic; `Week 8 - Canvas.pdf` teaches current Week 7 OOP; `Week 11 - Canvas.pdf` teaches current Week 8 patterns; `Week 12.pdf` teaches current Week 10 sound; and `Week 10 - Canvas.pdf` teaches current Week 11 animation.

Classification:

- **A — Demonstrated:** the construct/API, or an explicitly identified equivalent, appears in actual course material.
- **B — New application:** taught concepts are combined into an original algorithm, design or organisation. This is not a claim that the final algorithm appeared in a tutorial.
- **C — Extension / not located:** no actual teaching example was located for the specific feature. Explain its purpose, operation and source if retained.

## 1. JavaScript language and organisation

| Project feature | Classification and actual course evidence |
|---|---|
| `let`, `const`, assignment, numbers, strings, booleans, `null`, arithmetic, `%`, `++`, `+=`, `*=` | **A.** Week 2 Lecture, `3241852.json`; `Week 2 Canvas Slides.pdf` pp29–42 and pp55–65. Modulo is explicitly among the arithmetic operators. |
| Object literals, named keys, dot access and dynamic bracket access | **A.** Week 3 Lecture, `3241859.json`; `Week3 - Canvas.pdf` pp6–21. The palette's semantic names and token-to-colour object are **B** uses of this syntax. |
| Array literals, indexing, `.length`, arrays of objects, nested arrays | **A** fundamentals: Week 3 Lecture, PDF pp23–44. Arrays containing object data are demonstrated again in Week 4 Tutorial. The 128×48 two-dimensional tower grid is **B**, assembled from arrays and nested loops rather than copied from a class example. |
| `.push()` and `for...of` | **A.** Week 7 Lecture, `3241890.json`; OOP PDF `Week 8 - Canvas.pdf` pp1–23. `for...of` also appears in the supplied `lecture04.zip` examples. |
| `if`, `else if`, `else`, strict equality/inequality, `&&`, `||`, `!`, ternary `?:`, bounds checks | **A.** Week 4 Lecture/Tutorial, `3241866.json` / `3241867.json`; PDF comparisons/logical operators pp3–45 and conditions pp46–67. The ternary has a concrete `makeRGB` example in the Week 4 page and a shape-choice example in Week 10 Tutorial. |
| Counted `for` loops, loops over arrays, nested shape loops | **A.** Week 4 Tutorial; PDF loop section pp68–92. Week 7 Tutorial uses nested x/y loops to construct Mona Lisa segments. The disc masks and pixel tower are **B** designs built using this technique. |
| Functions, parameters, `return`, default parameters, helpers and early returns | **A** underlying syntax. Week 3 Lecture/Tutorial, `3241859.json` / `3241860.json`; PDF pp47–60. `createRect(..., maxWidth = 500, maxHeight = 500)` demonstrates default parameters. A guard such as `if (!sceneStarted) return;` is **B** control-flow organisation. |
| Anonymous callback functions passed to an event listener | **A.** Week 5 Tutorial section 1 explicitly uses `addEventListener("click", function(e) { ... })`. This feature must not be wrongly listed as wholly outside the course. |
| `class`, constructor, `this`, instance properties, methods, `new`, separate update/display responsibilities | **A.** Week 7 Lecture's `Ball` class; OOP PDF pp24–53 and pp54–84. Week 11 Tutorial's `Head` class independently demonstrates the pattern. OOP PDF p104 explicitly says OOP is needed for the Final. |
| Multiple ordinary script files in dependency order | **A.** Week 3 Tutorial's `utils.js` before `script.js`; OOP PDF pp85–88 separates class files and loads them before `sketch.js`. The project does not use ES modules or a build framework. |
| `String(value)`, `.indexOf()`, `.toUpperCase()` | **C** for the exact conversion/string methods: no example was located. String values and object-method syntax themselves are **A**. Here the methods produce ARIA values, identify an audio error status and format a phase label. |
| `try/catch`, Promise `.then(success, failure)`, captured `mechanic = this` across an asynchronous callback | **C.** Not located in the saved lesson bodies, exported page HTML or PDF text. Ordinary functions and scope are taught, but promise settlement and exception recovery are additional concepts. |

No authored runtime code uses array `.map()`/`.filter()`, arrow-function chains, destructuring, async/await, import/export, inheritance frameworks or a physics engine. This observation describes the current source; it does not imply every remaining browser helper was taught.

## 2. p5 drawing, motion and audio APIs

| API or behaviour | Classification and evidence |
|---|---|
| Global `preload()`, `setup()`, `draw()`, `createCanvas()`, `width`, `height`, `mouseX`, `mouseY`, `key` | **A.** Week 6 Lecture/Tutorial, `3241881.json` / `3241883.json`; p5 PDF pp23–28, pp48–59 and pp60–63. `preload()` is used for local resources in the DVD and sound tutorials. |
| `rect()`, `fill()`, `noStroke()`, colour strings, RGB and HEX | **A.** Week 6 Lecture, p5 PDF pp29–47. RGB and HEX also appear in Week 2 Tutorial. The entire castle and all new background symbols use these primitives. |
| `color()` | **A.** Week 7 Tutorial initialises `pixelColour = color(0)`; Week 11 Tutorial constructs colours for `Head` instances. |
| `lerp()` | **A.** Week 11 Lecture/Tutorial; Animation PDF `Week 10 - Canvas.pdf` pp7–20. Repeated current-to-target interpolation is directly taught. Audio breathing, world-detail opacity and phase-speed smoothing are **B** applications. |
| `lerpColor()` | **A, briefly shown.** Week 5 PDF p59 explicitly gives `lerpColor(c1, c2, 0.5)` as a verified API example. Week 11 teaches applying easing to colour, but it would overstate the evidence to call the complete sixteen-key world-palette algorithm a taught exercise. That algorithm is **B**. |
| `push()`, `pop()`, `translate()`, `scale()` | **A.** Week 11 Lecture/Tutorial; Animation PDF pp22–42, pp43–63 and pp96–108. The `Head.display()` tutorial combines push→translate→rotate→scale→draw→pop. Bottom-centre breathing is **B** anchoring of these transforms. |
| `dist()` | **A.** Week 7 Tutorial part 5 uses mouse-to-segment distance for scale. Using distance as a grid inclusion test to create a sphere, ring or disc is **B**. |
| `sin()`, `TWO_PI`, cyclic arithmetic | **A** underlying concepts and calls. Week 5 Tutorial sections 3–4 teaches `Math.sin`/`Math.cos` and `TWO_PI = 2*Math.PI`; Week 8 Lecture teaches sine frequency/amplitude; Week 11 Tutorial uses p5 `sin()` with `TWO_PI` for elliptical motion. The water, dust and ember trajectories are **B**. |
| `random()`, `noise()`, per-instance random offsets and continuously advanced noise inputs | **A.** Week 6 Tutorial's random walker; Week 8 Lecture/Tutorial's `randomNoisyShape` and `DotAnimator`. Patterns PDF `Week 11 - Canvas.pdf` pp20–28 and pp31–55 explains correlated samples. Three clouds with constrained side bands and phase-sensitive speed are **B**. |
| `constrain()` | **A.** Week 6 Tutorial uses it to bound walker positions, RGB channels, line length and stroke width. |
| `min()` and `max()` | **A.** Week 8/10 Tutorials use `min(width,height)` for proportional shapes; Week 11 Lecture's scaling example uses `max(1, ...)`. Combining them for desktop window-based canvas-height limits is **B**. |
| Exact p5 `floor()` and `round()` calls | **C for the exact convenience API, with A mathematical precedents.** Week 3 Tutorial explicitly uses `Math.floor()`; Week 2 Tutorial uses `Math.round()`. No direct p5 `floor()`/`round()` example was located in the searchable lesson source. Pixel snapping and grid-index conversion are **B** applications of the taught rounding concepts. |
| RGB plus alpha in `fill(r,g,b,a)` | **B** combination of taught RGB colouring and opacity. Week 11 Tutorial explicitly uses `fill(20,20)` for a translucent trail. The precise four-argument overload was not located as a classroom example; it is a small API extension rather than a new rendering framework. |
| `windowResized()`, `resizeCanvas()`, `windowHeight` | **A.** Week 8 Tutorial responsive normalised shapes and Week 11 Tutorial multiple heads. Recomputing the castle layout after a desktop window resize is **B**. Reading a DOM host's `clientWidth` instead of using only window width is **C** browser integration. |
| `mousePressed()`, `keyPressed()` and `key` checks | **A.** Week 6 Lecture and keyboard-controlled DVD/walker examples; p5 PDF pp60–63. Week 7 Tutorial uses Space to toggle segmentation; Audio PDF p24 shows a Space `keyCode == 32` gesture. |
| `return false` specifically to suppress Space scrolling | **C** event/default-action semantics. JavaScript `return` and `false` are taught, but this p5 event-cancellation use was not located. |
| `millis()` | **C exact API; B clock design.** The course teaches timers in Week 5 Tutorial using `setInterval`, and temporal animation using `frameCount` later. No actual `millis()` example was located in the lesson bodies, offline page HTML or PDF text. Elapsed-time modulo, pause compensation and re-anchoring the one clock are the project's own implementation. |
| `deltaTime` | **C exact API.** No example was located. The project uses it for elapsed-frame motion and easing, building on taught frame animation and `lerp`. |
| `pixelDensity(1)`, `frameRate(60)`, `cursor(HAND/ARROW)`, renderer `.parent()` and `.elt` | **C exact APIs.** Not located as taught examples. They control output density, target frame rate, hover feedback and DOM placement/accessibility. The course states that draw normally runs around 60 fps; that statement is not evidence that `frameRate()` was demonstrated. |
| `loadSound()`, `p5.Amplitude`, `.setInput()`, `.getLevel()`, `.isPlaying()`, `.play()`, `.pause()` | **A.** Week 10 Lecture/Tutorial, `3241912.json` / `3241914.json`; Audio PDF `Week 12.pdf` pp24–32 and pp38–56. The PDF p24 code screenshot explicitly calls `audio.pause()` and uses a Space gesture; this was visually rechecked during this audit. The webpage examples instead use `.stop()`/`.loop()`. Amplitude driving size is directly demonstrated; mapping it into a narrow scale range and doorway glow is **B**. |
| Sound `.setLoop(true)`, `.isLoaded()`, load success/error callbacks | **C for these exact calls/callback signatures.** The course teaches looping with `.loop()` and loading in `preload()`. Separate loop mode and load-state/error guards are additional implementation details. |
| `userStartAudio()` plus a promise | **C.** The course explicitly teaches that a user gesture must initiate audio, but this exact unlock API and its asynchronous success/failure handling were not located. Explain the distinction between granting browser playback permission and actually starting/pausing the sound file. |

## 3. What is original application rather than an extra language technique?

- **Castle:** constructing a token grid, painting groups of cells, choosing sphere/ring cells with distance, then drawing each occupied cell with `rect()`. This combines taught data structures, loops, classes, basic shapes and transforms. Its artwork-specific recipe was not a course example.
- **WorldClock:** four fifteen-second stages, stable/transition intervals, sixteen semantic colour keys, three world weights, repeated Earth intervention and pause compensation. Timers, modulo, booleans, conditions, arrays and interpolation have course precedents; this one-timeline state model is new project logic. `millis()` is separately identified as an additional API.
- **CloudSystem:** initial random size/position/speed/offset and continuous noise sampling, with side constraints and smooth phase-speed changes. The random/noise class concept is directly taught; the three-cloud composition and speed recipe are new.
- **AudioMechanic:** a known amplitude analyser drives a deliberately small, smoothed transform and doorway light. The aesthetic mapping is new; asynchronous browser recovery is an extension.
- **Input:** clicking an occupied, inversely transformed grid cell relocates the clock and adds visible feedback. Mouse/key callbacks and coordinate transforms are taught; grid-aware hit-testing and the intervention rule are new algorithms.
- **WorldDetails:** world weights crossfade a halo, sun, red moon, terraces, shrubs, dark towers, dust and embers. Arrays, loops, conditions, RGB/alpha, `dist`, sine, modulo and `lerp` support it. It is neither a demonstrated classroom algorithm nor a separate physics/particle engine. It reads the existing clock rather than introducing another timer.

## 4. HTML, CSS and browser interface

### Demonstrated foundations

Week 1 Lecture/Tutorial teaches HTML nesting, `html/head/body/title`, headings/paragraphs, links, images, attributes, paths, comments and a separate stylesheet. `Week1_S2_2026.pdf` pp44–58 and pp60–68 covers these foundations; p68 explicitly says CSS is not taught in depth. Week 2 Tutorial demonstrates type/id/class selectors, background colour, alignment, padding and font-family. Week 6's actual template includes `lang`, charset, viewport metadata, stylesheet linking and ordered local script tags.

Basic CSS should not all be labelled extra-course. Week 8 Tutorial's `DotAnimator` section **explicitly demonstrates** `display:flex`, `align-items:center`, `justify-content:center`, resetting margin/padding and `canvas { display:block; }`.

### Browser-interface classification

| Current feature | Finding |
|---|---|
| `document.getElementById()`, `.setAttribute()` | **A.** Week 2–5 repeatedly demonstrates both. Applying them to canvas accessibility or button state is **B/C**: the DOM methods are taught; the ARIA meanings are additional. |
| `addEventListener('click', function...)` | **A.** Week 5 Tutorial section 1. Moving the same event pattern from an SVG to HTML controls is **B**. |
| `querySelector()` | **Brief A mention.** Week 2 Tutorial names it alongside `getElementById` as a way to select existing elements. A full example was not located. |
| `querySelectorAll()`, `.classList.toggle()`, `.textContent`, `.style.width`, `.style.setProperty()` | **C exact browser APIs.** These connect state to labels, progress and CSS properties. |
| `.hidden`, `.disabled`, `.clientWidth`, `document.activeElement.tagName` | **C browser properties.** They support conditional messages, available controls, host sizing and preservation of native button keyboard behaviour. |
| Semantic `main/header/section`, `span`, HTML `button`, `noscript`, live regions, progressbar roles, `aria-*`, `tabindex` | **C for the specific additions.** HTML structure and attributes are taught. The W1 page mentions `div`, but no full semantic-layout/accessibility lesson was located. W10 uses p5 `createButton`, which is related interaction practice rather than evidence that all raw HTML button/accessibility details were taught. |
| Layout spacing, typography and palettes | **B design decisions using A basic CSS.** Their exact values are original. |
| Relative/absolute/fixed positioning, z-index and `isolation`, overflow, opacity, pointer behaviour, pseudo-classes/elements, attribute selectors, CSS custom properties, `calc()/clamp()/min()`, Flexbox wrapping/gap and the reduced-motion media query | **C specific CSS techniques.** Responsive canvas design is taught, but that does not establish that every Flexbox option or the reduced-motion preference query was taught. Current desktop controls use Flexbox. |
| Layered radial/linear gradients, shadows, CSS `filter:blur()`, transition/transform button feedback, a self-hosted variable Oxanium font and `@font-face` | **C presentation extensions.** No lesson example was located. The font's OFL licence and source should be retained separately from p5's licence. These features decorate the webpage; the p5 tower remains rectangle geometry. |
| Font `<link rel="preload" ... as="font" ... crossorigin>` and theme-colour metadata | **C resource/peripheral metadata.** Basic `<link>` and viewport/charset metadata are taught; font preloading and the meanings of these extra attributes were not located as lesson examples. |

The styled page is a new presentation design built around a course-based canvas. It is not reasonable to claim that advanced CSS is covered merely because Week 1 links to general CSS documentation.

## 5. Libraries, assets and offline production

`libraries/p5.min.js` and `libraries/p5.sound.min.js` are upstream dependencies, not student-authored algorithms. The Week 6 project template already includes these files; the p5 PDF pp15–22 explains their place and p17 says not to edit the libraries. Their internal JavaScript should not be counted as thousands of extra-course lines authored by the student, nor presented as the student's work. Preserve their licence and provenance.

The browser's authored audio mechanic plays and analyses `assets/audio/garden-loop.wav`. The file was made separately by `work/project-build/generate_garden_loop.py`, which uses Python, NumPy arrays, oscillators/harmonics, envelope functions, circular echo shifts, normalisation and PCM WAV writing. Sine-wave frequency/amplitude are taught concepts in Week 8/10, but **Python/NumPy synthesis, DSP envelopes, circular buffer echo and WAV encoding were not located as taught implementations**. This is explicitly extra-course asset production, not p5 runtime synthesis. The distinction and AI assistance should remain visible in documentation.

The V2 concept PNG is an AI-assisted reference, not a hidden image-drawing implementation. The running tower is generated from the authored grid. A self-hosted font is an external typography asset, not code that draws the artwork or a technique taught in the creative-coding tutorials. The final font folder contains the Oxanium variable TTF, `SOURCES.md`, metadata and the original `OFL.txt`; the licence identifies the Oxanium Project Authors and SIL OFL 1.1. This provenance is separate from the p5 library licence.

## 6. Documentation and explanation priorities

The strongest accurate statement is: **“The creative-coding core applies the semester's techniques; additional browser, audio-start and presentation features are identified and explained.”** Avoid “all code is classroom code”, “100% taught” or a coverage percentage unsupported by a defined measurement.

Prioritise explanations of: (1) elapsed real time versus a frame counter; (2) why resuming a paused clock shifts its start time; (3) one clock controlling both palette and world weights; (4) interpolation versus a fixed-duration animation; (5) random initial parameters versus correlated noise samples; (6) amplitude versus audible playback state; (7) promise success/failure and why audio needs a gesture; (8) inverse-coordinate hit-testing; and (9) the difference between p5 artwork code, webpage presentation, dependencies and offline asset production.

If a strictly classroom-only implementation is later requested, identify simplifications before changing behaviour. `frameRate(60)` is normally dispensable because the course/template default is already approximately 60 fps; hover cursor feedback and some decoration are optional. Removing `millis()`, DOM placement or asynchronous audio checks without replacement could weaken timing, layout or reliability. Extra APIs should be justified or deliberately replaced, not silently relabelled as taught.

### Sources used for precise teaching claims

- [Week 1 Lecture](https://canvas.sydney.edu.au/courses/74653/pages/week-1-lecture?module_item_id=3241843), [Week 1 Tutorial](https://canvas.sydney.edu.au/courses/74653/pages/week-1-tutorial?module_item_id=3241844); `Week1_S2_2026.pdf`.
- [Week 2 Lecture](https://canvas.sydney.edu.au/courses/74653/pages/week-2-lecture?module_item_id=3241852), [Week 2 Tutorial](https://canvas.sydney.edu.au/courses/74653/pages/week-2-tutorial?module_item_id=3241853); `Week 2 Canvas Slides.pdf`.
- [Week 3 Lecture](https://canvas.sydney.edu.au/courses/74653/pages/week-3-lecture?module_item_id=3241859), [Week 3 Tutorial](https://canvas.sydney.edu.au/courses/74653/pages/week-3-tutorial?module_item_id=3241860); `Week3 - Canvas.pdf`, `call-tree.pdf`.
- [Week 4 Lecture](https://canvas.sydney.edu.au/courses/74653/pages/week-4-lecture?module_item_id=3241866), [Week 4 Tutorial](https://canvas.sydney.edu.au/courses/74653/pages/week-4-tutorial?module_item_id=3241867); `Week4 - Canvas.pdf`, `lecture04.zip`.
- [Week 5 AI Lecture](https://canvas.sydney.edu.au/courses/74653/pages/week-5-vibecoding-and-ai-lecture?module_item_id=3241871), [Week 5 Tutorial](https://canvas.sydney.edu.au/courses/74653/pages/week-5-tutorial-2?module_item_id=3241872); `Week 5.pdf`, especially pp56 and 59.
- [Week 6 Lecture](https://canvas.sydney.edu.au/courses/74653/pages/week-6-lecture?module_item_id=3241881), [Week 6 Tutorial](https://canvas.sydney.edu.au/courses/74653/pages/week-6-tutorial?module_item_id=3241883); reused PDF `Week 7 - Canvas.pdf`.
- [Week 7 Lecture](https://canvas.sydney.edu.au/courses/74653/pages/week-7-lecture?module_item_id=3241890), [Week 7 Tutorial](https://canvas.sydney.edu.au/courses/74653/pages/week-7-tutorial?module_item_id=3241891); reused OOP PDF `Week 8 - Canvas.pdf`.
- [Week 8 Lecture](https://canvas.sydney.edu.au/courses/74653/pages/week-8-lecture?module_item_id=3241907), [Week 8 Tutorial](https://canvas.sydney.edu.au/courses/74653/pages/week-8-tutorial?module_item_id=3241908); patterns PDF `Week 11 - Canvas.pdf`.
- [Week 10 Lecture](https://canvas.sydney.edu.au/courses/74653/pages/week-10-lecture-2?module_item_id=3241912), [Week 10 Tutorial](https://canvas.sydney.edu.au/courses/74653/pages/week-10-tutorial?module_item_id=3241914); audio PDF `Week 12.pdf`.
- [Week 11 Lecture](https://canvas.sydney.edu.au/courses/74653/pages/week-11-lecture?module_item_id=3241901), [Week 11 Tutorial](https://canvas.sydney.edu.au/courses/74653/pages/week-11-tutorial?module_item_id=3241902); animation PDF `Week 10 - Canvas.pdf`.
- [Final assignment](https://canvas.sydney.edu.au/courses/74653/assignments/716000), saved in `work/course/final-assignment.json` and summarised in `work/course/final-requirements.md`.

### Audit status

The new `WorldDetails` class, its shared-clock world weights and sketch integration were included. After the interface revision, the complete final `index.html`, `style.css` and updated `sketch.js` were read again. The desktop-only scope update was then checked against the stylesheet and canvas-height function. Current presentation includes the local variable font, space gradients, star/haze pseudo-elements, shadows, button states, desktop Flexbox, the reduced-motion preference query, compact controls and hidden-unless-needed audio error note. The canvas height uses `min(760, max(520, windowHeight * 0.72))`; normal window-resize handling remains. Removed stage-message/footer instruction nodes are no longer treated as current code. A later change only to a gradient's opacity would not alter this technique classification.

During the final evidence check, the original Audio PDF p24 image was reopened. This corrected an initial text-search omission: `.pause()` is explicitly demonstrated in that screenshot. No classroom claim in this report relies solely on whether an exact string survived PDF text extraction.
