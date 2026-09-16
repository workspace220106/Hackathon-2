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
  createBlock,
  createCommentVNode,
  createElementBlock,
  createElementVNode,
  createVNode,
  nextTick,
  normalizeClass,
  normalizeStyle,
  onMounted,
  onUnmounted,
  openBlock,
  ref,
  renderList,
  toDisplayString,
  vShow,
  withCtx,
  withDirectives
} from 'vue';
import {
  app
} from '../core/App.js';
import {
  EVENTS,
  emitter
} from '../core/events.js';
import {
  throttle
} from '../utils/throttle.js';
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
  TextComponent
} from './TextComponent.js';
import {
  WebglBgComponent
} from './WebglBgComponent.js';

const fV = {
  class: "title__text"
};

const pV = {
  class: "items__title"
};

const AV = {
  class: "title__number"
};

const gV = {
  class: "title__name"
};

const mV = {
  class: "title__type"
};

const _V = {
  class: "items__roles"
};

const vV = {
  class: "items__date"
};

const yV = {
  class: "items__media"
};

const xV = {
  class: "media__inner"
};

const EV = ["src"];

const SV = ["src"];

const wV = ["src"];

const bV = ["src"];

const Gd = .35;

const Fg = 1400;

const TV = 350;

const iS = 1.3;

const CV = 1023;

const MV = .45;

const IV = .55;

const ArchivesBlockSfc = {
  __name: "ArchivesBlock",
  props: {
    title: {
      type: String,
      default: null
    },
    items: {
      type: Array,
      default: () => []
    },
    cursorIndication: {
      type: String,
      default: "Discover More"
    }
  },
  setup(s) {
    CustomEase.create("reveal", ".4,0,0,1"), CustomEase.create("hide", "0.86, 0, 0.07, 1");
    const e = ref([]),
      t = ref(),
      n = ref([]),
      i = ref([]),
      r = ref([]),
      o = ref([]),
      a = ref([]),
      l = ref(),
      u = new Map,
      h = new Map,
      c = new Map,
      d = new Map,
      f = new Map,
      A = new Map,
      m = new Map,
      g = new Map,
      p = new Map;
    let _ = !1,
      v = !1;
    const y = () => {
        _ = !1, v && (v = !1, Qe())
      },
      b = F => {
        const J = (g.get(F) ?? 0) + 1;
        return g.set(F, J), J
      },
      S = (F, J) => g.get(F) === J,
      T = (F, J) => {
        const fe = `${F}:${J}`,
          Oe = p.get(fe);
        Oe && (clearTimeout(Oe), p.delete(fe))
      },
      C = (F, J, fe, Oe) => {
        T(F, J);
        const je = setTimeout(fe, Oe);
        p.set(`${F}:${J}`, je)
      },
      x = F => {
        var Oe;
        ["close", "height", "scroll", "sync"].forEach(je => T(F, je)), (Oe = m.get(`media-fade-${F}`)) == null || Oe.kill(), m.delete(`media-fade-${F}`);
        const J = i.value[F],
          fe = r.value[F];
        J && gsap.killTweensOf(J), fe && gsap.killTweensOf(fe)
      },
      w = s,
      R = ref(),
      B = ref(null),
      N = ref(!1);
    let k = 0;
    const O = (F, J) => {
        F && (i.value[J] = F)
      },
      Y = (F, J) => {
        F && (r.value[J] = F)
      },
      G = (F, J) => {
        F && (o.value[J] = F)
      },
      z = (F, J) => {
        F && (a.value[J] = F)
      },
      Q = F => {
        var J;
        if ((J = F == null ? void 0 : F.media) != null && J.poster) return {
          backgroundImage: `url(${F.media.poster})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }
      },
      M = F => {
        const J = o.value[F],
          fe = c.get(F);
        fe == null || !J || (typeof J.cancelVideoFrameCallback == "function" && J.cancelVideoFrameCallback(fe), c.delete(F))
      },
      ne = F => {
        if (d.get(F)) return;
        d.set(F, !0);
        const J = a.value[F];
        J && (J.style.opacity = "0")
      },
      V = (F, J, fe) => {
        F && (n.value[J] || (n.value[J] = []), n.value[J][fe] = F)
      },
      ae = F => {
        var J;
        return (((J = F == null ? void 0 : F.agency) == null ? void 0 : J.name) ?? "").toLowerCase().includes("freelance")
      },
      ge = (F, J) => J.offsetY < F.clientHeight / 2 ? "top" : "bottom",
      q = (F, J, fe) => {
        var Ge, He, Ke;
        if (!((He = (Ge = e.value) == null ? void 0 : Ge[J]) != null && He.$el) || e.value[J].$el.classList.contains("expanded")) return;
        (Ke = m.get(`leave-${J}`)) == null || Ke.kill();
        const Oe = ge(e.value[J].$el, F),
          je = i.value[J];
        if (!je) return;
        const rt = gsap.timeline();
        m.set(`leave-${J}`, rt), Oe === "top" ? rt.to(je, {
          transform: "translateY(-102%)",
          duration: Gd,
          ease: "expo.out"
        }, 0) : rt.to(je, {
          transform: fe ? "translateY(-102%)" : "translateY(102%)",
          duration: Gd,
          ease: "expo.out"
        }, 0)
      },
      de = F => {
        var Oe, je, rt;
        if (!((je = (Oe = e.value) == null ? void 0 : Oe[F]) != null && je.$el) || e.value[F].$el.classList.contains("expanded")) return;
        (rt = m.get(`enter-${F}`)) == null || rt.kill();
        const J = i.value[F];
        if (!J) return;
        const fe = gsap.timeline();
        m.set(`enter-${F}`, fe), fe.to(J, {
          transform: "translateY(0%)",
          duration: Gd,
          ease: "expo.out"
        }, 0)
      },
      he = (F, J) => {
        const fe = F.style.transition;
        F.style.transition = "none";
        const Oe = J();
        return F.offsetHeight, fe ? F.style.transition = fe : F.style.removeProperty("transition"), Oe
      },
      ie = F => he(F, () => {
        const J = F.classList.contains("expanded"),
          fe = F.style.height;
        J && F.classList.remove("expanded"), F.style.height = "";
        const Oe = F.offsetHeight;
        return F.style.height = fe, J && F.classList.add("expanded"), Oe
      }),
      me = F => {
        const J = F.parentNode;
        if (!J) return ie(F);
        const fe = F.getBoundingClientRect().width,
          Oe = F.cloneNode(!0);
        Oe.classList.remove("expanded"), Oe.setAttribute("aria-hidden", "true"), Oe.style.cssText = ["position: absolute", "visibility: hidden", "pointer-events: none", "left: 0", "top: 0", `width: ${fe}px`, "margin: 0", "transform: none"].join(";"), J.appendChild(Oe);
        const je = Oe.getBoundingClientRect().height || Oe.offsetHeight;
        return Oe.remove(), je
      },
      Le = F => he(F, () => {
        const J = F.classList.contains("expanded"),
          fe = F.style.height;
        F.classList.add("expanded"), F.style.height = "auto", F.offsetHeight;
        const Oe = F.scrollHeight;
        return J ? F.style.height = fe : (F.classList.remove("expanded"), F.style.height = ""), Oe
      }),
      oe = () => {
        e.value.forEach((F, J) => {
          F != null && F.$el && u.set(J, Le(F.$el))
        })
      },
      E = (F, J) => {
        const fe = Le(F);
        u.set(J, fe);
        const Oe = F.offsetHeight;
        return F.style.height = `${Oe}px`, F.classList.add("expanded"), F.offsetHeight, F.style.height = `${fe}px`, fe
      },
      L = F => {
        var je, rt;
        const J = (je = e.value[F]) == null ? void 0 : je.$el;
        if (!(J != null && J.classList.contains("expanded"))) return;
        const fe = Le(J),
          Oe = parseFloat(J.style.height) || J.offsetHeight;
        Math.abs(fe - Oe) <= 1 || (u.set(F, fe), he(J, () => {
          J.style.height = `${fe}px`
        }), Ve(), (rt = app.lenis) == null || rt.resize())
      },
      X = (F, J) => {
        const fe = () => {
          S(F, J) && L(F)
        };
        if (_) {
          C(F, "sync", fe, Fg);
          return
        }
        requestAnimationFrame(() => {
          requestAnimationFrame(fe)
        })
      },
      $ = F => {
        const J = r.value[F];
        !J || J.tagName !== "IMG" || J.complete || J.addEventListener("load", () => {
          const fe = g.get(F);
          fe !== void 0 && X(F, fe)
        }, {
          once: !0
        })
      },
      se = () => window.matchMedia(`(max-width: ${CV}px)`).matches,
      H = (F, J) => {
        const fe = r.value[J];
        fe && (gsap.killTweensOf(fe), F.fromTo(fe, {
          transform: "translateY(102%)"
        }, {
          transform: "translateY(0%)",
          duration: iS,
          ease: "expo.out"
        }, 0), se() && (gsap.set(fe, {
          opacity: 0
        }), F.to(fe, {
          opacity: 1,
          duration: iS,
          ease: "expo.out"
        }, MV)), Re(J), $(J))
      },
      Ce = F => {
        const J = r.value[F];
        J && (gsap.killTweensOf(J), se() ? gsap.set(J, {
          opacity: 0,
          transform: "translateY(102%)"
        }) : gsap.set(J, {
          transform: "translateY(102%)"
        }))
      },
      Ee = (F, J) => {
        var je;
        const fe = r.value[F];
        if (!fe || !se()) return;
        (je = m.get(`media-fade-${F}`)) == null || je.kill(), gsap.killTweensOf(fe);
        const Oe = gsap.timeline({
          onComplete: () => {
            var rt, Ge;
            m.delete(`media-fade-${F}`), S(F, J) && ((Ge = (rt = e.value[F]) == null ? void 0 : rt.$el) != null && Ge.classList.contains("expanded") || Ce(F))
          }
        });
        m.set(`media-fade-${F}`, Oe), Oe.to(fe, {
          opacity: 0,
          duration: IV,
          ease: "hide"
        }, 0)
      },
      Re = F => {
        var rt;
        const J = w.items[F],
          fe = o.value[F];
        if (!((rt = J == null ? void 0 : J.media) != null && rt.isVideo) || !fe) return;
        const Oe = h.get(F);
        Oe && (clearTimeout(Oe), h.delete(F));
        const je = (f.get(F) ?? 0) + 1;
        if (f.set(F, je), J.media.poster && !d.get(F)) {
          const Ge = () => {
            f.get(F) === je && ne(F)
          };
          if (M(F), typeof fe.requestVideoFrameCallback == "function") {
            const He = fe.requestVideoFrameCallback(() => {
              c.delete(F), Ge()
            });
            c.set(F, He)
          } else {
            const He = () => {
              fe.removeEventListener("playing", He), f.get(F) === je && requestAnimationFrame(Ge)
            };
            fe.addEventListener("playing", He)
          }
        }
        fe.currentTime = 0, fe.play().catch(() => {})
      },
      Te = F => {
        var rt;
        const J = w.items[F],
          fe = o.value[F];
        if (!((rt = J == null ? void 0 : J.media) != null && rt.isVideo) || !fe) return;
        const Oe = h.get(F);
        Oe && (clearTimeout(Oe), h.delete(F));
        const je = (f.get(F) ?? 0) + 1;
        f.set(F, je), M(F), fe.pause()
      },
      ze = F => {
        var rt;
        const J = w.items[F],
          fe = o.value[F];
        if (!((rt = J == null ? void 0 : J.media) != null && rt.isVideo) || !fe) return;
        const Oe = h.get(F);
        Oe && clearTimeout(Oe);
        const je = setTimeout(() => {
          const Ge = (f.get(F) ?? 0) + 1;
          f.set(F, Ge), M(F), fe.pause(), h.delete(F)
        }, TV);
        h.set(F, je)
      },
      P = (F, J) => {
        var Oe;
        const fe = A.get(J) === !0;
        (Oe = n.value[J]) == null || Oe.forEach((je, rt) => {
          je && F.add(je.textRevealTL({
            reuseSplit: fe
          }), rt * .125)
        }), A.set(J, !0)
      },
      D = (F, J, {
        runEnterMask: fe = !1,
        runLeaveMask: Oe = !1,
        pauseVideoImmediately: je = !1
      } = {}) => {
        var Fe;
        const rt = (Fe = e.value[F]) == null ? void 0 : Fe.$el;
        if (!(rt != null && rt.classList.contains("expanded"))) return;
        const Ge = b(F);
        x(F), _ = !0;
        const He = rt.getBoundingClientRect().height,
          Ke = me(rt);
        rt.style.transition = "none", rt.style.height = `${He}px`, rt.offsetHeight, rt.style.removeProperty("transition"), rt.classList.remove("expanded"), rt.style.height = `${Ke}px`, Oe ? q(J, F, !0) : fe && de(F), Ee(F, Ge), je ? Te(F) : ze(F), C(F, "close", () => {
          S(F, Ge) && (rt.classList.contains("expanded") || (rt.style.height = "", Ce(F)), y())
        }, Fg)
      },
      le = (F, J) => {
        var Ge, He, Ke;
        const fe = e.value[F].$el,
          Oe = b(F);
        x(F), Ie(), (He = (Ge = t.value) == null ? void 0 : Ge[F]) == null || He.resetState(), P(J, F), E(fe, F), _ = !0, C(F, "height", () => {
          S(F, Oe) && y()
        }, Fg);
        const je = i.value[F],
          rt = r.value[F];
        je && J.to(je, {
          transform: "translateY(-102%)",
          duration: Gd,
          ease: "expo.out"
        }, 0), rt && H(J, F), (Ke = t.value) != null && Ke[F] && J.add(t.value[F].revealTL(.5), 0), X(F, Oe), se() && C(F, "scroll", () => {
          var ht;
          if (!S(F, Oe)) return;
          const Fe = (ht = e.value[F]) == null ? void 0 : ht.$el;
          if (!app.lenis || !(Fe != null && Fe.classList.contains("expanded"))) return;
          app.lenis.resize();
          const at = Fe.offsetHeight,
            tt = -window.innerHeight * .5 + at * .5;
          app.lenis.scrollTo(Fe, {
            duration: 2.5,
            offset: tt
          })
        }, 700)
      },
      Be = F => {
        de(F)
      },
      Me = (F, J) => {
        q(F, J, !1)
      },
      j = () => {
        B.value !== null || !w.cursorIndication || emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, w.cursorIndication, !0)
      },
      Ie = () => {
        emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, null, !1)
      },
      Se = () => {
        const F = document.querySelector(".archivesBlock__list");
        !(F != null && F.matches(":hover")) || k > 0 || j()
      },
      pe = () => {
        k += 1, k === 1 && Ie()
      },
      ke = () => {
        k = Math.max(0, k - 1), k === 0 && N.value && j()
      },
      et = () => {
        N.value = !0, k === 0 && j()
      },
      Ze = () => {
        N.value = !1, k = 0, Ie()
      },
      Ue = (F, J) => {
        var je, rt, Ge, He, Ke;
        if (!((rt = (je = e.value) == null ? void 0 : je[J]) != null && rt.$el)) return;
        const Oe = e.value[J].$el.classList.contains("expanded");
        if (B.value !== null && B.value !== J && ((Ge = R.value) == null || Ge.kill(), D(B.value, F, {
            runLeaveMask: !0,
            pauseVideoImmediately: !0
          })), Oe)(He = R.value) == null || He.kill(), D(J, F, {
          runEnterMask: !0
        }), B.value = null, N.value && j();
        else {
          (Ke = R.value) == null || Ke.kill();
          const Fe = gsap.timeline();
          R.value = Fe, le(J, Fe), B.value = J
        }
      },
      Ve = () => {
        var He, Ke;
        const F = (He = l.value) == null ? void 0 : He.$el,
          J = e.value || [],
          fe = (Ke = J[0]) == null ? void 0 : Ke.$el;
        if (!F || !fe) return;
        const Oe = [];
        J.forEach((Fe, at) => {
          const tt = Fe == null ? void 0 : Fe.$el;
          if (tt && tt.classList.contains("expanded")) {
            const ht = tt.style.height,
              en = tt.style.transition;
            Oe.push({
              el: tt,
              index: at,
              height: ht,
              transition: en
            }), tt.classList.remove("expanded"), tt.style.transition = "none", tt.style.height = "", tt.offsetHeight
          }
        }), F.style.height = "";
        const je = fe.getBoundingClientRect().height || 45,
          rt = F.scrollHeight;
        let Ge = Math.max((u.get(0) ?? Le(fe)) - je, 0);
        Oe.forEach(({
          index: Fe
        }) => {
          const at = u.get(Fe) ?? Le(J[Fe].$el);
          u.set(Fe, at), Ge = Math.max(Ge, at - je)
        }), F.style.height = `${rt+Ge}px`, Oe.forEach(({
          el: Fe,
          index: at,
          transition: tt
        }) => {
          Fe.classList.add("expanded");
          const ht = u.get(at);
          Fe.style.height = ht != null ? `${ht}px` : "", requestAnimationFrame(() => {
            tt ? Fe.style.transition = tt : Fe.style.removeProperty("transition")
          })
        })
      },
      ft = () => {
        (e.value || []).forEach((F, J) => {
          const fe = F == null ? void 0 : F.$el;
          if (!fe || fe.classList.contains("expanded")) return;
          fe.style.height = "";
          const Oe = i.value[J];
          Oe && (gsap.killTweensOf(Oe), gsap.set(Oe, {
            transform: "translateY(102%)"
          }))
        })
      },
      mt = () => {
        (e.value || []).forEach((F, J) => {
          const fe = F == null ? void 0 : F.$el;
          if (!(fe != null && fe.classList.contains("expanded"))) return;
          const Oe = Le(fe);
          u.set(J, Oe), he(fe, () => {
            fe.style.height = `${Oe}px`
          })
        })
      },
      K = () => {
        var F, J, fe, Oe;
        (F = app.lenis) == null || F.resize(), (Oe = (fe = (J = app.webgl) == null ? void 0 : J.interfaceScene) == null ? void 0 : fe.refreshBackgroundLayoutsFrom) == null || Oe.call(fe, 8), emitter.emit(EVENTS.LAYOUT_REFRESH)
      },
      Qe = () => {
        if (_) {
          v = !0;
          return
        }
        ft(), requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (_) {
              v = !0;
              return
            }
            oe(), mt(), Ve(), nextTick(() => {
              K()
            })
          })
        })
      },
      ve = throttle(Qe, 200);
    return emitter.on(EVENTS.RESIZE, ve), emitter.on(EVENTS.SHOWREEL_CURSOR_RESTORE, Se), onMounted(() => {
      nextTick(() => {
        requestAnimationFrame(() => {
          Qe()
        })
      })
    }), onUnmounted(() => {
      var F;
      Ie(), p.forEach(J => clearTimeout(J)), p.clear(), emitter.off(EVENTS.RESIZE, ve), emitter.off(EVENTS.SHOWREEL_CURSOR_RESTORE, Se), (F = R.value) == null || F.kill(), m.forEach(J => J.kill()), m.clear(), h.forEach(J => clearTimeout(J)), h.clear(), c.forEach((J, fe) => M(fe)), c.clear()
    }), (F, J) => (openBlock(), createBlock(WebglBgComponent, {
      ref_key: "archivesBlockRef",
      ref: l,
      "is-grid-wrapper": !1,
      index: 8,
      "current-page": "home",
      class: "archivesBlock"
    }, {
      default: withCtx(() => [createVNode(GridWrapper, {
        class: "archivesBlock__title"
      }, {
        default: withCtx(() => [createElementVNode("h3", fV, toDisplayString(s.title), 1)]),
        _: 1
      }), createElementVNode("div", {
        class: "archivesBlock__list",
        onMouseenter: et,
        onMouseleave: Ze
      }, [(openBlock(!0), createElementBlock(Fragment, null, renderList(s.items, (fe, Oe) => (openBlock(), createBlock(GridWrapper, {
        ref_for: !0,
        ref_key: "itemsRef",
        ref: e,
        key: Oe,
        class: "archivesBlock__items",
        onClick: je => Ue(je, Oe),
        onMouseenter: je => Be(Oe),
        onMouseleave: je => Me(je, Oe)
      }, {
        default: withCtx(() => {
          var je, rt, Ge, He;
          return [createElementVNode("div", {
            ref_for: !0,
            ref: Ke => O(Ke, Oe),
            class: "items__mask"
          }, null, 512), J[0] || (J[0] = createElementVNode("div", {
            class: "items__separator items__separator--top"
          }, null, -1)), createElementVNode("div", pV, [createElementVNode("div", AV, toDisplayString(Oe + 1), 1), createElementVNode("h4", gV, toDisplayString(fe == null ? void 0 : fe.name), 1), createElementVNode("div", mV, toDisplayString(fe == null ? void 0 : fe.type), 1)]), createElementVNode("div", _V, toDisplayString(fe == null ? void 0 : fe.roles), 1), createElementVNode("div", vV, toDisplayString(fe == null ? void 0 : fe.date), 1), createVNode(MainButton, {
            class: "items__agency",
            text: (je = fe == null ? void 0 : fe.agency) == null ? void 0 : je.name,
            url: (rt = fe == null ? void 0 : fe.agency) == null ? void 0 : rt.url,
            "underline-on-hover": !ae(fe),
            onMouseenter: pe,
            onMouseleave: ke
          }, null, 8, ["text", "url", "underline-on-hover"]), J[1] || (J[1] = createElementVNode("svg", {
            class: "items__arrow",
            width: "7",
            height: "5",
            viewBox: "0 0 7 5",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg"
          }, [createElementVNode("rect", {
            x: "3.96875",
            y: "4.02197",
            width: "4.28576",
            height: "1.09424",
            transform: "rotate(-135 3.96875 4.02197)",
            fill: "#022016"
          }), createElementVNode("rect", {
            x: "7",
            y: "0.991699",
            width: "4.28576",
            height: "1.09424",
            transform: "rotate(135 7 0.991699)",
            fill: "#022016"
          })], -1)), createElementVNode("div", {
            class: normalizeClass(["items__text", {
              "items__text--noLink": !(fe != null && fe.projectLink)
            }])
          }, [(openBlock(!0), createElementBlock(Fragment, null, renderList(fe == null ? void 0 : fe.infos, (Ke, Fe) => (openBlock(), createBlock(TextComponent, {
            key: Fe,
            ref_for: !0,
            ref: at => V(at, Oe, Fe),
            class: "text__infos",
            content: Ke,
            "reveal-on-scroll": !1,
            stagger: .075
          }, null, 8, ["content"]))), 128)), withDirectives(createVNode(ArrowButton, {
            ref_for: !0,
            ref_key: "arrowButtonRef",
            ref: t,
            class: "text__link",
            text: (Ge = fe == null ? void 0 : fe.projectLink) == null ? void 0 : Ge.text,
            url: (He = fe == null ? void 0 : fe.projectLink) == null ? void 0 : He.url
          }, null, 8, ["text", "url"]), [
            [vShow, fe == null ? void 0 : fe.projectLink]
          ])], 2), createElementVNode("div", yV, [createElementVNode("div", xV, [fe.media.isVideo ? (openBlock(), createElementBlock("div", {
            key: 1,
            ref_for: !0,
            ref: Ke => Y(Ke, Oe),
            class: "media__content media__content--video",
            style: normalizeStyle(Q(fe))
          }, [createElementVNode("video", {
            ref_for: !0,
            ref: Ke => G(Ke, Oe),
            class: "media__video",
            loop: "",
            muted: "",
            playsinline: "",
            preload: "none"
          }, [fe.media.url ? (openBlock(), createElementBlock("source", {
            key: 0,
            src: fe.media.url,
            type: "video/webm"
          }, null, 8, SV)) : createCommentVNode("", !0), fe.media.url2 ? (openBlock(), createElementBlock("source", {
            key: 1,
            src: fe.media.url2,
            type: "video/mp4"
          }, null, 8, wV)) : createCommentVNode("", !0)], 512), fe.media.poster ? (openBlock(), createElementBlock("img", {
            key: 0,
            ref_for: !0,
            ref: Ke => z(Ke, Oe),
            class: "media__poster",
            src: fe.media.poster,
            alt: "",
            "aria-hidden": "true"
          }, null, 8, bV)) : createCommentVNode("", !0)], 4)) : (openBlock(), createElementBlock("img", {
            key: 0,
            ref_for: !0,
            ref: Ke => Y(Ke, Oe),
            class: "media__content",
            loading: "lazy",
            src: fe.media.url,
            alt: ""
          }, null, 8, EV))])])]
        }),
        _: 2
      }, 1032, ["onClick", "onMouseenter", "onMouseleave"]))), 128))], 32), createVNode(GridWrapper, {
        class: "archivesBlock__separator"
      }, {
        default: withCtx(() => [...J[2] || (J[2] = [createElementVNode("div", {
          class: "separator__line"
        }, null, -1)])]),
        _: 1
      })]),
      _: 1
    }, 512))
  }
};

export const ArchivesBlock = _export_sfc(ArchivesBlockSfc, [
  ["__scopeId", "data-v-d1c93837"]
]);
