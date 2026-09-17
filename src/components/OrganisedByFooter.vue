<script setup>
import { onMounted, ref } from 'vue';
import { useScrollReveal } from '../composables/useScrollReveal.js';
import { about } from '../data/hackathon.js';

const rootRef = ref(null);
const { arm } = useScrollReveal(rootRef);
onMounted(() => requestAnimationFrame(arm));
</script>

<template>
  <footer class="organisedByFooter" ref="rootRef">
    <div class="organisedByFooter__inner" data-reveal>
      <div class="organisedByFooter__divider"></div>
      
      <p class="organisedByFooter__tag fade">ORGANISED BY</p>
      
      <h2 class="organisedByFooter__title reveal">
        <span>{{ about.organiser.name }}</span>
      </h2>
      
      <p class="organisedByFooter__college fade">{{ about.organiser.college }}</p>
      
      <div class="organisedByFooter__links fade">
        <a class="organisedByFooter__link" :href="'mailto:' + about.organiser.email">{{ about.organiser.email }}</a>
        <a class="organisedByFooter__link" :href="about.organiser.instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a class="organisedByFooter__link" :href="about.organiser.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.organisedByFooter {
  position: relative;
  padding: 2rem 1.7142857143rem 5rem;
  color: var(--c-navy, #1b2a4a);
  font-family: text, sans-serif;
  z-index: 1;
}

.organisedByFooter__inner {
  max-width: 72rem;
  margin: 0 auto;
}

.reveal {
  display: block;
  overflow: clip;
}

.reveal > span {
  display: block;
  will-change: transform;
}

[data-reveal] {
  visibility: hidden;
}

.organisedByFooter__divider {
  width: 100%;
  height: 1px;
  background: rgba(27, 42, 74, 0.16);
  margin-bottom: 2.5rem;
}

.organisedByFooter__tag {
  font-family: text, sans-serif;
  font-size: 0.7857142857rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-orange, #ff5a2e);
  margin: 0 0 0.5rem 0;
}

.organisedByFooter__title {
  font-family: title, sans-serif;
  font-weight: 600;
  font-size: clamp(1.8rem, 3.2vw, 3rem);
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: var(--c-navy, #1b2a4a);
  margin: 0 0 0.45rem 0;
}

.organisedByFooter__college {
  font-family: text, sans-serif;
  font-size: clamp(0.95rem, 1.1vw, 1.1rem);
  color: rgba(27, 42, 74, 0.75);
  margin: 0 0 1.8rem 0;
}

.organisedByFooter__links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem 2.2rem;
  margin: 0;
}

.organisedByFooter__link {
  font-family: text, sans-serif;
  font-size: 0.95rem;
  color: var(--c-navy, #1b2a4a);
  text-decoration: underline;
  text-underline-offset: 0.25em;
  transition: color 0.2s ease;
}

.organisedByFooter__link:hover {
  color: var(--c-cyan, #00c4cc);
}

@media (max-width: 768px) {
  .organisedByFooter {
    padding: 1.5rem 1rem 4rem;
  }
  .organisedByFooter__links {
    gap: 1rem 1.5rem;
  }
}
</style>
