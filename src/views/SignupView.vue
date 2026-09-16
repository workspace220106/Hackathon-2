<script setup>
import { nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import { gsap } from 'gsap';
import ImprintsLayer from '../components/ImprintsLayer.vue';
import { usePlainPage } from '../composables/usePlainPage.js';
import { signup } from '../auth/session.js';

const router = useRouter();
const rootRef = ref(null);
const form = ref({ name: '', email: '', password: '', confirm: '' });
const error = ref('');
const busy = ref(false);

usePlainPage('signup', () => {
  nextTick(() => {
    const lines = rootRef.value?.querySelectorAll('.reveal > *');
    if (lines?.length) gsap.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, clearProps: 'transform' });
    gsap.fromTo(rootRef.value.querySelectorAll('.fade'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06, delay: 0.35, clearProps: 'all' });
  });
});

async function submit() {
  error.value = '';
  busy.value = true;
  try {
    await signup({ ...form.value, name: form.value.name.trim(), email: form.value.email.trim() });
    router.push({ name: 'teams' });
  } catch (e) {
    error.value = e.message;
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="page authPage" ref="rootRef">
    <ImprintsLayer :count="3" />
    <section class="authPage__inner">
      <header class="authPage__head">
        <p class="authPage__eyebrow fade">New here?</p>
        <h1 class="authPage__title">
          <span class="reveal"><span>Create your</span></span>
          <span class="reveal"><span>account.</span></span>
        </h1>
      </header>

      <form class="authForm fade" @submit.prevent="submit" novalidate>
        <div class="authForm__row">
          <label class="authForm__field">
            <span class="authForm__label">Name</span>
            <input v-model="form.name" class="authForm__input" type="text" name="name" autocomplete="name" placeholder="Jake" required />
          </label>
          <label class="authForm__field">
            <span class="authForm__label">Email</span>
            <input v-model="form.email" class="authForm__input" type="email" name="email" autocomplete="email" placeholder="you@example.com" required />
          </label>
        </div>
        <div class="authForm__row">
          <label class="authForm__field">
            <span class="authForm__label">Password</span>
            <input v-model="form.password" class="authForm__input" type="password" name="password" autocomplete="new-password" placeholder="min. 6 characters" required />
          </label>
          <label class="authForm__field">
            <span class="authForm__label">Confirm password</span>
            <input v-model="form.confirm" class="authForm__input" type="password" name="confirm" autocomplete="new-password" placeholder="••••••••" required />
          </label>
        </div>

        <p v-if="error" class="authForm__error" role="alert">{{ error }}</p>

        <button class="authForm__submit" type="submit" :disabled="busy" data-cursor-indication-preserve>
          <span>{{ busy ? 'Creating…' : 'Create account' }}</span>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true"><path d="M7.47503 5.00038H6.47514V1.65681L0.70711 7.42484L2.76905e-06 6.71774L5.71762 1.00011H2.47488V0.000221195H7.47434L7.47503 5.00038Z" fill="currentColor"/></svg>
        </button>

        <p class="authForm__hint fade">Already have an account? <router-link to="/login" class="authForm__link">Log in</router-link></p>
      </form>
    </section>
  </div>
</template>

<style scoped>
.authPage { min-height: 100vh; min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 8rem 1.7142857143rem 4rem; color: var(--c-navy); font-family: text, sans-serif; }
.authPage__inner { width: 100%; max-width: 38rem; }
.authPage__head { margin-bottom: 2.5rem; }
.authPage__eyebrow { font-size: .7857142857rem; letter-spacing: .04em; text-transform: uppercase; margin: 0 0 .75rem; color: var(--c-orange); }
.authPage__title { font-family: title, sans-serif; font-weight: 600; font-size: clamp(3rem, 8vw, 5.5rem); line-height: .92; letter-spacing: -.03em; text-transform: uppercase; color: var(--c-hazard); margin: 0; }
.reveal { display: block; overflow: clip; }
.reveal > span { display: block; will-change: transform; }

.authForm { display: flex; flex-direction: column; gap: 1.25rem; }
.authForm__row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 640px) { .authForm__row { grid-template-columns: 1fr; } }
.authForm__field { display: flex; flex-direction: column; gap: .5rem; }
.authForm__label { font-size: .7857142857rem; text-transform: uppercase; letter-spacing: .04em; opacity: .7; }
.authForm__input { appearance: none; width: 100%; font: inherit; font-size: 1rem; padding: .95rem 1.1rem; color: var(--c-navy); background: #fff; border: 1.5px solid rgba(27, 42, 74, .18); border-radius: .75rem; outline: none; transition: border-color .25s ease, box-shadow .25s ease; }
.authForm__input::placeholder { color: rgba(27, 42, 74, .35); }
.authForm__input:focus { border-color: var(--c-cyan); box-shadow: 0 0 0 4px rgba(0, 229, 208, .2); }
.authForm__error { margin: 0; font-size: .85rem; color: var(--c-hazard); }
.authForm__submit { display: inline-flex; align-items: center; justify-content: center; gap: .6rem; margin-top: .5rem; padding: 1rem 1.5rem; font: inherit; font-size: 1rem; color: var(--c-navy); background: var(--c-brand); border: 0; border-radius: 3.5714285714rem; cursor: pointer; transition: transform .35s cubic-bezier(.4, 0, 0, 1), background-color .25s ease; }
.authForm__submit svg { transition: transform .35s cubic-bezier(.4, 0, 0, 1); }
.authForm__submit:hover { background: var(--c-cyan); transform: translateY(-2px); }
.authForm__submit:hover svg { transform: translate(2px, -2px); }
.authForm__submit:disabled { opacity: .6; cursor: default; transform: none; }
.authForm__hint { margin: .5rem 0 0; font-size: .85rem; opacity: .8; }
.authForm__link { color: var(--c-navy); text-decoration: underline; text-underline-offset: .2em; transition: color .2s ease; }
.authForm__link:hover { color: var(--c-cyan); }
</style>
