<script setup>
// Side-view Subway-Surfers-style orange train: four boxy coaches butted together
// (rubber gangways in between), flat shading, a dark skirt that hides the bogies
// (no wheels — like the game's trains), rivets, scratches and grime. Each coach
// has a sprayed domain name, two windows and a double sliding door clipped to
// its frame. Doors are driven imperatively by TrainDoorsBlock via `setDoor`.
import { ref } from 'vue';
import { VIEW, CARS, carX } from './trainDoorsLayout.js';

defineProps({ labels: { type: Array, default: () => [] } });

const cars = Array.from({ length: CARS }, (_, i) => i);
const doorL = ref([]);
const doorR = ref([]);
const DOOR_TRAVEL = VIEW.DOOR_W / 2 + 6;
const HALF = VIEW.DOOR_W / 2;
const W = VIEW.CAR_W;

const imprints = [
  { href: '/assets/imprints/imprint-2.webp', car: 0, x: 60, y: 378, w: 190, r: -5 },
  { href: '/assets/imprints/imprint-5.webp', car: 1, x: 300, y: 372, w: 220, r: 4 },
  { href: '/assets/imprints/imprint-3.webp', car: 2, x: 40, y: 374, w: 200, r: -3 },
  { href: '/assets/imprints/imprint-7.webp', car: 3, x: 320, y: 376, w: 200, r: 6 },
];

// deterministic grime / scratch placement per coach
function rng(seed) { let s = seed * 7919 + 13; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
const grime = cars.map((i) => {
  const r = rng(i + 1);
  const scratches = Array.from({ length: 7 }, () => {
    const x = 20 + r() * (W - 60), y = 120 + r() * 320, l = 20 + r() * 70, a = (r() - 0.5) * 50;
    return { x, y, l, a, o: 0.18 + r() * 0.25 };
  });
  const dirt = Array.from({ length: 5 }, () => ({ x: 20 + r() * (W - 40), y: 430 + r() * 60, rx: 18 + r() * 40, ry: 8 + r() * 14, o: 0.12 + r() * 0.16 }));
  const rivets = [];
  for (let x = 24; x < W - 12; x += 28) rivets.push(x);
  return { scratches, dirt, rivets };
});

function setDoor(i, d) {
  const l = doorL.value[i], r = doorR.value[i];
  if (!l || !r) return;
  l.style.transform = `translateX(${-d * DOOR_TRAVEL}px)`;
  r.style.transform = `translateX(${d * DOOR_TRAVEL}px)`;
}
defineExpose({ setDoor });
</script>

<template>
  <svg class="train" :viewBox="`0 0 ${VIEW.W} ${VIEW.H}`" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
    <defs>
      <linearGradient id="trainGlass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#CFE3EE" /><stop offset=".55" stop-color="#9FBFD0" /><stop offset="1" stop-color="#6B8FA8" />
      </linearGradient>
      <pattern id="trainHazard" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="14" height="28" fill="#F2C230" /><rect x="14" width="14" height="28" fill="#1F262B" />
      </pattern>
      <!-- car-local coordinates, so one clip serves every car -->
      <clipPath id="trainDoorClip">
        <rect :x="VIEW.DOOR_X" :y="VIEW.DOOR_Y" :width="VIEW.DOOR_W" :height="VIEW.DOOR_H" rx="6" />
      </clipPath>
    </defs>

    <g v-for="i in cars" :key="'car' + i" :transform="`translate(${carX(i)} 0)`">
      <!-- skirt: boxy dark base that hides the bogies, down to the rails -->
      <rect x="0" y="468" :width="W" height="96" fill="#2E3A42" />
      <rect x="0" y="468" :width="W" height="10" fill="#1F262B" />
      <rect x="0" y="548" :width="W" height="16" fill="#1F262B" />
      <!-- vents / equipment boxes -->
      <rect x="40" y="492" width="110" height="44" rx="3" fill="#3D4B54" stroke="#1F262B" stroke-width="3" />
      <g v-for="k in 5" :key="'v' + k"><rect :x="48 + (k - 1) * 20" y="500" width="10" height="28" fill="#242D33" /></g>
      <rect x="200" y="486" width="160" height="56" rx="3" fill="#3D4B54" stroke="#1F262B" stroke-width="3" />
      <rect x="212" y="498" width="136" height="6" fill="#242D33" /><rect x="212" y="512" width="136" height="6" fill="#242D33" /><rect x="212" y="526" width="136" height="6" fill="#242D33" />
      <rect x="410" y="492" width="110" height="44" rx="3" fill="#3D4B54" stroke="#1F262B" stroke-width="3" />
      <g v-for="k in 5" :key="'w' + k"><rect :x="418 + (k - 1) * 20" y="500" width="10" height="28" fill="#242D33" /></g>
      <!-- hazard stripe along the bottom edge -->
      <rect x="6" y="540" :width="W - 12" height="8" fill="url(#trainHazard)" opacity=".9" />

      <!-- roof: flat dark cap with an AC unit -->
      <rect x="0" y="66" :width="W" height="40" fill="#3D4B54" />
      <rect x="0" y="66" :width="W" height="8" fill="#55656E" />
      <rect x="170" y="44" width="220" height="30" rx="4" fill="#3D4B54" stroke="#1F262B" stroke-width="3" />
      <rect x="182" y="52" width="196" height="6" fill="#242D33" /><rect x="182" y="62" width="196" height="6" fill="#242D33" />

      <!-- body: flat orange, boxy, thick outline -->
      <rect x="0" y="100" :width="W" height="372" fill="#F27D26" stroke="#1F262B" stroke-width="4" />
      <rect x="0" y="100" :width="W" height="18" fill="#FF9A3C" />
      <rect x="0" y="300" :width="W" height="56" fill="#F2C230" />
      <rect x="0" y="356" :width="W" height="16" fill="#8DB33A" />
      <rect x="0" y="372" :width="W" height="8" fill="#B33B22" />
      <rect x="0" y="440" :width="W" height="32" fill="#D9691A" />
      <!-- rivets -->
      <g fill="#B3561A">
        <circle v-for="x in grime[i].rivets" :key="'r1' + x" :cx="x" cy="112" r="3" />
        <circle v-for="x in grime[i].rivets" :key="'r2' + x" :cx="x" cy="462" r="3" />
      </g>
      <line x1="0" y1="440" :x2="W" y2="440" stroke="#1F262B" stroke-width="3" opacity=".6" />

      <!-- windows: chunky dark frames, flat glass -->
      <g v-for="wx in [30, 440]" :key="'w' + wx">
        <rect :x="wx - 6" y="146" width="102" height="132" rx="6" fill="#1F262B" />
        <rect :x="wx" y="152" width="90" height="120" rx="4" fill="url(#trainGlass)" />
        <path :d="`M${wx + 12} 258 L${wx + 66} 168`" stroke="#fff" stroke-opacity=".5" stroke-width="10" stroke-linecap="round" />
        <rect :x="wx" y="152" width="90" height="120" rx="4" fill="none" stroke="#D4402B" stroke-width="5" />
      </g>

      <!-- door frame + dark interior -->
      <rect :x="VIEW.DOOR_X - 12" :y="VIEW.DOOR_Y - 12" :width="VIEW.DOOR_W + 24" :height="VIEW.DOOR_H + 24" rx="8" fill="#1F262B" />
      <rect :x="VIEW.DOOR_X - 6" :y="VIEW.DOOR_Y - 6" :width="VIEW.DOOR_W + 12" :height="VIEW.DOOR_H + 12" rx="6" fill="#D4402B" />
      <rect :x="VIEW.DOOR_X" :y="VIEW.DOOR_Y" :width="VIEW.DOOR_W" :height="VIEW.DOOR_H" rx="6" fill="#141a1e" />
      <!-- sliding panels, clipped to the frame -->
      <g clip-path="url(#trainDoorClip)">
        <g class="train__door" :ref="el => doorL[i] = el">
          <rect :x="VIEW.DOOR_X" :y="VIEW.DOOR_Y" :width="HALF" :height="VIEW.DOOR_H" fill="#F27D26" />
          <rect :x="VIEW.DOOR_X + 14" :y="VIEW.DOOR_Y + 18" :width="HALF - 28" height="136" rx="4" fill="#1F262B" />
          <rect :x="VIEW.DOOR_X + 20" :y="VIEW.DOOR_Y + 24" :width="HALF - 40" height="124" rx="3" fill="url(#trainGlass)" />
          <rect :x="VIEW.DOOR_X" :y="VIEW.DOOR_Y + 160" :width="HALF" height="56" fill="#F2C230" />
          <rect :x="VIEW.DOOR_X" :y="VIEW.DOOR_Y + 216" :width="HALF" height="16" fill="#8DB33A" />
          <rect :x="VIEW.DOOR_X + HALF - 5" :y="VIEW.DOOR_Y" width="5" :height="VIEW.DOOR_H" fill="#1F262B" />
          <rect :x="VIEW.DOOR_X + HALF - 22" :y="VIEW.DOOR_Y + 250" width="8" height="40" rx="3" fill="#1F262B" />
        </g>
        <g class="train__door" :ref="el => doorR[i] = el">
          <rect :x="VIEW.DOOR_X + HALF" :y="VIEW.DOOR_Y" :width="HALF" :height="VIEW.DOOR_H" fill="#F27D26" />
          <rect :x="VIEW.DOOR_X + HALF + 14" :y="VIEW.DOOR_Y + 18" :width="HALF - 28" height="136" rx="4" fill="#1F262B" />
          <rect :x="VIEW.DOOR_X + HALF + 20" :y="VIEW.DOOR_Y + 24" :width="HALF - 40" height="124" rx="3" fill="url(#trainGlass)" />
          <rect :x="VIEW.DOOR_X + HALF" :y="VIEW.DOOR_Y + 160" :width="HALF" height="56" fill="#F2C230" />
          <rect :x="VIEW.DOOR_X + HALF" :y="VIEW.DOOR_Y + 216" :width="HALF" height="16" fill="#8DB33A" />
          <rect :x="VIEW.DOOR_X + HALF" :y="VIEW.DOOR_Y" width="5" :height="VIEW.DOOR_H" fill="#1F262B" />
          <rect :x="VIEW.DOOR_X + HALF + 14" :y="VIEW.DOOR_Y + 250" width="8" height="40" rx="3" fill="#1F262B" />
        </g>
      </g>

      <!-- sprayed domain name over the door -->
      <text class="train__tag train__tag--shadow" :x="VIEW.DOOR_X + HALF + 3" y="139" text-anchor="middle">{{ labels[i] }}</text>
      <text class="train__tag" :x="VIEW.DOOR_X + HALF" y="136" text-anchor="middle">{{ labels[i] }}</text>

      <!-- graffiti imprint on the lower body -->
      <image v-for="im in imprints.filter(m => m.car === i)" :key="im.href" :href="im.href" :x="im.x" :y="im.y" :width="im.w" height="90" preserveAspectRatio="xMidYMid meet" class="train__imprint" :transform="`rotate(${im.r} ${im.x + im.w / 2} ${im.y + 45})`" />

      <!-- scratches + grime -->
      <g stroke="#FFE2C2" stroke-width="2" stroke-linecap="round">
        <line v-for="(s, k) in grime[i].scratches" :key="'s' + k" :x1="s.x" :y1="s.y" :x2="s.x + s.l" :y2="s.y" :opacity="s.o" :transform="`rotate(${s.a} ${s.x} ${s.y})`" />
      </g>
      <g fill="#1F262B">
        <ellipse v-for="(d, k) in grime[i].dirt" :key="'d' + k" :cx="d.x" :cy="d.y" :rx="d.rx" :ry="d.ry" :opacity="d.o" />
      </g>
      <rect x="0" y="380" :width="W" height="92" fill="#1F262B" opacity=".08" />

      <!-- rubber gangway where this coach meets the previous one -->
      <g v-if="i > 0">
        <rect x="-14" y="100" width="28" height="372" fill="#1F262B" />
        <g v-for="k in 12" :key="'g' + k"><rect x="-10" :y="112 + (k - 1) * 30" width="20" height="14" fill="#2E3A42" /></g>
        <rect x="-18" y="472" width="36" height="92" fill="#1F262B" />
      </g>

      <!-- cab face on the leading (left) end, tail light on the last coach -->
      <g v-if="i === 0">
        <rect x="-6" y="100" width="12" height="372" fill="#1F262B" />
        <rect x="-4" y="170" width="10" height="60" rx="3" fill="#FFF3B0" />
        <rect x="-4" y="240" width="10" height="60" rx="3" fill="#FFF3B0" />
        <ellipse cx="-2" cy="230" rx="70" ry="60" fill="#FFF3B0" opacity=".16" />
      </g>
      <rect v-if="i === CARS - 1" :x="W - 8" y="230" width="10" height="60" rx="3" fill="#FF3B2E" />
    </g>

    <!-- HACK ON TRACKS tag sprayed on the first coach's lower band -->
    <text class="train__hero train__hero--shadow" :x="carX(0) + 30 + 2" y="466">HACK ON TRACKS</text>
    <text class="train__hero" :x="carX(0) + 30" y="464">HACK ON TRACKS</text>
  </svg>
</template>

<style scoped>
.train { display: block; height: 100%; width: auto; overflow: visible; }
.train__door { will-change: transform; }
.train__imprint { mix-blend-mode: multiply; opacity: .85; }
.train__tag { font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; font-size: 34px; letter-spacing: .04em; fill: #1B2A4A; text-transform: uppercase; }
.train__tag--shadow { fill: #7A2E10; }
.train__hero { font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; font-size: 26px; letter-spacing: .08em; fill: #F2C230; }
.train__hero--shadow { fill: #141a1e; }
</style>
