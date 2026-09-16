const AUTOPLAY_OBSERVER_OPTIONS = {
  root: null,
  rootMargin: "0px",
  threshold: 0
};

const autoplayEntries = new Map;

const autoplaySuspended = new Set;

let autoplayPaused = !1;

const applyAutoplay = (s, e, t) => {
  if (e) {
    if (t != null && t.onVisible) {
      t.onVisible();
      return
    }
    s.play().catch(() => {});
    return
  }
  if (!autoplayPaused) {
    if (t != null && t.onHidden) {
      t.onHidden();
      return
    }
    s.pause()
  }
};

export function suspendMediaAutoplay() {
  autoplayPaused = !0, autoplayEntries.forEach((s, e) => {
    s.observer.disconnect(), autoplaySuspended.add(e)
  }), autoplayEntries.clear()
}

export function resumeMediaAutoplay() {
  autoplayPaused = !1, autoplaySuspended.forEach(s => {
    s.pause()
  }), autoplaySuspended.clear()
}

export function useMediaAutoplay(s, e = {}) {
  if (!s) return () => {};
  const {
    onVisible: t,
    onHidden: n,
    ...i
  } = e, r = {
    ...AUTOPLAY_OBSERVER_OPTIONS,
    ...i
  };
  s.pause();
  const o = {
      observer: null,
      options: r,
      onVisible: t,
      onHidden: n
    },
    a = new IntersectionObserver(l => {
      l.forEach(u => {
        u.target === s && applyAutoplay(s, u.isIntersecting, o)
      })
    }, r);
  return o.observer = a, a.observe(s), autoplayEntries.set(s, o), () => {
    if (a.disconnect(), autoplayEntries.delete(s), autoplayPaused) {
      autoplaySuspended.add(s);
      return
    }
    n == null || n(), s.pause()
  }
}
