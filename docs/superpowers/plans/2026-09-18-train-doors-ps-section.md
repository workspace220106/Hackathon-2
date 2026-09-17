# Train-doors problem-statement section — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the PS cards on the home page with a scroll-scrubbed sequence: an orange graffiti subway train rolls in, stops at each of its four doors which open one by one to reveal a domain's Round 1 problem statement, then rolls off to reveal the Timeline section.

**Architecture:** One Vue SFC (`TrainDoorsBlock.vue`) renders a 600vh section with a sticky 100vh stage. The stage holds an inline SVG train (4 cars, sliding door panels, wheels, graffiti imprints) and HTML text panels aligned over the door slots. Scroll progress (from the existing Lenis `onScroll` composable) is mapped by a pure `layout(p)` function to train x, per-door open amount and per-panel visibility; DOM is updated imperatively each scroll tick. The section overlaps the next section (Timeline) by 100vh so the train's exit reveals it.

**Tech Stack:** Vue 3.5 SFC, GSAP (eases only), Lenis scroll via `src/composables/useLenisScroll.js`, inline SVG, Google Font "Rubik Spray Paint".

## Global Constraints

* Data source is `src/data/hackathon.js` — `onlinePS[]` (`code`, `title`, `problem`, `strong`, `domain`) and `domainById()`; **do not edit that file**.
* No WebGL / `app.trackBee` changes.
* Scroll listening only through `onScroll` / `getScrollY` from `src/composables/useLenisScroll.js`; remeasure on `EVENTS.RESIZE`, `EVENTS.LAYOUT_REFRESH`, `EVENTS.LOADER_REVEAL_COMPLETE` (as `ScheduleTimeline.vue` does).
* Palette: body `#F27D26`, band `#F2C230`, stripe `#8DB33A`, door frame `#D4402B`, windows `#B8CBD6` / `#7FA0B5`, roof/undercarriage `#3C4A52`, wheels `#1F2A30`, door interior `#141a1e`.
* Section heights: 600vh desktop, 500vh below 900px width. Phase ranges: enter 0–0.14, slots 0.14–0.82 (4 × 0.17), exit 0.82–1.
* Spray font: Rubik Spray Paint (Google Fonts), fallback `'Permanent Marker', Impact, sans-serif`.

---

### Task 1: Pure layout math — `trainDoorsLayout.js`

**Files:**
- Create: `src/components/train/trainDoorsLayout.js`
- Test: `scripts/test-train-layout.mjs` (node script; project has no test runner)

**Interfaces:**
- Produces: `VIEW = { W: 2400, H: 620, CAR_W: 560, CAR_GAP: 20, CAR_X0: 40, DOOR_X: 140, DOOR_W: 280, DOOR_Y: 140, DOOR_H: 330, WHEEL_R: 26 }`
- Produces: `carX(i)` → user-unit x of car i; `doorCenterX(i)` → user-unit centre of door i.
- Produces: `layout(p, { scale, vw })` → `{ x, doors: number[4], panels: number[4], blur, phase }` where `x` is the train's translateX in px, `doors[i]`/`panels[i]` ∈ [0,1], `blur` ∈ [0,1] (how fast the train is moving), `phase` ∈ `'enter'|'slot'|'exit'`.
- Produces: `PHASES = { enterEnd: 0.14, slotLen: 0.17, exitStart: 0.82 }`.

- [ ] **Step 1: Write the failing test**

```js
// scripts/test-train-layout.mjs
import assert from 'node:assert/strict';
import { layout, carX, doorCenterX, VIEW, PHASES } from '../src/components/train/trainDoorsLayout.js';

const env = { scale: 1.2, vw: 1440 };
const off = layout(0, env);
assert.equal(off.x, 1440, 'train starts fully off the right edge');
assert.deepEqual(off.doors, [0, 0, 0, 0]);

const rest0 = layout(PHASES.enterEnd, env);
assert.equal(Math.round(rest0.x), Math.round(1440 / 2 - 1.2 * doorCenterX(0)), 'door 0 centred after entry');

const mid0 = layout(PHASES.enterEnd + PHASES.slotLen * 0.5, env);
assert.equal(mid0.doors[0], 1, 'door 0 fully open mid-slot');
assert.equal(mid0.panels[0], 1, 'panel 0 visible mid-slot');
assert.equal(mid0.doors[1], 0);

const mid2 = layout(PHASES.enterEnd + PHASES.slotLen * 2.5, env);
assert.equal(Math.round(mid2.x), Math.round(1440 / 2 - 1.2 * doorCenterX(2)), 'door 2 centred in slot 2');
assert.equal(mid2.doors[2], 1);
assert.equal(mid2.doors[1], 0, 'previous door closed');

const end = layout(1, env);
assert.ok(end.x < -VIEW.W * 1.2, 'train fully off the left at the end');
assert.equal(end.phase, 'exit');
assert.equal(carX(1), VIEW.CAR_X0 + VIEW.CAR_W + VIEW.CAR_GAP);
console.log('trainDoorsLayout ok');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-train-layout.mjs`
Expected: `ERR_MODULE_NOT_FOUND` for `trainDoorsLayout.js`.

- [ ] **Step 3: Write the implementation**

```js
// src/components/train/trainDoorsLayout.js
// Pure scroll-progress → layout math for TrainDoorsBlock.vue. No DOM here so it
// can be unit-tested with node (scripts/test-train-layout.mjs).
import gsap from 'gsap';

// SVG user units (viewBox 0 0 W H)
export const VIEW = { W: 2400, H: 620, CAR_W: 560, CAR_GAP: 20, CAR_X0: 40, DOOR_X: 140, DOOR_W: 280, DOOR_Y: 140, DOOR_H: 330, WHEEL_R: 26 };
export const CARS = 4;

// progress ranges: enter → 4 slots (move, open, hold, close) → exit
export const PHASES = { enterEnd: 0.14, slotLen: 0.17, exitStart: 0.82 };
// inside a slot, as fractions of slotLen
const SLOT = { moveEnd: 0.15, openEnd: 0.35, closeStart: 0.8 };
// panel fades in/out over the last 30 % of the door travel
const PANEL_AT = 0.7;

const easeOut = gsap.parseEase('power2.out');
const easeIn = gsap.parseEase('power2.in');
const easeInOut = gsap.parseEase('power3.inOut');

export const carX = (i) => VIEW.CAR_X0 + i * (VIEW.CAR_W + VIEW.CAR_GAP);
export const doorCenterX = (i) => carX(i) + VIEW.DOOR_X + VIEW.DOOR_W / 2;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * @param {number} p scroll progress 0..1
 * @param {{scale:number, vw:number}} env scale = px per user unit, vw = viewport width px
 */
export function layout(p, { scale, vw }) {
  const doors = [0, 0, 0, 0];
  const panels = [0, 0, 0, 0];
  const restX = (i) => vw / 2 - scale * doorCenterX(i); // door i centred in the viewport
  const offRight = vw;
  const offLeft = -VIEW.W * scale - 40;

  if (p <= PHASES.enterEnd) {
    const t = easeOut(clamp01(p / PHASES.enterEnd));
    return { x: lerp(offRight, restX(0), t), doors, panels, blur: 1 - t, phase: 'enter' };
  }
  if (p >= PHASES.exitStart) {
    const t = easeIn(clamp01((p - PHASES.exitStart) / (1 - PHASES.exitStart)));
    return { x: lerp(restX(CARS - 1), offLeft, t), doors, panels, blur: t, phase: 'exit' };
  }

  const i = Math.min(CARS - 1, Math.floor((p - PHASES.enterEnd) / PHASES.slotLen));
  const s = clamp01((p - PHASES.enterEnd - i * PHASES.slotLen) / PHASES.slotLen);
  let x = restX(i);
  let blur = 0;
  if (i > 0 && s < SLOT.moveEnd) {
    const t = easeInOut(s / SLOT.moveEnd);
    x = lerp(restX(i - 1), restX(i), t);
    blur = Math.sin(t * Math.PI);
  }
  let d = 0;
  if (s < SLOT.moveEnd) d = 0;
  else if (s < SLOT.openEnd) d = easeInOut((s - SLOT.moveEnd) / (SLOT.openEnd - SLOT.moveEnd));
  else if (s < SLOT.closeStart) d = 1;
  else d = 1 - easeInOut((s - SLOT.closeStart) / (1 - SLOT.closeStart));
  doors[i] = d;
  panels[i] = clamp01((d - PANEL_AT) / (1 - PANEL_AT));
  return { x, doors, panels, blur, phase: 'slot' };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node scripts/test-train-layout.mjs`
Expected: `trainDoorsLayout ok`

- [ ] **Step 5: Commit**

```bash
git add src/components/train/trainDoorsLayout.js scripts/test-train-layout.mjs
git commit -m "feat(train-doors): scroll progress → train/door layout math"
```

---

### Task 2: The SVG train component — `TrainSvg.vue`

**Files:**
- Create: `src/components/train/TrainSvg.vue`

**Interfaces:**
- Consumes: `VIEW`, `CARS`, `carX` from Task 1.
- Props: `labels: string[]` (4 sprayed domain names).
- Exposes (via `defineExpose`): `setDoor(i, d)` (d ∈ [0,1]), `setWheels(px)` (train x in px → wheel rotation), `setScale(scale)` (so wheels know px per unit).
- Root element has class `train`; the SVG `viewBox` is `0 0 2400 620`, `preserveAspectRatio="xMinYMid meet"`.

- [ ] **Step 1: Write the component**

```vue
<script setup>
// Side-view Subway-Surfers-style orange train: 4 cars, each with a sprayed domain
// name, two windows, and a double sliding door clipped to its frame. Doors and
// wheels are driven imperatively by TrainDoorsBlock through the exposed setters.
import { ref } from 'vue';
import { VIEW, CARS, carX } from './trainDoorsLayout.js';

defineProps({ labels: { type: Array, default: () => [] } });

const cars = Array.from({ length: CARS }, (_, i) => i);
const doorL = ref([]);
const doorR = ref([]);
const wheels = ref([]);
let unitScale = 1;
const DOOR_TRAVEL = VIEW.DOOR_W / 2 + 6;
const CIRC = 2 * Math.PI * VIEW.WHEEL_R;

const imprints = [
  { href: '/assets/imprints/imprint-2.webp', car: 0, x: 60, y: 372, w: 190, r: -5 },
  { href: '/assets/imprints/imprint-5.webp', car: 1, x: 300, y: 365, w: 220, r: 4 },
  { href: '/assets/imprints/imprint-3.webp', car: 2, x: 40, y: 368, w: 200, r: -3 },
  { href: '/assets/imprints/imprint-7.webp', car: 3, x: 320, y: 370, w: 200, r: 6 },
];

function setDoor(i, d) {
  const l = doorL.value[i], r = doorR.value[i];
  if (!l || !r) return;
  l.style.transform = `translateX(${-d * DOOR_TRAVEL}px)`;
  r.style.transform = `translateX(${d * DOOR_TRAVEL}px)`;
}
function setScale(s) { unitScale = s || 1; }
function setWheels(px) {
  const deg = (-(px / unitScale) / CIRC) * 360;
  wheels.value.forEach((w) => { if (w) w.style.transform = `rotate(${deg}deg)`; });
}
defineExpose({ setDoor, setWheels, setScale });
</script>

<template>
  <svg class="train" :viewBox="`0 0 ${VIEW.W} ${VIEW.H}`" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
    <defs>
      <linearGradient id="trainBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FF9A3C" /><stop offset=".55" stop-color="#F27D26" /><stop offset="1" stop-color="#C95F16" />
      </linearGradient>
      <linearGradient id="trainGlass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#D8E6EE" /><stop offset=".5" stop-color="#B8CBD6" /><stop offset="1" stop-color="#7FA0B5" />
      </linearGradient>
      <clipPath v-for="i in cars" :key="'clip' + i" :id="'doorClip' + i">
        <rect :x="carX(i) + VIEW.DOOR_X" :y="VIEW.DOOR_Y" :width="VIEW.DOOR_W" :height="VIEW.DOOR_H" rx="10" />
      </clipPath>
    </defs>

    <!-- coupling bars between cars -->
    <rect v-for="i in cars.slice(1)" :key="'link' + i" :x="carX(i) - VIEW.CAR_GAP - 8" y="330" :width="VIEW.CAR_GAP + 16" height="26" fill="#2A353B" />

    <g v-for="i in cars" :key="'car' + i" :transform="`translate(${carX(i)} 0)`">
      <!-- roof -->
      <rect x="6" y="72" :width="VIEW.CAR_W - 12" height="40" rx="14" fill="#3C4A52" />
      <rect x="40" y="62" width="120" height="16" rx="6" fill="#55656E" />
      <rect x="400" y="62" width="120" height="16" rx="6" fill="#55656E" />
      <!-- body -->
      <rect x="0" y="95" :width="VIEW.CAR_W" height="380" rx="28" fill="url(#trainBody)" />
      <rect x="0" y="300" :width="VIEW.CAR_W" height="52" fill="#F2C230" />
      <rect x="0" y="352" :width="VIEW.CAR_W" height="14" fill="#8DB33A" />
      <rect x="0" y="366" :width="VIEW.CAR_W" height="6" fill="#B33B22" />
      <!-- rivet line -->
      <line x1="16" y1="118" :x2="VIEW.CAR_W - 16" y2="118" stroke="#C95F16" stroke-width="3" stroke-dasharray="2 14" />

      <!-- windows -->
      <g v-for="wx in [30, 440]" :key="'w' + wx">
        <rect :x="wx" y="150" width="90" height="120" rx="12" fill="#D4402B" />
        <rect :x="wx + 8" y="158" width="74" height="104" rx="8" fill="url(#trainGlass)" />
        <path :d="`M${wx + 14} 244 L${wx + 74} 168`" stroke="#fff" stroke-opacity=".45" stroke-width="10" stroke-linecap="round" />
      </g>

      <!-- door frame + dark interior -->
      <rect :x="VIEW.DOOR_X - 10" :y="VIEW.DOOR_Y - 10" :width="VIEW.DOOR_W + 20" :height="VIEW.DOOR_H + 20" rx="16" fill="#D4402B" />
      <rect :x="VIEW.DOOR_X" :y="VIEW.DOOR_Y" :width="VIEW.DOOR_W" :height="VIEW.DOOR_H" rx="10" fill="#141a1e" />
      <!-- sliding panels, clipped to the frame -->
      <g :clip-path="`url(#doorClip${i})`" :transform="`translate(${-carX(i)} 0)`">
        <g :transform="`translate(${carX(i)} 0)`">
          <g class="train__door" :ref="el => doorL[i] = el">
            <rect :x="VIEW.DOOR_X" :y="VIEW.DOOR_Y" :width="VIEW.DOOR_W / 2" :height="VIEW.DOOR_H" fill="#F27D26" />
            <rect :x="VIEW.DOOR_X + 18" :y="VIEW.DOOR_Y + 22" :width="VIEW.DOOR_W / 2 - 36" height="130" rx="8" fill="url(#trainGlass)" />
            <rect :x="VIEW.DOOR_X + VIEW.DOOR_W / 2 - 6" :y="VIEW.DOOR_Y" width="6" :height="VIEW.DOOR_H" fill="#B33B22" />
            <rect :x="VIEW.DOOR_X" :y="VIEW.DOOR_Y + 160" :width="VIEW.DOOR_W / 2" height="52" fill="#F2C230" />
            <rect :x="VIEW.DOOR_X" :y="VIEW.DOOR_Y + 212" :width="VIEW.DOOR_W / 2" height="14" fill="#8DB33A" />
          </g>
          <g class="train__door" :ref="el => doorR[i] = el">
            <rect :x="VIEW.DOOR_X + VIEW.DOOR_W / 2" :y="VIEW.DOOR_Y" :width="VIEW.DOOR_W / 2" :height="VIEW.DOOR_H" fill="#F27D26" />
            <rect :x="VIEW.DOOR_X + VIEW.DOOR_W / 2 + 18" :y="VIEW.DOOR_Y + 22" :width="VIEW.DOOR_W / 2 - 36" height="130" rx="8" fill="url(#trainGlass)" />
            <rect :x="VIEW.DOOR_X + VIEW.DOOR_W / 2" :y="VIEW.DOOR_Y" width="6" :height="VIEW.DOOR_H" fill="#B33B22" />
            <rect :x="VIEW.DOOR_X + VIEW.DOOR_W / 2" :y="VIEW.DOOR_Y + 160" :width="VIEW.DOOR_W / 2" height="52" fill="#F2C230" />
            <rect :x="VIEW.DOOR_X + VIEW.DOOR_W / 2" :y="VIEW.DOOR_Y + 212" :width="VIEW.DOOR_W / 2" height="14" fill="#8DB33A" />
          </g>
        </g>
      </g>

      <!-- sprayed domain name over the door -->
      <text class="train__tag train__tag--shadow" :x="VIEW.DOOR_X + VIEW.DOOR_W / 2 + 3" y="131" text-anchor="middle">{{ labels[i] }}</text>
      <text class="train__tag" :x="VIEW.DOOR_X + VIEW.DOOR_W / 2" y="128" text-anchor="middle">{{ labels[i] }}</text>

      <!-- graffiti imprint on the lower body -->
      <image v-for="im in imprints.filter(m => m.car === i)" :key="im.href" :href="im.href" :x="im.x" :y="im.y" :width="im.w" height="96" preserveAspectRatio="xMidYMid meet" class="train__imprint" :transform="`rotate(${im.r} ${im.x + im.w / 2} ${im.y + 48})`" />

      <!-- undercarriage + bogies -->
      <rect x="10" y="470" :width="VIEW.CAR_W - 20" height="34" rx="6" fill="#3C4A52" />
      <g v-for="bx in [90, 470]" :key="'b' + bx">
        <rect :x="bx - 60" y="496" width="120" height="22" rx="6" fill="#2A353B" />
        <g v-for="off in [-34, 34]" :key="'wh' + off" class="train__wheel" :ref="el => wheels.push(el)" :style="{ transformOrigin: `${bx + off}px 540px` }">
          <circle :cx="bx + off" cy="540" :r="VIEW.WHEEL_R" fill="#1F2A30" stroke="#55656E" stroke-width="5" />
          <circle :cx="bx + off" cy="540" r="7" fill="#8E9AA1" />
          <line :x1="bx + off" y1="520" :x2="bx + off" y2="560" stroke="#55656E" stroke-width="4" />
        </g>
      </g>

      <!-- headlights on the leading (left) end, tail light on the last car -->
      <g v-if="i === 0">
        <ellipse cx="8" cy="250" rx="14" ry="22" fill="#FFF3B0" />
        <ellipse cx="8" cy="250" rx="60" ry="26" fill="#FFF3B0" opacity=".18" />
      </g>
      <rect v-if="i === CARS - 1" :x="VIEW.CAR_W - 14" y="236" width="10" height="28" rx="4" fill="#FF3B2E" />
    </g>

    <!-- HACK ON TRACKS tag on the first car's yellow band -->
    <text class="train__hero train__hero--shadow" :x="carX(0) + 40 + 3" y="342" >HACK ON TRACKS</text>
    <text class="train__hero" :x="carX(0) + 40" y="339">HACK ON TRACKS</text>
  </svg>
</template>

<style scoped>
.train { display: block; height: 100%; width: auto; overflow: visible; }
.train__door { will-change: transform; }
.train__wheel { will-change: transform; }
.train__imprint { mix-blend-mode: multiply; opacity: .85; }
.train__tag { font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; font-size: 34px; letter-spacing: .04em; fill: #1B2A4A; text-transform: uppercase; }
.train__tag--shadow { fill: #7A2E10; }
.train__hero { font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; font-size: 30px; letter-spacing: .06em; fill: #1B2A4A; }
.train__hero--shadow { fill: #7A2E10; }
</style>
```

- [ ] **Step 2: Smoke-check it renders**

Temporarily mount it: in `src/views/HomeView.js` add `import TrainSvg from '../components/train/TrainSvg.vue';` and `createVNode(TrainSvg, { labels: ['A','B','C','D'] })` after `AboutBlock` inside the render list; open the `dev` preview, confirm 4 orange cars with windows, doors, wheels and the sprayed labels; then remove the temporary lines.

- [ ] **Step 3: Commit**

```bash
git add src/components/train/TrainSvg.vue
git commit -m "feat(train-doors): SVG orange graffiti train with sliding doors"
```

---

### Task 3: The section — `TrainDoorsBlock.vue` wired into the home page

**Files:**
- Create: `src/components/TrainDoorsBlock.vue`
- Modify: `src/views/HomeView.js:21` (import), `:63` (imprint zones), `:71` (vnode)
- Modify: `index.html` (add Google Font link after line 53)

**Interfaces:**
- Consumes: `layout`, `VIEW`, `PHASES`, `carX` (Task 1); `TrainSvg` with `setDoor/setWheels/setScale` (Task 2); `onlinePS`, `domainById`, `DOMAINS`; `onScroll`, `getScrollY`; `emitter`, `EVENTS`; `app`.
- Produces: section class `trainBlock` (600vh, `margin-bottom: -100vh`, `z-index: 3`), stage class `trainBlock__stage`.

- [ ] **Step 1: Add the font link to `index.html` (after the font preloads, line 53)**

```html
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link href="https://fonts.googleapis.com/css2?family=Rubik+Spray+Paint&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Write the component**

```vue
<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { onScroll, getScrollY } from '../composables/useLenisScroll.js';
import { emitter, EVENTS } from '../core/events.js';
import { app } from '../core/App.js';
import { onlinePS, domainById } from '../data/hackathon.js';
import TrainSvg from './train/TrainSvg.vue';
import { layout, VIEW, PHASES, carX } from './train/trainDoorsLayout.js';

// Scroll-scrubbed "train wipe": the section is 600vh tall with a sticky 100vh
// stage. Progress 0..1 across the section drives the train in from the right,
// stops it at each of its four doors (one per domain) which slide open to show
// that domain's Round 1 problem statement, then rolls it off to the left. The
// section overlaps the next one (Timeline) by 100vh and its stage goes
// transparent during the exit so the train reveals the timeline behind it.
const TRAIN_H = 0.82;      // train height as a fraction of the stage height
const MOBILE_MAX = 900;    // below this width the text lives in a bottom sheet

const items = computed(() => onlinePS.slice(0, 4).map((ps) => ({ ...ps, dom: domainById(ps.domain) })));
const labels = computed(() => items.value.map((it) => it.dom.short));

const rootRef = ref(null);
const stageRef = ref(null);
const trainRef = ref(null);
const wallRef = ref(null);
const panelRefs = ref([]);
const mobile = ref(false);
const active = ref(-1);

let top = 0, height = 0, scale = 1, vw = 0, vh = 0;
let unScroll = null;
let last = null;

function measure() {
  const el = rootRef.value;
  if (!el) return;
  vw = window.innerWidth; vh = window.innerHeight;
  mobile.value = vw < MOBILE_MAX;
  const r = el.getBoundingClientRect();
  top = r.top + getScrollY();
  height = el.offsetHeight;
  scale = (vh * TRAIN_H) / VIEW.H;
  trainRef.value?.setScale(scale);
  positionPanels();
  update(getScrollY());
}

// place each HTML panel exactly over its door slot (px, relative to the train wrapper)
function positionPanels() {
  panelRefs.value.forEach((p, i) => {
    if (!p) return;
    p.style.left = `${(carX(i) + VIEW.DOOR_X) * scale}px`;
    p.style.top = `${VIEW.DOOR_Y * scale}px`;
    p.style.width = `${VIEW.DOOR_W * scale}px`;
    p.style.height = `${VIEW.DOOR_H * scale}px`;
  });
}

function update(scrollY) {
  const wrap = stageRef.value?.querySelector('.trainBlock__train');
  if (!wrap || height <= vh) return;
  const p = Math.min(1, Math.max(0, (scrollY - top) / (height - vh)));
  const L = layout(p, { scale, vw });
  wrap.style.transform = `translate3d(${L.x}px, 0, 0)`;
  wrap.style.filter = L.blur > 0.05 ? `blur(${(L.blur * 1.5).toFixed(2)}px)` : '';
  if (wallRef.value) wallRef.value.style.transform = `translate3d(${L.x * 0.08}px, 0, 0)`;
  trainRef.value?.setWheels(L.x);
  let a = -1;
  for (let i = 0; i < 4; i++) {
    if (!last || last.doors[i] !== L.doors[i]) trainRef.value?.setDoor(i, L.doors[i]);
    const panel = panelRefs.value[i];
    if (panel) {
      panel.style.opacity = L.panels[i];
      panel.style.transform = `translateY(${(1 - L.panels[i]) * 12}px)`;
      panel.style.pointerEvents = L.panels[i] > 0.9 ? 'auto' : 'none';
    }
    if (L.panels[i] > 0) a = i;
  }
  active.value = a;
  // fade the stage out during the exit so the Timeline underneath shows through
  const reveal = L.phase === 'exit' ? Math.min(1, (p - PHASES.exitStart) / 0.08) : 0;
  if (stageRef.value) stageRef.value.style.setProperty('--stage-alpha', String(1 - reveal));
  last = L;
}

onMounted(() => {
  measure();
  unScroll = onScroll(update);
  emitter.on(EVENTS.RESIZE, measure);
  emitter.on(EVENTS.LAYOUT_REFRESH, measure);
  emitter.on(EVENTS.LOADER_REVEAL_COMPLETE, measure);
  requestAnimationFrame(() => { app.refreshScrollLayout?.(); measure(); });
});
onUnmounted(() => {
  unScroll?.();
  emitter.off(EVENTS.RESIZE, measure);
  emitter.off(EVENTS.LAYOUT_REFRESH, measure);
  emitter.off(EVENTS.LOADER_REVEAL_COMPLETE, measure);
});
</script>

<template>
  <section v-if="items.length" class="trainBlock" :class="{ 'is-mobile': mobile }" ref="rootRef">
    <div class="trainBlock__stage" ref="stageRef">
      <div class="trainBlock__wall" ref="wallRef" aria-hidden="true">
        <img src="/assets/imprints/imprint-1.webp" alt="" style="left:8%;top:12%;width:22vw;transform:rotate(-6deg)" />
        <img src="/assets/imprints/imprint-4.webp" alt="" style="left:58%;top:8%;width:26vw;transform:rotate(4deg)" />
        <img src="/assets/imprints/imprint-6.webp" alt="" style="left:34%;top:58%;width:20vw;transform:rotate(-3deg)" />
      </div>
      <p class="trainBlock__eyebrow">Round 1 · Online · one problem statement per domain</p>

      <div class="trainBlock__train">
        <TrainSvg ref="trainRef" :labels="labels" />
        <div class="trainBlock__panels">
          <article v-for="(it, i) in items" :key="it.code + it.domain" class="doorPanel" :ref="el => panelRefs[i] = el">
            <p class="doorPanel__tag">{{ it.dom.short }}</p>
            <p class="doorPanel__code">{{ it.code }} · {{ it.dom.name }}</p>
            <h3 class="doorPanel__title">{{ it.title }}</h3>
            <p class="doorPanel__problem">{{ it.problem }}</p>
            <p class="doorPanel__label">Expected solution</p>
            <p class="doorPanel__strong">{{ it.strong }}</p>
          </article>
        </div>
      </div>

      <div class="trainBlock__rails" aria-hidden="true"></div>

      <!-- mobile: the door slot is too narrow, show the active PS as a bottom sheet -->
      <article v-if="mobile && active >= 0" class="doorSheet">
        <p class="doorPanel__tag">{{ items[active].dom.short }}</p>
        <p class="doorPanel__code">{{ items[active].code }} · {{ items[active].dom.name }}</p>
        <h3 class="doorPanel__title">{{ items[active].title }}</h3>
        <p class="doorPanel__problem">{{ items[active].problem }}</p>
        <p class="doorPanel__label">Expected solution</p>
        <p class="doorPanel__strong">{{ items[active].strong }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.trainBlock { position: relative; z-index: 3; height: 600vh; margin-bottom: -100vh; pointer-events: none; }
.trainBlock.is-mobile { height: 500vh; }
.trainBlock__stage { --stage-alpha: 1; position: sticky; top: 0; height: 100vh; overflow: hidden; background: rgba(247, 247, 247, var(--stage-alpha)); }
.trainBlock__wall { position: absolute; inset: 0; opacity: calc(var(--stage-alpha) * .5); will-change: transform; }
.trainBlock__wall img { position: absolute; mix-blend-mode: multiply; opacity: .55; }
.trainBlock__eyebrow { position: absolute; top: 6vh; left: 0; right: 0; text-align: center; font-family: text, sans-serif; font-size: .8rem; letter-spacing: .18em; text-transform: uppercase; color: var(--c-navy); opacity: calc(var(--stage-alpha) * .55); }
.trainBlock__train { position: absolute; left: 0; top: 9vh; height: 82vh; width: max-content; will-change: transform; }
.trainBlock__panels { position: absolute; inset: 0; }
.trainBlock__rails { position: absolute; left: 0; right: 0; top: calc(9vh + 82vh * (560 / 620)); height: 8vh; background: linear-gradient(#5A6870 0 12%, #2E393F 12% 22%, transparent 22% 55%, #8A8378 55% 62%, #5C564D 62%); opacity: var(--stage-alpha); }
.trainBlock__rails::before { content: ''; position: absolute; left: 0; right: 0; top: 22%; height: 33%; background: repeating-linear-gradient(90deg, #4A3F33 0 26px, transparent 26px 70px); }

.doorPanel { position: absolute; box-sizing: border-box; padding: clamp(10px, 1.4vw, 22px); overflow-y: auto; color: #F7F7F7; opacity: 0; font-family: text, sans-serif; background: linear-gradient(#141a1e, #1B2A4A); }
.doorPanel__tag { font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; font-size: clamp(16px, 1.5vw, 24px); color: var(--c-brand); text-transform: uppercase; letter-spacing: .04em; }
.doorPanel__code { font-size: clamp(9px, .7vw, 12px); letter-spacing: .16em; text-transform: uppercase; opacity: .6; margin: .2em 0 .6em; }
.doorPanel__title { font-family: title; font-weight: 500; font-size: clamp(16px, 1.6vw, 28px); line-height: 1; letter-spacing: -.02em; color: var(--c-hazard); margin-bottom: .55em; text-transform: uppercase; }
.doorPanel__problem { font-size: clamp(10px, .8vw, 13px); line-height: 1.4; opacity: .9; }
.doorPanel__label { margin-top: .9em; font-size: clamp(9px, .65vw, 11px); letter-spacing: .16em; text-transform: uppercase; color: var(--c-cyan); }
.doorPanel__strong { font-size: clamp(10px, .8vw, 13px); line-height: 1.4; font-style: italic; margin-top: .3em; }

.doorSheet { position: absolute; left: 12px; right: 12px; bottom: 12px; max-height: 55vh; overflow-y: auto; padding: 16px; background: linear-gradient(#141a1e, #1B2A4A); color: #F7F7F7; font-family: text, sans-serif; border-radius: 10px; pointer-events: auto; }
.is-mobile .doorPanel { display: none; }
.is-mobile .trainBlock__train { top: 4vh; height: 60vh; }
.is-mobile .trainBlock__rails { top: calc(4vh + 60vh * (560 / 620)); }
</style>
```

- [ ] **Step 3: Wire into `HomeView.js`**

Replace line 21 `import ProblemStatementsBlock from '../components/ProblemStatementsBlock.vue';` with
`import TrainDoorsBlock from '../components/TrainDoorsBlock.vue';`, replace `createVNode(ProblemStatementsBlock),` with `createVNode(TrainDoorsBlock),`, and remove `".psBlock", ` from the `ImprintsLayer` `zones` array.

- [ ] **Step 4: Verify in the `dev` preview**

Open `http://localhost:5173/?skipLoader`, scroll to the section. Check: train enters from the right and stops with door 1 centred; doors open one by one with the PS text readable; train creeps one car between doors; train leaves left and the Timeline shows through; scrolling back reverses. `read_console_messages` → no errors. `resize_window` mobile → bottom sheet shows the active PS, no horizontal scroll. Fix any issue found before committing.

- [ ] **Step 5: Commit**

```bash
git add src/components/TrainDoorsBlock.vue src/views/HomeView.js index.html
git commit -m "feat(train-doors): scroll-driven train wipe replaces PS cards on the home page"
```

---

### Task 4: README note

**Files:**
- Modify: `README.md` (append to the "Train + soundtrack" list)

- [ ] **Step 1: Add the bullet**

```markdown
* **Problem statements = train doors** (2026-09-18): `src/components/TrainDoorsBlock.vue` replaces the
  expandable cards (`ProblemStatementsBlock.vue` is kept but unused). A sticky 100vh stage inside a 600vh section;
  scroll progress → `src/components/train/trainDoorsLayout.js` (`layout(p)`, tested by
  `node scripts/test-train-layout.mjs`) → the SVG train in `src/components/train/TrainSvg.vue`. Tune `PHASES` /
  `SLOT` there, palette + graffiti placement in `TrainSvg.vue`, text panel sizes in `TrainDoorsBlock.vue`.
  The section overlaps the Timeline by 100vh (`margin-bottom: -100vh`) so the exiting train reveals it.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: train-doors section"
```
