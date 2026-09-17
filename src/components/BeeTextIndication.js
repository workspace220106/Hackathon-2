import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  gsap
} from 'gsap';
import {
  Vector3
} from 'three';
import {
  createElementBlock,
  createElementVNode,
  normalizeClass,
  onMounted,
  onUnmounted,
  openBlock,
  ref,
  toDisplayString
} from 'vue';
import {
  EVENTS,
  emitter
} from '../core/events.js';
import {
  formatBeeText
} from '../utils/bee-text-format.js';
import {
  isTabletWidth,
  isTouch
} from '../utils/device.js';

const X3 = {
  class: "beeTextIndication__label"
};

const BeeTextIndicationSfc = {
  __name: "BeeTextIndication",
  setup(s) {
    const e = ref(),
      t = ref(),
      n = ref(""),
      i = ref(!1),
      r = ref(!1),
      o = ref("generic"),
      a = ref("white"),
      l = ref("bottomLeft"),
      u = ref(1),
      h = ref(!1),
      c = new Vector3(0, 0, 1),
      d = ref(),
      f = ref(!1),
      A = ref(!1),
      m = () => !0 /* bee texts on every device */,
      g = () => l.value === "top" ? "50% 100%" : "50% 0%",
      p = () => {
        if (!h.value) return "translate(-100%, -100%)";
        const {
          x: O,
          y: Y
        } = c, G = l.value === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0)";
        return `translate(${O}px, ${Y}px) ${G}`
      },
      _ = () => {
        t.value && t.value.style.setProperty("--bee-scale", String(u.value))
      },
      v = () => {
        t.value && (_(), gsap.set(t.value, {
          clipPath: "none",
          clearProps: "scale,transformOrigin,xPercent,yPercent"
        }))
      },
      y = O => formatBeeText(O),
      b = O => {
        var G;
        if (!t.value || !O) return;
        (G = d.value) == null || G.kill(), r.value = !1, n.value = y(O), v();
        const Y = gsap.timeline();
        Y.set(t.value, {
          "--reveal": 0,
          opacity: 1
        }, 0), Y.to(t.value, {
          "--reveal": 1,
          duration: .65,
          ease: "elastic.out(0.75)"
        }, 0), d.value = Y
      },
      S = O => {
        var Y;
        if (!t.value) {
          O == null || O();
          return
        }(Y = d.value) == null || Y.kill(), r.value = !0, v(), d.value = gsap.to(t.value, {
          "--reveal": 0,
          duration: .3,
          ease: "expo.out",
          onComplete: () => {
            r.value = !1, d.value = null, O == null || O()
          }
        })
      },
      T = (O, Y = "generic") => {
        var Q;
        if (!t.value || !O) return;
        (Q = d.value) == null || Q.kill(), r.value = !1, v();
        const G = Y === "conversation" ? "conversation" : "generic",
          z = gsap.timeline();
        z.to(t.value, {
          "--reveal": 0,
          duration: .22,
          ease: "expo.in"
        }), z.call(() => {
          n.value = y(O), o.value = G
        }), z.to(t.value, {
          "--reveal": 1,
          duration: .65,
          ease: "elastic.out(0.75)"
        }), d.value = z
      },
      C = O => {
        const Y = O.placement === "top" ? "top" : "bottomLeft";
        l.value = Y, u.value = O.scale ?? 1, v(), c.x = O.x, c.y = O.y, c.z = u.value, h.value = !0, _(), e.value && (e.value.style.transformOrigin = g(), e.value.style.transform = p())
      },
      x = O => {
        var G;
        if (!t.value || !i.value) return;
        (G = d.value) == null || G.kill(), f.value = !0;
        const Y = gsap.timeline({
          onComplete: () => {
            f.value = !1, d.value = null
          }
        });
        Y.to(t.value, {
          "--reveal": 0,
          duration: .3,
          ease: "expo.out"
        }), Y.call(() => {
          w(), C(O), f.value = !1
        }), Y.to(t.value, {
          "--reveal": 1,
          duration: .65,
          ease: "elastic.out(0.75)"
        }), d.value = Y
      },
      w = () => {
        h.value = !1, c.set(0, 0, 1)
      },
      R = (O, Y, G = {}) => {
        var z, Q, M;
        if (m()) {
          if (Y) {
            A.value && ((z = d.value) == null || z.kill(), A.value = !1), (Q = d.value) == null || Q.kill(), r.value = !1;
            const ne = i.value,
              V = G.mode === "conversation" ? "conversation" : "generic",
              ae = G.theme ?? "white";
            if (i.value = !0, l.value = G.placement === "top" ? "top" : "bottomLeft", a.value = ae, !ne) {
              o.value = V, w(), b(O);
              return
            }
            T(O, V);
            return
          }
          A.value || !i.value && !r.value || (f.value = !1, (M = d.value) == null || M.kill(), S(() => {
            i.value = !1, o.value = "generic", a.value = "white", w()
          }))
        }
      },
      B = () => {
        var O;
        !i.value && !r.value || (A.value = !0, f.value = !1, (O = d.value) == null || O.kill(), S(() => {
          i.value = !1, A.value = !1, o.value = "generic", a.value = "white", w()
        }))
      },
      N = O => {
        if (A.value || !i.value && !r.value || !O || f.value || !Number.isFinite(O.x) || !Number.isFinite(O.y)) return;
        const Y = O.placement === "top" ? "top" : "bottomLeft";
        if (h.value && l.value !== Y) {
          x(O);
          return
        }
        C(O)
      },
      k = () => {
        if (!(!e.value || !i.value && !r.value)) {
          if (!h.value) {
            e.value.style.transform = "translate(-100%, -100%)";
            return
          }
          _(), e.value.style.transformOrigin = g(), e.value.style.transform = p()
        }
      };
    return onMounted(() => {
      e.value && (e.value.style.transform = "translate(-100%, -100%)"), t.value && t.value.style.setProperty("--reveal", "1"), emitter.on(EVENTS.CONTENT_BEE_TEXT_CHANGE, R), emitter.on(EVENTS.CONTENT_BEE_CURSOR_ANCHOR_UPDATE, N), emitter.on(EVENTS.BEE_TEXT_HIDE_ALL, B), emitter.on(EVENTS.RENDER, k)
    }), onUnmounted(() => {
      var O;
      (O = d.value) == null || O.kill(), t.value && gsap.killTweensOf(t.value), emitter.off(EVENTS.CONTENT_BEE_TEXT_CHANGE, R), emitter.off(EVENTS.CONTENT_BEE_CURSOR_ANCHOR_UPDATE, N), emitter.off(EVENTS.BEE_TEXT_HIDE_ALL, B), emitter.off(EVENTS.RENDER, k)
    }), (O, Y) => (openBlock(), createElementBlock("div", {
      ref_key: "beeTextRef",
      ref: e,
      class: normalizeClass(["beeTextIndication", [`beeTextIndication--theme-${a.value}`, {
        "beeTextIndication--conversation": o.value === "conversation"
      }]])
    }, [createElementVNode("div", {
      ref_key: "beeTextLabelRef",
      ref: t,
      class: "beeTextIndication__text"
    }, [createElementVNode("span", X3, toDisplayString(n.value), 1)], 512)], 2))
  }
};

export const BeeTextIndication = _export_sfc(BeeTextIndicationSfc, [
  ["__scopeId", "data-v-e2dfbf19"]
]);
