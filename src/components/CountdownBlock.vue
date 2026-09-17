<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { HACKATHON_START, HACKATHON_DATES_LABEL } from '../data/hackathon.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';

// Live countdown to HACKATHON_START (src/data/hackathon.js), drawn as four
// spray-painted tiles. Ticks once a second; shows "Now boarding" once the date
// has passed.
const rootRef = ref(null);
const { arm } = useScrollReveal(rootRef);

const target = new Date(HACKATHON_START).getTime();
const now = ref(Date.now());
let timer = null;

const left = computed(() => Math.max(0, target - now.value));
const over = computed(() => left.value === 0);
const pad = (n) => String(n).padStart(2, '0');
const tiles = computed(() => {
  const s = Math.floor(left.value / 1000);
  return [
    { label: 'Days', value: pad(Math.floor(s / 86400)), tilt: -3, color: '#FF5A2E' },
    { label: 'Hours', value: pad(Math.floor((s % 86400) / 3600)), tilt: 2, color: '#FFC300' },
    { label: 'Min', value: pad(Math.floor((s % 3600) / 60)), tilt: -2, color: '#00E5D0' },
    { label: 'Sec', value: pad(s % 60), tilt: 3, color: '#4FC3F7' },
  ];
});

onMounted(() => {
  requestAnimationFrame(arm);
  timer = setInterval(() => { now.value = Date.now(); }, 1000);
});
onUnmounted(() => clearInterval(timer));
</script>

<template>
  <section class="countdownBlock" ref="rootRef">
    <div class="countdownBlock__inner" data-reveal>
      <p class="countdownBlock__eyebrow fade">Next stop · {{ HACKATHON_DATES_LABEL }}</p>
      <h2 class="countdownBlock__title">
        <span class="reveal"><span>{{ over ? 'Now boarding.' : 'The train leaves in' }}</span></span>
      </h2>

      <ol class="countdownBlock__tiles fade" aria-live="polite">
        <li v-for="t in tiles" :key="t.label" class="tile" :style="{ '--tilt': t.tilt + 'deg', '--c': t.color }">
          <svg class="tile__splat" viewBox="0 0 200 200" aria-hidden="true">
            <path d="M28 40 C36 14 84 8 118 16 C150 22 186 30 190 66 C194 96 176 118 178 146 C180 174 150 190 118 186 C88 182 62 194 40 178 C14 160 6 128 12 100 C16 78 20 60 28 40 Z" fill="var(--c)" />
            <path class="tile__drip" d="M52 176 c0 14 -2 30 2 40 c4 6 10 0 8 -12 c-2 -10 0 -20 -2 -28 z M132 182 c0 10 -1 22 3 28 c4 4 8 -2 6 -10 c-2 -8 0 -12 -1 -18 z" fill="var(--c)" />
            <circle cx="20" cy="150" r="5" fill="var(--c)" /><circle cx="184" cy="42" r="4" fill="var(--c)" /><circle cx="176" cy="172" r="3" fill="var(--c)" /><circle cx="30" cy="22" r="3" fill="var(--c)" />
          </svg>
          <span class="tile__value">{{ t.value }}</span>
          <span class="tile__label">{{ t.label }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.countdownBlock { position: relative; padding: 7rem 1.7142857143rem 4rem; color: var(--c-navy); font-family: text, sans-serif; text-align: center; }
.countdownBlock__inner { max-width: 72rem; margin: 0 auto; }
.reveal { display: block; overflow: clip; }
.reveal > span { display: block; will-change: transform; }
[data-reveal] { visibility: hidden; }
.countdownBlock__eyebrow { font-size: .8rem; letter-spacing: .18em; text-transform: uppercase; opacity: .55; margin-bottom: 1rem; }
.countdownBlock__title { font-family: title; font-weight: 500; letter-spacing: -.02em; line-height: .9; text-transform: uppercase; color: var(--c-hazard); font-size: clamp(44px, 7vw, 120px); margin-bottom: 3rem; }

.countdownBlock__tiles { display: flex; justify-content: center; gap: clamp(10px, 2.2vw, 36px); flex-wrap: wrap; }
.tile { position: relative; width: clamp(120px, 15vw, 210px); aspect-ratio: 1; display: grid; place-content: center; transform: rotate(var(--tilt)); }
.tile__splat { position: absolute; inset: -6% -6% -18% -6%; width: 112%; height: 124%; filter: drop-shadow(0 6px 0 rgba(27, 42, 74, .18)); }
.tile__drip { opacity: .9; }
.tile__value { position: relative; font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; font-size: clamp(44px, 6vw, 88px); line-height: 1; color: var(--c-navy); text-shadow: 3px 3px 0 rgba(255, 255, 255, .55); font-variant-numeric: tabular-nums; }
.tile__label { position: relative; margin-top: .2em; font-family: title; font-weight: 500; text-transform: uppercase; letter-spacing: .12em; font-size: clamp(11px, 1vw, 15px); color: var(--c-navy); }

@media (max-width: 700px) {
  .countdownBlock { padding: 4rem 1rem 2rem; }
  .countdownBlock__tiles { gap: 14px; }
  .tile { width: 38vw; }
}
</style>
