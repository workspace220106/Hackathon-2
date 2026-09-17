<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { onScroll } from '../composables/useLenisScroll.js';
import { emitter, EVENTS } from '../core/events.js';

// Graffiti "imprints" scattered over the white background. They live behind the
// content (pointer-events: none), scroll with the page and drift a little slower
// than it (parallax). Tweak IMPRINTS / OPACITY / PARALLAX to taste.
const props = defineProps({
  // CSS selectors (inside .page) of the white sections the imprints may cover. Empty array = the whole page.
  // Inside a zone a piece is only placed where it does not touch any text or media (see layout()).
  zones: { type: Array, default: () => [] },
  count: { type: Number, default: 12 }, // upper bound — fewer are placed when there is no free room
});

const IMPRINTS = Array.from({ length: 7 }, (_, i) => `/assets/imprints/imprint-${i + 1}.webp`);
const OPACITY = 0.92;
const PARALLAX = 0.12; // fraction of scroll delta the imprints lag behind

const rootRef = ref(null);
const items = ref([]);

// pseudo-random but stable layout (left/right alternation, rotation, size)
// x is % of page width (negative / >40 pushes the piece off the left / right edge), w in vw
// every piece sits fully inside the page: left ones start at x≈3%, right ones end ≈3% before the edge
const LAYOUT = [
  { x: 3, w: 50, r: -6 }, { x: 48, w: 49, r: 5 }, { x: 4, w: 48, r: 4 },
  { x: 47, w: 50, r: -5 }, { x: 3, w: 49, r: 7 }, { x: 49, w: 48, r: -6 }, { x: 4, w: 50, r: 3 },
  { x: 50, w: 46, r: 4 }, { x: 3, w: 49, r: -4 }, { x: 47, w: 50, r: 6 }, { x: 5, w: 46, r: -5 }, { x: 48, w: 49, r: 3 },
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
  const vw = window.innerWidth;
  const imprintW = (w) => Math.min(vw * w / 100, 980);
  const imprintH = (w) => imprintW(w) * 0.55;
  // everything a piece must stay clear of: visible text and media inside the zones (+ padding)
  const PAD = 28;
  const pageRect = page.getBoundingClientRect();
  const content = [...page.querySelectorAll('h1,h2,h3,h4,p,span,a,button,strong,li,img,video,canvas,svg,input,textarea,label')]
    .filter((el) => !el.closest('.imprints') && (el.children.length === 0 || /^(IMG|VIDEO|CANVAS|SVG)$/.test(el.tagName)))
    .filter((el) => { const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden'; })
    .map((el) => { const r = el.getBoundingClientRect(); return { l: r.left - pageRect.left - PAD, t: r.top - pageTop - PAD, r: r.right - pageRect.left + PAD, b: r.bottom - pageTop + PAD }; })
    .filter((r) => r.r - r.l > 2 * PAD + 4 && r.b - r.t > 2 * PAD + 4);
  const hits = (box) => content.some((c) => box.l < c.r && box.r > c.l && box.t < c.b && box.b > c.t);
  const placed = [];
  const clashes = (box) => placed.some((c) => box.l < c.r + PAD && box.r > c.l - PAD && box.t < c.b + PAD && box.b > c.t - PAD);
  // walk the zones top→bottom; at each step try the piece at full size, then smaller, on its
  // side / the other side / centred, and take the first placement that touches nothing
  const out = [];
  let k = 0;
  const STEP = 36, SCALES = [1, 0.8, 0.62, 0.48];
  // the fixed navbar covers the first ~110px of a section when it lands at the top of the viewport
  const NAV_INSET = 110;
  for (const z of zones) {
    let y = z.top + NAV_INSET;
    while (out.length < n && y < z.top + z.height) {
      const l = LAYOUT[k % LAYOUT.length];
      let hit = null;
      for (const sc of SCALES) {
        const wv = l.w * sc, w = imprintW(wv), h = imprintH(wv);
        if (y + h > z.top + z.height) continue;
        const xs = l.x < 50 ? [3, 100 - wv - 3, 50 - wv / 2] : [100 - wv - 3, 3, 50 - wv / 2];
        for (const xp of xs) {
          const left = vw * xp / 100;
          const box = { l: left, t: y, r: left + w, b: y + h };
          if (!hits(box) && !clashes(box)) { hit = { box, xp, wv, h }; break; }
        }
        if (hit) break;
      }
      if (hit) {
        out.push({ src: IMPRINTS[k % IMPRINTS.length], top: y, x: hit.xp, w: hit.wv, r: l.r, speed: PARALLAX * (0.6 + (k % 3) * 0.3) });
        placed.push(hit.box); k++; y += hit.h * 0.5;
      } else {
        y += STEP;
      }
    }
  }
  items.value = out;
}
let unScroll = null;
const onScrolled = (y) => {
  const els = rootRef.value?.children;
  if (!els) return;
  // parallax relative to each piece's own spot: 0 when it is centred in the viewport,
  // so it lags a little while on screen but never drifts out of its white zone
  const mid = y + window.innerHeight / 2;
  for (let i = 0; i < els.length; i++) {
    const it = items.value[i];
    const off = (mid - (it.top + els[i].offsetHeight / 2)) * it.speed;
    els[i].style.transform = `translate3d(0, ${(-off).toFixed(1)}px, 0) rotate(${it.r}deg)`;
  }
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
.imprints__item { position: absolute; max-width: 980px; height: auto; will-change: transform; filter: saturate(1.05) drop-shadow(0 6px 18px rgba(27, 42, 74, .08)); }
</style>
