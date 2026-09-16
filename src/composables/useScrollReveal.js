import { onUnmounted } from 'vue';
import { gsap } from 'gsap';

/**
 * Reveal-on-scroll for plain pages: elements with `[data-reveal]` slide/fade in
 * when they enter the viewport (masked lines use `.reveal > *`). Call `arm()`
 * after the page's initial reveal so nothing pops in before the loader is gone.
 */
export function useScrollReveal(rootRef) {
  let io = null;
  const show = (el) => {
    const lines = el.querySelectorAll('.reveal > *');
    if (lines.length) gsap.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, clearProps: 'transform' });
    const fades = el.matches('[data-reveal]') && !lines.length ? [el] : [...el.querySelectorAll('.fade')];
    if (fades.length) gsap.fromTo(fades, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, delay: lines.length ? 0.25 : 0, clearProps: 'all' });
    el.querySelectorAll('[data-progress]').forEach((bar) => gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.out', delay: 0.2 }));
  };
  const arm = () => {
    const root = rootRef.value;
    if (!root) return;
    const targets = [...root.querySelectorAll('[data-reveal]')];
    targets.forEach((t) => { t.style.visibility = 'visible'; });
    io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    targets.forEach((t) => io.observe(t));
  };
  onUnmounted(() => io?.disconnect());
  return { arm };
}
