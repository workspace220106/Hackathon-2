<script setup>
// Side-view Subway-Surfers-style orange train: 4 cars, each with a sprayed domain
// name, two windows, and a double sliding door clipped to its frame. Doors and
// wheels are driven imperatively by TrainDoorsBlock through the exposed setters.
import { ref } from 'vue';
import { VIEW, CARS, carX } from './trainDoorsLayout.js';

defineProps({ labels: { type: Array, default: () => [] } });

const cars = Array.from({ length: CARS }, (_, i) => i);
const doorL = ref([]);
const doorR = ref([]);
const wheels = [];
let unitScale = 1;
const DOOR_TRAVEL = VIEW.DOOR_W / 2 + 6;
const CIRC = 2 * Math.PI * VIEW.WHEEL_R;
const HALF = VIEW.DOOR_W / 2;

const imprints = [
  { href: '/assets/imprints/imprint-2.webp', car: 0, x: 60, y: 372, w: 190, r: -5 },
  { href: '/assets/imprints/imprint-5.webp', car: 1, x: 300, y: 365, w: 220, r: 4 },
  { href: '/assets/imprints/imprint-3.webp', car: 2, x: 40, y: 368, w: 200, r: -3 },
  { href: '/assets/imprints/imprint-7.webp', car: 3, x: 320, y: 370, w: 200, r: 6 },
];

function setDoor(i, d) {
  const l = doorL.value[i], r = doorR.value[i];
  if (!l || !r) return;
  l.style.transform = `translateX(${-d * DOOR_TRAVEL}px)`;
  r.style.transform = `translateX(${d * DOOR_TRAVEL}px)`;
}
function setScale(s) { unitScale = s || 1; }
function setWheels(px) {
  const deg = (-(px / unitScale) / CIRC) * 360;
  for (const w of wheels) w.style.transform = `rotate(${deg}deg)`;
}
function addWheel(el) { if (el && !wheels.includes(el)) wheels.push(el); }
defineExpose({ setDoor, setWheels, setScale });
</script>

<template>
  <svg class="train" :viewBox="`0 0 ${VIEW.W} ${VIEW.H}`" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
    <defs>
      <linearGradient id="trainBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FF9A3C" /><stop offset=".55" stop-color="#F27D26" /><stop offset="1" stop-color="#C95F16" />
      </linearGradient>
      <linearGradient id="trainGlass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#D8E6EE" /><stop offset=".5" stop-color="#B8CBD6" /><stop offset="1" stop-color="#7FA0B5" />
      </linearGradient>
      <!-- car-local coordinates, so one clip serves every car -->
      <clipPath id="trainDoorClip">
        <rect :x="VIEW.DOOR_X" :y="VIEW.DOOR_Y" :width="VIEW.DOOR_W" :height="VIEW.DOOR_H" rx="10" />
      </clipPath>
    </defs>

    <!-- coupling bars between cars -->
    <rect v-for="i in cars.slice(1)" :key="'link' + i" :x="carX(i) - VIEW.CAR_GAP - 8" y="330" :width="VIEW.CAR_GAP + 16" height="26" fill="#2A353B" />

    <g v-for="i in cars" :key="'car' + i" :transform="`translate(${carX(i)} 0)`">
      <!-- roof -->
      <rect x="6" y="72" :width="VIEW.CAR_W - 12" height="40" rx="14" fill="#3C4A52" />
      <rect x="40" y="62" width="120" height="16" rx="6" fill="#55656E" />
      <rect x="400" y="62" width="120" height="16" rx="6" fill="#55656E" />
      <!-- body -->
      <rect x="0" y="95" :width="VIEW.CAR_W" height="380" rx="28" fill="url(#trainBody)" />
      <rect x="0" y="300" :width="VIEW.CAR_W" height="52" fill="#F2C230" />
      <rect x="0" y="352" :width="VIEW.CAR_W" height="14" fill="#8DB33A" />
      <rect x="0" y="366" :width="VIEW.CAR_W" height="6" fill="#B33B22" />
      <line x1="16" y1="118" :x2="VIEW.CAR_W - 16" y2="118" stroke="#C95F16" stroke-width="3" stroke-dasharray="2 14" />

      <!-- windows -->
      <g v-for="wx in [30, 440]" :key="'w' + wx">
        <rect :x="wx" y="150" width="90" height="120" rx="12" fill="#D4402B" />
        <rect :x="wx + 8" y="158" width="74" height="104" rx="8" fill="url(#trainGlass)" />
        <path :d="`M${wx + 14} 244 L${wx + 74} 168`" stroke="#fff" stroke-opacity=".45" stroke-width="10" stroke-linecap="round" />
      </g>

      <!-- door frame + dark interior -->
      <rect :x="VIEW.DOOR_X - 10" :y="VIEW.DOOR_Y - 10" :width="VIEW.DOOR_W + 20" :height="VIEW.DOOR_H + 20" rx="16" fill="#D4402B" />
      <rect :x="VIEW.DOOR_X" :y="VIEW.DOOR_Y" :width="VIEW.DOOR_W" :height="VIEW.DOOR_H" rx="10" fill="#141a1e" />
      <!-- sliding panels, clipped to the frame -->
      <g clip-path="url(#trainDoorClip)">
        <g class="train__door" :ref="el => doorL[i] = el">
          <rect :x="VIEW.DOOR_X" :y="VIEW.DOOR_Y" :width="HALF" :height="VIEW.DOOR_H" fill="#F27D26" />
          <rect :x="VIEW.DOOR_X + 18" :y="VIEW.DOOR_Y + 22" :width="HALF - 36" height="130" rx="8" fill="url(#trainGlass)" />
          <rect :x="VIEW.DOOR_X" :y="VIEW.DOOR_Y + 160" :width="HALF" height="52" fill="#F2C230" />
          <rect :x="VIEW.DOOR_X" :y="VIEW.DOOR_Y + 212" :width="HALF" height="14" fill="#8DB33A" />
          <rect :x="VIEW.DOOR_X + HALF - 6" :y="VIEW.DOOR_Y" width="6" :height="VIEW.DOOR_H" fill="#B33B22" />
        </g>
        <g class="train__door" :ref="el => doorR[i] = el">
          <rect :x="VIEW.DOOR_X + HALF" :y="VIEW.DOOR_Y" :width="HALF" :height="VIEW.DOOR_H" fill="#F27D26" />
          <rect :x="VIEW.DOOR_X + HALF + 18" :y="VIEW.DOOR_Y + 22" :width="HALF - 36" height="130" rx="8" fill="url(#trainGlass)" />
          <rect :x="VIEW.DOOR_X + HALF" :y="VIEW.DOOR_Y + 160" :width="HALF" height="52" fill="#F2C230" />
          <rect :x="VIEW.DOOR_X + HALF" :y="VIEW.DOOR_Y + 212" :width="HALF" height="14" fill="#8DB33A" />
          <rect :x="VIEW.DOOR_X + HALF" :y="VIEW.DOOR_Y" width="6" :height="VIEW.DOOR_H" fill="#B33B22" />
        </g>
      </g>

      <!-- sprayed domain name over the door -->
      <text class="train__tag train__tag--shadow" :x="VIEW.DOOR_X + HALF + 3" y="131" text-anchor="middle">{{ labels[i] }}</text>
      <text class="train__tag" :x="VIEW.DOOR_X + HALF" y="128" text-anchor="middle">{{ labels[i] }}</text>

      <!-- graffiti imprint on the lower body -->
      <image v-for="im in imprints.filter(m => m.car === i)" :key="im.href" :href="im.href" :x="im.x" :y="im.y" :width="im.w" height="96" preserveAspectRatio="xMidYMid meet" class="train__imprint" :transform="`rotate(${im.r} ${im.x + im.w / 2} ${im.y + 48})`" />

      <!-- undercarriage + bogies -->
      <rect x="10" y="470" :width="VIEW.CAR_W - 20" height="34" rx="6" fill="#3C4A52" />
      <g v-for="bx in [90, 470]" :key="'b' + bx">
        <rect :x="bx - 60" y="496" width="120" height="22" rx="6" fill="#2A353B" />
        <g v-for="off in [-34, 34]" :key="'wh' + off" class="train__wheel" :ref="addWheel" :style="{ transformOrigin: `${bx + off}px 540px` }">
          <circle :cx="bx + off" cy="540" :r="VIEW.WHEEL_R" fill="#1F2A30" stroke="#55656E" stroke-width="5" />
          <circle :cx="bx + off" cy="540" r="7" fill="#8E9AA1" />
          <line :x1="bx + off" y1="520" :x2="bx + off" y2="560" stroke="#55656E" stroke-width="4" />
        </g>
      </g>

      <!-- headlights on the leading (left) end, tail light on the last car -->
      <g v-if="i === 0">
        <ellipse cx="8" cy="250" rx="14" ry="22" fill="#FFF3B0" />
        <ellipse cx="8" cy="250" rx="60" ry="26" fill="#FFF3B0" opacity=".18" />
      </g>
      <rect v-if="i === CARS - 1" :x="VIEW.CAR_W - 14" y="236" width="10" height="28" rx="4" fill="#FF3B2E" />
    </g>

    <!-- HACK ON TRACKS tag sprayed on the first car's undercarriage skirt -->
    <text class="train__hero train__hero--shadow" :x="carX(0) + 30 + 2" y="498">HACK ON TRACKS</text>
    <text class="train__hero" :x="carX(0) + 30" y="496">HACK ON TRACKS</text>
  </svg>
</template>

<style scoped>
.train { display: block; height: 100%; width: auto; overflow: visible; }
.train__door { will-change: transform; }
.train__wheel { will-change: transform; }
.train__imprint { mix-blend-mode: multiply; opacity: .85; }
.train__tag { font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; font-size: 34px; letter-spacing: .04em; fill: #1B2A4A; text-transform: uppercase; }
.train__tag--shadow { fill: #7A2E10; }
.train__hero { font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; font-size: 26px; letter-spacing: .08em; fill: #F2C230; }
.train__hero--shadow { fill: #141a1e; }
</style>
