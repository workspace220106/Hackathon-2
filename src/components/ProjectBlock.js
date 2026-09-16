import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  Fragment,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createElementVNode,
  createVNode,
  onMounted,
  onUnmounted,
  openBlock,
  ref,
  renderList,
  toDisplayString,
  withCtx
} from 'vue';
import {
  sliderGap,
  sliderOptions
} from '../config/slider.js';
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
  isTouch
} from '../utils/device.js';
import {
  getOffset
} from '../utils/dom.js';
import {
  ArrowButton
} from './ArrowButton.js';
import {
  GridWrapper
} from './GridWrapper.js';
import {
  MainButton
} from './MainButton.js';
import {
  WebglBgComponent
} from './WebglBgComponent.js';

const i4 = {
  class: "title__text"
};

const s4 = {
  class: "projectBlock__informations"
};

const r4 = {
  class: "top__title"
};

const o4 = {
  class: "title__number"
};

const a4 = {
  class: "title__name"
};

const l4 = {
  class: "title__type"
};

const c4 = {
  key: 0,
  class: "top__recognitions"
};

const u4 = {
  class: "top__date"
};

const h4 = {
  class: "top__team"
};

const d4 = {
  class: "team__text"
};

const f4 = {
  key: 1
};

const p4 = {
  class: "bottom__left"
};

const A4 = {
  class: "left__number"
};

const g4 = {
  class: "bottom__roles"
};

const m4 = {
  class: "roles__text"
};

const _4 = 6;

const v4 = 8;

const y4 = .029;

const ProjectBlockSfc = {
  __name: "ProjectBlock",
  props: {
    title: {
      type: String,
      default: null
    },
    cursorIndication: {
      type: String,
      default: null
    },
    projectIndex: {
      type: Number,
      default: null
    },
    mediasUrl: {
      type: Array,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    },
    recognitions: {
      type: Array,
      default: null
    },
    date: {
      type: String,
      default: null
    },
    team: {
      type: Object,
      default: null
    },
    projectLink: {
      type: Object,
      default: null
    },
    roles: {
      type: Object,
      default: null
    }
  },
  setup(s) {
    const e = ref(),
      t = ref(),
      n = ref(),
      i = s;
    let r = !1,
      o = null,
      a = !1,
      l = !1,
      u = null,
      h = 0,
      c = "step",
      d = !1;
    const f = {
        x: 0,
        y: 0
      },
      A = {
        x: 0,
        y: 0
      },
      m = {
        x: 0,
        y: 0
      },
      g = {
        x: 0,
        y: 0
      };
    let p;
    const _ = {
        currentDrag: 0,
        smoothCurrentDrag: 0,
        rawDragInput: 0,
        dragForce: 0,
        smoothDragForce: 0,
        snapThreshold: sliderOptions().snapThreshold,
        snapping: !1,
        targetIndex: 0,
        snapTarget: null,
        forcedSnapIndex: null,
        activeIndex: 0,
        isDragging: !1
      },
      v = () => {
        const E = navigator.userAgent;
        return /Safari/.test(E) && !/Chrome|Chromium|CriOS|Edg|Firefox|FxiOS/.test(E)
      },
      y = () => {
        l || !app.lenis || !e.value || (l = !0, !v() && (app.lenis.resize(), app.lenis.scrollTo(e.value, {
          duration: 2.5,
          offset: -window.innerHeight * y4
        })))
      },
      b = (E, L) => {
        g.x === null || g.y === null || l || Math.hypot(g.x - E, g.y - L) < v4 || y()
      },
      S = E => {
        _.isDragging = E
      },
      T = (E = u) => {
        var X;
        const L = e.value;
        if (L && E != null && ((X = L.hasPointerCapture) != null && X.call(L, E))) try {
          L.releasePointerCapture(E)
        } catch {}
        u = null
      },
      C = () => {
        const E = e.value;
        E && (E.addEventListener("touchstart", Y, {
          passive: !0
        }), window.addEventListener("touchmove", G, {
          passive: !1
        }), window.addEventListener("touchend", Q), window.addEventListener("touchcancel", Q), E.addEventListener("pointerdown", M), window.addEventListener("pointermove", ne), window.addEventListener("pointerup", V), window.addEventListener("pointercancel", V), E.addEventListener("lostpointercapture", ae))
      },
      x = () => {
        const E = e.value;
        E && (E.removeEventListener("touchstart", Y), window.removeEventListener("touchmove", G, {
          passive: !1
        }), window.removeEventListener("touchend", Q), window.removeEventListener("touchcancel", Q), E.removeEventListener("pointerdown", M), window.removeEventListener("pointermove", ne), window.removeEventListener("pointerup", V), window.removeEventListener("pointercancel", V), E.removeEventListener("lostpointercapture", ae))
      },
      w = (E, L) => {
        r = !0, l = !1, S(!0), k(E, L), O(E, L), emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, null, !1)
      },
      R = () => {
        a && app.lenis && (app.lenis.start(), a = !1), e.value && (e.value.style.touchAction = ""), o = null, c = "step", d = !1
      },
      B = (E, L) => {
        r && b(E, L);
        const X = m.x - E;
        A.x = X, A.y = o === "x" ? 0 : m.y - L, O(E, L), app.webgl.interfaceScene.updateSliderDelta(i.projectIndex, A)
      },
      N = () => {
        r = !1, S(!1), k(null, null), O(null, null), R()
      },
      k = (E = null, L = null) => {
        g.x = E, g.y = L
      },
      O = (E = null, L = null) => {
        m.x = E, m.y = L
      },
      Y = E => {
        const L = E.touches[0];
        o = null, c = "step", d = !0, f.x = L.clientX, f.y = L.clientY, w(L.clientX, L.clientY)
      },
      G = E => {
        if (!r) return;
        const L = E.touches[0];
        if (isTouch() && o === null) {
          const X = L.clientX - f.x,
            $ = L.clientY - f.y;
          if (Math.hypot(X, $) < _4) return;
          if (Math.abs(X) > Math.abs($)) o = "x", c = "step", h = p ? Math.round(_.smoothCurrentDrag / p) : 0, y(), e.value && (e.value.style.touchAction = "none"), app.lenis && !a && (app.lenis.stop(), a = !0);
          else {
            o = "y", r = !1, S(!1), k(null, null), O(null, null);
            return
          }
        }
        if (o !== "y") {
          if (o === "x") {
            E.preventDefault();
            const X = sliderOptions(),
              $ = L.clientX - f.x;
            if (c === "step" && Math.abs($) < X.dragActivationThresholdPx) {
              A.x = 0, A.y = 0, app.webgl.interfaceScene.updateSliderDelta(i.projectIndex, A);
              return
            }
            c === "step" && (c = "drag", O(L.clientX, L.clientY))
          }
          B(L.clientX, L.clientY)
        }
      },
      z = (E = null) => {
        const L = sliderOptions(),
          X = i.mediasUrl.length - 1,
          $ = L.infiniteDrag ?? !1;
        let se = null;
        if (E !== null && p) {
          const H = E - f.x,
            Ce = Math.abs(H) >= L.stepThresholdPx;
          if (se = h, c === "step") {
            if (Ce) {
              const Ee = H > 0 ? -1 : 1;
              se = h + Ee
            }
          } else if (se = Math.round(_.currentDrag / p), se === h && Ce) {
            const Ee = H > 0 ? -1 : 1;
            se = h + Ee
          }
          $ || (se = Math.max(0, Math.min(X, se))), _.forcedSnapIndex = se, _.snapTarget = se * p
        }
        A.x = 0, A.y = 0, _.smoothDragForce = 0, _.dragForce = 0, _.rawDragInput = 0, app.webgl.interfaceScene.updateSliderDelta(i.projectIndex, A)
      },
      Q = E => {
        const L = E.changedTouches[0];
        if (!L) return;
        const X = L.clientX - f.x,
          $ = L.clientY - f.y;
        o === "x" ? z(L.clientX) : d && o !== "y" && Math.abs(X) >= sliderOptions().stepThresholdPx && Math.abs(X) >= Math.abs($) && (h = p ? Math.round(_.smoothCurrentDrag / p) : 0, c = "step", z(L.clientX)), R(), r = !1, S(!1), k(null, null), O(null, null)
      },
      M = E => {
        if (E.pointerType !== "touch" && E.button === 0) {
          E.preventDefault(), u = E.pointerId;
          try {
            E.currentTarget.setPointerCapture(E.pointerId)
          } catch {}
          w(E.clientX, E.clientY)
        }
      },
      ne = E => {
        E.pointerType !== "touch" && r && (u != null && E.pointerId !== u || (E.cancelable && E.preventDefault(), B(E.clientX, E.clientY)))
      },
      V = E => {
        E.pointerType !== "touch" && (u != null && E.pointerId !== u || (T(E.pointerId), N()))
      },
      ae = () => {},
      ge = E => getOffset(E).width,
      q = () => {
        var E;
        (E = n.value) != null && E[0] && (p = ge(n.value[0]) + sliderGap(), _.mediaWidth = p, app.webgl.interfaceScene.createProjectsGroups(), n.value.forEach((L, X) => {
          app.webgl.interfaceScene.addMedias(L, X, i.projectIndex)
        }), app.webgl.interfaceScene.registerSlider(i.projectIndex, _, A, sliderOptions()))
      },
      de = E => {
        const L = getOffset(E);
        t.value = new DOMRect(L.x, L.y, L.width, L.height)
      },
      he = E => {
        if (!t.value) return;
        const L = t.value.top - window.innerHeight,
          X = t.value.top + t.value.height,
          $ = mapRangeClamped(E.animatedScroll, [L, X], [-1, 1]);
        app.webgl.interfaceScene.setParallaxUniforms(i.projectIndex, $)
      },
      ie = () => {
        var L, X;
        if (!e.value) return;
        de(e.value);
        const E = sliderOptions();
        _.snapThreshold = E.snapThreshold, app.webgl.interfaceScene.setSliderConfig(i.projectIndex, E), (L = n.value) != null && L[0] && (p = ge(n.value[0]) + sliderGap(), _.mediaWidth = p), (X = n.value) == null || X.forEach($ => {
          $ && app.webgl.interfaceScene.refreshMediaLayout($)
        })
      },
      me = () => {
        emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, i.cursorIndication, !0)
      },
      Le = () => {
        emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, null, !1)
      },
      oe = () => {
        var E;
        (E = e.value) != null && E.matches(":hover") && emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, i.cursorIndication, !0)
      };
    return emitter.on(EVENTS.RESIZE, ie), emitter.on(EVENTS.SHOWREEL_CURSOR_RESTORE, oe), app.lenis.on("scroll", he), onMounted(() => {
      q(), de(e.value), C()
    }), onUnmounted(() => {
      T(), S(!1), R(), x(), emitter.off(EVENTS.RESIZE, ie), emitter.off(EVENTS.SHOWREEL_CURSOR_RESTORE, oe), app.lenis.off("scroll", he)
    }), (E, L) => (openBlock(), createBlock(WebglBgComponent, {
      index: s.projectIndex + 2,
      "is-grid-wrapper": !1,
      "is-project": !0,
      "current-page": "home",
      class: "projectBlock"
    }, {
      default: withCtx(() => [s.projectIndex === 0 ? (openBlock(), createBlock(GridWrapper, {
        key: 0,
        class: "projectBlock__title"
      }, {
        default: withCtx(() => [createElementVNode("h3", i4, toDisplayString(s.title), 1)]),
        _: 1
      })) : createCommentVNode("", !0), createElementVNode("div", {
        ref_key: "sliderRef",
        ref: e,
        class: "projectBlock__slider",
        onMouseenter: me,
        onMouseleave: Le
      }, [(openBlock(!0), createElementBlock(Fragment, null, renderList(s.mediasUrl, (X, $) => (openBlock(), createElementBlock("div", {
        key: $,
        class: "slider__media"
      }, [createElementVNode("div", {
        ref_for: !0,
        ref_key: "mediaRefs",
        ref: n,
        class: "media__image"
      }, null, 512)]))), 128))], 544), createElementVNode("div", s4, [createVNode(GridWrapper, {
        class: "informations__top"
      }, {
        default: withCtx(() => [createElementVNode("div", r4, [createElementVNode("div", o4, toDisplayString(s.projectIndex + 1), 1), createElementVNode("h4", a4, toDisplayString(s.name), 1), createElementVNode("div", l4, toDisplayString(s.type), 1)]), s.recognitions ? (openBlock(), createElementBlock("div", c4, [(openBlock(!0), createElementBlock(Fragment, null, renderList(s.recognitions, (X, $) => (openBlock(), createElementBlock("div", {
          key: $,
          class: "recognitions__recognition"
        }, toDisplayString(X), 1))), 128))])) : createCommentVNode("", !0), createElementVNode("div", u4, toDisplayString(s.date), 1), s.projectLink ? (openBlock(), createBlock(ArrowButton, {
          key: 1,
          class: "top__link",
          text: s.projectLink.text,
          url: s.projectLink.url,
          "always-visible": !0
        }, null, 8, ["text", "url"])) : createCommentVNode("", !0), createElementVNode("div", h4, [createElementVNode("div", d4, toDisplayString(s.team.text), 1), s.team.agency.url ? (openBlock(), createBlock(MainButton, {
          key: 0,
          text: s.team.agency.name,
          url: s.team.agency.url
        }, null, 8, ["text", "url"])) : (openBlock(), createElementBlock("div", f4, toDisplayString(s.team.agency.name), 1))])]),
        _: 1
      }), createVNode(GridWrapper, {
        class: "informations__bottom"
      }, {
        default: withCtx(() => [createElementVNode("div", p4, [createElementVNode("div", A4, toDisplayString(s.projectIndex + 1), 1), s.projectLink ? (openBlock(), createBlock(ArrowButton, {
          key: 0,
          class: "left__link",
          text: s.projectLink.text,
          url: s.projectLink.url,
          "always-visible": !0
        }, null, 8, ["text", "url"])) : createCommentVNode("", !0)]), createElementVNode("div", g4, [createElementVNode("div", m4, toDisplayString(s.roles.text), 1), (openBlock(!0), createElementBlock(Fragment, null, renderList(s.roles.items, (X, $) => (openBlock(), createElementBlock("div", {
          key: $,
          class: "roles__role"
        }, toDisplayString(X), 1))), 128))])]),
        _: 1
      })])]),
      _: 1
    }, 8, ["index"]))
  }
};

export const ProjectBlock = _export_sfc(ProjectBlockSfc, [
  ["__scopeId", "data-v-7bd7230c"]
]);
