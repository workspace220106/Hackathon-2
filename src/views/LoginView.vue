<script setup>
import { nextTick, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { gsap } from 'gsap';
import { usePlainPage } from '../composables/usePlainPage.js';
import { login } from '../auth/session.js';

const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const error = ref('');
const busy = ref(false);
const rootRef = ref(null);

// Reveal: the same masked line-slide the rest of the site uses (lines rise from below).
usePlainPage('login', () => {
  nextTick(() => {
    const lines = rootRef.value?.querySelectorAll('.reveal > *');
    if (!lines?.length) return;
    gsap.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, clearProps: 'transform' });
    gsap.fromTo(rootRef.value.querySelectorAll('.fade'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06, delay: 0.35, clearProps: 'all' });
  });
});

async function submit() {
  error.value = '';
  busy.value = true;
  try {
    await login({ email: email.value.trim(), password: password.value });
    router.push(route.query.next?.toString() || { name: 'dashboard' });
  } catch (e) {
    error.value = e.message;
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="page loginPage" ref="rootRef">
    <section class="loginPage__inner">
      <header class="loginPage__head">
        <p class="loginPage__eyebrow fade">Welcome back</p>
        <h1 class="loginPage__title">
          <span class="reveal"><span>Log in to</span></span>
          <span class="reveal"><span>your run.</span></span>
        </h1>
      </header>

      <form class="loginForm fade" @submit.prevent="submit" novalidate>
        <label class="loginForm__field">
          <span class="loginForm__label">Email</span>
          <input v-model="email" class="loginForm__input" type="email" name="email" autocomplete="email" placeholder="you@example.com" required />
        </label>
        <label class="loginForm__field">
          <span class="loginForm__label">Password</span>
          <input v-model="password" class="loginForm__input" type="password" name="password" autocomplete="current-password" placeholder="••••••••" required />
        </label>

        <p v-if="error" class="loginForm__error" role="alert">{{ error }}</p>

        <button class="loginForm__submit" type="submit" :disabled="busy" data-cursor-indication-preserve>
          <span>{{ busy ? 'Logging in…' : 'Log in' }}</span>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true"><path d="M7.47503 5.00038H6.47514V1.65681L0.70711 7.42484L2.76905e-06 6.71774L5.71762 1.00011H2.47488V0.000221195H7.47434L7.47503 5.00038Z" fill="currentColor"/></svg>
        </button>

        <p class="loginForm__hint fade">No account yet? <a href="#" class="loginForm__link" @click.prevent>Create one</a></p>
      </form>
    </section>
  </div>
</template>

<style scoped>
.loginPage {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rem 1.7142857143rem 4rem;
  color: var(--c-navy);
  font-family: text, sans-serif;
}
.loginPage__inner { width: 100%; max-width: 30rem; }
.loginPage__head { margin-bottom: 2.5rem; }
.loginPage__eyebrow {
  font-size: .7857142857rem;
  letter-spacing: .04em;
  text-transform: uppercase;
  margin: 0 0 .75rem;
  color: var(--c-orange);
}
.loginPage__title {
  font-family: title, sans-serif;
  font-weight: 600;
  font-size: clamp(3rem, 8vw, 5.5rem);
  line-height: .92;
  letter-spacing: -.03em;
  text-transform: uppercase;
  color: var(--c-hazard);
  margin: 0;
}
.reveal { display: block; overflow: clip; }
.reveal > span { display: block; will-change: transform; }

.loginForm { display: flex; flex-direction: column; gap: 1.25rem; }
.loginForm__field { display: flex; flex-direction: column; gap: .5rem; }
.loginForm__label { font-size: .7857142857rem; text-transform: uppercase; letter-spacing: .04em; opacity: .7; }
.loginForm__input {
  appearance: none;
  width: 100%;
  font: inherit;
  font-size: 1rem;
  padding: .95rem 1.1rem;
  color: var(--c-navy);
  background: #fff;
  border: 1.5px solid rgba(27, 42, 74, .18);
  border-radius: .75rem;
  outline: none;
  transition: border-color .25s ease, box-shadow .25s ease;
}
.loginForm__input::placeholder { color: rgba(27, 42, 74, .35); }
.loginForm__input:focus { border-color: var(--c-cyan); box-shadow: 0 0 0 4px rgba(0, 229, 208, .2); }
.loginForm__error { margin: 0; font-size: .85rem; color: var(--c-hazard); }
.loginForm__submit {
  display: inline-flex; align-items: center; justify-content: center; gap: .6rem;
  margin-top: .5rem;
  padding: 1rem 1.5rem;
  font: inherit; font-size: 1rem;
  color: var(--c-navy);
  background: var(--c-brand);
  border: 0; border-radius: 3.5714285714rem;
  cursor: pointer;
  transition: transform .35s cubic-bezier(.4, 0, 0, 1), background-color .25s ease;
}
.loginForm__submit svg { transition: transform .35s cubic-bezier(.4, 0, 0, 1); }
.loginForm__submit:hover { background: var(--c-cyan); transform: translateY(-2px); }
.loginForm__submit:hover svg { transform: translate(2px, -2px); }
.loginForm__submit:disabled { opacity: .6; cursor: default; transform: none; }
.loginForm__hint { margin: .5rem 0 0; font-size: .85rem; opacity: .8; }
.loginForm__link { color: var(--c-navy); text-decoration: underline; text-underline-offset: .2em; transition: color .2s ease; }
.loginForm__link:hover { color: var(--c-cyan); }
</style>
