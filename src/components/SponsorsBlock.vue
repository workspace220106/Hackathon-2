<script setup>
import { onMounted, ref } from 'vue';
import { sponsors } from '../data/hackathon.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';

// Six spray-paint patches for sponsor logos. Slots come from `sponsors` in
// src/data/hackathon.js; an empty slot shows a dashed "your logo here" spot.
// Each patch has its own splat shape / colour / tilt so the wall looks hand-sprayed.
const rootRef = ref(null);
const { arm } = useScrollReveal(rootRef);
onMounted(() => requestAnimationFrame(arm));

const PATCHES = [
  { color: '#FF5A2E', tilt: -3, d: 'M40 70 C50 30 120 14 190 20 C260 26 330 40 350 96 C368 150 340 210 280 236 C220 262 130 258 80 226 C30 194 16 140 26 104 C30 90 34 80 40 70 Z' },
  { color: '#FFC300', tilt: 2, d: 'M30 96 C24 44 96 18 170 22 C240 26 320 30 356 84 C384 128 350 196 300 230 C250 262 160 260 96 236 C40 214 34 150 30 96 Z' },
  { color: '#00E5D0', tilt: -2, d: 'M50 60 C90 20 170 12 230 24 C290 36 356 66 352 130 C348 190 300 240 236 250 C170 260 90 246 50 206 C10 166 14 100 50 60 Z' },
  { color: '#4FC3F7', tilt: 3, d: 'M36 84 C50 36 130 10 200 16 C270 22 344 50 354 110 C364 170 316 226 256 244 C196 262 110 256 62 220 C14 184 22 130 36 84 Z' },
  { color: '#FF6EB4', tilt: -1, d: 'M44 74 C70 28 150 16 214 18 C280 20 346 52 350 116 C354 180 306 236 240 248 C174 260 96 250 56 214 C16 178 18 120 44 74 Z' },
  { color: '#8DB33A', tilt: 2, d: 'M32 90 C38 42 110 14 186 20 C262 26 336 46 352 104 C368 162 330 222 266 244 C202 266 116 254 66 220 C16 186 26 138 32 90 Z' },
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
          <svg class="patch__splat" viewBox="0 0 380 280" aria-hidden="true">
            <path :d="s.d" fill="var(--c)" />
            <path d="M90 236 c0 14 -3 32 3 42 c5 6 12 0 9 -14 c-3 -12 0 -20 -3 -28 z M262 244 c0 12 -2 26 4 34 c5 5 10 -2 7 -12 c-3 -10 0 -14 -1 -22 z" fill="var(--c)" />
            <circle cx="22" cy="200" r="5" fill="var(--c)" /><circle cx="360" cy="52" r="4" fill="var(--c)" /><circle cx="346" cy="236" r="3" fill="var(--c)" /><circle cx="48" cy="34" r="3" fill="var(--c)" />
          </svg>
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
.patch__splat { position: absolute; inset: -4% -4% -16% -4%; width: 108%; height: 120%; filter: drop-shadow(0 6px 0 rgba(27, 42, 74, .16)); }
.patch__slot { position: relative; width: 60%; aspect-ratio: 16 / 9; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-decoration: none; color: inherit; }
.patch.is-empty .patch__slot { border: 3px dashed rgba(27, 42, 74, .5); border-radius: 14px; width: 58%; aspect-ratio: 3 / 2; }
.patch__logo { max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(2px 2px 0 rgba(255, 255, 255, .6)); }
.patch__n { white-space: nowrap; font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; text-transform: uppercase; font-size: clamp(14px, 1.5vw, 26px); color: var(--c-navy); text-shadow: 2px 2px 0 rgba(255, 255, 255, .55); }
.patch__placeholder { margin-top: .2em; font-size: clamp(9px, .8vw, 12px); letter-spacing: .16em; text-transform: uppercase; opacity: .6; }

@media (max-width: 700px) {
  .sponsorsBlock { padding: 3rem 1rem 4rem; }
  .sponsorsBlock__wall { grid-template-columns: repeat(2, 1fr); gap: 18px 14px; }
}
</style>
