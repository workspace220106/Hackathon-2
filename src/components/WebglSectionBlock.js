import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  gsap
} from 'gsap';
import {
  SplitText
} from 'gsap/SplitText';
import {
  Fragment,
  computed,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createElementVNode,
  nextTick,
  onMounted,
  onUnmounted,
  openBlock,
  ref,
  renderList,
  toDisplayString,
  withCtx
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
  isTabletWidth
} from '../utils/device.js';
import {
  GridWrapper
} from './GridWrapper.js';

const $z = {
  class: "textWrapper__inner"
};

const nS = .15;

const eV = .72;

const tV = 8;

const nV = .9;

const iV = 0;

const sV = .35;

const WebglSectionBlockSfc = {
  __name: "WebglSectionBlock",
  props: {
    experiences: {
      type: Object,
      default: null
    },
    text: {
      type: String,
      default: null
    },
    textLines: {
      type: Array,
      default: null
    },
    cameraParams: {
      type: Object,
      default: null
    }
  },
  setup(s, {
    expose: e
  }) {
    const t = ref(),
      n = ref(),
      i = ref(),
      r = ref(),
      o = ref(),
      a = ref();
    let l = [],
      u = [],
      h = null,
      c = null,
      d = null,
      f = !1,
      A = null;
    const m = {
        type: "chars",
        charsClass: "webglSection-char",
        autoSplit: !1
      },
      g = s,
      p = computed(() => {
        var oe;
        return (oe = g.textLines) != null && oe.length ? g.textLines : g.text ? [g.text] : []
      }),
      _ = () => {
        var oe;
        return ((oe = app.webgl) == null ? void 0 : oe._webglSectionRevealLocked) ?? !1
      },
      v = oe => {
        const E = oe.getBoundingClientRect();
        return new DOMRect(E.x, E.y + window.scrollY, E.width, E.height)
      },
      y = () => p.value.join("").replace(/\s/g, "").length,
      b = oe => [...oe.querySelectorAll(".text__line")],
      S = oe => oe.flatMap(E => (E == null ? void 0 : E.chars) ?? []),
      T = oe => oe.filter(E => {
        var L;
        return (L = E.textContent) == null ? void 0 : L.length
      }).length,
      C = oe => {
        const E = y(),
          L = Math.max(8, Math.floor(E * .6));
        return T(oe) >= L
      },
      x = oe => {
        if (!oe) return;
        const E = b(oe),
          L = p.value;
        E.forEach((X, $) => {
          X.replaceChildren(), X.textContent = L[$] ?? ""
        })
      },
      w = ({
        force: oe = !1
      } = {}) => {
        if (!(_() && !oe)) {
          if (f) {
            x(r.value), x(o.value), f = !1, u = [], l = [];
            return
          }
          for (const E of u) E.revert();
          for (const E of l) E.revert();
          u = [], l = []
        }
      },
      R = oe => {
        const E = [];
        for (const L of b(oe)) {
          const X = L.textContent ?? "";
          L.replaceChildren();
          for (const $ of X) {
            const se = document.createElement("span");
            se.className = "webglSection-char", se.textContent = $, se.style.display = "inline-block", L.appendChild(se), E.push(se)
          }
        }
        return E
      },
      B = () => {
        f = !0, l = [], u = [];
        const oe = R(r.value),
          E = R(o.value);
        gsap.set(oe, {
          opacity: nS,
          display: "inline-block"
        }), gsap.set(E, {
          opacity: 0,
          display: "inline-block"
        })
      },
      N = () => {
        const oe = S(u);
        return oe.length ? oe : [...document.querySelectorAll(".webglSectionBlock__text--reveal .webglSection-char")]
      },
      k = () => {
        const oe = S(l);
        return oe.length ? oe : [...document.querySelectorAll(".webglSectionBlock__text--base .webglSection-char")]
      },
      O = () => {
        const oe = N();
        return oe.length ? oe.map(E => Number(gsap.getProperty(E, "opacity"))) : null
      },
      Y = () => {
        var L;
        const oe = (L = app.webgl) == null ? void 0 : L._webglSectionRevealSnapshot,
          E = N();
        !E.length || !(oe != null && oe.length) || E.forEach((X, $) => {
          oe[$] === null || oe[$] === void 0 || gsap.set(X, {
            opacity: oe[$]
          })
        })
      },
      G = () => {
        _() || (app.webgl._webglSectionRevealLocked = !0, app.webgl._webglSectionRevealSnapshot = O())
      },
      z = () => {
        app.webgl._webglSectionRevealLocked = !1, app.webgl._webglSectionRevealSnapshot = null, de(0)
      },
      Q = oe => {
        const E = b(oe);
        return E.length ? E.map(L => SplitText.create(L, m)) : []
      },
      M = async ({
        retry: oe = 0
      } = {}) => {
        var se, H;
        if (_() || ((se = document.fonts) != null && se.ready && await document.fonts.ready, await nextTick(), !r.value || !o.value || !p.value.length)) return;
        const E = ((H = r.value.textContent) == null ? void 0 : H.replace(/\s/g, "")) ?? "",
          L = y();
        if (!E.length || L > 0 && E.length < L * .5) {
          oe < 6 && (clearTimeout(d), d = setTimeout(() => {
            M({
              retry: oe + 1
            })
          }, 80));
          return
        }
        w(), l = Q(r.value), u = Q(o.value);
        const X = k(),
          $ = N();
        if (!C(X) || !C($)) {
          if (w(), oe < 6) {
            clearTimeout(d), d = setTimeout(() => {
              M({
                retry: oe + 1
              })
            }, 120);
            return
          }
          x(r.value), x(o.value), B();
          return
        }
        f = !1, gsap.set(X, {
          opacity: nS,
          display: "inline-block"
        }), gsap.set($, {
          opacity: 0,
          display: "inline-block"
        })
      }, ne = () => {
        clearTimeout(d), d = setTimeout(() => {
          M().then(() => {
            var oe;
            de(q(((oe = app.lenis) == null ? void 0 : oe.animatedScroll) ?? window.scrollY))
          })
        }, 80)
      }, V = () => {
        !document.fonts || A || (A = () => {
          if (!p.value.length || _()) return;
          const oe = N();
          C(oe) || ne()
        }, document.fonts.addEventListener("loadingdone", A))
      }, ae = () => {
        !document.fonts || !A || (document.fonts.removeEventListener("loadingdone", A), A = null)
      }, ge = () => {
        ne()
      }, q = oe => {
        if (!a.value) return 0;
        const E = window.innerHeight,
          L = isTabletWidth() ? sV : iV,
          X = a.value.top - E * nV,
          $ = a.value.top - E * L;
        return mapRangeClamped(oe, [X, $], [0, 1])
      }, de = oe => {
        if (_()) {
          Y();
          return
        }
        const E = N();
        if (!E.length) return;
        const L = E.length,
          X = gsap.utils.clamp(0, 1, oe),
          $ = 1 / L * tV;
        E.forEach((se, H) => {
          const Ce = H / L * eV,
            Ee = Ce + $,
            Re = gsap.utils.mapRange(Ce, Ee, 0, 1, X);
          gsap.set(se, {
            opacity: gsap.utils.clamp(0, 1, Re)
          })
        })
      }, he = oe => {
        const E = (oe == null ? void 0 : oe.width) ?? window.innerWidth,
          L = (oe == null ? void 0 : oe.height) ?? window.innerHeight;
        return h === null ? (h = E, c = L, !0) : E === h && L === c ? !1 : (h = E, c = L, !0)
      }, ie = oe => {
        de(q(oe.animatedScroll))
      }, me = oe => {
        var E;
        (E = t.value) != null && E.$el && (n.value = v(t.value.$el), app.webgl.setWebglSectionScrollRect(n.value), !_() && he(oe) && (a.value = i.value ? v(i.value) : null, nextTick(() => ne())))
      }, Le = () => {
        !app.lenis || !n.value || !g.cameraParams || app.webgl.camera.setScrollSectionPositions(app.lenis.animatedScroll, n.value, g.cameraParams.scrollRangePosition, g.cameraParams.scrollRangeRotation, g.cameraParams.scrollOffsetPosition, g.cameraParams.scrollOffsetRotation)
      };
    return app.webgl._webglSectionRevealListenersReady || (app.webgl._webglSectionRevealListenersReady = !0, emitter.on(EVENTS.WEBGL_SECTION_REVEAL_LOCK, G), emitter.on(EVENTS.WEBGL_SECTION_REVEAL_RESET, z)), emitter.on(EVENTS.RESIZE, me), emitter.on(EVENTS.RENDER, Le), onMounted(() => {
      n.value = v(t.value.$el), a.value = i.value ? v(i.value) : null, app.webgl.setWebglSectionScrollRect(n.value), V(), ne(), app.isLoaderRevealComplete || emitter.on(EVENTS.LOADER_REVEAL_COMPLETE, ge), app.lenis.on("scroll", ie)
    }), onUnmounted(() => {
      const oe = _();
      app.lenis.off("scroll", ie), emitter.off(EVENTS.LOADER_REVEAL_COMPLETE, ge), ae(), clearTimeout(d), d = null, oe ? (u = [], l = []) : w({
        force: !0
      }), a.value = null, n.value = null, app.webgl.setWebglSectionScrollRect(null), emitter.off(EVENTS.RESIZE, me), emitter.off(EVENTS.RENDER, Le)
    }), e({
      textWrapperRef: i,
      textRevealRef: o,
      getRevealChars: () => N(),
      getBaseChars: () => k(),
      getLettersOpacityProgress: q,
      applyRevealProgress: de,
      setupTextSplit: M,
      destroyTextSplit: w
    }), (oe, E) => (openBlock(), createBlock(GridWrapper, {
      ref_key: "webglSectionBlockRef",
      ref: t,
      class: "webglSectionBlock"
    }, {
      default: withCtx(() => [/* (About-page experience cards removed) */ createCommentVNode("", !0), p.value.length ? (openBlock(), createElementBlock("div", {
        key: 1,
        ref_key: "textWrapperRef",
        ref: i,
        class: "webglSectionBlock__textWrapper"
      }, [createElementVNode("div", $z, [createElementVNode("p", {
        ref_key: "textBaseRef",
        ref: r,
        class: "webglSectionBlock__text webglSectionBlock__text--base"
      }, [(openBlock(!0), createElementBlock(Fragment, null, renderList(p.value, (L, X) => (openBlock(), createElementBlock("span", {
        key: `base-${X}`,
        class: "text__line"
      }, toDisplayString(L), 1))), 128))], 512), createElementVNode("p", {
        ref_key: "textRevealRef",
        ref: o,
        class: "webglSectionBlock__text webglSectionBlock__text--reveal",
        "aria-hidden": "true"
      }, [(openBlock(!0), createElementBlock(Fragment, null, renderList(p.value, (L, X) => (openBlock(), createElementBlock("span", {
        key: `reveal-${X}`,
        class: "text__line"
      }, toDisplayString(L), 1))), 128))], 512)])], 512)) : createCommentVNode("", !0)]),
      _: 1
    }, 512))
  }
};

export const WebglSectionBlock = _export_sfc(WebglSectionBlockSfc, [
  ["__scopeId", "data-v-afac87a3"]
]);
