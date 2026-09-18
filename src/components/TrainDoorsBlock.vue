<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { onScroll, getScrollY } from '../composables/useLenisScroll.js';
import { emitter, EVENTS } from '../core/events.js';
import { app } from '../core/App.js';
import { onlinePS, domainById } from '../data/hackathon.js';
import TrainSvg from './train/TrainSvg.vue';
import { layout, VIEW, PHASES, carX } from './train/trainDoorsLayout.js';

// Scroll-scrubbed "train wipe": the section is 600vh tall with a sticky 100vh
// stage. Progress 0..1 across the section drives the train in from the right,
// stops it at each of its four doors (one per domain) which slide open to show
// that domain's Round 1 problem statement, then rolls it off to the left. The
// section overlaps the next one (Timeline) by 100vh and its stage goes
// transparent during the exit so the train reveals the timeline behind it.
const TRAIN_H = 0.82;      // train height as a fraction of the stage height
const MOBILE_MAX = 900;    // below this width the text lives in a bottom sheet

// "expected solution": the strong framing when the PS has one, else its MVP scope,
// else the workflow chain — not every online PS carries all three fields
const expectedOf = (ps) => ps.strong || ps.mvp || (ps.flow ? ps.flow.join(' → ') : '');
const items = computed(() => onlinePS.slice(0, 4).map((ps) => ({ ...ps, dom: domainById(ps.domain), expected: expectedOf(ps) })));
const labels = computed(() => items.value.map((it) => it.dom.short));

const rootRef = ref(null);
const stageRef = ref(null);
const trainWrapRef = ref(null);
const trainRef = ref(null);
const wallRef = ref(null);
const panelRefs = ref([]);
const mobile = ref(false);
const active = ref(-1);

let top = 0, height = 0, scale = 1, vw = 0, vh = 0;
let unScroll = null;
let last = null;
let pinState = '';

function measure() {
  const el = rootRef.value;
  if (!el) return;
  vw = window.innerWidth; vh = window.innerHeight;
  mobile.value = vw < MOBILE_MAX;
  const trainH = mobile.value ? 0.6 : TRAIN_H;
  height = el.offsetHeight;
  scale = (vh * trainH) / VIEW.H;
  positionPanels();
  last = null;
  update(getScrollY());
}

// place each HTML panel exactly over its door slot (px, relative to the train wrapper)
function positionPanels() {
  panelRefs.value.forEach((p, i) => {
    if (!p) return;
    p.style.left = `${(carX(i) + VIEW.DOOR_X) * scale}px`;
    p.style.top = `${VIEW.DOOR_Y * scale}px`;
    p.style.width = `${VIEW.DOOR_W * scale}px`;
    p.style.height = `${VIEW.DOOR_H * scale}px`;
  });
}

function update(scrollY) {
  const wrap = trainWrapRef.value;
  if (!wrap || !rootRef.value || !vh) return;
  // document offset re-read every tick: the page above shifts as media / fonts load
  top = rootRef.value.getBoundingClientRect().top + window.scrollY;
  height = rootRef.value.offsetHeight;
  const p = Math.min(1, Math.max(0, (scrollY - top) / Math.max(1, height - vh)));
  // pin the stage: `main.app` has overflow-x hidden, which breaks position: sticky,
  // so the stage is fixed while the section spans the viewport and absolute otherwise
  const pin = scrollY < top ? 'before' : scrollY > top + height - vh ? 'after' : 'fixed';
  if (pin !== pinState) { pinState = pin; stageRef.value?.setAttribute('data-pin', pin); }
  const L = layout(p, { scale, vw });
  wrap.style.transform = `translate3d(${L.x}px, 0, 0)`;
  if (wallRef.value) wallRef.value.style.transform = `translate3d(${L.x * 0.08}px, 0, 0)`;
  let a = -1;
  for (let i = 0; i < 4; i++) {
    if (!last || last.doors[i] !== L.doors[i]) trainRef.value?.setDoor(i, L.doors[i]);
    const panel = panelRefs.value[i];
    if (panel) {
      panel.style.opacity = L.panels[i];
      panel.style.transform = `translateY(${(1 - L.panels[i]) * 12}px)`;
      panel.style.pointerEvents = L.panels[i] > 0.9 ? 'auto' : 'none';
    }
    if (L.panels[i] > 0) a = i;
  }
  active.value = a;
  // fade the stage out during the exit so the Timeline underneath shows through
  const reveal = L.phase === 'exit' ? Math.min(1, (p - PHASES.exitStart) / 0.08) : 0;
  stageRef.value?.style.setProperty('--stage-alpha', String(1 - reveal));
  last = L;
}

onMounted(() => {
  measure();
  unScroll = onScroll(update);
  emitter.on(EVENTS.RESIZE, measure);
  emitter.on(EVENTS.LAYOUT_REFRESH, measure);
  emitter.on(EVENTS.LOADER_REVEAL_COMPLETE, measure);
  requestAnimationFrame(() => { app.refreshScrollLayout?.(); measure(); });
});
onUnmounted(() => {
  unScroll?.();
  emitter.off(EVENTS.RESIZE, measure);
  emitter.off(EVENTS.LAYOUT_REFRESH, measure);
  emitter.off(EVENTS.LOADER_REVEAL_COMPLETE, measure);
});
</script>

<template>
  <section v-if="items.length" class="trainBlock" :class="{ 'is-mobile': mobile }" ref="rootRef">
    <div class="trainBlock__stage" ref="stageRef">
      <div class="trainBlock__wall" ref="wallRef" aria-hidden="true">
        <img src="/assets/imprints/imprint-1.webp" alt="" style="left:8%;top:12%;width:22vw;transform:rotate(-6deg)" />
        <img src="/assets/imprints/imprint-4.webp" alt="" style="left:58%;top:8%;width:26vw;transform:rotate(4deg)" />
        <img src="/assets/imprints/imprint-6.webp" alt="" style="left:34%;top:58%;width:20vw;transform:rotate(-3deg)" />
      </div>
      <p class="trainBlock__eyebrow">Round 1 · Online · one problem statement per domain</p>

      <div class="trainBlock__train" ref="trainWrapRef">
        <TrainSvg ref="trainRef" :labels="labels" />
        <div class="trainBlock__panels">
          <article v-for="(it, i) in items" :key="it.code + it.domain" class="doorPanel" :ref="el => panelRefs[i] = el">
            <p class="doorPanel__tag">{{ it.dom.short }}</p>
            <p class="doorPanel__code">{{ it.code }} · {{ it.dom.name }}</p>
            <h3 class="doorPanel__title">{{ it.title }}</h3>
            <p class="doorPanel__problem">{{ it.problem }}</p>
            <p class="doorPanel__label">Expected solution</p>
            <p class="doorPanel__strong">{{ it.expected }}</p>
          </article>
        </div>
      </div>

      <div class="trainBlock__rails" aria-hidden="true"></div>

      <!-- mobile: the door slot is too narrow, show the active PS as a bottom sheet -->
      <article v-if="mobile && active >= 0" class="doorSheet">
        <p class="doorPanel__tag">{{ items[active].dom.short }}</p>
        <p class="doorPanel__code">{{ items[active].code }} · {{ items[active].dom.name }}</p>
        <h3 class="doorPanel__title">{{ items[active].title }}</h3>
        <p class="doorPanel__problem">{{ items[active].problem }}</p>
        <p class="doorPanel__label">Expected solution</p>
        <p class="doorPanel__strong">{{ items[active].expected }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.trainBlock { position: relative; z-index: 3; height: 600vh; margin-bottom: -100vh; pointer-events: none; }
.trainBlock.is-mobile { height: 500vh; }
.trainBlock__stage { --stage-alpha: 1; position: absolute; top: 0; left: 0; width: 100%; height: 100vh; overflow: hidden; background: rgba(247, 247, 247, var(--stage-alpha)); }
.trainBlock__stage[data-pin="fixed"] { position: fixed; }
.trainBlock__stage[data-pin="after"] { top: auto; bottom: 0; }
.trainBlock__wall { position: absolute; inset: 0; opacity: calc(var(--stage-alpha) * .5); will-change: transform; }
.trainBlock__wall img { position: absolute; mix-blend-mode: multiply; opacity: .55; }
.trainBlock__eyebrow { position: absolute; bottom: 3vh; left: 0; right: 0; text-align: center; font-family: text, sans-serif; font-size: .8rem; letter-spacing: .18em; text-transform: uppercase; color: var(--c-navy); opacity: calc(var(--stage-alpha) * .55); }
.trainBlock__train { position: absolute; left: 0; top: 9vh; height: 82vh; width: max-content; will-change: transform; }
.trainBlock__panels { position: absolute; inset: 0; }
.trainBlock__rails { position: absolute; left: 0; right: 0; top: calc(9vh + 82vh * (562 / 620)); height: 8vh; background: linear-gradient(#5A6870 0 12%, #2E393F 12% 22%, transparent 22% 55%, #8A8378 55% 62%, #5C564D 62%); opacity: var(--stage-alpha); }
.trainBlock__rails::before { content: ''; position: absolute; left: 0; right: 0; top: 22%; height: 33%; background: repeating-linear-gradient(90deg, #4A3F33 0 26px, transparent 26px 70px); }

.doorPanel { position: absolute; box-sizing: border-box; padding: clamp(10px, 1.3vw, 20px); overflow-y: auto; color: #F7F7F7; opacity: 0; font-family: text, sans-serif; background: linear-gradient(#141a1e, #1B2A4A); }
.doorPanel__tag { font-family: 'Rubik Spray Paint', 'Permanent Marker', Impact, sans-serif; font-size: clamp(16px, 1.5vw, 26px); color: var(--c-brand); text-transform: uppercase; letter-spacing: .04em; }
.doorPanel__code { font-size: clamp(9px, .7vw, 12px); letter-spacing: .14em; text-transform: uppercase; opacity: .6; margin: .2em 0 .5em; }
.doorPanel__title { font-family: title; font-weight: 500; font-size: clamp(16px, 1.6vw, 28px); line-height: 1; letter-spacing: -.02em; color: var(--c-hazard); margin-bottom: .55em; text-transform: uppercase; }
.doorPanel__problem { font-size: clamp(11px, .9vw, 14px); line-height: 1.4; opacity: .9; }
.doorPanel__label { margin-top: 1em; font-size: clamp(9px, .7vw, 11px); letter-spacing: .16em; text-transform: uppercase; color: var(--c-cyan); }
.doorPanel__strong { font-size: clamp(11px, .9vw, 14px); line-height: 1.4; font-style: italic; margin-top: .25em; color: #FFF3B0; }

.doorSheet { position: absolute; left: 12px; right: 12px; bottom: 12px; max-height: 55vh; overflow-y: auto; padding: 16px; background: linear-gradient(#141a1e, #1B2A4A); color: #F7F7F7; font-family: text, sans-serif; border-radius: 10px; pointer-events: auto; }
.is-mobile .doorPanel { display: none; }
.is-mobile .trainBlock__train { top: 4vh; height: 60vh; }
.is-mobile .trainBlock__rails { top: calc(4vh + 60vh * (560 / 620)); }
</style>
