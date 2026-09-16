import { onMounted, onUnmounted, ref } from 'vue';
import { app } from '../core/App.js';
import { EVENTS, emitter } from '../core/events.js';

/**
 * Lifecycle glue for pages that have no WebGL environment (login, dashboard…):
 * hides the 3D groups, resets smooth scroll and tells the caller when to play
 * its reveal animation (first load after the loader, or after a page transition).
 */
export function usePlainPage(routeName, onReveal) {
  const revealed = ref(false);
  const reveal = () => { if (!revealed.value) { revealed.value = true; onReveal?.(); } };
  const show = (isInitial) => {
    app.webgl?.scene?.show(routeName);
    app.resetSmoothScroll();
    if (!isInitial) emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, null, false);
    reveal();
  };
  const onPlainPage = (name) => { if (name === routeName) show(false); };
  const onInitial = () => show(true);
  onMounted(() => {
    if (app.firstReveal) { app.firstReveal = false; if (app.isLoaderRevealComplete) show(true); }
    emitter.on(EVENTS.SHOW_PLAIN_PAGE, onPlainPage);
    emitter.on(EVENTS.PLAIN_PAGE_INITIAL_REVEAL, onInitial);
    emitter.on(EVENTS.LOADER_REVEAL_COMPLETE, onInitial);
  });
  onUnmounted(() => {
    emitter.off(EVENTS.SHOW_PLAIN_PAGE, onPlainPage);
    emitter.off(EVENTS.PLAIN_PAGE_INITIAL_REVEAL, onInitial);
    emitter.off(EVENTS.LOADER_REVEAL_COMPLETE, onInitial);
  });
  return { revealed };
}
