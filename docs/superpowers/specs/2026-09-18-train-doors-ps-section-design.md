# Train-doors problem-statement section — design

Date: 2026-09-18 · Project: `leoparpeix-clone` (Hack on Tracks site)

## Goal

Replace the expandable problem-statement cards (`ProblemStatementsBlock.vue`) on the home page with a
scroll-driven sequence modelled on the reference screen recording: an orange Subway-Surfers-style train
(graffiti / spray-paint tags) rolls across the full viewport, four sliding doors — one per domain — open one
after another revealing that domain's Round 1 problem statement (title, problem, expected solution), then the
train rolls off to the right to reveal the Timeline section behind it.

## Decisions (from brainstorming)

* Placement: replaces the PS cards section on the home page (between About and Schedule/Timeline).
* Train rendering: 2D illustrated train, inline SVG + CSS (not the 3D OBJ — it is a single mesh with no doors).
* Door content: sprayed domain tag, `PS n · title`, the `problem` paragraph, and `strong` shown as
  "Expected solution". One door open at a time; previous closes as the next opens.
* Graffiti: reuse `public/assets/imprints/imprint-1..7.webp` on the car body + domain names in a spray-paint
  web font (Rubik Spray Paint, Google Fonts; fallback Permanent Marker / Impact).
* Mechanics: **sticky stage + scroll-scrubbed GSAP timeline** (approach A). No autoplay, no scroll snapping.

## Architecture

### Component — `src/components/TrainDoorsBlock.vue`

* Mounted from `src/views/HomeView.js` in place of `ProblemStatementsBlock` (old file left on disk, unused).
* Markup:
  ```
  section.trainBlock            height: 600vh (500vh below tablet width); background = page paper white
    div.trainBlock__stage       position: sticky; top: 0; height: 100vh; overflow: hidden
      div.trainBlock__wall      faint graffiti wall (2–3 imprints, slow parallax)
      svg.train                 the car, width ≈ 240vw, absolutely positioned, translated by the timeline
      div.trainBlock__panels    HTML text panels aligned over the four door slots
  ```
* Data: `onlinePS` + `domainById` from `src/data/hackathon.js`. Fields used per PS: `code`, `title`,
  `problem`, `strong`, `domain` (→ `DOMAINS[].short` for the sprayed tag, `.name` in the panel header).
* Scroll: `onScroll` + `getScrollY` from `src/composables/useLenisScroll.js`; section top/height measured on
  mount and on `EVENTS.RESIZE` / `EVENTS.LAYOUT_REFRESH` / `EVENTS.LOADER_REVEAL_COMPLETE` (same as
  `ScheduleTimeline.vue`). Progress `p = clamp((scrollY - top) / (height - innerHeight), 0, 1)`.
* Animation: one `gsap.timeline({ paused: true })` built once on mount; every scroll update calls
  `tl.progress(p)`. Nothing is time-based.
* Lifecycle: `app.refreshScrollLayout()` after mount; `onUnmounted` removes scroll listener, emitter listeners,
  kills the timeline.

### The train (SVG)

* Four car segments in one long `<svg viewBox="0 0 2400 620">`. Per segment: roof rail, window strip
  (3 blue-grey windows), sprayed domain name above the door, a double sliding door (`g.door--l`, `g.door--r`)
  inside a red frame, undercarriage, bogie with 2 wheels. Front car gets a cab face with headlights; rear car a
  tail light. Rails + gravel strip along the bottom of the stage (CSS, not part of the SVG so it stays put).
* Palette (from `trains.png`): body `#F27D26`, band `#F2C230`, stripe `#8DB33A`, door frames `#D4402B`,
  windows `#B8CBD6` with `#7FA0B5` inner shade, roof/undercarriage `#3C4A52`, wheels `#1F2A30`.
* Graffiti: 3 `<image href="/assets/imprints/imprint-N.webp">` on the body, `mix-blend-mode: multiply`,
  opacity .85, rotated ±6°; "HACK ON TRACKS" tag on the first car in the spray font with a 2-px darker
  offset copy behind it as the "spray shadow".
* Doors: each panel translates outward by its own width (open) — `x: ±doorWidth`. Behind the door slot the
  SVG has a dark interior rect (`#141a1e`) so the opening reads as a cavity before the text panel fades in.

### Door text panels (HTML)

* One `div.doorPanel` per PS, absolutely positioned over the door slot of its car (positions derived from the
  same viewBox numbers via `%` so they track the SVG when it moves — the panels container is translated together
  with the train).
* Content: `.doorPanel__tag` (domain short name, spray font), `.doorPanel__code` (`PS 1`), `.doorPanel__title`,
  `.doorPanel__problem`, `.doorPanel__label` ("Expected solution"), `.doorPanel__strong`.
* Panel `overflow-y: auto` in case the viewport is short; text ≤ ~110 words per door.
* Panel enters (opacity 0→1, y 12→0) once its door is ≥ 70 % open, leaves as the door starts closing.

### Timeline (progress 0→1)

| range | what |
|---|---|
| 0.00–0.14 | train `x: 120vw → 0` (`power2.out`), wheels rotate proportional to x, 1–2 px body bob |
| 0.14–0.82 | four slots of 0.17: open door (0–25 % of slot, `power3.inOut`), panel in (20–35 %), hold, panel out (75–80 %), close door (80–100 %). Slot n+1 starts when slot n ends |
| 0.82–1.00 | train `x: 0 → -140vw`; stage background fades to transparent from 0.82 so the Timeline section (next in flow, sitting underneath the sticky stage's tail) is revealed — the "wipe" from the video |

Motion lines / a light `filter: blur(0 → 1.5px)` on the train only while `|dx/dp|` is large (rolling phases).

### Mobile / touch (`app.isTabletWidth` or width < 900)

* Same SVG scaled to fit height-wise (train ≈ 180vh wide), same door logic.
* Door slot is too narrow for text, so `.doorPanel` becomes a bottom sheet (fixed to the stage bottom, full
  width, max-height 55vh) that shows the active PS; the door still opens visually.
* Section height 500vh.

### Integration / no-touch list

* No WebGL changes; the flying 3D train and `app.trackBee` logic are untouched.
* `src/data/hackathon.js` unchanged (all needed fields exist).
* Google Font link added in `index.html` (`Rubik+Spray+Paint`), `font-display: swap`.

## Error handling

* If `onlinePS` is empty the section renders nothing (v-if) so the page flow is unaffected.
* Font failure → fallback stack; imprint image failure → `<image>` simply doesn't draw (no JS dependency).
* Scroll listener is a no-op until measurements exist (`height > innerHeight`), preventing NaN progress.

## Testing (manual, in the `dev` preview)

1. Desktop 1440×900 and 1920×1080: train enters, 4 doors open in order with readable text, train leaves,
   Timeline visible afterwards; scrolling back up reverses cleanly.
2. Mobile 375×812: bottom sheet shows the active PS; no horizontal page scroll.
3. No console errors; `?remindScrollY` restore lands mid-sequence at the right state.
4. Timeline section's train-on-rails behaviour still works after the wipe.
