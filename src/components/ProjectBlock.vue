<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { DOMAIN_PS_BLOCKS } from '../data/psBlocksData.js';
import { emitter, EVENTS } from '../core/events.js';
import { app } from '../core/App.js';

const props = defineProps({
  title: { type: String, default: null },
  cursorIndication: { type: String, default: 'Drag' },
  projectIndex: { type: Number, default: 0 },
  name: { type: String, default: '' },
  type: { type: String, default: '' },
  date: { type: String, default: '' },
  team: { type: Object, default: () => ({ text: 'Round 1', agency: { name: 'Online Idea Sprint' } }) },
  roles: { type: Object, default: () => ({ text: 'Theme', items: [] }) },
});

const domainData = computed(() => DOMAIN_PS_BLOCKS.find((d) => d.domainIndex === props.projectIndex) || DOMAIN_PS_BLOCKS[0]);

const sliderRef = ref(null);
const trackRef = ref(null);

const currentIndex = ref(0);
const dragOffset = ref(0);
let isDragging = false;
let startX = 0;
let currentX = 0;
let dragDelta = 0;

function onPointerDown(e) {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  isDragging = true;
  startX = e.clientX;
  currentX = e.clientX;
  dragDelta = 0;
  
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
}

function onPointerMove(e) {
  if (!isDragging) return;
  currentX = e.clientX;
  dragDelta = currentX - startX;
}

function onPointerUp() {
  if (!isDragging) return;
  isDragging = false;
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);

  const threshold = 60;
  if (dragDelta < -threshold && currentIndex.value < domainData.value.blocks.length - 1) {
    currentIndex.value++;
  } else if (dragDelta > threshold && currentIndex.value > 0) {
    currentIndex.value--;
  }
  dragDelta = 0;
}

function goTo(idx) {
  currentIndex.value = Math.max(0, Math.min(domainData.value.blocks.length - 1, idx));
}

function prev() {
  if (currentIndex.value > 0) currentIndex.value--;
}

function next() {
  if (currentIndex.value < domainData.value.blocks.length - 1) currentIndex.value++;
}

function onMouseEnter() {
  emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, props.cursorIndication || 'Drag', true);
}

function onMouseLeave() {
  emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, null, false);
}

onMounted(() => {
  // refresh layout on resize
});

onUnmounted(() => {
  emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, null, false);
});
</script>

<template>
  <section class="projectBlock" :class="`project-${projectIndex}`">
    <!-- Section Title on first item -->
    <div v-if="projectIndex === 0" class="projectBlock__header">
      <h3 class="header__eyebrow">{{ title }}</h3>
    </div>

    <!-- Domain Main Info Header -->
    <div class="projectBlock__infoTop">
      <div class="infoTop__left">
        <span class="infoTop__num">0{{ projectIndex + 1 }}</span>
        <h4 class="infoTop__title">{{ name }}</h4>
        <span class="infoTop__tag">{{ date }}</span>
      </div>
      <div class="infoTop__right">
        <span class="infoTop__round">{{ team?.text || 'Round 1' }} · {{ team?.agency?.name || 'Online Sprint' }}</span>
        <div class="infoTop__nav">
          <button type="button" class="navBtn" @click="prev" :disabled="currentIndex === 0" aria-label="Previous block">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span class="navStatus">{{ currentIndex + 1 }} / {{ domainData.blocks.length }}</span>
          <button type="button" class="navBtn" @click="next" :disabled="currentIndex === domainData.blocks.length - 1" aria-label="Next block">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Interactive Slider with 5 Written PS Cards -->
    <div
      ref="sliderRef"
      class="projectBlock__slider"
      @pointerdown="onPointerDown"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <div
        ref="trackRef"
        class="slider__track"
        :style="{ transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 1.5}rem + ${dragDelta}px))` }"
      >
        <article
          v-for="(block, bIdx) in domainData.blocks"
          :key="block.id"
          class="psCard"
          :class="{ 'is-active': bIdx === currentIndex }"
        >
          <div class="psCard__top">
            <span class="psCard__blockNum">0{{ bIdx + 1 }}</span>
            <span class="psCard__tag">{{ block.tag }}</span>
          </div>

          <h5 class="psCard__title">{{ block.title }}</h5>
          <p class="psCard__sub">{{ block.subtitle }}</p>

          <div class="psCard__body">
            <div v-for="(sec, sIdx) in block.sections" :key="sIdx" class="psSec">
              <!-- Text Section -->
              <div v-if="sec.type === 'text'" class="psSec--text">
                <span class="psSec__label">{{ sec.label }}</span>
                <p class="psSec__content">{{ sec.body }}</p>
              </div>

              <!-- Workflow Steps -->
              <div v-else-if="sec.type === 'steps'" class="psSec--steps">
                <span class="psSec__label">{{ sec.label }}</span>
                <ol class="stepsList">
                  <li v-for="(step, stIdx) in sec.items" :key="stIdx" class="stepItem">
                    <span class="stepItem__num">{{ stIdx + 1 }}</span>
                    <span class="stepItem__text">{{ step }}</span>
                  </li>
                </ol>
              </div>

              <!-- Bullets / Principles -->
              <div v-else-if="sec.type === 'bullets'" class="psSec--bullets">
                <span class="psSec__label">{{ sec.label }}</span>
                <ul class="bulletsList">
                  <li v-for="(item, biIdx) in sec.items" :key="biIdx" class="bulletItem">
                    <span class="bulletItem__dot"></span>
                    <span class="bulletItem__text">{{ item }}</span>
                  </li>
                </ul>
              </div>

              <!-- Badges -->
              <div v-else-if="sec.type === 'badges'" class="psSec--badges">
                <span class="psSec__label">{{ sec.label }}</span>
                <div class="badgesWrap">
                  <span v-for="(badge, bgIdx) in sec.items" :key="bgIdx" class="badgeItem">{{ badge }}</span>
                </div>
              </div>

              <!-- Warning Box -->
              <div v-else-if="sec.type === 'warning'" class="psSec--warning">
                <span class="psSec__label">{{ sec.label }}</span>
                <div class="warningBox">
                  <p>{{ sec.body }}</p>
                </div>
              </div>

              <!-- Pitch Comparison -->
              <div v-else-if="sec.type === 'pitch'" class="psSec--pitch">
                <div class="pitchBox pitchBox--weak">
                  <span class="pitchLabel">Weak Pitch</span>
                  <p>{{ sec.weak }}</p>
                </div>
                <div class="pitchBox pitchBox--strong">
                  <span class="pitchLabel">Strong Pitch</span>
                  <p>{{ sec.strong }}</p>
                </div>
              </div>

              <!-- Scoring Table -->
              <div v-else-if="sec.type === 'table'" class="psSec--table">
                <span class="psSec__label">{{ sec.label }}</span>
                <div class="scoreTable">
                  <div v-for="([crit, pts], rIdx) in sec.rows" :key="rIdx" class="scoreRow">
                    <span class="scoreRow__crit">{{ crit }}</span>
                    <span class="scoreRow__pts">{{ pts }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Pagination Dots & Theme Tags -->
    <div class="projectBlock__footer">
      <div class="footer__dots">
        <button
          v-for="(_, dIdx) in domainData.blocks"
          :key="dIdx"
          type="button"
          class="dotBtn"
          :class="{ 'is-active': dIdx === currentIndex }"
          @click="goTo(dIdx)"
          :aria-label="`Go to block ${dIdx + 1}`"
        ></button>
      </div>
      <div class="footer__themes" v-if="roles?.items?.length">
        <span class="themeLabel">{{ roles.text }}:</span>
        <span v-for="th in roles.items" :key="th" class="themeTag">{{ th }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projectBlock {
  position: relative;
  padding: 5rem 1.7142857143rem 6rem;
  color: var(--c-navy, #1b2a4a);
  font-family: text, sans-serif;
  overflow: hidden;
}

.projectBlock__header {
  max-width: 72rem;
  margin: 0 auto 1.5rem;
}

.header__eyebrow {
  font-family: title, sans-serif;
  font-weight: 600;
  font-size: clamp(2rem, 4.5vw, 3.8rem);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.95;
  color: var(--c-hazard, #ff5a2e);
  margin: 0;
}

.projectBlock__infoTop {
  max-width: 72rem;
  margin: 0 auto 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
  border-bottom: 1.5px solid rgba(27, 42, 74, 0.12);
  padding-bottom: 1.25rem;
}

.infoTop__left {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.infoTop__num {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--c-orange, #ff5a2e);
}

.infoTop__title {
  font-family: title, sans-serif;
  font-weight: 600;
  font-size: clamp(1.6rem, 2.8vw, 2.5rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--c-navy, #1b2a4a);
  margin: 0;
}

.infoTop__tag {
  font-size: 0.95rem;
  color: rgba(27, 42, 74, 0.7);
}

.infoTop__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.8rem;
}

.infoTop__round {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.7;
}

.infoTop__nav {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.navBtn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid rgba(27, 42, 74, 0.2);
  background: #ffffff;
  color: var(--c-navy, #1b2a4a);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.navBtn:hover:not(:disabled) {
  background: var(--c-navy, #1b2a4a);
  color: #ffffff;
  border-color: var(--c-navy, #1b2a4a);
  transform: scale(1.05);
}

.navBtn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.navStatus {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  min-width: 44px;
  text-align: center;
}

/* Slider Track & Cards */
.projectBlock__slider {
  max-width: 72rem;
  margin: 0 auto;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  touch-action: pan-y;
  padding: 0.5rem 0 1.5rem;
}

.projectBlock__slider:active {
  cursor: grabbing;
}

.slider__track {
  display: flex;
  gap: 1.5rem;
  transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform;
}

.psCard {
  flex: 0 0 clamp(320px, 32vw, 440px);
  min-height: 520px;
  background: #ffffff;
  border: 1.5px solid rgba(27, 42, 74, 0.12);
  border-radius: 1.25rem;
  padding: 1.8rem 1.8rem 1.6rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(27, 42, 74, 0.05);
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
}

.psCard:hover {
  border-color: rgba(27, 42, 74, 0.28);
  box-shadow: 0 12px 36px rgba(27, 42, 74, 0.08);
  transform: translateY(-3px);
}

.psCard__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.psCard__blockNum {
  font-size: 0.75rem;
  font-weight: 700;
  opacity: 0.45;
}

.psCard__tag {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--c-orange, #ff5a2e);
}

.psCard__title {
  font-family: title, sans-serif;
  font-weight: 600;
  font-size: 1.45rem;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--c-navy, #1b2a4a);
  margin: 0 0 0.35rem;
}

.psCard__sub {
  font-size: 0.88rem;
  line-height: 1.4;
  color: rgba(27, 42, 74, 0.65);
  margin: 0 0 1.25rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(27, 42, 74, 0.08);
}

.psCard__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.psSec__label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(27, 42, 74, 0.5);
  margin-bottom: 0.45rem;
}

.psSec__content {
  font-size: 0.92rem;
  line-height: 1.5;
  color: #243356;
  margin: 0;
}

/* Steps */
.stepsList {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.stepItem {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.88rem;
  line-height: 1.35;
  color: #1b2a4a;
}

.stepItem__num {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffb800;
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Bullets */
.bulletsList {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.bulletItem {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.88rem;
  line-height: 1.4;
  color: #243356;
}

.bulletItem__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00c4cc;
  margin-top: 0.45rem;
  flex-shrink: 0;
}

/* Badges */
.badgesWrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.badgeItem {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0369a1;
}

/* Warning */
.warningBox {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.65rem;
  padding: 0.75rem 1rem;
  font-size: 0.88rem;
  line-height: 1.4;
  color: #b91c1c;
  font-weight: 500;
}

.warningBox p {
  margin: 0;
}

/* Pitch Comparison */
.psSec--pitch {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.pitchBox {
  border-radius: 0.65rem;
  padding: 0.75rem 1rem;
  font-size: 0.86rem;
  line-height: 1.4;
}

.pitchBox p {
  margin: 0.2rem 0 0;
  font-style: italic;
}

.pitchLabel {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
}

.pitchBox--weak {
  background: #f1f5f9;
  color: #475569;
}

.pitchBox--strong {
  background: #e0f7fa;
  color: #00695c;
}

/* Scoring Table */
.scoreTable {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.scoreRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.86rem;
  padding: 0.25rem 0;
  border-bottom: 1px dashed rgba(27, 42, 74, 0.08);
}

.scoreRow__crit {
  color: #334155;
}

.scoreRow__pts {
  font-weight: 700;
  color: #1b2a4a;
}

/* Footer Dots & Themes */
.projectBlock__footer {
  max-width: 72rem;
  margin: 1.5rem auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer__dots {
  display: flex;
  gap: 0.45rem;
}

.dotBtn {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 0;
  background: rgba(27, 42, 74, 0.2);
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.dotBtn.is-active {
  width: 24px;
  border-radius: 999px;
  background: var(--c-hazard, #ff5a2e);
}

.footer__themes {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  font-size: 0.8rem;
}

.themeLabel {
  opacity: 0.6;
  font-weight: 600;
  text-transform: uppercase;
  margin-right: 0.2rem;
}

.themeTag {
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background: var(--c-sky, #e8f4fc);
  color: var(--c-navy, #1b2a4a);
}

@media (max-width: 768px) {
  .projectBlock {
    padding: 3.5rem 1rem 4rem;
  }
  .projectBlock__infoTop {
    flex-direction: column;
    align-items: flex-start;
  }
  .infoTop__right {
    align-items: flex-start;
  }
  .psCard {
    flex: 0 0 85vw;
    min-height: 480px;
  }
}
</style>
