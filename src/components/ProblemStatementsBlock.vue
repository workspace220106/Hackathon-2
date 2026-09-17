<script setup>
import { nextTick, onMounted, ref } from 'vue';
import { onlinePS, domainById } from '../data/hackathon.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';
import { app } from '../core/App.js';

// Round 1 (online) problem statements — one expandable card per domain.
// Round 2 (offline) statements exist in src/data/hackathon.js but are not rendered yet.
const rootRef = ref(null);
const openIdx = ref(0);
const { arm } = useScrollReveal(rootRef);
onMounted(() => requestAnimationFrame(arm));

function toggle(i) {
  openIdx.value = openIdx.value === i ? null : i;
  nextTick(() => app.refreshScrollLayout?.());
}
</script>

<template>
  <section class="psBlock" ref="rootRef">
    <div class="psBlock__inner">
      <header class="psHead" data-reveal>
        <p class="psHead__eyebrow fade">Round 1 · Online · one per domain</p>
        <h2 class="psHead__title">
          <span class="reveal"><span>Problem</span></span>
          <span class="reveal"><span>statements.</span></span>
        </h2>
        <p class="psHead__lead fade">Pick one. Round 1 asks for an idea and an architecture on paper, not a prototype — show that you understand the problem, what already exists, and what would actually make your approach different.</p>
      </header>

      <ol class="psList">
        <li v-for="(ps, i) in onlinePS" :key="ps.code + ps.domain" class="psCard" :class="{ 'is-open': openIdx === i }" data-reveal>
          <button type="button" class="psCard__head" @click="toggle(i)" :aria-expanded="openIdx === i">
            <span class="psCard__index">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="psCard__titles">
              <span class="psCard__domain fade">{{ domainById(ps.domain).name }} · {{ ps.code }}</span>
              <span class="psCard__name reveal"><span>{{ ps.title }}</span></span>
              <span class="psCard__topic fade">{{ ps.topic }}</span>
            </span>
            <svg class="psCard__chev" width="14" height="9" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>

          <div class="psCard__body" v-show="openIdx === i">
            <p class="psCard__hook">{{ ps.hook }}</p>
            <div class="psCard__grid">
              <div class="psCard__col">
                <h3 class="psCard__h">The problem</h3>
                <p class="psCard__p">{{ ps.problem }}</p>
                <h3 class="psCard__h">{{ ps.domain === 'blockchain' ? 'Format' : 'Worked example' }}</h3>
                <p class="psCard__p">{{ ps.example }}</p>
                <p v-if="ps.warning" class="psCard__warning">{{ ps.warning }}</p>
                <template v-if="ps.mvp">
                  <h3 class="psCard__h">MVP scope</h3>
                  <p class="psCard__p">{{ ps.mvp }}</p>
                </template>
              </div>
              <div class="psCard__col">
                <h3 class="psCard__h">Workflow</h3>
                <ol class="flow">
                  <li v-for="(step, j) in ps.flow" :key="j" class="flow__step"><span class="flow__n">{{ j + 1 }}</span>{{ step }}</li>
                </ol>
                <h3 class="psCard__h">{{ ps.domain === 'cyber' ? 'Why it\'s hard' : 'Focus & design principles' }}</h3>
                <ul class="bullets">
                  <li v-for="h in ps.hard" :key="h">{{ h }}</li>
                </ul>
                <template v-if="ps.baselines">
                  <h3 class="psCard__h">Existing baselines</h3>
                  <p class="psCard__tags"><span v-for="b in ps.baselines" :key="b" class="psCard__tag">{{ b }}</span></p>
                </template>
              </div>
              <div class="psCard__col">
                <template v-if="ps.weak">
                  <h3 class="psCard__h">Weak pitch</h3>
                  <p class="pitch pitch--weak">{{ ps.weak }}</p>
                  <h3 class="psCard__h">Strong pitch</h3>
                  <p class="pitch pitch--strong">{{ ps.strong }}</p>
                </template>
                <template v-if="ps.judging">
                  <h3 class="psCard__h">{{ ps.judging.title }}</h3>
                  <table class="rubric">
                    <tbody>
                      <tr v-for="r in ps.judging.rows" :key="r[0]"><td>{{ r[0] }}</td><td class="rubric__val">{{ r[1] }}</td></tr>
                    </tbody>
                  </table>
                </template>
                <template v-else-if="!ps.weak">
                  <h3 class="psCard__h">How Round 1 is judged</h3>
                  <ul class="bullets">
                    <li>Problem understanding</li>
                    <li>Architecture on paper</li>
                    <li>Innovation and differentiation</li>
                  </ul>
                </template>
              </div>
            </div>
          </div>
        </li>
      </ol>

      <p class="psBlock__note" data-reveal><span class="fade">Round 2 brings two offline problem statements per domain for the shortlisted teams — announced after Round 1 results.</span></p>
    </div>
  </section>
</template>

<style scoped>
.psBlock { position: relative; padding: 6rem 1.7142857143rem 5rem; color: var(--c-navy); font-family: text, sans-serif; }
.psBlock__inner { max-width: 72rem; margin: 0 auto; }
.reveal { display: block; overflow: clip; }
.reveal > span { display: block; will-change: transform; }
[data-reveal] { visibility: hidden; }

.psHead { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem 4rem; align-items: end; margin-bottom: 2.5rem; }
.psHead__eyebrow { grid-column: 1 / -1; font-size: .7857142857rem; letter-spacing: .04em; text-transform: uppercase; margin: 0; color: var(--c-orange); }
.psHead__title { font-family: title, sans-serif; font-weight: 600; font-size: clamp(3rem, 8vw, 6.5rem); line-height: .92; letter-spacing: -.03em; text-transform: uppercase; color: var(--c-hazard); margin: 0; }
.psHead__lead { font-size: clamp(1rem, 1.2vw, 1.2rem); line-height: 1.5; margin: 0; }

.psList { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .75rem; }
.psCard { background: #fff; border: 1.5px solid rgba(27, 42, 74, .12); border-radius: 1rem; overflow: hidden; transition: border-color .25s ease, box-shadow .3s ease; }
.psCard:hover, .psCard.is-open { border-color: rgba(27, 42, 74, .3); box-shadow: 0 10px 30px rgba(27, 42, 74, .07); }
.psCard__head { width: 100%; display: grid; grid-template-columns: 2.5rem 1fr 1rem; align-items: center; gap: 1rem; padding: 1.2rem 1.4rem; background: none; border: 0; font: inherit; color: inherit; text-align: left; cursor: pointer; }
.psCard__index { font-size: .75rem; opacity: .5; align-self: start; padding-top: .35rem; }
.psCard__titles { display: flex; flex-direction: column; gap: .2rem; min-width: 0; }
.psCard__domain { font-size: .75rem; text-transform: uppercase; letter-spacing: .08em; color: var(--c-orange); }
.psCard__name { font-family: title, sans-serif; font-weight: 600; font-size: clamp(1.4rem, 2.4vw, 2.1rem); line-height: 1.05; letter-spacing: -.015em; }
.psCard__topic { font-size: .92rem; opacity: .7; }
.psCard__chev { justify-self: end; transition: transform .35s cubic-bezier(.4,0,0,1); }
.psCard.is-open .psCard__chev { transform: rotate(180deg); }

.psCard__body { padding: 0 1.4rem 1.6rem; border-top: 1px solid rgba(27, 42, 74, .1); }
.psCard__hook { font-family: title, sans-serif; font-weight: 500; font-size: clamp(1.1rem, 1.8vw, 1.5rem); line-height: 1.2; margin: 1.3rem 0 1.2rem; color: var(--c-hazard); }
.psCard__grid { display: grid; grid-template-columns: 1.25fr 1fr .9fr; gap: 2rem; }
.psCard__h { font-size: .72rem; text-transform: uppercase; letter-spacing: .06em; opacity: .55; margin: 0 0 .4rem; font-weight: 400; }
.psCard__p { margin: 0 0 1.1rem; font-size: .95rem; line-height: 1.5; }
.psCard__warning { margin: -.3rem 0 1.1rem; padding: .7rem .9rem; border-radius: .6rem; background: rgba(255, 90, 46, .1); color: var(--c-hazard); font-size: .88rem; line-height: 1.4; }
.psCard__tags { margin: 0 0 1.1rem; display: flex; flex-wrap: wrap; gap: .4rem; }
.psCard__tag { font-size: .75rem; padding: .3rem .65rem; border-radius: 3rem; background: var(--c-sky); }

.flow { list-style: none; margin: 0 0 1.1rem; padding: 0; display: flex; flex-direction: column; gap: .35rem; }
.flow__step { display: flex; align-items: baseline; gap: .6rem; font-size: .88rem; line-height: 1.4; }
.flow__n { flex: none; width: 1.3rem; height: 1.3rem; border-radius: 50%; background: var(--c-brand); font-size: .65rem; display: inline-flex; align-items: center; justify-content: center; transform: translateY(-.05em); }
.bullets { list-style: none; margin: 0 0 1.1rem; padding: 0; display: flex; flex-direction: column; gap: .4rem; }
.bullets li { position: relative; padding-left: 1rem; font-size: .88rem; line-height: 1.4; }
.bullets li::before { content: ''; position: absolute; left: 0; top: .55em; width: .4rem; height: .4rem; border-radius: 50%; background: var(--c-cyan); }

.pitch { margin: 0 0 1.1rem; padding: .8rem .95rem; border-radius: .7rem; font-size: .9rem; line-height: 1.45; font-style: italic; }
.pitch--weak { background: rgba(27, 42, 74, .06); opacity: .8; text-decoration: line-through; text-decoration-color: rgba(27, 42, 74, .35); }
.pitch--strong { background: rgba(0, 229, 208, .18); }
.rubric { width: 100%; border-collapse: collapse; font-size: .85rem; margin-bottom: 1rem; }
.rubric td { padding: .4rem 0; border-bottom: 1px solid rgba(27, 42, 74, .1); line-height: 1.3; }
.rubric__val { text-align: right; font-family: title, sans-serif; font-weight: 600; white-space: nowrap; padding-left: 1rem; }

.psBlock__note { margin: 2rem 0 0; font-size: .9rem; opacity: .7; }

@media (max-width: 900px) {
  .psBlock { padding: 4rem 1rem 3rem; }
  .psHead { grid-template-columns: 1fr; gap: 1rem; }
  .psCard__grid { grid-template-columns: 1fr; gap: 1.2rem; }
  .psCard__head { grid-template-columns: 2rem 1fr 1rem; padding: 1rem 1rem; }
  .psCard__body { padding: 0 1rem 1.3rem; }
}
</style>
