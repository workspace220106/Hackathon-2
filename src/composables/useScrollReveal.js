import { onUnmounted } from 'vue';
import { gsap } from 'gsap';

/**
 * Reveal-on-scroll: elements with `[data-reveal]` slide/fade in smoothly.
 * Prevents elements from disappearing/flashing when scrolled into view.
 */
export function useScrollReveal(rootRef) {
  let io = null;

  const show = (el) => {
    if (!el || el._revealed) return;
    el._revealed = true;
    el.style.visibility = 'visible';

    const lines = el.querySelectorAll('.reveal > *');
    if (lines.length) {
      gsap.to(lines, {
        yPercent: 0,
        duration: 1.0,
        ease: 'expo.out',
        stagger: 0.06,
        clearProps: 'transform'
      });
    }

    const fadeTargets = el.querySelectorAll('.fade');
    const fades = fadeTargets.length ? [...fadeTargets] : [el];
    gsap.to(fades, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.06,
      delay: lines.length ? 0.15 : 0,
      clearProps: 'all'
    });

    el.querySelectorAll('[data-progress]').forEach((bar) => {
      gsap.to(bar, { scaleX: 1, duration: 1.0, ease: 'expo.out', delay: 0.15 });
    });
  };

  const arm = () => {
    const root = rootRef.value;
    if (!root) return;

    const targets = [...root.querySelectorAll('[data-reveal]')];
    if (!targets.length) return;

    // Set initial hidden state before observing so there is no jarring snap
    targets.forEach((t) => {
      t.style.visibility = 'visible';
      const lines = t.querySelectorAll('.reveal > *');
      if (lines.length) gsap.set(lines, { yPercent: 110 });
      const fadeTargets = t.querySelectorAll('.fade');
      const fades = fadeTargets.length ? [...fadeTargets] : [t];
      gsap.set(fades, { opacity: 0, y: 20 });
      t.querySelectorAll('[data-progress]').forEach((bar) => gsap.set(bar, { scaleX: 0 }));
    });

    io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          show(e.target);
          io.unobserve(e.target);
        }
      }
    }, { rootMargin: '0px 0px 40px 0px', threshold: 0.01 });

    targets.forEach((t) => {
      const rect = t.getBoundingClientRect();
      // If already in viewport on mount, show immediately
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        show(t);
      } else {
        io.observe(t);
      }
    });
  };

  onUnmounted(() => io?.disconnect());
  return { arm };
}
