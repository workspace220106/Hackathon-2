import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  computed,
  createCommentVNode,
  createElementBlock,
  createElementVNode,
  normalizeStyle,
  onMounted,
  onUnmounted,
  openBlock,
  ref
} from 'vue';
import {
  getScrollY,
  isRectNearViewport,
  onScroll
} from '../composables/useLenisScroll.js';
import {
  useMediaAutoplay
} from '../composables/useMediaAutoplay.js';
import {
  toCompressedShowreel,
  toWebpMedia
} from '../config/media-paths.js';
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
import {
  mapRange
} from '../utils/map-range.js';

const lQ = ["src"];

const cQ = ["src"];

const uQ = ["src"];

const hQ = ["src"];

const MediaComponentSfc = {
  __name: "MediaComponent",
  props: {
    url: {
      type: String,
      default: null
    },
    url2: {
      type: String,
      default: null
    },
    poster: {
      type: String,
      default: null
    },
    isVideo: {
      type: Boolean,
      default: !1
    },
    parallaxMaskAmount: {
      type: Number,
      default: 20
    },
    parallaxScaleAmount: {
      type: Number,
      default: .05
    },
    parallaxRotateAmount: {
      type: Number,
      default: -3
    },
    parallaxPositionAmount: {
      type: Number,
      default: -200
    },
    scaleOffsetAmount: {
      type: Number,
      default: 1.1
    },
    hasParallaxMask: {
      type: Boolean,
      default: !0
    },
    hasParallaxScale: {
      type: Boolean,
      default: !1
    },
    hasParallaxRotation: {
      type: Boolean,
      default: !1
    },
    hasParallaxPosition: {
      type: Boolean,
      default: !1
    }
  },
  setup(s) {
    const e = s,
      t = ref(),
      n = ref(),
      i = ref(),
      r = ref(),
      o = ref(),
      a = ref(typeof window < "u" ? window.innerWidth : 1025),
      l = computed(() => toWebpMedia(e.url)),
      u = computed(() => e.url2 ? toCompressedShowreel(e.url2, a.value) : null),
      h = computed(() => {
        if (e.poster) return e.poster;
        const w = e.url || e.url2;
        return !w || !/\.(webm|mp4)$/i.test(w) ? null : w.replace(/\.(webm|mp4)$/i, "-poster.webp")
      }),
      c = computed(() => {
        if (h.value) return {
          backgroundImage: `url(${h.value})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }
      });
    let d = null,
      f = null,
      A = 0,
      m = null,
      g = !1;
    const p = () => e.isVideo ? n.value : i.value,
      _ = w => {
        m == null || !w || (typeof w.cancelVideoFrameCallback == "function" && w.cancelVideoFrameCallback(m), m = null)
      },
      v = () => {
        if (g) return;
        g = !0;
        const w = r.value;
        w && (w.style.opacity = "0")
      },
      y = () => {
        const w = i.value;
        if (!w) return;
        const R = ++A;
        if (h.value && !g) {
          const B = () => {
            R === A && v()
          };
          if (_(w), typeof w.requestVideoFrameCallback == "function") m = w.requestVideoFrameCallback(() => {
            m = null, B()
          });
          else {
            const N = () => {
              w.removeEventListener("playing", N), R === A && requestAnimationFrame(B)
            };
            w.addEventListener("playing", N)
          }
        }
        w.play().catch(() => {})
      },
      b = () => {
        var w;
        A += 1, _(i.value), (w = i.value) == null || w.pause()
      },
      S = w => {
        if (!w) return;
        const R = w.getBoundingClientRect(),
          B = getScrollY();
        o.value = new DOMRect(R.x, R.y + B, R.width, R.height)
      },
      T = () => {
        t.value && (t.value.style.transform = "");
        const w = p();
        w && (w.style.transform = "")
      },
      C = w => {
        if (!t.value || !o.value) return;
        if (!isRectNearViewport(w, o.value)) {
          T();
          return
        }
        const R = o.value.top - window.innerHeight,
          B = o.value.top + o.value.height,
          N = o.value.top - window.innerHeight * .25,
          k = mapRange(w, [R, B], [-1, 1]) * e.parallaxMaskAmount,
          O = mapRangeClamped(w, [R, N], [1, 0]) * e.parallaxScaleAmount,
          Y = mapRangeClamped(w, [R, B], [0, 1]) * e.parallaxRotateAmount,
          G = mapRangeClamped(w, [R, B], [-1, 1]) * e.parallaxPositionAmount;
        t.value && (e.hasParallaxScale && (t.value.style.transform = `scale(${1-O})`), e.hasParallaxPosition && !isTabletWidth() && (t.value.style.transform = `translate3d(0, ${G}px, 0)`), e.hasParallaxScale && e.hasParallaxPosition && (t.value.style.transform = `scale(${1-O}) translate3d(0, ${G}px, 0)`), e.hasParallaxRotation && (t.value.style.transform = `rotate(${Y}deg)`));
        const z = p();
        z && (e.hasParallaxScale ? z.style.transform = `translate3d(0, ${k}%, 0) scale(${1*e.scaleOffsetAmount+O})` : z.style.transform = `translate3d(0, ${k}%, 0) scale(${1*e.scaleOffsetAmount})`)
      },
      x = () => {
        a.value = window.innerWidth, t.value && S(t.value), app.lenis && C(app.lenis.animatedScroll)
      };
    return emitter.on(EVENTS.RESIZE, x), onMounted(() => {
      S(t.value), d = onScroll(C), e.isVideo && i.value && (f = useMediaAutoplay(i.value, {
        onVisible: y,
        onHidden: b
      })), app.lenis && C(app.lenis.animatedScroll)
    }), onUnmounted(() => {
      A += 1, _(i.value), emitter.off(EVENTS.RESIZE, x), d == null || d(), f == null || f()
    }), (w, R) => (openBlock(), createElementBlock("div", {
      ref_key: "mediaComponentRef",
      ref: t,
      class: "mediaComponent"
    }, [e.isVideo ? (openBlock(), createElementBlock("div", {
      key: 1,
      ref_key: "mediaTransformRef",
      ref: n,
      class: "mediaComponent__media",
      style: normalizeStyle(c.value)
    }, [createElementVNode("video", {
      ref_key: "mediaRef",
      ref: i,
      class: "mediaComponent__video",
      loop: "",
      muted: "",
      playsinline: "",
      preload: "metadata"
    }, [createElementVNode("source", {
      src: s.url,
      type: "video/webm"
    }, null, 8, cQ), u.value ? (openBlock(), createElementBlock("source", {
      key: 0,
      src: u.value,
      type: "video/mp4"
    }, null, 8, uQ)) : createCommentVNode("", !0)], 512), h.value ? (openBlock(), createElementBlock("img", {
      key: 0,
      ref_key: "posterRef",
      ref: r,
      class: "mediaComponent__poster",
      src: h.value,
      alt: "",
      "aria-hidden": "true"
    }, null, 8, hQ)) : createCommentVNode("", !0)], 4)) : (openBlock(), createElementBlock("img", {
      key: 0,
      ref_key: "mediaRef",
      ref: i,
      class: "mediaComponent__media",
      src: l.value,
      alt: "",
      loading: "lazy"
    }, null, 8, lQ))], 512))
  }
};

export const MediaComponent = _export_sfc(MediaComponentSfc, [
  ["__scopeId", "data-v-229b2ac0"]
]);
