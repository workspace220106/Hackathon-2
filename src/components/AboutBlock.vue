<script setup>
import { onMounted, ref } from 'vue';
import { about } from '../data/hackathon.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';

// "About us" section on the home page: what the hackathon is, the two rounds,
// what every track has in common, and who runs it. Copy lives in src/data/hackathon.js.
const rootRef = ref(null);
const { arm } = useScrollReveal(rootRef);
onMounted(() => requestAnimationFrame(arm));
</script>

<template>
  <section class="aboutBlock" ref="rootRef">
    <div class="aboutBlock__inner">
      <header class="aboutHead" data-reveal>
        <p class="aboutHead__eyebrow fade">{{ about.eyebrow }}</p>
        <h2 class="aboutHead__title">
          <span v-for="(l, i) in about.title" :key="i" class="reveal"><span>{{ l }}</span></span>
        </h2>
        <p class="aboutHead__lead fade">{{ about.lead }}</p>
      </header>

      <ul class="aboutStats" data-reveal>
        <li v-for="s in about.stats" :key="s.label" class="aboutStats__item fade">
          <span class="aboutStats__value">{{ s.value }}<small v-if="s.suffix">{{ s.suffix }}</small></span>
          <span class="aboutStats__label">{{ s.label }}</span>
        </li>
      </ul>

      <div class="aboutRounds">
        <article v-for="r in about.rounds" :key="r.tag" class="round" data-reveal>
          <p class="round__tag fade">{{ r.tag }}</p>
          <h3 class="round__name reveal"><span>{{ r.name }}</span></h3>
          <p class="round__where fade">{{ r.where }}</p>
          <p class="round__summary fade">{{ r.summary }}</p>
          <ul class="round__points">
            <li v-for="p in r.points" :key="p" class="fade">{{ p }}</li>
          </ul>
        </article>
      </div>

      <blockquote class="aboutTheme" data-reveal>
        <p class="aboutTheme__text reveal"><span>{{ about.theme }}</span></p>
        <p class="aboutTheme__by fade">The theme every track builds toward</p>
      </blockquote>

      <ul class="aboutPrinciples" data-reveal>
        <li v-for="p in about.principles" :key="p.title" class="principle fade">
          <h4 class="principle__title">{{ p.title }}</h4>
          <p class="principle__text">{{ p.text }}</p>
        </li>
      </ul>

      <footer class="aboutOrg" data-reveal>
        <p class="aboutOrg__label fade">Organised by</p>
        <h3 class="aboutOrg__name reveal"><span>{{ about.organiser.name }}</span></h3>
        <p class="aboutOrg__college fade">{{ about.organiser.college }}</p>
        <p class="aboutOrg__links fade">
          <a class="aboutOrg__link" :href="'mailto:' + about.organiser.email">{{ about.organiser.email }}</a>
          <a class="aboutOrg__link" :href="about.organiser.instagram" target="_blank" rel="noopener">Instagram</a>
          <a class="aboutOrg__link" :href="about.organiser.linkedin" target="_blank" rel="noopener">LinkedIn</a>
        </p>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.aboutBlock { position: relative; padding: 7rem 1.7142857143rem 5rem; color: var(--c-navy); font-family: text, sans-serif; }
.aboutBlock__inner { max-width: 72rem; margin: 0 auto; }
.reveal { display: block; overflow: clip; }
.reveal > span { display: block; will-change: transform; }
[data-reveal] { visibility: hidden; }

.aboutHead { display: grid; grid-template-columns: 1.1fr 1fr; gap: 2rem 4rem; align-items: end; margin-bottom: 3rem; }
.aboutHead__eyebrow { grid-column: 1 / -1; font-size: .7857142857rem; letter-spacing: .04em; text-transform: uppercase; margin: 0; color: var(--c-orange); }
.aboutHead__title { font-family: title, sans-serif; font-weight: 600; font-size: clamp(3rem, 8vw, 6.5rem); line-height: .92; letter-spacing: -.03em; text-transform: uppercase; color: var(--c-hazard); margin: 0; }
.aboutHead__lead { font-size: clamp(1rem, 1.25vw, 1.25rem); line-height: 1.5; margin: 0; }

.aboutStats { list-style: none; margin: 0 0 3rem; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.aboutStats__item { display: flex; flex-direction: column; gap: .35rem; padding: 1.25rem 1.5rem; border-radius: 1rem; background: var(--c-sky); }
.aboutStats__value { font-family: title, sans-serif; font-weight: 600; font-size: 2.5rem; line-height: 1; letter-spacing: -.02em; }
.aboutStats__value small { font-size: 1rem; margin-left: .15em; }
.aboutStats__label { font-size: .8rem; text-transform: uppercase; letter-spacing: .04em; opacity: .75; }

.aboutRounds { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 3rem; }
.round { background: #fff; border: 1.5px solid rgba(27, 42, 74, .12); border-radius: 1rem; padding: 1.6rem 1.7rem 1.4rem; transition: border-color .25s ease, box-shadow .3s ease; }
.round:hover { border-color: rgba(27, 42, 74, .3); box-shadow: 0 10px 30px rgba(27, 42, 74, .07); }
.round__tag { display: inline-block; font-size: .72rem; letter-spacing: .12em; text-transform: uppercase; padding: .4rem .8rem; border-radius: 999px; background: var(--c-brand); margin: 0 0 1rem; }
.round__name { font-family: title, sans-serif; font-weight: 600; font-size: clamp(1.6rem, 2.4vw, 2.2rem); line-height: 1.05; letter-spacing: -.02em; margin: 0 0 .3rem; color: var(--c-hazard); }
.round__where { font-size: .8rem; text-transform: uppercase; letter-spacing: .05em; opacity: .6; margin: 0 0 1rem; }
.round__summary { font-size: 1rem; line-height: 1.5; margin: 0 0 1rem; }
.round__points { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .5rem; }
.round__points li { position: relative; padding-left: 1.1rem; font-size: .92rem; line-height: 1.45; opacity: .85; }
.round__points li::before { content: ''; position: absolute; left: 0; top: .55em; width: .45rem; height: .45rem; border-radius: 50%; background: var(--c-cyan); }

.aboutTheme { margin: 0 0 3rem; padding: 2.4rem 2rem; border-radius: 1rem; background: var(--c-navy); color: #fff; }
.aboutTheme__text { font-family: title, sans-serif; font-weight: 500; font-size: clamp(1.3rem, 2.4vw, 2.1rem); line-height: 1.15; letter-spacing: -.01em; margin: 0 0 .8rem; }
.aboutTheme__by { margin: 0; font-size: .78rem; text-transform: uppercase; letter-spacing: .08em; opacity: .6; }

.aboutPrinciples { list-style: none; margin: 0 0 3.5rem; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.principle { padding: 1.2rem 1.3rem; border-radius: 1rem; background: #fff; border: 1.5px solid rgba(27, 42, 74, .12); }
.principle__title { font-family: title, sans-serif; font-weight: 600; font-size: 1.15rem; margin: 0 0 .45rem; color: var(--c-hazard); }
.principle__text { margin: 0; font-size: .88rem; line-height: 1.45; opacity: .85; }

.aboutOrg { border-top: 1.5px solid rgba(27, 42, 74, .15); padding-top: 2rem; }
.aboutOrg__label { font-size: .7857142857rem; letter-spacing: .04em; text-transform: uppercase; margin: 0 0 .5rem; color: var(--c-orange); }
.aboutOrg__name { font-family: title, sans-serif; font-weight: 600; font-size: clamp(1.5rem, 3vw, 2.6rem); line-height: 1.05; letter-spacing: -.02em; margin: 0 0 .3rem; }
.aboutOrg__college { margin: 0 0 1rem; font-size: 1rem; opacity: .8; }
.aboutOrg__links { display: flex; flex-wrap: wrap; gap: .6rem 1.5rem; margin: 0; }
.aboutOrg__link { font-size: .95rem; text-decoration: underline; text-underline-offset: .2em; transition: color .25s ease; }
.aboutOrg__link:hover { color: var(--c-cyan); }

@media (max-width: 900px) {
  .aboutBlock { padding: 5rem 1rem 3rem; }
  .aboutHead { grid-template-columns: 1fr; gap: 1.2rem; }
  .aboutStats { grid-template-columns: 1fr 1fr; }
  .aboutRounds { grid-template-columns: 1fr; }
  .aboutPrinciples { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 520px) {
  .aboutPrinciples { grid-template-columns: 1fr; }
}
</style>
