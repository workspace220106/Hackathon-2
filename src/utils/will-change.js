export function setWillChange(s, e, t = "transform") {
  (Array.isArray(s) ? s : [s]).flat().filter(Boolean).forEach(i => {
    e ? i.style.willChange = t : i.style.removeProperty("will-change")
  })
}

export function willChangeDuringTween(s, e) {
  const t = n => setWillChange(e(), n);
  s.eventCallback("onStart", () => t(!0)), s.eventCallback("onComplete", () => t(!1)), s.eventCallback("onInterrupt", () => t(!1))
}

export const GSAP_DEFAULTS = {
  force3D: !0
};
