export function isTabletWidth() {
  return window.innerWidth < 1025
}

export function isTouch() {
  return window.matchMedia("(pointer: coarse)").matches ? !0 : window.matchMedia("(pointer: fine)").matches ? !1 : "ontouchstart" in window || navigator.maxTouchPoints > 0
}
