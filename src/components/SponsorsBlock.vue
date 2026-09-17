<script setup>
import { onMounted, ref } from 'vue';
import { sponsors } from '../data/hackathon.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';
import SpraySplash from './SpraySplash.vue';

// Six spray-paint patches for sponsor logos. Slots come from `sponsors` in
// src/data/hackathon.js; an empty slot shows a dashed "your logo here" spot.
// Each patch has its own splat shape / colour / tilt so the wall looks hand-sprayed.
const rootRef = ref(null);
const { arm } = useScrollReveal(rootRef);
onMounted(() => requestAnimationFrame(arm));

const PATCHES = [
  { color: '#FF5A2E', accent: '#FFC300', tilt: -3, seed: 3 },
  { color: '#2E8BFF', accent: '#00E5D0', tilt: 2, seed: 7 },
  { color: '#8DE21C', accent: '#FFC300', tilt: -2, seed: 12 },
  { color: '#FF3FA4', accent: '#B04CFF', tilt: 3, seed: 19 },
  { color: '#FFC300', accent: '#FF5A2E', tilt: -1, seed: 28 },
  { color: '#00E5D0', accent: '#2E8BFF', tilt: 2, seed: 33 },
];
const slots = sponsors.slice(0, 6).map((s, i) => ({ ...s, ...PATCHES[i], n: String(i + 1).padStart(2, '0') }));
</script>

<template>
  <section class="sponsorsBlock" ref="rootRef">
    <div class="sponsorsBlock__inner" data-reveal>
      <p class="sponsorsBlock__eyebrow fade">Powered by</p>
      <h2 class="sponsorsBlock__title">
        <span class="reveal"><span>Sponsors.</span></span>
      </h2>

      <ul class="sponsorsBlock__wall fade">
        <li v-for="s in slots" :key="s.n" class="patch" :class="{ 'is-empty': !s.logo }" :style="{ '--c': s.color, '--tilt': s.tilt + 'deg' }">
          <SpraySplash class="patch__splat" :color="s.color" :accent="s.accent" :seed="s.seed" :rough=".5" />
          <component :is="s.url ? 'a' : 'div'" class="patch__slot" :href="s.url || undefined" :target="s.url ? '_blank' : undefined" rel="noopener noreferrer">
            <img v-if="s.logo" :src="s.logo" :alt="s.name" class="patch__logo" />
            <template v-else>
              <span class="patch__n">Sponsor {{ s.n }}</span>
              <span class="patch__placeholder">your logo here</span>
            </template>
          </component>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.sponsorsBlock { position: relative; padding: 5rem 1.7142857143rem 6rem; color: var(--c-navy); font-family: text, sans-serif; text-align: center; }
.sponsorsBlock__inner { max-width: 72rem; margin: 0 auto; }
.reveal { display: block; overflow: clip; }
.reveal > span { display: block; will-change: transform; }
[data-reveal] { visibility: hidden; }
.sponsorsBlock__eyebrow { font-size: .8rem; letter-spacing: .18em; text-transform: uppercase; opacity: .55; margin-bottom: 1rem; }
.sponsorsBlock__title { font-family: title; font-weight: 500; letter-spacing: -.02em; line-height: .9; text-transform: uppercase; color: var(--c-hazard); font-size: clamp(56px, 8.5vw, 150px); margin-bottom: 3rem; }

.sponsorsBlock__wall { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(16px, 3vw, 48px) clamp(12px, 2.5vw, 40px); }
.patch { position: relative; aspect-ratio: 380 / 280; display: flex; align-items: center; justify-content: center; transform: rotate(var(--tilt)); }
.patch__splat { inset: -10% -8% -18% -8%; width: 116%; height: 128%; }
.patch__slot { position: relative; width: 60%; aspect-ratio: 16 / 9; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; color: inherit; }
.patch.is-empty .patch__slot { border: 3px dashed rgba(27, 42, 74, .6); background: rgba(255, 255, 255, .28); border-radius: 14px; width: 58%; aspect-ratio: 3 / 2; }
.patch__logo { max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(2px 2px 0 rgba(255, 255, 255, .6)); }
.patch__n { white-space: nowrap; font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; text-transform: uppercase; font-size: clamp(14px, 1.5vw, 26px); color: #fff; -webkit-text-stroke: 1.5px var(--c-navy); paint-order: stroke fill; text-shadow: 3px 3px 0 var(--c-navy); }
.patch__placeholder { margin-top: .2em; font-size: clamp(9px, .8vw, 12px); letter-spacing: .16em; text-transform: uppercase; opacity: .75; color: var(--c-navy); }

@media (max-width: 700px) {
  .sponsorsBlock { padding: 3rem 1rem 4rem; }
  .sponsorsBlock__wall { grid-template-columns: repeat(2, 1fr); gap: 18px 14px; }
}
</style>
