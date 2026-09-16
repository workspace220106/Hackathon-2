import {
  app
} from '../core/App.js';

const SCROLL_VISIBILITY_MARGIN = 200;

const scrollListeners = new Set;

let lenisScrollBound = !1;

const onLenisScroll = s => {
  const e = s.animatedScroll;
  scrollListeners.forEach(t => t(e))
};

export const getScrollY = () => {
  var s;
  return ((s = app.lenis) == null ? void 0 : s.animatedScroll) ?? window.scrollY
};

export function isRectNearViewport(s, e, t = SCROLL_VISIBILITY_MARGIN) {
  if (!e) return !1;
  const n = s - t,
    i = s + window.innerHeight + t;
  return e.bottom > n && e.top < i
}

export function onScroll(s) {
  return scrollListeners.add(s), !lenisScrollBound && app.lenis && (app.lenis.on("scroll", onLenisScroll), lenisScrollBound = !0), () => {
    scrollListeners.delete(s), scrollListeners.size === 0 && lenisScrollBound && app.lenis && (app.lenis.off("scroll", onLenisScroll), lenisScrollBound = !1)
  }
}
