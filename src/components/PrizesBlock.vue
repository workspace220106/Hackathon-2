<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { createPrizeStage } from './prizes/prizeStage.js';
import { prizes } from '../data/hackathon.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';

// Prize podium: the three Subway Surfers characters stand in a row on their own
// small Three.js stage (src/components/prizes/prizeStage.js), idling with a bob
// and sway. Hovering a column makes that character hop + spin and reveals the
// spray-paint price tag. Data: `prizes` in src/data/hackathon.js.
const rootRef = ref(null);
const canvasRef = ref(null);
const hovered = ref(-1);
const { arm } = useScrollReveal(rootRef);
let stage = null;

function enter(i) { hovered.value = i; stage?.setHover(i); }
function leave() { hovered.value = -1; stage?.setHover(-1); }

onMounted(() => {
  requestAnimationFrame(arm);
  stage = createPrizeStage(canvasRef.value, prizes);
});
onUnmounted(() => { stage?.dispose(); stage = null; });
</script>

<template>
  <section class="prizesBlock" ref="rootRef">
    <div class="prizesBlock__inner" data-reveal>
      <p class="prizesBlock__eyebrow fade">Prize pool · ₹1,00,000</p>
      <h2 class="prizesBlock__title">
        <span class="reveal"><span>Prizes.</span></span>
      </h2>
      <p class="prizesBlock__hint fade">Hover a surfer to see what they're running for.</p>
    </div>

    <div class="prizesBlock__stage">
      <canvas ref="canvasRef" class="prizesBlock__canvas" aria-hidden="true"></canvas>
      <div class="prizesBlock__cols">
        <button
          v-for="(p, i) in prizes" :key="p.character" type="button" class="prizeCol" :class="{ 'is-on': hovered === i }"
          :style="{ '--c': p.color }" @mouseenter="enter(i)" @mouseleave="leave" @focus="enter(i)" @blur="leave" @click="hovered === i ? leave() : enter(i)"
          :aria-label="`${p.place} prize: ${p.amount}`"
        >
          <span class="prizeCol__tag">
            <svg class="prizeCol__splat" viewBox="0 0 260 150" aria-hidden="true">
              <path d="M30 40 C40 10 110 4 160 10 C210 16 250 30 252 70 C254 104 230 130 190 138 C150 146 100 150 60 136 C20 122 4 96 10 66 C14 52 22 46 30 40 Z" fill="var(--c)" />
              <path d="M70 134 c0 12 -2 26 3 34 c4 6 10 0 8 -12 c-2 -10 0 -16 -2 -22 z M200 130 c0 10 -1 20 3 26 c4 4 8 -2 6 -10 c-2 -8 0 -10 -1 -16 z" fill="var(--c)" />
              <circle cx="18" cy="112" r="4" fill="var(--c)" /><circle cx="246" cy="34" r="4" fill="var(--c)" /><circle cx="236" cy="128" r="3" fill="var(--c)" />
            </svg>
            <span class="prizeCol__amount">{{ p.amount }}</span>
            <span class="prizeCol__place">{{ p.place }} · {{ p.label }}</span>
          </span>
          <span class="prizeCol__name">{{ p.character }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.prizesBlock { position: relative; padding: 5rem 0 3rem; color: var(--c-navy); font-family: text, sans-serif; }
.prizesBlock__inner { max-width: 72rem; margin: 0 auto; padding: 0 1.7142857143rem; text-align: center; }
.reveal { display: block; overflow: clip; }
.reveal > span { display: block; will-change: transform; }
[data-reveal] { visibility: hidden; }
.prizesBlock__eyebrow { font-size: .8rem; letter-spacing: .18em; text-transform: uppercase; opacity: .55; margin-bottom: 1rem; }
.prizesBlock__title { font-family: title; font-weight: 500; letter-spacing: -.02em; line-height: .9; text-transform: uppercase; color: var(--c-hazard); font-size: clamp(56px, 8.5vw, 150px); }
.prizesBlock__hint { margin-top: 1rem; font-size: clamp(14px, 1.05vw, 17px); opacity: .7; }

.prizesBlock__stage { position: relative; height: clamp(420px, 62vh, 700px); max-width: 84rem; margin: 1rem auto 0; }
.prizesBlock__canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.prizesBlock__cols { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(3, 1fr); }
.prizeCol { position: relative; cursor: pointer; background: none; border: 0; padding: 0; color: inherit; font: inherit; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 1%; }
.prizeCol:focus-visible { outline: 2px dashed var(--c); outline-offset: -8px; }

.prizeCol__tag { position: relative; width: clamp(150px, 16vw, 250px); aspect-ratio: 260 / 150; display: grid; place-content: center; opacity: 0; transform: translateY(18px) rotate(-4deg) scale(.85); transition: opacity .28s ease, transform .5s cubic-bezier(.2, 1.4, .4, 1); pointer-events: none; }
.prizeCol.is-on .prizeCol__tag { opacity: 1; transform: translateY(0) rotate(-4deg) scale(1); }
.prizeCol__splat { position: absolute; inset: -4% -4% -20% -4%; width: 108%; height: 126%; filter: drop-shadow(0 5px 0 rgba(27, 42, 74, .18)); }
.prizeCol__amount { position: relative; font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; font-size: clamp(30px, 3.2vw, 52px); line-height: 1; color: var(--c-navy); text-shadow: 3px 3px 0 rgba(255, 255, 255, .55); }
.prizeCol__place { position: relative; margin-top: .3em; font-family: title; font-weight: 500; text-transform: uppercase; letter-spacing: .12em; font-size: clamp(10px, .85vw, 13px); color: var(--c-navy); }
.prizeCol__name { position: absolute; bottom: 4%; font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; text-transform: uppercase; font-size: clamp(16px, 1.6vw, 26px); letter-spacing: .06em; color: var(--c-navy); opacity: .6; transition: opacity .3s; }
.prizeCol.is-on .prizeCol__name { opacity: 1; color: var(--c); }

@media (max-width: 700px) {
  .prizesBlock { padding: 3rem 0 1rem; }
  .prizesBlock__stage { height: 300px; }
  .prizeCol__tag { width: 28vw; }
  .prizeCol__amount { font-size: 5.2vw; }
}
</style>
