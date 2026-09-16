import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  gsap
} from 'gsap';
import {
  CustomEase
} from 'gsap/CustomEase';
import {
  Fragment,
  createCommentVNode,
  createElementBlock,
  createElementVNode,
  normalizeClass,
  onMounted,
  onUnmounted,
  openBlock,
  ref,
  renderList,
  toDisplayString
} from 'vue';
import {
  isTabletDevice
} from '../composables/useOrientation.js';
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
  GSAP_DEFAULTS,
  setWillChange,
  willChangeDuringTween
} from '../utils/will-change.js';

const XQ = {
  class: "container__titles--default"
};

const qQ = {
  class: "titles__wrapper"
};

const jQ = {
  class: "container__titles--reveal"
};

const KQ = {
  class: "titles__wrapper"
};

const JQ = {
  key: 0,
  class: "indication"
};

const Pl = 2;

const eS = 2600;

const BeeBlockSfc = {
  __name: "BeeBlock",
  props: {
    titles: {
      type: Array,
      default: null
    },
    titlesReveal: {
      type: Array,
      default: null
    },
    indication: {
      type: String,
      default: null
    },
    isFooter: {
      type: Boolean,
      default: !1
    },
    revealOnScroll: {
      type: Boolean,
      default: !0
    }
  },
  setup(s, {
    expose: e
  }) {
    CustomEase.create("reveal", ".4,0,0,1"), CustomEase.create("hide", "0.86, 0, 0.07, 1");
    const t = s,
      n = ref(),
      i = ref(),
      r = ref(),
      o = ref(),
      a = ref(),
      l = ref(),
      u = ref(),
      h = ref(),
      c = ref(),
      d = ref(!1),
      f = ref(!1),
      A = ref(!1),
      m = ref(!1),
      g = {
        x: null,
        y: null
      };
    let p = !1,
      _, v = !1,
      y = !1,
      b, S, T = 0;
    const C = isTouch(),
      x = isTabletDevice(),
      w = () => [...l.value ?? []],
      R = () => [...u.value ?? []],
      B = () => [...h.value ?? [], ...c.value ?? []],
      N = () => t.isFooter ? app.webgl.topScene.footerBeeObject : app.webgl.topScene.heroBeeObject,
      k = (j, Ie) => {
        if (!o.value || j == null || Ie == null) return !1;
        const Se = o.value.getBoundingClientRect();
        return j >= Se.left && j <= Se.right && Ie >= Se.top && Ie <= Se.bottom
      },
      O = (j, Ie) => j == null || Ie == null ? null : document.elementFromPoint(j, Ie),
      Y = (j, Ie) => {
        var pe;
        if (!app.isLoaderRevealComplete || !G() || !k(j, Ie)) return !1;
        const Se = O(j, Ie);
        return !(!Se || !((pe = o.value) != null && pe.contains(Se)))
      },
      G = () => {
        if (!t.revealOnScroll) return !0;
        if (!r.value) return !1;
        const j = app.lenis.animatedScroll,
          Ie = j,
          Se = j + window.innerHeight,
          pe = r.value.top;
        return pe + r.value.height > Ie && pe < Se
      },
      z = () => {
        const j = N();
        return v || f.value || A.value || (j == null ? void 0 : j.isInteractionLocked())
      },
      Q = (j, Ie, Se = !1) => {
        var pe;
        j == null || Ie == null || z() || (pe = N()) == null || pe.updatePointer(j, Ie, {
          skipVelocity: Se
        })
      },
      M = (j, Ie, {
        positionOnly: Se = !1
      } = {}) => {
        const pe = j ?? g.x,
          ke = Ie ?? g.y;
        if (pe == null || ke == null) return;
        const et = G(),
          Ze = k(pe, ke);
        if (m.value = et && Ze, !et) {
          m.value = !1, (d.value || A.value) && V();
          return
        }
        if (Y(pe, ke)) {
          if (A.value) return;
          if (!d.value && !z()) {
            const Ue = N();
            Ue == null || Ue.enterZone(), Q(pe, ke, Se), C || (Ue == null || Ue.showCursorFruit(), d.value = !0)
          } else d.value && Q(pe, ke, Se)
        } else d.value ? V() : m.value = Ze
      },
      ne = j => {
        g.x = j.clientX, g.y = j.clientY, M(j.clientX, j.clientY)
      },
      V = () => {
        const j = N();
        !j || !d.value && !A.value || (A.value = !0, j.hideCursorFruit(() => {
          A.value = !1, d.value = !1
        }))
      },
      ae = () => {
        var j;
        (j = N()) == null || j.resetDefaultMovement(), v = !1
      },
      ge = () => {
        _ == null || _.kill(), _ = null, S == null || S.kill(), S = null, setWillChange(w(), !1), setWillChange(B(), !1), clearTimeout(b), b = null
      },
      q = j => {
        j == null || j.forEach((Ie, Se) => {
          const pe = Se % 2;
          gsap.set(Ie, {
            y: "100%",
            x: pe ? "-5%" : "5%",
            ...GSAP_DEFAULTS
          })
        })
      },
      de = () => {
        var j, Ie;
        q(l.value), (j = u.value) == null || j.forEach(Se => {
          gsap.set(Se, {
            y: "0%",
            x: "0%",
            ...GSAP_DEFAULTS
          })
        }), (Ie = c.value) == null || Ie.forEach((Se, pe) => {
          const ke = pe % 2;
          gsap.set(Se, {
            y: "100%",
            x: ke ? "-5%" : "5%",
            ...GSAP_DEFAULTS
          })
        })
      },
      he = (j, {
        delay: Ie = 0,
        revealDelay: Se = .115,
        stagger: pe = .115,
        duration: ke = 1,
        ease: et = "reveal",
        getMotionTargets: Ze
      } = {}) => {
        const Ue = gsap.timeline({
          delay: Ie + Se
        });
        return willChangeDuringTween(Ue, Ze), j == null || j.forEach((Ve, ft) => {
          const mt = ft % 2;
          Ue.fromTo(Ve, {
            y: "100%",
            x: mt ? "-5%" : "5%"
          }, {
            y: "0%",
            x: "0%",
            ease: et,
            duration: ke,
            ...GSAP_DEFAULTS
          }, ft * pe)
        }), Ue
      },
      ie = (j = {}) => he(l.value, {
        ...j,
        getMotionTargets: w
      }),
      me = (j = {}) => he(u.value, {
        ...j,
        getMotionTargets: R
      }),
      Le = (j = 0) => {
        const Ie = typeof j == "number" ? {
            delay: j
          } : j,
          Se = () => {
            var pe;
            if (!((pe = l.value) != null && pe.length)) {
              requestAnimationFrame(Se);
              return
            }
            S == null || S.kill(), S = ie(Ie), p = !0
          };
        Se()
      },
      oe = () => {
        var Ie;
        const j = gsap.timeline();
        return willChangeDuringTween(j, B), (Ie = h.value) == null || Ie.forEach((Se, pe) => {
          var Ze;
          const ke = (Ze = c.value) == null ? void 0 : Ze[pe];
          if (!ke) return;
          const et = pe % 2;
          y ? (j.to(Se, {
            y: "100%",
            x: et ? "-5%" : "5%",
            ease: "power4.inOut",
            duration: Pl * .75,
            ...GSAP_DEFAULTS
          }, pe * .115), j.to(ke, {
            y: "0%",
            x: "0%",
            ease: "reveal",
            duration: Pl,
            ...GSAP_DEFAULTS
          }, pe * .1 + Pl * .315)) : (j.to(ke, {
            y: "100%",
            x: et ? "5%" : "-5%",
            ease: "power4.inOut",
            duration: Pl * .75,
            ...GSAP_DEFAULTS
          }, pe * .115), j.to(Se, {
            y: "0%",
            x: "0%",
            ease: "reveal",
            duration: Pl,
            ...GSAP_DEFAULTS
          }, pe * .1 + Pl * .315))
        }), j
      },
      E = j => {
        g.x = j.clientX, g.y = j.clientY, M(j.clientX, j.clientY)
      },
      L = () => {
        M(g.x, g.y)
      },
      X = j => {
        z() || (g.x = j.clientX, g.y = j.clientY, M(j.clientX, j.clientY))
      },
      $ = () => {
        if (A.value) return !1;
        const j = N();
        return !j || (f.value && j.canPlaceFruit() && (f.value = !1), f.value) ? !1 : j.canPlaceFruit()
      },
      se = () => {
        if (f.value || A.value) return !1;
        const j = N();
        return j ? j.canDropHeldFruit() : !1
      },
      H = () => !(!$() || C && v),
      Ce = () => {
        const j = N();
        j && (T++, f.value = !1, d.value = !1, A.value = !1, j.abortFruitInteraction())
      },
      Ee = () => {
        var j;
        clearTimeout(b), v = !1, (j = N()) == null || j.resetDefaultMovement()
      },
      Re = (j, {
        fromTouchTap: Ie = !1
      } = {}) => {
        const Se = ++T,
          pe = () => {
            if (Se === T) {
              if (f.value = !1, C) {
                m.value = k(g.x, g.y);
                return
              }
              requestAnimationFrame(() => {
                M(g.x, g.y)
              })
            }
          };
        Ie && j.showCursorFruit({
          hidden: !0
        }), f.value = !0, d.value = !1, (Ie ? j.dropFruit(pe, {
          spawnWhileFalling: !0
        }) : j.dropFruit(pe)) || (f.value = !1, requestAnimationFrame(() => {
          M(g.x, g.y)
        }))
      },
      Te = j => {
        if (!G()) return;
        g.x = j.clientX, g.y = j.clientY;
        const Ie = N();
        if (!Ie || !Y(j.clientX, j.clientY) || z()) return;
        if (C) {
          if (!H()) return;
          Ie.updatePointer(j.clientX, j.clientY), m.value = !0, Ie.enterZone(), y = !y, _ == null || _.kill(), _ = oe(), Re(Ie, {
            fromTouchTap: !0
          }), clearTimeout(b), b = setTimeout(ae, eS), v = !0;
          return
        }
        if (!(d.value && se())) return;
        Ie.updatePointer(j.clientX, j.clientY), m.value = k(j.clientX, j.clientY), Re(Ie);
        const pe = !v;
        clearTimeout(b), b = setTimeout(ae, eS), v = !0, pe && (y = !y, _ == null || _.kill(), _ = oe())
      },
      ze = j => {
        if (a.value) {
          const Ie = a.value.top - window.innerHeight,
            Se = a.value.top + a.value.height,
            pe = mapRangeClamped(j.animatedScroll, [Ie, Se], [0, 1]);
          pe > 0 && !p && (S == null || S.kill(), S = y ? me() : ie(), p = !0), pe <= 0 && (p && y && q(u.value), p = !1)
        }
      },
      P = j => getOffset(j),
      D = () => {
        i.value && (r.value = P(i.value)), !x && o.value && (a.value = P(o.value)), M(void 0, void 0, {
          positionOnly: !0
        })
      },
      le = () => {
        const j = N();
        if (!app.isLoaderRevealComplete) {
          j == null || j.leaveZone();
          return
        }
        if (!G()) {
          j == null || j.leaveZone(), C ? ((!(j != null && j.canPlaceFruit()) || f.value || d.value || A.value) && Ce(), Ee()) : (d.value || A.value) && V();
          return
        }
        j == null || j.enterZone()
      },
      Be = () => {
        if (app.isLoaderRevealComplete) {
          if (t.isFooter) {
            n.value = (r == null ? void 0 : r.value.y) - window.innerHeight, app.playgroundFooterBeeStart = n.value;
            const j = app.lenis.animatedScroll;
            if (j >= n.value) {
              const Ie = app.webgl.topCamera.setScrollPositions(j, r == null ? void 0 : r.value);
              app.webgl.topScene.setPageTransitionGroupToScrollCamera(Ie), app.showFooterBee = !0
            } else app.showFooterBee = !1
          } else if (!app.showFooterBee && !app.showPlaygroundContentBee) {
            const j = app.webgl.topCamera.setScrollPositions(app.lenis.animatedScroll, r == null ? void 0 : r.value);
            app.webgl.topScene.setPageTransitionGroupToScrollCamera(j)
          }
          le(), M(g.x, g.y, {
            positionOnly: !0
          })
        }
      };
    return t.revealOnScroll && app.lenis.on("scroll", ze), emitter.on(EVENTS.RESIZE, D), emitter.on(EVENTS.LAYOUT_REFRESH, D), emitter.on(EVENTS.RENDER, Be), onMounted(() => {
      r.value = P(i.value), a.value = P(o.value), de(), le(), window.addEventListener("pointermove", ne)
    }), e({
      triggerReveal: Le,
      refreshLayoutRects: () => {
        i.value && (r.value = P(i.value)), !x && o.value && (a.value = P(o.value)), M(g.x, g.y, {
          positionOnly: !0
        })
      }
    }), onUnmounted(() => {
      window.removeEventListener("pointermove", ne), emitter.off(EVENTS.RESIZE, D), emitter.off(EVENTS.LAYOUT_REFRESH, D), emitter.off(EVENTS.RENDER, Be), t.revealOnScroll ? (app.lenis.off("scroll", ze), ge()) : (clearTimeout(b), b = null)
    }), (j, Ie) => (openBlock(), createElementBlock("div", {
      ref_key: "beeBlockRef",
      ref: i,
      class: normalizeClass(["beeBlock", {
        isFooter: s.isFooter,
        isInZone: m.value,
        isHoldingFruit: d.value
      }])
    }, [createElementVNode("div", {
      ref_key: "containerRef",
      ref: o,
      class: "beeBlock__container",
      onPointerenter: E,
      onPointerleave: L,
      onPointermove: X,
      onClick: Te
    }, [createElementVNode("div", XQ, [(openBlock(!0), createElementBlock(Fragment, null, renderList(s.titles, Se => (openBlock(), createElementBlock("div", qQ, [createElementVNode("div", {
      ref_for: !0,
      ref_key: "titlesDefaultWrapperRef",
      ref: l,
      class: "wrapper"
    }, [createElementVNode("h2", {
      ref_for: !0,
      ref_key: "titlesDefaultRef",
      ref: h,
      class: "title"
    }, toDisplayString(Se), 513)], 512)]))), 256))]), createElementVNode("div", jQ, [(openBlock(!0), createElementBlock(Fragment, null, renderList(s.titlesReveal, (Se, pe) => (openBlock(), createElementBlock("div", KQ, [createElementVNode("div", {
      ref_for: !0,
      ref_key: "titlesRevealWrapperRef",
      ref: u,
      class: "wrapper"
    }, [createElementVNode("h2", {
      ref_for: !0,
      ref_key: "titlesRevealRef",
      ref: c,
      class: normalizeClass(["title", `title--${pe+1}`])
    }, toDisplayString(Se), 3)], 512)]))), 256))])], 544), s.indication ? (openBlock(), createElementBlock("span", JQ, toDisplayString(s.indication), 1)) : createCommentVNode("", !0)], 2))
  }
};

export const BeeBlock = _export_sfc(BeeBlockSfc, [
  ["__scopeId", "data-v-46f0f810"]
]);
