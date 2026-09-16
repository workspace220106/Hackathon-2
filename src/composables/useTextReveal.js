import {
  gsap
} from 'gsap';
import {
  nextTick,
  onMounted,
  onUnmounted
} from 'vue';
import {
  app
} from '../core/App.js';
import {
  EVENTS,
  emitter
} from '../core/events.js';
import {
  mapRangeClamped
} from '../utils/clamp.js';
import {
  isTabletWidth,
  isTouch
} from '../utils/device.js';
import {
  getOffset
} from '../utils/dom.js';

export function isTouchTablet() {
  return isTouch() && isTabletWidth()
}

export function scaleStagger(s, e = 1.35) {
  return s / e
}

export function useTextReveal({
  triggerRef: s,
  getTextComponents: e,
  stagger: t,
  enabled: n = isTouchTablet(),
  expectedCount: i = 0
}) {
  let r, o = !1;
  const a = () => e().filter(d => d == null ? void 0 : d.textRevealTL),
    l = d => {
      if (!s.value) return 0;
      const f = getOffset(s.value),
        A = f.top - window.innerHeight,
        m = f.top + f.height;
      return Number(mapRangeClamped(d, [A, m], [0, 1]).toFixed(5))
    },
    u = () => {
      const d = a();
      if (i > 0 && d.length < i) return !1;
      r == null || r.kill();
      const f = gsap.timeline();
      return d.forEach((A, m) => {
        f.add(A.textRevealTL(), m * t)
      }), r = f, !0
    },
    h = d => {
      if (!n) return;
      const f = l(d.animatedScroll);
      f > 0 && !o && u() && (o = !0), f <= 0 && (o = !1)
    },
    c = () => {
      !n || !app.lenis || !o || l(app.lenis.animatedScroll) > 0 && u()
    };
  return onMounted(async () => {
    !n || !app.lenis || (await nextTick(), app.lenis.on("scroll", h), emitter.on(EVENTS.RESIZE, c), l(app.lenis.animatedScroll) > 0 && u() && (o = !0))
  }), onUnmounted(() => {
    r == null || r.kill(), !(!n || !app.lenis) && (app.lenis.off("scroll", h), emitter.off(EVENTS.RESIZE, c))
  }), {
    enabled: n,
    triggerGroupedReveal: u
  }
}
