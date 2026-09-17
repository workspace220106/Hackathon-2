<script setup>
// Procedural spray-paint splash in the style of the graffiti imprints
// (public/assets/imprints): a soft airbrush halo, a rough-edged main blob with a
// dark outline, a second colour bleeding through, drips and speckles.
// Deterministic per `seed`, so the same slot always draws the same splash.
import { computed } from 'vue';

const props = defineProps({
  color: { type: String, default: '#FF5A2E' },
  accent: { type: String, default: '#FFC300' },
  seed: { type: Number, default: 1 },
  // 0..1 — how ragged the edge is
  rough: { type: Number, default: 0.5 },
});

const uid = `spray${Math.random().toString(36).slice(2, 8)}`;

function rng(seed) {
  let s = seed * 9301 + 49297;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

// closed smooth blob around (cx, cy) as a cubic path
function blob(rand, cx, cy, rx, ry, n = 12, wobble = 0.22) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + (rand() - 0.5) * 2 * wobble;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + ' Z';
}

const art = computed(() => {
  const rand = rng(props.seed);
  const main = blob(rand, 200, 140, 168, 112, 14, 0.18);
  const halo = blob(rand, 200 + (rand() - 0.5) * 30, 140 + (rand() - 0.5) * 20, 190, 130, 10, 0.25);
  const bleed = blob(rand, 120 + rand() * 160, 90 + rand() * 100, 60 + rand() * 50, 40 + rand() * 40, 9, 0.3);
  const hi = blob(rand, 150 + rand() * 60, 90 + rand() * 30, 70, 34, 8, 0.25);
  const drips = [];
  const nd = 2 + Math.floor(rand() * 3);
  for (let i = 0; i < nd; i++) {
    const x = 90 + rand() * 220, y0 = 210 + rand() * 30, len = 22 + rand() * 46, w = 5 + rand() * 6;
    drips.push(`M${x - w / 2} ${y0} q${-w * 0.2} ${len * 0.5} ${w * 0.15} ${len} a${w / 2} ${w / 2} 0 0 0 ${w * 0.7} 0 q${w * 0.35} ${-len * 0.5} ${w * 0.05} ${-len} z`);
  }
  const dots = [];
  for (let i = 0; i < 26; i++) {
    const a = rand() * Math.PI * 2, r = 150 + rand() * 60;
    dots.push({ x: 200 + Math.cos(a) * r * 1.15, y: 140 + Math.sin(a) * r * 0.78, r: 1.2 + rand() * 4.2, o: 0.35 + rand() * 0.6, c: rand() < 0.35 ? props.accent : props.color });
  }
  return { main, halo, bleed, hi, drips, dots, seedNum: 10 + Math.floor(rand() * 90) };
});
</script>

<template>
  <svg class="spray" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <filter :id="uid + 'rough'" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" :seed="art.seedNum" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" :scale="8 + rough * 22" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter :id="uid + 'halo'" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
      <filter :id="uid + 'soft'" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>
    <!-- airbrush overspray -->
    <path :d="art.halo" :fill="accent" opacity=".38" :filter="`url(#${uid}halo)`" />
    <path :d="art.main" :fill="color" opacity=".55" :filter="`url(#${uid}halo)`" />
    <!-- speckles -->
    <circle v-for="(d, i) in art.dots" :key="i" :cx="d.x" :cy="d.y" :r="d.r" :fill="d.c" :opacity="d.o" />
    <!-- main body: dark outline under a rough-edged fill -->
    <g :filter="`url(#${uid}rough)`">
      <path :d="art.main" fill="#1B2A4A" transform="translate(4 6)" opacity=".85" />
      <path :d="art.main" :fill="color" stroke="#1B2A4A" stroke-width="5" />
      <path v-for="(d, i) in art.drips" :key="'d' + i" :d="d" :fill="color" stroke="#1B2A4A" stroke-width="3" />
      <path :d="art.bleed" :fill="accent" opacity=".85" :filter="`url(#${uid}soft)`" />
      <path :d="art.hi" fill="#ffffff" opacity=".28" :filter="`url(#${uid}soft)`" />
    </g>
  </svg>
</template>

<style scoped>
.spray { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
</style>
