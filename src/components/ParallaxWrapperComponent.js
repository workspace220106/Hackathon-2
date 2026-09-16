import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  createElementBlock,
  onMounted,
  onUnmounted,
  openBlock,
  ref,
  renderSlot
} from 'vue';
import {
  getScrollY,
  isRectNearViewport,
  onScroll
} from '../composables/useLenisScroll.js';
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
  isTabletWidth
} from '../utils/device.js';

const ParallaxWrapperSfc = {
  __name: "ParallaxWrapperComponent",
  props: {
    parallaxAmount: {
      type: Number,
      default: -200
    }
  },
  setup(s) {
    const e = s,
      t = ref(),
      n = ref();
    let i = null;
    const r = l => {
        if (!l) return;
        const u = l.getBoundingClientRect(),
          h = getScrollY();
        n.value = new DOMRect(u.x, u.y + h, u.width, u.height)
      },
      o = () => {
        if (t.value && !isTabletWidth() && r(t.value), app.lenis) {
          a(app.lenis.animatedScroll);
          return
        }
        t.value && (t.value.style.transform = "")
      },
      a = l => {
        if (!t.value || !n.value) return;
        if (isTabletWidth() || !isRectNearViewport(l, n.value)) {
          t.value.style.transform = "";
          return
        }
        const u = n.value.top - window.innerHeight,
          h = n.value.top + n.value.height,
          c = mapRangeClamped(l, [u, h], [-1, 1]) * e.parallaxAmount;
        t.value.style.transform = `translate3d(0, ${c}px, 0)`
      };
    return emitter.on(EVENTS.RESIZE, o), onMounted(() => {
      r(t.value), i = onScroll(a), app.lenis && a(app.lenis.animatedScroll)
    }), onUnmounted(() => {
      emitter.off(EVENTS.RESIZE, o), i == null || i()
    }), (l, u) => (openBlock(), createElementBlock("div", {
      ref_key: "parallaxComponentRef",
      ref: t,
      class: "parallaxComponent"
    }, [renderSlot(l.$slots, "default", {}, void 0)], 512))
  }
};

export const ParallaxWrapperComponent = _export_sfc(ParallaxWrapperSfc, [
  ["__scopeId", "data-v-72708019"]
]);
