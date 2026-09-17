<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { HACKATHON_START, HACKATHON_DATES_LABEL } from '../data/hackathon.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';
import SpraySplash from './SpraySplash.vue';

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
    { label: 'Days', value: pad(Math.floor(s / 86400)), tilt: -3, color: '#FF5A2E', accent: '#FF3FA4', seed: 11 },
    { label: 'Hours', value: pad(Math.floor((s % 86400) / 3600)), tilt: 2, color: '#FFC300', accent: '#8DE21C', seed: 23 },
    { label: 'Min', value: pad(Math.floor((s % 3600) / 60)), tilt: -2, color: '#00E5D0', accent: '#2E8BFF', seed: 37 },
    { label: 'Sec', value: pad(s % 60), tilt: 3, color: '#B04CFF', accent: '#FF3FA4', seed: 41 },
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
          <SpraySplash class="tile__splat" :color="t.color" :accent="t.accent" :seed="t.seed" :rough=".55" />
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
.tile { position: relative; width: clamp(120px, 14vw, 200px); aspect-ratio: 4 / 3; display: grid; place-content: center; transform: rotate(var(--tilt)); }
.tile__splat { inset: -12% -10% -20% -10%; width: 120%; height: 132%; }
.tile__value { position: relative; font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; font-size: clamp(44px, 6vw, 88px); line-height: 1; color: #fff; -webkit-text-stroke: 2px var(--c-navy); paint-order: stroke fill; text-shadow: 4px 4px 0 var(--c-navy); font-variant-numeric: tabular-nums; }
.tile__label { position: relative; margin-top: .25em; font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; text-transform: uppercase; letter-spacing: .1em; font-size: clamp(12px, 1.1vw, 17px); color: var(--c-navy); }

@media (max-width: 700px) {
  .countdownBlock { padding: 4rem 1rem 2rem; }
  .countdownBlock__tiles { gap: 14px; }
  .tile { width: 38vw; }
}
</style>
