import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  gsap
} from 'gsap';
import {
  createBlock,
  createCommentVNode,
  createElementVNode,
  createVNode,
  nextTick,
  onMounted,
  onUnmounted,
  openBlock,
  ref,
  withCtx
} from 'vue';
import {
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
  clamp
} from '../utils/clamp.js';
import {
  isTabletWidth
} from '../utils/device.js';
import {
  getOffset
} from '../utils/dom.js';
import {
  mapRange
} from '../utils/map-range.js';
import {
  GridWrapper
} from './GridWrapper.js';
import {
  TextComponent
} from './TextComponent.js';

const HeaderBlockSfc = {
  __name: "HeaderBlock",
  props: {
    cameraParams: {
      type: Object,
      default: null
    },
    description: {
      type: String,
      default: ""
    },
    scrollIndication: {
      type: String,
      default: ""
    },
    mobileScrollRangeScale: {
      type: Number,
      default: 1
    },
    contentParallaxAmount: {
      type: Number,
      default: 800
    },
    contentFadeStartProgress: {
      type: Number,
      default: .2
    },
    contentFadeEndProgress: {
      type: Number,
      default: .45
    },
    revealArrivalDelay: {
      type: Number,
      default: .01
    },
    firstLoadRevealExtraDelay: {
      type: Number,
      default: .9
    },
    pageTransitionRevealDelay: {
      type: Number,
      default: 0
    },
    descriptionRevealDelay: {
      type: Number,
      default: 0
    },
    scrollIndicationRevealDelay: {
      type: Number,
      default: 0
    },
    textRevealStagger: {
      type: Number,
      default: .25
    }
  },
  setup(s, {
    expose: e
  }) {
    const t = (S, T) => ({
        x: S.x * T,
        y: S.y * T,
        z: S.z * T
      }),
      n = ref(),
      i = ref(),
      r = ref(),
      o = ref(),
      a = ref(),
      l = ref();
    let u = !1,
      h = null,
      c = null;
    const d = s,
      f = S => getOffset(S),
      A = ({
        isPageTransition: S = !1
      } = {}) => {
        if (u) return;
        h == null || h.kill();
        const T = S ? d.pageTransitionRevealDelay : d.revealArrivalDelay + d.firstLoadRevealExtraDelay;
        h = gsap.delayedCall(T, () => {
          h = null, g()
        })
      },
      m = () => {
        nextTick(() => {
          A({
            isPageTransition: !0
          })
        })
      },
      g = () => {
        var x;
        if (u) return;
        const S = o.value,
          T = a.value;
        if (!d.description && !d.scrollIndication) {
          u = !0;
          return
        }
        if (!(S != null && S.textRevealTL) || !(T != null && T.textRevealTL)) {
          nextTick(g);
          return
        }
        u = !0, (x = l.value) == null || x.kill();
        const C = gsap.timeline();
        C.add(S.textRevealTL(), 0), C.add(T.textRevealTL(), d.textRevealStagger), l.value = C
      },
      p = () => {
        A({
          isPageTransition: !1
        })
      },
      _ = () => app.isLoaderRevealComplete && !app.firstReveal,
      v = S => {
        const T = i.value,
          C = r.value;
        if (!T || !(C != null && C.height)) return;
        if (isTabletWidth()) {
          T.style.transform = "", T.style.opacity = "1", T.style.willChange = "";
          return
        }
        const x = clamp(S / C.height, 0, 1);
        if (x <= 0) {
          T.style.transform = "", T.style.opacity = "", T.style.willChange = "";
          return
        }
        const w = x * d.contentParallaxAmount;
        T.style.transform = `translateY(${w}%)`;
        const R = clamp(mapRange(x, [d.contentFadeStartProgress, d.contentFadeEndProgress], [0, 1]), 0, 1);
        T.style.opacity = String(1 - R), T.style.willChange = x < 1 ? "transform, opacity" : ""
      },
      y = () => {
        var T;
        const S = (T = n.value) == null ? void 0 : T.$el;
        S && (r.value = f(S), app.webgl.setHeaderScrollRect(r.value), app.lenis && v(app.lenis.animatedScroll))
      },
      b = () => {
        if (!app.lenis || !r.value || !d.cameraParams) return;
        const S = isTabletWidth() ? d.mobileScrollRangeScale : 1;
        app.webgl.camera.setScrollHeaderPositions(app.lenis.animatedScroll, r.value, t(d.cameraParams.scrollRangePosition, S), t(d.cameraParams.scrollRangeRotation, S), d.cameraParams.scrollOffsetPosition, d.cameraParams.scrollOffsetRotation)
      };
    return e({
      show: g
    }), onMounted(() => {
      var T;
      const S = (T = n.value) == null ? void 0 : T.$el;
      if (S) {
        if (r.value = f(S), app.webgl.setHeaderScrollRect(r.value), emitter.on(EVENTS.RESIZE, y), emitter.on(EVENTS.RENDER, b), emitter.on(EVENTS.LOADER_REVEAL_COMPLETE, p), c = onScroll(v), app.lenis && v(app.lenis.animatedScroll), _()) {
          m();
          return
        }
        app.isLoaderRevealComplete && app.skipLoader && p()
      }
    }), onUnmounted(() => {
      c == null || c(), c = null, i.value && (i.value.style.transform = "", i.value.style.opacity = "", i.value.style.willChange = ""), app.webgl.setHeaderScrollRect(null), emitter.off(EVENTS.RESIZE, y), emitter.off(EVENTS.RENDER, b), emitter.off(EVENTS.LOADER_REVEAL_COMPLETE, p)
    }), (S, T) => (openBlock(), createBlock(GridWrapper, {
      ref_key: "headerBlockRef",
      ref: n,
      class: "headerBlock"
    }, {
      default: withCtx(() => [createElementVNode("div", {
        ref_key: "contentRef",
        ref: i,
        class: "headerBlock__content"
      }, [s.description ? createVNode(TextComponent, {
        key: 0,
        ref_key: "descriptionRef",
        ref: o,
        class: "content__description",
        content: s.description,
        "reveal-on-scroll": !1,
        "is-from-to-reveal": !0,
        "reveal-delay": s.descriptionRevealDelay
      }, null, 8, ["content", "reveal-delay"]) : createCommentVNode("", !0), s.scrollIndication ? createVNode(TextComponent, {
        key: 1,
        ref_key: "scrollIndicationRef",
        ref: a,
        class: "content__scrollIndication",
        content: s.scrollIndication,
        "only-one-line": !0,
        "reveal-on-scroll": !1,
        "is-from-to-reveal": !0,
        "reveal-delay": s.scrollIndicationRevealDelay
      }, null, 8, ["content", "reveal-delay"]) : createCommentVNode("", !0)], 512)]),
      _: 1
    }, 512))
  }
};

export const HeaderBlock = _export_sfc(HeaderBlockSfc, [
  ["__scopeId", "data-v-9a2f8b06"]
]);
