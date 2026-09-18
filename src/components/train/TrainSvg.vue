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

// graffiti imprints per coach: the coach's own domain word big on the lower
// body, plus smaller tags on the upper panels and the skirt
const imprints = [
  { href: '/assets/imprints/imprint-1.webp', car: 0, x: 20, y: 372, w: 250, h: 100, r: -4 },
  { href: '/assets/imprints/imprint-7.webp', car: 0, x: 380, y: 380, w: 150, h: 80, r: 5 },
  { href: '/assets/imprints/imprint-5.webp', car: 0, x: 200, y: 470, w: 150, h: 60, r: 0, skirt: true },
  { href: '/assets/imprints/imprint-4.webp', car: 1, x: 290, y: 370, w: 250, h: 100, r: 4 },
  { href: '/assets/imprints/imprint-6.webp', car: 1, x: 20, y: 380, w: 150, h: 84, r: -6 },
  { href: '/assets/imprints/imprint-2.webp', car: 1, x: 40, y: 468, w: 150, h: 60, r: 0, skirt: true },
  { href: '/assets/imprints/imprint-3.webp', car: 2, x: 20, y: 368, w: 250, h: 104, r: -3 },
  { href: '/assets/imprints/imprint-5.webp', car: 2, x: 380, y: 382, w: 150, h: 80, r: 6 },
  { href: '/assets/imprints/imprint-7.webp', car: 2, x: 400, y: 470, w: 150, h: 60, r: 0, skirt: true },
  { href: '/assets/imprints/imprint-2.webp', car: 3, x: 280, y: 372, w: 260, h: 100, r: 5 },
  { href: '/assets/imprints/imprint-6.webp', car: 3, x: 20, y: 382, w: 150, h: 84, r: -5 },
  { href: '/assets/imprints/imprint-1.webp', car: 3, x: 200, y: 470, w: 150, h: 60, r: 0, skirt: true },
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
      <linearGradient id="trainGraf" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#FF3FA4" /><stop offset=".2" stop-color="#FF5A2E" /><stop offset=".4" stop-color="#FFC300" />
        <stop offset=".6" stop-color="#8DE21C" /><stop offset=".8" stop-color="#00E5D0" /><stop offset="1" stop-color="#B04CFF" />
      </linearGradient>
      <linearGradient id="trainGrafShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".55" /><stop offset=".5" stop-color="#fff" stop-opacity="0" /><stop offset="1" stop-color="#000" stop-opacity=".25" />
      </linearGradient>
      <filter id="trainGrafHalo" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="16" /></filter>
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
      <image v-for="(im, k) in imprints.filter(m => m.car === i)" :key="'im' + k" :href="im.href" :x="im.x" :y="im.y" :width="im.w" :height="im.h" preserveAspectRatio="xMidYMid meet" class="train__imprint" :class="{ 'train__imprint--skirt': im.skirt }" :transform="`rotate(${im.r} ${im.x + im.w / 2} ${im.y + im.h / 2})`" />

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

    <!-- big "DOMAINS" pieces sprayed across the coach joints (between the doors), imprint-style:
         airbrush halo, 3D extrusion, thick outline, rainbow fill, highlight, drips -->
    <g v-for="(px, k) in [carX(1), carX(3)]" :key="'piece' + k" class="train__piece" :transform="`translate(${px} 456) scale(.44) rotate(${k ? 3 : -3})`">
      <text class="piece__txt" x="0" y="0" text-anchor="middle" fill="#FF3FA4" opacity=".7" filter="url(#trainGrafHalo)">DOMAINS</text>
      <text class="piece__txt" x="0" y="0" text-anchor="middle" fill="#00E5D0" opacity=".55" filter="url(#trainGrafHalo)" transform="translate(40 30)">DOMAINS</text>
      <g fill="#1B2A4A">
        <text v-for="k in 7" :key="'ex' + k" class="piece__txt" :x="k * 3" :y="k * 3" text-anchor="middle">DOMAINS</text>
      </g>
      <text class="piece__txt" x="0" y="0" text-anchor="middle" fill="none" stroke="#1B2A4A" stroke-width="22" stroke-linejoin="round">DOMAINS</text>
      <text class="piece__txt" x="0" y="0" text-anchor="middle" fill="url(#trainGraf)">DOMAINS</text>
      <text class="piece__txt" x="0" y="0" text-anchor="middle" fill="url(#trainGrafShade)">DOMAINS</text>
      <text class="piece__txt" x="-4" y="-5" text-anchor="middle" fill="none" stroke="#fff" stroke-width="3" stroke-opacity=".7">DOMAINS</text>
      <!-- drips -->
      <g fill="#FF3FA4"><path d="M-330 14 q-6 40 2 70 a7 7 0 0 0 12 0 q4 -30 -2 -70 z" /><path d="M120 12 q-5 30 1 52 a6 6 0 0 0 10 0 q3 -22 -1 -52 z" fill="#FFC300" /><path d="M300 10 q-6 48 2 84 a7 7 0 0 0 12 0 q4 -36 -2 -84 z" fill="#00E5D0" /><path d="M-120 12 q-4 26 1 44 a5 5 0 0 0 8 0 q3 -18 -1 -44 z" fill="#8DE21C" /></g>
      <!-- stars + speckles -->
      <g fill="#FFC300"><path d="M-400 -150 l6 14 15 1 -12 9 4 15 -13 -9 -13 9 4 -15 -12 -9 15 -1z" /><path d="M380 -120 l5 11 12 1 -9 7 3 12 -11 -7 -11 7 3 -12 -9 -7 12 -1z" fill="#FF3FA4" /></g>
      <g fill="#B04CFF"><circle cx="-420" cy="-40" r="6" /><circle cx="-380" cy="20" r="4" /><circle cx="410" cy="-30" r="5" /><circle cx="430" cy="40" r="3" /><circle cx="-60" cy="-160" r="4" fill="#00E5D0" /><circle cx="200" cy="-150" r="5" fill="#FF5A2E" /></g>
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
.train__imprint--skirt { mix-blend-mode: normal; opacity: .9; }
.train__tag { font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; font-size: 34px; letter-spacing: .04em; fill: #1B2A4A; text-transform: uppercase; }
.train__tag--shadow { fill: #7A2E10; }
.piece__txt { font-family: 'Bangers', 'Rubik Spray Paint', Impact, sans-serif; font-size: 190px; letter-spacing: .04em; }
.train__hero { font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; font-size: 26px; letter-spacing: .08em; fill: #F2C230; }
.train__hero--shadow { fill: #141a1e; }
</style>
