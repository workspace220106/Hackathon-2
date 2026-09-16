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
  Fragment,
  computed,
  createElementBlock,
  createElementVNode,
  createStaticVNode,
  nextTick,
  normalizeClass,
  onMounted,
  onUnmounted,
  openBlock,
  ref,
  toDisplayString
} from 'vue';
import {
  app
} from '../core/App.js';
import {
  EVENTS,
  emitter
} from '../core/events.js';
import {
  isTabletWidth,
  isTouch
} from '../utils/device.js';
import {
  getOffset
} from '../utils/dom.js';
import {
  lerp,
  remToPx,
  remToPxMap
} from '../utils/math.js';

const R3 = {
  class: "showreel__timelineArrows"
};

const B3 = {
  class: "cursorIndication__lineWrap"
};

const D3 = {
  class: "cursorIndication__lineWrap cursorIndication__lineWrap--copied"
};

const SE = "Copied";

const Ig = .25;

const L3 = 50;

const P3 = .35;

const O3 = 1.4;

const Rg = 1.75;

const F3 = 5;

const N3 = 27;

const CursorIndicationSfc = {
  __name: "CursorIndication",
  props: {
    cursorIndication: {
      type: [String, Array],
      default: null
    },
    isStatic: {
      type: Boolean,
      default: !1
    }
  },
  setup(s, {
    expose: e
  }) {
    const t = s,
      n = {
        x: "10%",
        y: "-112%"
      },
      i = {
        x: "0%",
        y: "-100%"
      },
      r = ref(),
      o = ref(),
      a = ref(),
      l = ref(),
      u = ref(),
      h = ref(),
      c = ref("Copy to clipboard"),
      d = ref(!1),
      f = ref(t.cursorIndication ?? ""),
      A = ref(Array.isArray(t.cursorIndication)),
      m = ref(),
      g = ref(),
      p = ref("default"),
      _ = ref("default"),
      v = ref(null),
      y = ref(!1),
      b = ref(!1),
      S = ref(!1),
      T = new Vector3(0, 0, 0),
      C = new Vector3(0, 0, 0),
      x = {
        x: 0,
        y: 0
      },
      w = ref(0),
      R = ref(!1),
      B = ref(!1),
      N = ref(!0),
      k = ref("default"),
      O = ref(!1),
      Y = ref(),
      G = ref(),
      z = ref(),
      Q = ref(),
      M = ref(),
      ne = ref(),
      V = ref(),
      ae = ref(),
      ge = ref(),
      q = ref(),
      de = ref(),
      he = ref(),
      ie = computed(() => k.value === "timeline" || k.value === "timelineDrag"),
      me = () => isTabletWidth() && isTouch(),
      Le = () => !me(),
      oe = {
        xPercent: 0,
        yPercent: -100,
        transformOrigin: "0% 100%"
      },
      E = {
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "50% 50%"
      },
      L = {
        width: 44,
        height: 18,
        paddingTop: 0,
        paddingRight: 6,
        paddingBottom: 0,
        paddingLeft: 6
      },
      X = {
        width: 54,
        height: 14,
        paddingTop: 0,
        paddingRight: 4,
        paddingBottom: 0,
        paddingLeft: 4
      },
      $ = () => remToPxMap(L),
      se = () => remToPxMap(X),
      H = () => remToPx(F3),
      Ce = () => remToPx(N3);
    let Ee = null;
    const Re = W => Array.isArray(W),
      Te = (...W) => W.flat().filter(Boolean),
      ze = W => W ?? f.value,
      P = W => ze(W) === "Drag" ? n : i,
      D = W => {
        const {
          x: ye,
          y: Pe
        } = P(W);
        return {
          xPercent: parseFloat(ye),
          yPercent: parseFloat(Pe)
        }
      },
      le = () => {
        d.value = !1, o.value && gsap.set(o.value, {
          clearProps: "width,overflow"
        }), u.value && gsap.set(u.value, {
          yPercent: 0,
          opacity: 1
        }), h.value && (h.value.classList.add("cursorIndication__label--initial"), gsap.set(h.value, {
          clearProps: "transform"
        }))
      },
      Be = W => {
        W.classList.remove("cursorIndication__label--initial"), gsap.set(W, {
          yPercent: 100,
          overwrite: !0
        })
      },
      Me = () => {
        var W;
        (W = g.value) == null || W.kill(), le()
      },
      j = (W, ye, Pe) => {
        const qe = window.getComputedStyle(W),
          Tt = parseFloat(qe.paddingLeft) + parseFloat(qe.paddingRight),
          vt = Pe.cloneNode(!1);
        vt.textContent = SE, vt.style.cssText = "visibility:hidden;position:absolute;left:0;top:0;white-space:nowrap;pointer-events:none;", ye.appendChild(vt);
        const kt = vt.offsetWidth + Tt;
        return ye.removeChild(vt), kt
      },
      Ie = () => {
        var Nn;
        const W = o.value,
          ye = a.value,
          Pe = u.value,
          qe = h.value;
        if (!W || !ye || !Pe || !qe || t.isStatic || p.value !== "clipboard" || d.value) return;
        (Nn = g.value) == null || Nn.kill();
        const Tt = W.offsetWidth,
          vt = j(W, ye, qe);
        gsap.set(W, {
          width: Tt,
          overflow: "hidden"
        }), gsap.set(Pe, {
          yPercent: 0,
          opacity: 1,
          overwrite: !0
        }), Be(qe);
        const kt = gsap.timeline({
          onComplete: () => {
            d.value = !0, gsap.set(W, {
              width: vt,
              overflow: "hidden"
            })
          }
        });
        kt.to(Pe, {
          yPercent: -100,
          opacity: 0,
          duration: Ig,
          ease: "power2.out"
        }, 0), kt.fromTo(qe, {
          yPercent: 100
        }, {
          yPercent: 0,
          duration: Ig,
          ease: "power2.out"
        }, 0), kt.to(W, {
          width: vt,
          duration: Ig,
          ease: "power2.out"
        }, 0), g.value = kt
      },
      Se = (W, ye, Pe) => {
        var Nn;
        if (!o.value) return;
        (Nn = m.value) == null || Nn.kill();
        const qe = ze(W);
        ye && qe !== null && qe !== void 0 && qe !== "" && (f.value = qe, A.value = Array.isArray(qe));
        const {
          xPercent: Tt,
          yPercent: vt
        } = D(qe);
        gsap.set(o.value, {
          transformOrigin: "0% 100%",
          xPercent: Tt,
          yPercent: vt
        });
        const kt = gsap.timeline();
        ye && kt.set(o.value, {
          scale: 0,
          opacity: 1
        }, 0), kt.to(o.value, {
          scale: ye ? 1 : 0,
          duration: ye ? .65 : .3,
          ease: ye ? "elastic.out(0.75)" : "expo.out"
        }, 0), Pe && kt.eventCallback("onComplete", Pe), m.value = kt
      },
      pe = W => {
        var ye;
        o.value && ((ye = m.value) == null || ye.kill(), gsap.set(o.value, {
          scale: 1
        }), m.value = gsap.to(o.value, {
          opacity: 0,
          duration: .3,
          ease: "power2.in"
        }))
      };
    e({
      revealStaticSoundIndication: (W, ye) => {
        var Pe;
        !t.isStatic || !o.value || !Re(t.cursorIndication) || y.value || ((Pe = v.value) == null || Pe.kill(), gsap.set(o.value, {
          opacity: 0,
          scale: 1
        }), W.to(o.value, {
          opacity: 1,
          duration: 1,
          ease: "reveal"
        }, ye))
      },
      getTextElement: () => o.value
    });
    const et = W => {
        if (!o.value || !Re(W)) return;
        if (t.isStatic) {
          gsap.set(o.value, {
            opacity: 0,
            scale: 1
          });
          return
        }
        const {
          xPercent: ye,
          yPercent: Pe
        } = D(W);
        gsap.set(o.value, {
          scale: 0,
          transformOrigin: "0% 100%",
          xPercent: ye,
          yPercent: Pe
        })
      },
      Ze = () => {
        var W;
        Le() && (t.isStatic || !Re(t.cursorIndication) || y.value || b.value || (b.value = !0, (W = v.value) == null || W.kill(), Se(t.cursorIndication, !0)))
      },
      Ue = () => {
        const W = Ce();
        return me() ? W * 2 : W
      },
      Ve = () => {
        const W = document.querySelector(".videoPlayer__progress");
        if (!W) return null;
        const ye = W.getBoundingClientRect();
        return ye.top + ye.height / 2 - Ue()
      },
      ft = () => {
        const W = ae.value && Number(gsap.getProperty(ae.value, "scale")) || 0,
          ye = V.value && Number(gsap.getProperty(V.value, "scale")) || 0;
        return W > .01 || ye > .01
      },
      mt = () => {
        const W = ae.value;
        return W != null && W.offsetWidth ? W.offsetWidth / 2 : (k.value === "timelineDrag" ? se() : $()).width / 2
      },
      K = (W, ye) => {
        if (!(W === void 0 || ye === void 0)) {
          if (R.value = !0, w.value = Date.now(), ie.value) {
            const Pe = Ve();
            T.x = Qe(W), T.y = Pe ?? ye
          } else T.x = W, T.y = ye;
          C.x = T.x, C.y = T.y, x.x = W, x.y = ye
        }
      },
      Qe = W => {
        const ye = document.querySelector(".videoPlayer__progress");
        if (!ye) return W;
        const Pe = ye.getBoundingClientRect(),
          qe = mt();
        return Math.min(Pe.right - qe, Math.max(Pe.left + qe, W))
      },
      ve = () => {
        var W;
        (W = ne.value) == null || W.kill(), ne.value = null
      },
      F = () => {
        const W = Ve();
        W !== null && (T.y = W, ve(), ne.value = gsap.to(C, {
          y: W,
          duration: O3,
          ease: "power3.out",
          overwrite: "auto"
        }))
      },
      J = W => W === V.value ? Y : W === ae.value ? G : null,
      fe = () => ie.value ? ae.value : V.value,
      Oe = (W, ye) => {
        var qe;
        if (!W) {
          ye == null || ye();
          return
        }
        const Pe = J(W);
        (qe = Pe == null ? void 0 : Pe.value) == null || qe.kill(), Pe.value = gsap.to(W, {
          scale: 0,
          duration: .3,
          ease: "expo.out",
          overwrite: !0,
          onComplete: ye
        })
      },
      je = (W, ye) => {
        var qe;
        if (!W) return;
        He(W);
        const Pe = J(W);
        (qe = Pe == null ? void 0 : Pe.value) == null || qe.kill(), Pe.value = gsap.to(W, {
          scale: 1,
          duration: .65,
          ease: "elastic.out(0.75)",
          overwrite: !0,
          onComplete: ye
        })
      },
      rt = (W, ye, Pe) => {
        Oe(W), je(ye, Pe)
      },
      Ge = W => W === ae.value ? E : oe,
      He = W => {
        W && gsap.set(W, Ge(W))
      },
      Ke = () => {
        const W = me() ? se() : $();
        gsap.set(V.value, {
          scale: 0,
          ...oe
        }), gsap.set(ae.value, {
          scale: 0,
          ...E,
          ...W,
          overflow: "hidden"
        })
      },
      Fe = (W, {
        animate: ye = !0
      } = {}) => {
        var Di;
        const Pe = ae.value;
        if (!Pe) return;
        (Di = z.value) == null || Di.kill();
        const qe = W === "timelineDrag" ? se() : $(),
          Tt = ge.value,
          vt = q.value,
          kt = W === "timelineDrag" ? H() : 0;
        if (!(ye && !me())) {
          gsap.set(Pe, {
            ...qe,
            overflow: "hidden"
          }), Tt && vt && (gsap.set(Tt, {
            x: -kt
          }), gsap.set(vt, {
            x: kt
          }));
          return
        }
        const an = gsap.timeline({
          overwrite: !0
        });
        an.to(Pe, {
          ...qe,
          duration: Rg,
          ease: "elastic.out(1, 0.55)"
        }, 0), Tt && vt && (an.to(Tt, {
          x: -kt,
          duration: Rg,
          ease: "elastic.out(1, 0.55)"
        }, 0), an.to(vt, {
          x: kt,
          duration: Rg,
          ease: "elastic.out(1, 0.55)"
        }, 0)), z.value = an
      },
      at = W => {
        k.value = W, Fe(W, {
          animate: !1
        }), rt(V.value, ae.value)
      },
      tt = W => {
        var ye, Pe;
        k.value = "default", ve(), (ye = Y.value) == null || ye.kill(), (Pe = G.value) == null || Pe.kill(), U(W, {
          animate: !1
        }), rt(ae.value, V.value)
      },
      ht = () => {
        nextTick(() => {
          var W;
          o.value && ((W = m.value) == null || W.kill(), gsap.set(o.value, {
            scale: 0,
            opacity: 1,
            transformOrigin: "0% 100%",
            xPercent: 0,
            yPercent: -100
          }))
        })
      },
      en = () => {
        emitter.emit(EVENTS.SHOWREEL_CURSOR_RESTORE)
      },
      St = ({
        animateOut: W = !1
      } = {}) => {
        var vt, kt, Nn, an, Di;
        ve(), (vt = Y.value) == null || vt.kill(), (kt = G.value) == null || kt.kill(), (Nn = z.value) == null || Nn.kill(), (an = Q.value) == null || an.kill(), (Di = M.value) == null || Di.kill();
        const ye = p.value === "showreel",
          Pe = ie.value;
        if (B.value = !1, N.value = !0, k.value = "default", O.value = !1, he.value && gsap.set(he.value, {
            yPercent: 0,
            clearProps: "transform"
          }), !r.value || t.isStatic) return;
        gsap.set(r.value, {
          opacity: 1,
          clearProps: "opacity"
        });
        const qe = V.value,
          Tt = ae.value;
        if (ye) {
          if (W) {
            const ji = Pe ? Tt : qe,
              $h = ji && Number(gsap.getProperty(ji, "scale")) || 0;
            if (ji && $h > .01) {
              Oe(ji, () => {
                p.value = "default", f.value = "", A.value = !1, ht(), en()
              });
              return
            }
          }
          p.value = "default", f.value = "", A.value = !1, ht(), en()
        }
      },
      tn = () => {
        !B.value && p.value !== "showreel" || St({
          animateOut: !1
        })
      },
      Tn = W => W ? 0 : -50,
      qt = (W, {
        animate: ye = !0
      } = {}) => {
        var Tt;
        const Pe = he.value;
        if (!Pe) return !1;
        (Tt = M.value) == null || Tt.kill();
        const qe = Tn(W);
        return ye ? (M.value = gsap.to(Pe, {
          yPercent: qe,
          duration: P3,
          ease: "power3.out",
          force3D: !0,
          overwrite: "auto"
        }), !0) : (gsap.set(Pe, {
          yPercent: qe,
          force3D: !0
        }), !0)
      },
      jt = (W, {
        animate: ye = !1
      } = {}) => {
        qt(W, {
          animate: ye
        }) || nextTick(() => {
          qt(W, {
            animate: ye
          }) || requestAnimationFrame(() => qt(W, {
            animate: ye
          }))
        })
      },
      U = (W, {
        animate: ye = !1
      } = {}) => {
        var Pe, qe;
        (Pe = M.value) == null || Pe.kill(), (qe = Q.value) == null || qe.kill(), jt(W, {
          animate: ye
        })
      },
      _e = W => {
        U(W, {
          animate: !1
        }), je(V.value)
      },
      xe = () => {
        var ye;
        const W = V.value;
        W && ((ye = Q.value) == null || ye.kill(), Q.value = gsap.timeline({
          overwrite: "auto"
        }).to(W, {
          scale: 1.12,
          duration: .08,
          ease: "power2.out"
        }).to(W, {
          scale: 1,
          duration: .85,
          ease: "elastic.out(1.6, 0.35)"
        }))
      },
      Ae = W => {
        if (t.isStatic || !B.value || ie.value) return;
        const ye = typeof W == "boolean" ? W : !!(W != null && W.playing);
        if (N.value = ye, O.value) {
          U(ye, {
            animate: !1
          });
          return
        }
        xe(), U(ye, {
          animate: !0
        })
      },
      De = W => {
        if (!r.value) return;
        R.value || (R.value = !0, Ze()), w.value = Date.now();
        const ye = W.clientX - x.x,
          Pe = W.clientY - x.y,
          qe = Math.sqrt(ye * ye + Pe * Pe);
        let Tt;
        if (Math.abs(ye) > Math.abs(Pe) ? Tt = ye > 0 ? qe : -qe : Tt = Pe > 0 ? qe : -qe, qe > 0 && !(B.value && ie.value) && (T.z = Math.max(-1, Math.min(Tt * .02, 1))), B.value && ie.value) {
          const vt = Ve();
          T.x = Qe(W.clientX), T.y = vt ?? W.clientY
        } else T.x = W.clientX, T.y = W.clientY;
        x.x = W.clientX, x.y = W.clientY, _t()
      },
      We = ({
        dt: W
      }) => {
        if (!r.value) return;
        Date.now() - w.value > L3 && (T.z = 0);
        const Pe = B.value && ie.value,
          qe = !!ne.value,
          Tt = 12,
          vt = 1 - Math.exp(-Tt * W),
          kt = 1 - Math.exp(-6 * W);
        if (C.x = lerp(C.x, T.x, vt), Pe && (C.x = Qe(C.x)), !qe) {
          const ji = 1 - Math.exp(-(Pe ? 6 : Tt) * W);
          C.y = lerp(C.y, T.y, ji)
        }
        C.z = lerp(C.z, T.z, kt);
        const Nn = B.value && ie.value && !O.value;
        B.value && O.value && !ft() || !R.value && !Nn ? r.value.style.transform = "translate(-100%, -100%) scale(1) rotate(0deg)" : B.value && ie.value ? r.value.style.transform = `translate(${C.x}px, ${C.y}px) scale(1) rotate(0deg)` : r.value.style.transform = `translate(${C.x}px, ${C.y}px) scale(${1+Math.abs(C.z)}) rotate(${C.z*40}deg)`
      },
      nt = () => {
        var W;
        y.value || (y.value = !0, (W = v.value) == null || W.kill(), Array.isArray(f.value) && (t.isStatic ? pe() : Se(f.value, !1)))
      },
      ot = () => {
        var W;
        return ((W = app.lenis) == null ? void 0 : W.animatedScroll) ?? window.scrollY
      },
      pt = () => {
        const W = document.querySelector(".webglBg__content.heroBlock");
        if (!W) {
          Ee = null;
          return
        }
        Ee = getOffset(W).top
      },
      _t = () => {
        if (t.isStatic || y.value || !app.firstClick || !S.value || !Re(f.value) || !R.value || Ee === null) return;
        const W = Ee - ot(),
          ye = T.y;
        W <= ye && nt()
      },
      ut = () => {
        pt(), _t(), p.value === "showreel" && (Fe(k.value, {
          animate: !1
        }), ie.value && (F(), T.x = Qe(T.x), C.x = T.x))
      },
      lt = () => {
        pt()
      },
      Ct = () => {
        _t()
      },
      Kt = () => {
        Ie()
      },
      Fn = () => {
        Oe(fe())
      },
      Dn = W => {
        const ye = typeof W == "boolean" ? W : !!(W != null && W.active),
          Pe = typeof W == "object" && W !== null && "isPlaying" in W ? W.isPlaying : N.value,
          qe = typeof W == "object" && W !== null && W.cursorMode ? W.cursorMode : "default",
          Tt = k.value,
          vt = O.value;
        if (B.value = ye, N.value = Pe, !r.value || t.isStatic) {
          ye || (k.value = "default", O.value = !1);
          return
        }
        if (ye) {
          const kt = p.value !== "showreel",
            Nn = p.value,
            an = () => {
              if (p.value = "showreel", f.value = "", A.value = !1, r.value.style.visibility = "", gsap.set(r.value, {
                  opacity: 1
                }), qe === "hidden") {
                O.value = !0, Fn(), k.value = "default", U(Pe, {
                  animate: !1
                });
                return
              }
              O.value = !1;
              const Di = Tt === "timeline" || Tt === "timelineDrag",
                ji = qe === "timeline" || qe === "timelineDrag";
              kt ? nextTick(() => {
                Ke(), ji ? (F(), at(qe)) : (k.value = "default", _e(Pe))
              }) : vt ? ji ? Di ? (k.value = qe, F(), nextTick(() => {
                Fe(qe, {
                  animate: !1
                }), je(ae.value)
              })) : (F(), at(qe)) : (k.value = qe, ve(), _e(Pe)) : Tt !== qe && (ji && !Di ? (F(), at(qe)) : !ji && Di ? tt(Pe) : ji && (k.value = qe, Fe(qe, {
                animate: !me()
              })))
            };
          if (kt && Nn === "default" && o.value && (Number(gsap.getProperty(o.value, "scale")) || 0) > .01) {
            Se(null, !1, an);
            return
          }
          an(), typeof W == "object" && W !== null && W.clientX !== void 0 && nextTick(() => K(W.clientX, W.clientY));
          return
        }
        p.value === "showreel" && St({
          animateOut: !0
        })
      },
      Dt = (W, ye, Pe = {}) => {
        var vt;
        if (t.isStatic || B.value || !Le()) return;
        if (ye && Pe.variant && (p.value = Pe.variant, Pe.variant === "clipboard" && (_.value = Pe.clipboardTheme === "white" ? "white" : "default", typeof W == "string" && (c.value = W))), ye) {
          if (Re(W) && y.value) {
            f.value = W, A.value = !0, Se(W, !1);
            return
          }
          if (Pe.variant === "clipboard") {
            nextTick(() => {
              le(), Se(W, !0)
            });
            return
          }
          Se(W, !0);
          return
        }
        const qe = p.value === "clipboard",
          Tt = qe && d.value;
        Tt ? (vt = g.value) == null || vt.kill() : Me(), Re(f.value) && (y.value = !0), Se(W, !1, () => {
          Tt && Me(), qe && (p.value = "default", _.value = "default")
        })
      },
      yt = W => {
        W && nt()
      },
      be = () => {
        S.value = !0
      };
    return onMounted(async () => {
      var Pe;
      if (A.value = Array.isArray(t.cursorIndication), f.value = t.cursorIndication ?? "", emitter.on(EVENTS.CURSOR_SOUND_INDICATION_SUPPRESS, yt), await nextTick(), Re(t.cursorIndication) && et(t.cursorIndication), t.isStatic) return;
      app.isLoaderRevealComplete && (S.value = !0), emitter.on(EVENTS.RENDER, We), emitter.on(EVENTS.CURSOR_INDICATION_CHANGE, Dt), emitter.on(EVENTS.CURSOR_INDICATION_CLIPBOARD_COPIED, Kt), emitter.on(EVENTS.SHOWREEL_PLAYER_CHANGE, Dn), emitter.on(EVENTS.SHOWREEL_ICON_TOGGLE, Ae), emitter.on(EVENTS.SHOWREEL_RESET, tn), emitter.on(EVENTS.RESIZE, ut), emitter.on(EVENTS.SHOW_HOME_PAGE, lt), emitter.on(EVENTS.LOADER_REVEAL_COMPLETE, be), Re(t.cursorIndication) || Dt(t.cursorIndication, !0);
      const W = window.innerWidth / 2,
        ye = window.innerHeight / 2;
      T.x = W, T.y = ye, C.x = W, C.y = ye, x.x = W, x.y = ye, r.value && (r.value.style.transform = "translate(-100%, -100%) scale(1) rotate(0deg)"), window.addEventListener("pointermove", De, {
        passive: !0
      }), (Pe = app.lenis) == null || Pe.on("scroll", Ct), pt()
    }), onUnmounted(() => {
      var W, ye, Pe, qe, Tt, vt, kt, Nn, an;
      (W = v.value) == null || W.kill(), (ye = Y.value) == null || ye.kill(), (Pe = G.value) == null || Pe.kill(), (qe = z.value) == null || qe.kill(), (Tt = Q.value) == null || Tt.kill(), (vt = M.value) == null || vt.kill(), ve(), gsap.killTweensOf(Te(o.value, a.value, l.value, u.value, h.value, V.value, ae.value, he.value, ge.value, q.value)), (kt = m.value) == null || kt.kill(), (Nn = g.value) == null || Nn.kill(), emitter.off(EVENTS.CURSOR_SOUND_INDICATION_SUPPRESS, yt), !t.isStatic && (window.removeEventListener("pointermove", De), (an = app.lenis) == null || an.off("scroll", Ct), emitter.off(EVENTS.RENDER, We), emitter.off(EVENTS.CURSOR_INDICATION_CHANGE, Dt), emitter.off(EVENTS.CURSOR_INDICATION_CLIPBOARD_COPIED, Kt), emitter.off(EVENTS.SHOWREEL_PLAYER_CHANGE, Dn), emitter.off(EVENTS.SHOWREEL_ICON_TOGGLE, Ae), emitter.off(EVENTS.SHOWREEL_RESET, tn), emitter.off(EVENTS.RESIZE, ut), emitter.off(EVENTS.SHOW_HOME_PAGE, lt), emitter.off(EVENTS.LOADER_REVEAL_COMPLETE, be), Ee = null)
    }), (W, ye) => (openBlock(), createElementBlock("div", {
      ref_key: "cursorIndicationRef",
      ref: r,
      class: normalizeClass(["cursorIndication", {
        "cursorIndication--static": s.isStatic,
        "cursorIndication--showreel": p.value === "showreel",
        "cursorIndication--showreelHidden": p.value === "showreel" && O.value
      }])
    }, [p.value === "showreel" ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [createElementVNode("div", {
      ref_key: "showreelPlayPauseBubbleRef",
      ref: V,
      class: "cursorIndication__text cursorIndication__text--showreel showreel__bubble showreel__bubble--playPause"
    }, [createElementVNode("div", {
      ref_key: "showreelIconTrackRef",
      ref: de,
      class: "showreel__iconTrack"
    }, [createElementVNode("div", {
      ref_key: "showreelIconInnerRef",
      ref: he,
      class: "showreel__iconInner"
    }, [...ye[0] || (ye[0] = [createStaticVNode('<div class="showreel__iconLine" data-v-002aba1a><span class="showreel__icon showreel__icon--pause" aria-hidden="true" data-v-002aba1a><span class="showreel__pauseBar" data-v-002aba1a></span><span class="showreel__pauseBar" data-v-002aba1a></span></span></div><div class="showreel__iconLine" data-v-002aba1a><svg class="showreel__icon showreel__icon--play" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-v-002aba1a><path d="M0 0L9 5.5L0 11V0Z" fill="currentColor" data-v-002aba1a></path></svg></div>', 2)])], 512)], 512)], 512), createElementVNode("div", {
      ref_key: "showreelTimelineBubbleRef",
      ref: ae,
      class: "cursorIndication__text cursorIndication__text--showreelTimeline showreel__bubble showreel__bubble--timeline"
    }, [createElementVNode("div", R3, [(openBlock(), createElementBlock("svg", {
      ref_key: "showreelArrowLeftRef",
      ref: ge,
      class: "showreel__arrow showreel__arrow--left",
      viewBox: "0 0 5 8",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true"
    }, [...ye[1] || (ye[1] = [createElementVNode("path", {
      d: "M4 1L1 4L4 7",
      stroke: "currentColor",
      "stroke-width": "1.25",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)])], 512)), (openBlock(), createElementBlock("svg", {
      ref_key: "showreelArrowRightRef",
      ref: q,
      class: "showreel__arrow showreel__arrow--right",
      viewBox: "0 0 5 8",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true"
    }, [...ye[2] || (ye[2] = [createElementVNode("path", {
      d: "M1 1L4 4L1 7",
      stroke: "currentColor",
      "stroke-width": "1.25",
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, null, -1)])], 512))])], 512)], 64)) : (openBlock(), createElementBlock("div", {
      key: 1,
      ref_key: "cursorIndicationTextRef",
      ref: o,
      class: normalizeClass(["cursorIndication__text", {
        "cursorIndication__text--array": A.value,
        "cursorIndication__text--clipboard": p.value === "clipboard" && _.value === "default",
        "cursorIndication__text--clipboardWhite": p.value === "clipboard" && _.value === "white"
      }])
    }, [A.value ? (openBlock(), createElementBlock(Fragment, {
      key: 0
    }, [createElementVNode("span", null, toDisplayString(f.value[0]), 1), ye[3] || (ye[3] = createElementVNode("span", {
      class: "text__separator",
      "aria-hidden": "true"
    }, null, -1)), createElementVNode("span", null, toDisplayString(f.value[1]), 1)], 64)) : p.value === "clipboard" ? (openBlock(), createElementBlock("div", {
      key: 1,
      ref_key: "cursorIndicationTrackRef",
      ref: a,
      class: "cursorIndication__track cursorIndication__track--clipboard"
    }, [createElementVNode("div", B3, [createElementVNode("span", {
      ref_key: "clipboardDefaultLabelRef",
      ref: u,
      class: "cursorIndication__label"
    }, toDisplayString(c.value), 513)]), createElementVNode("div", D3, [createElementVNode("span", {
      ref_key: "clipboardCopiedLabelRef",
      ref: h,
      class: "cursorIndication__label cursorIndication__label--initial"
    }, toDisplayString(SE), 512)])], 512)) : (openBlock(), createElementBlock("div", {
      key: 2,
      ref_key: "cursorIndicationTrackRef",
      ref: a,
      class: "cursorIndication__track"
    }, [createElementVNode("span", {
      ref_key: "cursorIndicationLabelRef",
      ref: l,
      class: "cursorIndication__label"
    }, toDisplayString(f.value), 513)], 512))], 2))], 2))
  }
};

export const CursorIndication = _export_sfc(CursorIndicationSfc, [
  ["__scopeId", "data-v-002aba1a"]
]);
