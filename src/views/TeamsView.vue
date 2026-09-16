<script setup>
import { computed, nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import { gsap } from 'gsap';
import ImprintsLayer from '../components/ImprintsLayer.vue';
import { usePlainPage } from '../composables/usePlainPage.js';
import { useScrollReveal } from '../composables/useScrollReveal.js';
import { currentUser, logout } from '../auth/session.js';
import { DOMAINS, teams } from '../data/teams.js';
import { app } from '../core/App.js';

const router = useRouter();
const rootRef = ref(null);
const user = computed(() => currentUser());
const domain = ref('All');
const openId = ref(null);

const filtered = computed(() => (domain.value === 'All' ? teams : teams.filter((t) => t.domain === domain.value)));
const stats = computed(() => ({
  teams: teams.length,
  avg: Math.round(teams.reduce((a, t) => a + t.progress, 0) / teams.length),
  done: teams.filter((t) => t.progress >= 90).length,
}));
const statusColor = (s) => ({ 'Ahead': 'var(--c-cyan)', 'On track': 'var(--c-brand)', 'At risk': 'var(--c-orange)', 'Behind': 'var(--c-hazard)' }[s] || 'var(--c-sky)');

const { arm } = useScrollReveal(rootRef);

usePlainPage('teams', () => {
  nextTick(() => {
    const lines = rootRef.value?.querySelectorAll('.teamsHead .reveal > *');
    if (lines?.length) gsap.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, clearProps: 'transform' });
    gsap.fromTo(rootRef.value.querySelectorAll('.teamsHead .fade, .teamsStats'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06, delay: 0.3, clearProps: 'all' });
    arm();
  });
});

function toggle(id) {
  openId.value = openId.value === id ? null : id;
  nextTick(() => app.refreshScrollLayout());
}
function setDomain(d) {
  domain.value = d;
  openId.value = null;
  nextTick(() => { arm(); app.refreshScrollLayout(); });
}
function signOut() { logout(); router.push({ name: 'home' }); }
</script>

<template>
  <div class="page teams" ref="rootRef">
    <ImprintsLayer :count="5" />
    <section class="teams__inner">
      <header class="teamsHead">
        <p class="teamsHead__eyebrow fade">Welcome {{ user?.name || 'runner' }} · participating teams</p>
        <h1 class="teamsHead__title">
          <span class="reveal"><span>Teams on</span></span>
          <span class="reveal"><span>the tracks.</span></span>
        </h1>
      </header>

      <ul class="teamsStats">
        <li class="teamsStats__item"><span class="teamsStats__value">{{ stats.teams }}</span><span class="teamsStats__label">Teams</span></li>
        <li class="teamsStats__item"><span class="teamsStats__value">{{ stats.avg }}<small>%</small></span><span class="teamsStats__label">Avg. progress</span></li>
        <li class="teamsStats__item"><span class="teamsStats__value">{{ stats.done }}</span><span class="teamsStats__label">Demo ready</span></li>
      </ul>

      <ul class="teamList">
        <li v-for="(t, i) in filtered" :key="t.id" class="teamCard" :class="{ 'is-open': openId === t.id }" data-reveal>
          <button type="button" class="teamCard__head" @click="toggle(t.id)" :aria-expanded="openId === t.id">
            <span class="teamCard__index">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="teamCard__name reveal"><span>{{ t.name }}</span></span>
            <span class="teamCard__domain fade">{{ t.domain }}</span>
            <span class="teamCard__status fade" :style="{ '--dot': statusColor(t.status) }">{{ t.status }}</span>
            <span class="teamCard__progress fade">
              <span class="teamCard__bar"><span class="teamCard__fill" data-progress :style="{ width: t.progress + '%' }"></span></span>
              <span class="teamCard__pct">{{ t.progress }}%</span>
            </span>
            <svg class="teamCard__chev" width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>

          <div class="teamCard__body" v-show="openId === t.id">
            <div class="teamCard__grid">
              <div>
                <h3 class="teamCard__h">Problem statement</h3>
                <p class="teamCard__p">{{ t.ps }}</p>
                <h3 class="teamCard__h">Notes</h3>
                <p class="teamCard__p">{{ t.notes }}</p>
              </div>
              <div>
                <h3 class="teamCard__h">Members</h3>
                <p class="teamCard__p">{{ t.members.join(', ') }}</p>
                <h3 class="teamCard__h">Mentor · College</h3>
                <p class="teamCard__p">{{ t.mentor }} · {{ t.college }}</p>
                <h3 class="teamCard__h">Stack</h3>
                <p class="teamCard__tags"><span v-for="s in t.stack" :key="s" class="teamCard__tag">{{ s }}</span></p>
              </div>
              <div>
                <h3 class="teamCard__h">Milestones</h3>
                <ol class="milestones">
                  <li v-for="m in t.milestones" :key="m.label" class="milestones__item" :class="{ 'is-done': m.done }"><span class="milestones__dot"></span>{{ m.label }}</li>
                </ol>
              </div>
            </div>
          </div>
        </li>
      </ul>

      <div class="teams__actions">
        <router-link to="/dashboard" class="btn btn--ghost">My dashboard</router-link>
        <button class="btn btn--ghost" type="button" @click="signOut">Log out</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.teams { min-height: 100vh; min-height: 100dvh; padding: 8rem 1.7142857143rem 6rem; color: var(--c-navy); font-family: text, sans-serif; }
.teams__inner { max-width: 72rem; margin: 0 auto; }
.teamsHead { margin-bottom: 2.5rem; }
.teamsHead__eyebrow { font-size: .7857142857rem; letter-spacing: .04em; text-transform: uppercase; margin: 0 0 .75rem; color: var(--c-orange); }
.teamsHead__title { font-family: title, sans-serif; font-weight: 600; font-size: clamp(3rem, 8vw, 6.5rem); line-height: .92; letter-spacing: -.03em; text-transform: uppercase; color: var(--c-hazard); margin: 0; }
.reveal { display: block; overflow: clip; }
.reveal > span { display: block; will-change: transform; }
[data-reveal] { visibility: hidden; }

.teamsStats { list-style: none; margin: 0 0 1.5rem; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: 1rem; }
.teamsStats__item { display: flex; flex-direction: column; gap: .35rem; padding: 1.25rem 1.5rem; border-radius: 1rem; background: var(--c-sky); }
.teamsStats__value { font-family: title, sans-serif; font-weight: 600; font-size: 2.5rem; line-height: 1; letter-spacing: -.02em; }
.teamsStats__value small { font-size: 1rem; margin-left: .15em; }
.teamsStats__label { font-size: .8rem; text-transform: uppercase; letter-spacing: .04em; opacity: .75; }

.teamsFilter { display: flex; flex-wrap: wrap; gap: .5rem; margin: 0 0 1.5rem; }
.teamsFilter__btn { font: inherit; font-size: .85rem; padding: .55rem 1rem; border-radius: 3rem; border: 1.5px solid rgba(27, 42, 74, .2); background: #fff; color: var(--c-navy); cursor: pointer; transition: background-color .25s ease, border-color .25s ease, color .25s ease, transform .3s cubic-bezier(.4,0,0,1); }
.teamsFilter__btn:hover { border-color: var(--c-cyan); color: var(--c-cyan); transform: translateY(-1px); }
.teamsFilter__btn.is-active { background: var(--c-brand); border-color: var(--c-brand); color: var(--c-navy); }

.teamList { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .75rem; }
.teamCard { background: #fff; border: 1.5px solid rgba(27, 42, 74, .12); border-radius: 1rem; overflow: hidden; transition: border-color .25s ease, box-shadow .3s ease; }
.teamCard:hover, .teamCard.is-open { border-color: rgba(27, 42, 74, .3); box-shadow: 0 10px 30px rgba(27, 42, 74, .07); }
.teamCard__head { width: 100%; display: grid; grid-template-columns: 2.5rem 1.4fr .8fr .8fr 1.2fr 1rem; align-items: center; gap: 1rem; padding: 1.1rem 1.4rem; background: none; border: 0; font: inherit; color: inherit; text-align: left; cursor: pointer; }
@media (max-width: 860px) { .teamCard__head { grid-template-columns: 2rem 1fr auto 1rem; } .teamCard__domain, .teamCard__progress { display: none; } }
.teamCard__index { font-size: .75rem; opacity: .5; }
.teamCard__name { font-family: title, sans-serif; font-weight: 600; font-size: 1.5rem; letter-spacing: -.01em; }
.teamCard__domain { font-size: .85rem; opacity: .7; }
.teamCard__status { font-size: .8rem; display: inline-flex; align-items: center; gap: .5rem; }
.teamCard__status::before { content: ''; width: .5rem; height: .5rem; border-radius: 50%; background: var(--dot); }
.teamCard__progress { display: flex; align-items: center; gap: .75rem; }
.teamCard__bar { flex: 1; height: .45rem; border-radius: 1rem; background: rgba(27, 42, 74, .1); overflow: hidden; }
.teamCard__fill { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--c-brand), var(--c-hazard)); transform-origin: left center; }
.teamCard__pct { font-size: .8rem; width: 2.6rem; text-align: right; }
.teamCard__chev { justify-self: end; transition: transform .35s cubic-bezier(.4,0,0,1); }
.teamCard.is-open .teamCard__chev { transform: rotate(180deg); }
.teamCard__body { padding: 0 1.4rem 1.5rem; border-top: 1px solid rgba(27, 42, 74, .1); }
.teamCard__grid { display: grid; grid-template-columns: 1.3fr 1fr .8fr; gap: 2rem; padding-top: 1.25rem; }
@media (max-width: 860px) { .teamCard__grid { grid-template-columns: 1fr; gap: 1.25rem; } }
.teamCard__h { font-size: .72rem; text-transform: uppercase; letter-spacing: .06em; opacity: .55; margin: 0 0 .35rem; font-weight: 400; }
.teamCard__p { margin: 0 0 1.1rem; font-size: .95rem; line-height: 1.5; }
.teamCard__tags { margin: 0; display: flex; flex-wrap: wrap; gap: .4rem; }
.teamCard__tag { font-size: .75rem; padding: .3rem .65rem; border-radius: 3rem; background: var(--c-sky); }
.milestones { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .5rem; }
.milestones__item { display: flex; align-items: center; gap: .6rem; font-size: .9rem; opacity: .55; }
.milestones__item.is-done { opacity: 1; }
.milestones__dot { width: .7rem; height: .7rem; border-radius: 50%; border: 1.5px solid rgba(27, 42, 74, .4); }
.milestones__item.is-done .milestones__dot { background: var(--c-cyan); border-color: var(--c-cyan); }

.teams__actions { display: flex; gap: .75rem; margin-top: 2.5rem; flex-wrap: wrap; }
.btn { font: inherit; font-size: 1rem; padding: 1rem 1.5rem; border-radius: 3.5714285714rem; border: 1.5px solid transparent; cursor: pointer; text-decoration: none; transition: transform .35s cubic-bezier(.4,0,0,1), background-color .25s ease, color .25s ease, border-color .25s ease; }
.btn:hover { transform: translateY(-2px); }
.btn--ghost { background: transparent; color: var(--c-navy); border-color: rgba(27, 42, 74, .25); }
.btn--ghost:hover { border-color: var(--c-cyan); color: var(--c-cyan); }
</style>
