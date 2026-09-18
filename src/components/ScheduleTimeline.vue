<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { onScroll, getScrollY } from '../composables/useLenisScroll.js';
import { emitter, EVENTS } from '../core/events.js';
import { app } from '../core/App.js';

// Scroll-driven vertical timeline for the schedule: a centre line that fills as
// you scroll, a crosshair marker pinned to the middle of the viewport, and entries
// on alternating sides that light up when the marker reaches them.
// Data comes from homeData.archives (src/data/home.js) — `items[]` with name / type (time) / date / infos.
const props = defineProps({
  title: { type: String, default: 'Schedule' },
  items: { type: Array, default: () => [] },
});

// where the marker sits, as a fraction of the viewport height
const MARKER_AT = 0.5;
// an entry is "live" while its dot is within this many px of the marker
const LIVE_RANGE = 220;

const entries = computed(() => props.items.map((it, i) => ({
  ...it,
  side: i % 2 === 0 ? 'left' : 'right',
  newDay: i === 0 || it.date !== props.items[i - 1].date,
})));

const rootRef = ref(null);
const lineRef = ref(null);
const fillRef = ref(null);
const markerRef = ref(null);
const entryRefs = ref([]);
const setEntryRef = (el, i) => { if (el) entryRefs.value[i] = el; };

let lineTop = 0, lineHeight = 1, lineX = 0, dots = [], trainActive = false;
function measure() {
  const line = lineRef.value;
  if (!line) return;
  const y = getScrollY();
  const r = line.getBoundingClientRect();
  lineTop = r.top + y; lineHeight = Math.max(1, r.height); lineX = r.left + r.width / 2;
  dots = entryRefs.value.map((el) => {
    const d = el.querySelector('.entry__dot').getBoundingClientRect();
    return d.top + y + d.height / 2;
  });
  update(y);
}

function update(y) {
  const markerY = y + window.innerHeight * MARKER_AT;
  // fill the line down to the marker
  const p = Math.min(1, Math.max(0, (markerY - lineTop) / lineHeight));
  if (fillRef.value) fillRef.value.style.transform = `scaleY(${p.toFixed(4)})`;
  // keep the marker inside the line (it's sticky, so only clamp at the ends)
  const onTrack = markerY >= lineTop && markerY <= lineTop + lineHeight;
  if (markerRef.value) markerRef.value.classList.toggle('is-out', !onTrack);
  // hand the marker's screen position to the WebGL train (see WebGL._updateTrackBee)
  const train = onTrack;
  if (train !== trainActive) { trainActive = train; rootRef.value?.classList.toggle('has-train', train); }
  app.trackBee = train ? { active: true, x: lineX, y: window.innerHeight * MARKER_AT } : null;
  // entries: upcoming → live (near the marker) → passed
  const els = entryRefs.value;
  for (let i = 0; i < els.length; i++) {
    const dist = dots[i] - markerY;
    const el = els[i];
    el.classList.toggle('is-live', Math.abs(dist) < LIVE_RANGE);
    el.classList.toggle('is-passed', dist <= -LIVE_RANGE);
    el.classList.toggle('is-revealed', dist < LIVE_RANGE + 80);
  }
}

let unScroll = null, ro = null;
onMounted(() => {
  measure();
  requestAnimationFrame(measure);
  unScroll = onScroll(update);
  emitter.on(EVENTS.RESIZE, measure);
  emitter.on(EVENTS.LAYOUT_REFRESH, measure);
  emitter.on(EVENTS.LOADER_REVEAL_COMPLETE, measure);
  if ('ResizeObserver' in window && rootRef.value) { ro = new ResizeObserver(measure); ro.observe(rootRef.value); }
});
onUnmounted(() => { app.trackBee = null; unScroll?.(); ro?.disconnect(); emitter.off(EVENTS.RESIZE, measure); emitter.off(EVENTS.LAYOUT_REFRESH, measure); emitter.off(EVENTS.LOADER_REVEAL_COMPLETE, measure); });
</script>

<template>
  <section class="scheduleBlock" ref="rootRef">
    <h2 class="scheduleBlock__title">{{ title }}</h2>

    <div class="timeline">
      <div class="timeline__line" ref="lineRef"><div class="timeline__fill" ref="fillRef"></div></div>

      <div class="timeline__marker" ref="markerRef" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="17" stroke="currentColor" stroke-width="2" />
          <circle cx="24" cy="24" r="4" fill="currentColor" />
          <path d="M24 1v9M24 38v9M1 24h9M38 24h9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>

      <article v-for="(it, i) in entries" :key="i" class="entry" :class="`entry--${it.side}`" :ref="(el) => setEntryRef(el, i)">
        <div v-if="it.newDay" class="entry__dayChip">{{ it.date }}</div>
        <div class="entry__time">
          <span class="entry__day">{{ it.date }}</span>
          <strong>{{ it.type }}</strong>
        </div>
        <span class="entry__dot"></span>
        <div class="entry__body">
          <h3 class="entry__name">{{ it.name }}</h3>
          <p v-for="(line, j) in it.infos" :key="j" class="entry__info">{{ line }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.scheduleBlock { position: relative; padding: 9rem 0 6rem; color: var(--c-navy); }
.scheduleBlock__title { font-family: title; font-weight: 500; letter-spacing: -.02em; line-height: .9; text-transform: uppercase; color: var(--c-hazard); font-size: clamp(56px, 8.5vw, 150px); text-align: center; margin-bottom: 5rem; }

.timeline { position: relative; width: min(1180px, calc(100% - 3rem)); margin: 0 auto; padding: 3rem 0 6rem; }
/* railway track: two rails + sleepers; the lit copy on top fills down to the marker */
.timeline__line, .timeline__fill {
  --rail: rgba(27, 42, 74, .28); --sleeper: rgba(27, 42, 74, .16);
  position: absolute; left: 50%; top: 0; bottom: 0; width: 40px; margin-left: -20px;
  background:
    linear-gradient(to right, var(--rail) 0 3px, transparent 3px calc(100% - 3px), var(--rail) calc(100% - 3px)) no-repeat,
    repeating-linear-gradient(to bottom, var(--sleeper) 0 5px, transparent 5px 22px) 0 0 / 100% 100%;
  border-radius: 2px;
}
.timeline__fill { --rail: var(--c-hazard); --sleeper: rgba(255, 90, 46, .55); inset: 0; margin-left: 0; left: 0; width: 100%; transform-origin: top; transform: scaleY(0); filter: drop-shadow(0 0 10px rgba(255, 90, 46, .35)); }

.timeline__marker { position: sticky; top: calc(50vh - 24px); z-index: 2; width: 48px; height: 48px; margin: 0 auto -48px; color: var(--c-hazard); pointer-events: none; transition: opacity .3s, transform .3s; }
.timeline__marker svg { width: 100%; height: 100%; display: block; animation: markerSpin 14s linear infinite; }
.timeline__marker.is-out, .has-train .timeline__marker { opacity: 0; transform: scale(.6); }
@keyframes markerSpin { to { transform: rotate(360deg); } }

.entry { position: relative; display: grid; grid-template-columns: 1fr 48px 1fr; align-items: center; column-gap: 2.5rem; padding: 3.2rem 0; }
.entry__dot { grid-column: 2; justify-self: center; width: 16px; height: 16px; box-shadow: 0 0 0 4px #fff; border-radius: 50%; background: #fff; border: 2px solid rgba(27, 42, 74, .25); transition: background .35s, border-color .35s, transform .35s, box-shadow .35s; }

.entry__time { display: flex; flex-direction: column; gap: .4rem; }
.entry__day { font-family: text; font-size: .8rem; letter-spacing: .18em; text-transform: uppercase; opacity: .5; }
.entry__time strong { font-family: title; font-weight: 500; font-size: clamp(34px, 4.6vw, 76px); line-height: .95; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
.entry__name { font-family: title; font-weight: 500; font-size: clamp(22px, 2.3vw, 36px); line-height: 1.05; color: var(--c-hazard); margin-bottom: .7rem; }
.entry__info { font-family: text; font-size: clamp(14px, 1.05vw, 17px); line-height: 1.45; opacity: .78; }
.entry__info + .entry__info { margin-top: .25rem; }

.entry--left .entry__time { grid-column: 1; text-align: right; align-items: flex-end; }
.entry--left .entry__body { grid-column: 3; text-align: left; }
.entry--right .entry__time { grid-column: 3; text-align: left; align-items: flex-start; grid-row: 1; }
.entry--right .entry__body { grid-column: 1; text-align: right; grid-row: 1; }
.entry--right .entry__dot { grid-row: 1; }

.entry__dayChip { position: absolute; left: 50%; top: 0; transform: translate(-50%, -50%); z-index: 1; font-family: text; font-size: .75rem; letter-spacing: .2em; text-transform: uppercase; padding: .45rem .9rem; border-radius: 999px; background: var(--c-brand); color: var(--c-navy); white-space: nowrap; }

/* reveal / live / passed states driven by scroll */
.entry__time, .entry__body { opacity: 0; transform: translateY(28px); transition: opacity .7s cubic-bezier(.2, .7, .2, 1), transform .9s cubic-bezier(.2, .7, .2, 1), filter .5s; }
.entry--left .entry__time, .entry--right .entry__body { transform: translateX(-36px); }
.entry--left .entry__body, .entry--right .entry__time { transform: translateX(36px); }
.entry.is-revealed .entry__time, .entry.is-revealed .entry__body { opacity: 1; transform: none; }
.entry.is-live .entry__dot { background: var(--c-hazard); border-color: var(--c-hazard); transform: scale(1.35); box-shadow: 0 0 0 8px rgba(255, 90, 46, .14); }
.entry.is-passed .entry__dot { background: var(--c-hazard); border-color: var(--c-hazard); }
.entry.is-passed .entry__time, .entry.is-passed .entry__body { opacity: .38; }

@media (max-width: 900px) {
  /* same centred track on phones — just tighter */
  .scheduleBlock { padding-top: 6rem; }
  .scheduleBlock__title { margin-bottom: 2.5rem; }
  .timeline { width: calc(100% - 1.5rem); }
  .timeline__line, .timeline__fill { width: 28px; margin-left: -14px; }
  .timeline__fill { margin-left: 0; }
  .entry { grid-template-columns: minmax(0, 1fr) 36px minmax(0, 1fr); column-gap: .9rem; padding: 2rem 0; }
  .entry__time, .entry__body { min-width: 0; overflow-wrap: anywhere; }
  .entry__time strong { font-size: clamp(17px, 5.4vw, 30px); letter-spacing: -.03em; }
  .entry__name { font-size: clamp(17px, 4.6vw, 22px); margin-bottom: .4rem; }
  .entry__info { font-size: 13px; }
  .entry__day { font-size: 10px; }
  .entry__dot { width: 12px; height: 12px; }
  .entry--left .entry__time, .entry--right .entry__body { transform: translateX(-18px); }
  .entry--left .entry__body, .entry--right .entry__time { transform: translateX(18px); }
}
</style>
