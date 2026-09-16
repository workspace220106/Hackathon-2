<script setup>
import { computed, nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import { gsap } from 'gsap';
import ImprintsLayer from '../components/ImprintsLayer.vue';
import { usePlainPage } from '../composables/usePlainPage.js';
import { currentUser, logout } from '../auth/session.js';

const router = useRouter();
const rootRef = ref(null);
const user = computed(() => currentUser());

// Placeholder content for the post-login area — swap for real data.
const stats = [
  { label: 'Best run', value: '12,480', unit: 'm' },
  { label: 'Coins', value: '3,210', unit: '' },
  { label: 'Sessions', value: '27', unit: '' },
];
const items = [
  { title: 'Subway sprint', date: 'Today', tag: 'New record' },
  { title: 'Platform dash', date: 'Yesterday', tag: '' },
  { title: 'Graffiti alley', date: '2 days ago', tag: '' },
];

usePlainPage('dashboard', () => {
  nextTick(() => {
    const lines = rootRef.value?.querySelectorAll('.reveal > *');
    if (lines?.length) gsap.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, clearProps: 'transform' });
    gsap.fromTo(rootRef.value.querySelectorAll('.fade'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06, delay: 0.3, clearProps: 'all' });
  });
});

function signOut() {
  logout();
  router.push({ name: 'home' });
}
</script>

<template>
  <div class="page dashboard" ref="rootRef">
    <ImprintsLayer :count="3" />
    <section class="dashboard__inner">
      <header class="dashboard__head">
        <p class="dashboard__eyebrow fade">Signed in as {{ user?.email }}</p>
        <h1 class="dashboard__title">
          <span class="reveal"><span>Hey {{ user?.name || 'runner' }},</span></span>
          <span class="reveal"><span>ready to go?</span></span>
        </h1>
      </header>

      <ul class="stats fade">
        <li v-for="s in stats" :key="s.label" class="stats__item">
          <span class="stats__value">{{ s.value }}<small v-if="s.unit">{{ s.unit }}</small></span>
          <span class="stats__label">{{ s.label }}</span>
        </li>
      </ul>

      <div class="panel fade">
        <h2 class="panel__title">Recent runs</h2>
        <ul class="list">
          <li v-for="it in items" :key="it.title" class="list__row">
            <span class="list__title">{{ it.title }}</span>
            <span class="list__date">{{ it.date }}</span>
            <span v-if="it.tag" class="list__tag">{{ it.tag }}</span>
          </li>
        </ul>
      </div>

      <div class="dashboard__actions fade">
        <router-link to="/teams" class="btn btn--primary">View teams</router-link>
        <button class="btn btn--ghost" type="button" @click="signOut">Log out</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  min-height: 100dvh;
  padding: 8rem 1.7142857143rem 5rem;
  color: var(--c-navy);
  font-family: text, sans-serif;
}
.dashboard__inner { max-width: 60rem; margin: 0 auto; }
.dashboard__head { margin-bottom: 2.5rem; }
.dashboard__eyebrow { font-size: .7857142857rem; letter-spacing: .04em; text-transform: uppercase; margin: 0 0 .75rem; color: var(--c-orange); }
.dashboard__title {
  font-family: title, sans-serif; font-weight: 600;
  font-size: clamp(3rem, 8vw, 6rem); line-height: .92; letter-spacing: -.03em; text-transform: uppercase;
  color: var(--c-hazard); margin: 0;
}
.reveal { display: block; overflow: clip; }
.reveal > span { display: block; will-change: transform; }

.stats { list-style: none; margin: 0 0 1.5rem; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr)); gap: 1rem; }
.stats__item { display: flex; flex-direction: column; gap: .35rem; padding: 1.25rem 1.5rem; border-radius: 1rem; background: var(--c-sky); color: var(--c-navy); }
.stats__value { font-family: title, sans-serif; font-weight: 600; font-size: 2.5rem; line-height: 1; letter-spacing: -.02em; }
.stats__value small { font-size: 1rem; margin-left: .2em; }
.stats__label { font-size: .8rem; text-transform: uppercase; letter-spacing: .04em; opacity: .75; }

.panel { padding: 1.5rem; border-radius: 1rem; background: #fff; border: 1.5px solid rgba(27, 42, 74, .12); }
.panel__title { font-family: title, sans-serif; font-weight: 600; font-size: 1.5rem; margin: 0 0 1rem; letter-spacing: -.01em; }
.list { list-style: none; margin: 0; padding: 0; }
.list__row { display: grid; grid-template-columns: 1fr auto auto; gap: 1rem; align-items: center; padding: .9rem 0; border-top: 1px solid rgba(27, 42, 74, .1); }
.list__title { font-size: 1rem; }
.list__date { font-size: .85rem; opacity: .6; }
.list__tag { font-size: .75rem; text-transform: uppercase; letter-spacing: .04em; padding: .35rem .7rem; border-radius: 3rem; background: var(--c-brand); }

.dashboard__actions { display: flex; gap: .75rem; margin-top: 2rem; flex-wrap: wrap; }
.btn { font: inherit; text-decoration: none; display: inline-block; font-size: 1rem; padding: 1rem 1.5rem; border-radius: 3.5714285714rem; border: 1.5px solid transparent; cursor: pointer; transition: transform .35s cubic-bezier(.4,0,0,1), background-color .25s ease, color .25s ease, border-color .25s ease; }
.btn:hover { transform: translateY(-2px); }
.btn--primary { background: var(--c-brand); color: var(--c-navy); }
.btn--primary:hover { background: var(--c-cyan); }
.btn--ghost { background: transparent; color: var(--c-navy); border-color: rgba(27, 42, 74, .25); }
.btn--ghost:hover { border-color: var(--c-cyan); color: var(--c-cyan); }
</style>
