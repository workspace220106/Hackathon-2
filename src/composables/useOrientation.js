import {
  onMounted,
  onUnmounted,
  ref
} from 'vue';
import {
  isTouch
} from '../utils/device.js';

function isLandscape() {
  return window.innerWidth > window.innerHeight || window.matchMedia("(orientation: landscape)").matches
}

function isIPadLike() {
  const s = navigator.userAgent || "";
  return /iPad/.test(s) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 || /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(s) ? !0 : window.matchMedia("(hover: hover) and (pointer: fine)").matches ? !1 : isTouch()
}

export function isTabletDevice() {
  return isIPadLike()
}

function isTabletLandscape() {
  return isIPadLike() && isLandscape()
}

export function useOrientation() {
  const s = ref(isTabletLandscape()),
    e = () => {
      s.value = isTabletLandscape()
    },
    t = () => {
      e(), requestAnimationFrame(e)
    };
  let n;
  return onMounted(() => {
    e(), n = window.matchMedia("(orientation: landscape)"), n.addEventListener("change", t), window.addEventListener("orientationchange", t), window.addEventListener("resize", e)
  }), onUnmounted(() => {
    n == null || n.removeEventListener("change", t), window.removeEventListener("orientationchange", t), window.removeEventListener("resize", e)
  }), {
    isVisible: s,
    update: e
  }
}
