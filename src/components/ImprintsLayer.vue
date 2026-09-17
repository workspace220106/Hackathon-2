<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { onScroll } from '../composables/useLenisScroll.js';
import { emitter, EVENTS } from '../core/events.js';

// Graffiti "imprints" scattered over the white background. They live behind the
// content (pointer-events: none), scroll with the page and drift a little slower
// than it (parallax). Tweak IMPRINTS / OPACITY / PARALLAX to taste.
const props = defineProps({
  // CSS selectors (inside .page) of the white sections the imprints may cover.
  // Imprints are distributed across these zones proportionally to their height.
  // Empty array = the whole page.
  zones: { type: Array, default: () => [] },
  count: { type: Number, default: 8 }, // images repeat (cycled) beyond the 7 unique ones
});

const IMPRINTS = Array.from({ length: 7 }, (_, i) => `/assets/imprints/imprint-${i + 1}.webp`);
const OPACITY = 0.8;
const PARALLAX = 0.12; // fraction of scroll delta the imprints lag behind

const rootRef = ref(null);
const items = ref([]);

// pseudo-random but stable layout (left/right alternation, rotation, size)
// x is % of page width (negative / >40 pushes the piece off the left / right edge), w in vw
// pieces hug the left/right margins (x ≈ -15 or ≈ 80) so the centre column stays clean
const LAYOUT = [
  { x: -14, w: 34, r: -6 }, { x: 80, w: 32, r: 5 }, { x: -18, w: 30, r: 4 },
  { x: 82, w: 34, r: -5 }, { x: -12, w: 32, r: 7 }, { x: 84, w: 30, r: -6 }, { x: -16, w: 34, r: 3 },
  { x: 80, w: 32, r: 4 }, { x: -14, w: 30, r: -4 }, { x: 82, w: 34, r: 6 }, { x: -18, w: 32, r: -5 }, { x: 84, w: 30, r: 3 },
];

function layout() {
  const page = rootRef.value?.parentElement;
  if (!page) return;
  const pageTop = page.getBoundingClientRect().top;
  // zones as {top, height} relative to the page
  let zones = props.zones
    .map((sel) => page.querySelector(sel))
    .filter(Boolean)
    .map((el) => { const r = el.getBoundingClientRect(); return { top: r.top - pageTop, height: r.height }; })
    .filter((z) => z.height > 0);
  if (!zones.length) zones = [{ top: 0, height: page.scrollHeight }];
  const n = props.count;
  const imprintH = (w) => Math.min(window.innerWidth * w / 100, 640) * 0.55;
  const avgH = imprintH(32);
  // capacity per zone (imprints may overlap a little), then distribute proportionally within capacity
  const caps = zones.map((z) => Math.max(1, Math.round(z.height / (avgH * 0.35))));
  const total = zones.reduce((a, z) => a + z.height, 0);
  let counts = zones.map((z, i) => Math.min(caps[i], Math.max(1, Math.round((z.height / total) * n))));
  let sum = counts.reduce((a, b) => a + b, 0);
  for (let i = 0; sum < n && i < zones.length * 4; i++) { const zi = i % zones.length; if (counts[zi] < caps[zi]) { counts[zi]++; sum++; } }
  while (sum > n) { const zi = counts.indexOf(Math.max(...counts)); counts[zi]--; sum--; }
  const out = [];
  let k = 0;
  zones.forEach((z, zi) => {
    const c = counts[zi];
    const slot = z.height / c;
    for (let j = 0; j < c && k < n; j++, k++) {
      const l = LAYOUT[k % LAYOUT.length];
      const top = z.top + slot * j + (slot - imprintH(l.w)) / 2; // centred in an equal slot
      out.push({ src: IMPRINTS[k % IMPRINTS.length], top, x: l.x, w: l.w, r: l.r, speed: PARALLAX * (0.6 + (k % 3) * 0.3) });
    }
  });
  items.value = out;
}
let unScroll = null;
const onScrolled = (y) => {
  const els = rootRef.value?.children;
  if (!els) return;
  for (let i = 0; i < els.length; i++) els[i].style.transform = `translate3d(0, ${(-y * items.value[i].speed).toFixed(1)}px, 0) rotate(${items.value[i].r}deg)`;
};
let ro = null;
onMounted(() => {
  layout();
  requestAnimationFrame(layout);
  emitter.on(EVENTS.RESIZE, layout);
  emitter.on(EVENTS.LAYOUT_REFRESH, layout);
  emitter.on(EVENTS.LOADER_REVEAL_COMPLETE, layout);
  // the page grows as fonts/media settle — follow it
  if (rootRef.value?.parentElement && 'ResizeObserver' in window) { ro = new ResizeObserver(() => layout()); ro.observe(rootRef.value.parentElement); }
  unScroll = onScroll(onScrolled);
});
onUnmounted(() => { emitter.off(EVENTS.RESIZE, layout); emitter.off(EVENTS.LAYOUT_REFRESH, layout); emitter.off(EVENTS.LOADER_REVEAL_COMPLETE, layout); ro?.disconnect(); unScroll?.(); });
</script>

<template>
  <div class="imprints" ref="rootRef" aria-hidden="true">
    <img v-for="(it, i) in items" :key="i" :src="it.src" class="imprints__item" loading="lazy" decoding="async"
      :style="{ top: it.top + 'px', left: it.x + '%', width: it.w + 'vw', opacity: OPACITY }" alt="" />
  </div>
</template>

<style scoped>
.imprints { position: absolute; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; }
.imprints__item { position: absolute; max-width: 640px; min-width: 220px; height: auto; will-change: transform; filter: saturate(1.05) drop-shadow(0 6px 18px rgba(27, 42, 74, .08)); }
</style>
