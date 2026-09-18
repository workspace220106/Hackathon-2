import {
  app
} from '../core/App.js';

const SCROLL_VISIBILITY_MARGIN = 200;

const scrollListeners = new Set;

let lenisScrollBound = !1;

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

// Listeners get the current scroll position. Lenis emits "scroll" while it drives
// the page, but on touch devices (native scrolling) it can stop emitting after an
// interrupted programmatic scrollTo — so the native window scroll event is bound
// as well, deduplicated by value.
let lastY = null;
const onNativeScroll = () => {
  // no smooth scroll (touch): the page scrolls natively, trust window.scrollY
  const y = app.hasNoSmoothScroll ? window.scrollY : getScrollY();
  if (y === lastY) return;
  lastY = y;
  scrollListeners.forEach(t => t(y));
};
const onLenisScrollDedup = s => {
  lastY = s.animatedScroll;
  scrollListeners.forEach(t => t(s.animatedScroll));
};

export function onScroll(s) {
  scrollListeners.add(s);
  if (!lenisScrollBound) {
    app.lenis && app.lenis.on("scroll", onLenisScrollDedup);
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    lenisScrollBound = !0;
  }
  return () => {
    scrollListeners.delete(s);
    if (scrollListeners.size === 0 && lenisScrollBound) {
      app.lenis && app.lenis.off("scroll", onLenisScrollDedup);
      window.removeEventListener("scroll", onNativeScroll);
      lenisScrollBound = !1;
    }
  }
}
