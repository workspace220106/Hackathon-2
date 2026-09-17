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
 * @returns {{x:number, doors:number[], panels:number[], blur:number, phase:'enter'|'slot'|'exit'}}
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
  let d;
  if (s < SLOT.moveEnd) d = 0;
  else if (s < SLOT.openEnd) d = easeInOut((s - SLOT.moveEnd) / (SLOT.openEnd - SLOT.moveEnd));
  else if (s < SLOT.closeStart) d = 1;
  else d = 1 - easeInOut((s - SLOT.closeStart) / (1 - SLOT.closeStart));
  doors[i] = d;
  panels[i] = clamp01((d - PANEL_AT) / (1 - PANEL_AT));
  return { x, doors, panels, blur, phase: 'slot' };
}
