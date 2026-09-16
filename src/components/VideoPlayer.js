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
  Teleport,
  computed,
  createBlock,
  createElementVNode,
  createVNode,
  normalizeClass,
  normalizeStyle,
  onMounted,
  onUnmounted,
  openBlock,
  ref,
  unref,
  vShow,
  withCtx,
  withDirectives,
  withModifiers
} from 'vue';
import {
  toCompressedShowreel
} from '../config/media-paths.js';
import {
  app
} from '../core/App.js';
import {
  EVENTS,
  emitter
} from '../core/events.js';
import {
  isSafari
} from '../utils/browser.js';
import {
  isTabletWidth
} from '../utils/device.js';
import {
  GridWrapper
} from './GridWrapper.js';
import {
  CrossIcon
} from './icons/CrossIcon.js';

const d5 = {
  class: "videoPlayer__media"
};

const f5 = ["src"];

const p5 = {
  class: "videoPlayer__closeWrap"
};

const A5 = {
  class: "compactPlayPause__iconTrack"
};

const Ol = .3;

const hS = .35;

const dS = .6;

const g5 = .5;

const m5 = .35;

const _5 = 600;

const v5 = 2800;

const y5 = 1.02;

const Qg = 1;

const x5 = 1e3;

const E5 = .2;

const S5 = 100;

const w5 = .6;

const b5 = .99;

const VideoPlayerSfc = {
  __name: "VideoPlayer",
  props: {
    url: {
      type: String,
      default: null
    }
  },
  setup(s, {
    expose: e
  }) {
    const t = isSafari();
    CustomEase.create("reveal", "0.4,0,0,1"), CustomEase.create("hide", "0.86, 0, 0.07, 1");
    const n = s,
      i = ref(typeof window < "u" ? window.innerWidth : 1025),
      r = computed(() => n.url ? toCompressedShowreel(n.url, i.value) : null),
      o = () => {
        i.value = window.innerWidth
      },
      a = {
        WHITE_MASK_START: 0,
        WHITE_MASK_DURATION: .4,
        VIDEO_SCALE_1_START: 0,
        VIDEO_SCALE_1_DURATION: .4,
        VIDEO_SCALE_2_START: .35,
        VIDEO_SCALE_2_DURATION: .65,
        CLOSE_BUTTON_START: .35,
        CLOSE_BUTTON_DURATION: .65,
        PROGRESS_SCALE_START: .35,
        PROGRESS_SCALE_DURATION: .65,
        PLAY_START: .55
      },
      l = a.VIDEO_SCALE_2_START + a.VIDEO_SCALE_2_DURATION,
      u = a.PROGRESS_SCALE_START,
      h = a.PROGRESS_SCALE_DURATION,
      c = ref();
    ref();
    const d = ref(),
      f = ref(),
      A = ref(),
      m = ref(),
      g = ref(),
      p = ref(),
      _ = ref(),
      v = ref(),
      y = ref(),
      b = ref(),
      S = ref(!1),
      T = ref(!1),
      C = ref(!1),
      x = ref(!1),
      w = ref(0);
    let R = null,
      B = null,
      N = null,
      k = !1,
      O = !1,
      Y = !1,
      G = 0,
      z = 0,
      Q = "default",
      M = null,
      ne = null,
      V = !1,
      ae = !1,
      ge = !1,
      q = !1,
      de = !1,
      he = null,
      ie = 0,
      me = 0,
      Le = 0;
    const oe = ref(!1),
      E = (be = G, W = z) => {
        ie = 0, me = be, Le = W
      },
      L = (be, W) => {
        const ye = be - me,
          Pe = W - Le;
        return ie += Math.hypot(ye, Pe), me = be, Le = W, ie >= S5
      },
      X = () => [A.value, _.value, y.value].filter(Boolean),
      $ = () => isTabletWidth(),
      se = () => !$();
    let H = null;
    const Ce = () => {
        const be = y.value;
        !be || !$() || (H == null || H.kill(), H = gsap.timeline({
          overwrite: "auto"
        }).to(be, {
          scale: 1.12,
          duration: .08,
          ease: "power2.out"
        }).to(be, {
          scale: 1,
          duration: .85,
          ease: "elastic.out(1.6, 0.35)"
        }))
      },
      Ee = (be, {
        animate: W = !0
      } = {}) => {
        const ye = b.value;
        !ye || !$() || gsap.to(ye, {
          yPercent: be ? 0 : -50,
          duration: W ? .35 : 0,
          ease: "power3.out"
        })
      },
      Re = be => {
        if (!S.value || !$()) return;
        const W = typeof be == "boolean" ? be : !!(be != null && be.playing);
        (typeof be == "boolean" ? !0 : (be == null ? void 0 : be.animateClick) !== !1) && Ce(), Ee(W, {
          animate: !0
        })
      },
      Te = (be, W, {
        position: ye,
        duration: Pe,
        ease: qe
      }) => {
        !f.value || !$() || be.to(f.value, {
          opacity: W,
          duration: Pe,
          ease: qe
        }, ye)
      },
      ze = () => {
        document.body && (document.body.style.cursor = S.value && oe.value ? "none" : "")
      },
      P = be => {
        p.value && gsap.set(p.value, {
          opacity: be
        })
      },
      D = () => {
        V = !1, ae = !1, ge = !1, q = !1, gsap.killTweensOf(p.value), P(0)
      },
      le = () => !S.value || $() ? !1 : x.value ? ge && q : !0,
      Be = () => {
        !S.value || !V || (ge = !0)
      },
      Me = be => {
        const W = X(),
          ye = E5,
          Pe = be ? "power2.out" : "power2.inOut";
        Se();
        const qe = gsap.timeline();
        W.length && qe.to(W, {
          opacity: be ? 1 : 0,
          duration: ye,
          ease: Pe
        }, 0), p.value && be && le() ? qe.to(p.value, {
          opacity: w5,
          duration: ye,
          ease: Pe
        }, 0) : p.value && !be && Number(gsap.getProperty(p.value, "opacity") ?? 0) > .001 && qe.to(p.value, {
          opacity: 0,
          duration: ye,
          ease: Pe
        }, 0), ne = qe
      },
      j = be => {
        const W = be ? "auto" : "none";
        A.value && (A.value.style.pointerEvents = W), v.value && (v.value.style.pointerEvents = W)
      },
      Ie = () => {
        M !== null && (clearTimeout(M), M = null)
      },
      Se = () => {
        ne == null || ne.kill(), ne = null
      },
      pe = () => {
        S.value && (oe.value = !1, ze(), j(!0), Q = "", F(), Me(!0))
      },
      ke = () => {
        !se() || !S.value || !x.value || k || oe.value || (oe.value = !0, q = !0, ze(), O = !1, Y = !1, j(!1), Q = "hidden", K(!0, x.value, "hidden"), Me(!1), E())
      },
      et = () => {
        he !== null && clearTimeout(he), de = !0, he = setTimeout(() => {
          de = !1, he = null
        }, 120)
      },
      Ze = () => {
        se() && (Ie(), Se(), !(!S.value || oe.value) && (Y = !1, O = !1, oe.value = !0, q = !0, ze(), j(!1), Q = "hidden", K(!0, x.value, "hidden"), Me(!1), E(), et()))
      },
      Ue = ({
        immediate: be = !1
      } = {}) => {
        if (Ie(), !(!se() || !S.value || !x.value)) {
          if (be) {
            Ze();
            return
          }
          M = setTimeout(ke, x5)
        }
      },
      Ve = ({
        forceReveal: be = !1
      } = {}) => {
        if (!(!S.value || de)) {
          if (oe.value) {
            if (!be) return;
            pe(), E()
          }
          Ue()
        }
      },
      ft = () => {
        S.value && (oe.value = !1, ze(), gsap.set(X(), {
          opacity: 1
        }), j(!0), Ue())
      },
      mt = () => {
        Ie(), Se(), he !== null && (clearTimeout(he), he = null), de = !1, oe.value = !1, E(), ze(), gsap.set(X(), {
          opacity: 1
        }), j(!0)
      },
      K = (be, W = x.value, ye = "default", Pe = null) => {
        const qe = {
          active: be,
          isPlaying: W,
          cursorMode: ye
        };
        (Pe == null ? void 0 : Pe.clientX) !== void 0 ? (qe.clientX = Pe.clientX, qe.clientY = Pe.clientY) : be && $() && k && (qe.clientX = G, qe.clientY = z), emitter.emit(EVENTS.SHOWREEL_PLAYER_CHANGE, qe)
      },
      Qe = () => $() ? k ? "timelineDrag" : "hidden" : oe.value || O ? "hidden" : k ? "timelineDrag" : Y || Ae(G, z) ? "timeline" : "default",
      ve = () => ae || $() && k,
      F = be => {
        if (!S.value) return;
        const W = ve() ? Qe() : "hidden",
          ye = be !== void 0 ? be : x.value,
          qe = $() && k && (W !== Q || be !== void 0) ? {
            clientX: G,
            clientY: z
          } : null;
        W === Q && be === void 0 || (Q = W, K(!0, ye, W, qe))
      },
      J = be => {
        const W = be.clientX,
          ye = be.clientY;
        if (G = W, z = ye, oe.value) {
          if (!L(W, ye)) return;
          Ve({
            forceReveal: !0
          }), F();
          return
        }
        Ve(), F()
      },
      fe = be => {
        S.value && (G = be.clientX, z = be.clientY, Ve({
          forceReveal: !0
        }))
      },
      Oe = () => {
        window.addEventListener("pointermove", J, {
          passive: !0
        }), window.addEventListener("pointerdown", fe, {
          passive: !0
        })
      },
      je = () => {
        window.removeEventListener("pointermove", J), window.removeEventListener("pointerdown", fe)
      },
      rt = () => {
        var be;
        (be = app.lenis) == null || be.stop()
      },
      Ge = () => {
        var be;
        (be = app.lenis) == null || be.start()
      },
      He = () => {
        N == null || N.kill(), N = null
      },
      Ke = (be, W, ye = g5) => {
        const Pe = m.value;
        Pe && (He(), N = gsap.to(Pe, {
          volume: be,
          duration: ye,
          ease: "power2.inOut",
          onComplete: W
        }))
      },
      Fe = () => {
        app.soundController.suppressAmbientForShowreel(), app.soundController.fadeOutAmbient(_5)
      },
      at = () => {
        app.soundController.releaseAmbientForShowreel(), !(app.soundController.ambientVolumeFactor <= 0) && app.soundController.fadeInAmbient(v5)
      },
      tt = () => $(),
      ht = ({
        hideUiImmediately: be = !1
      } = {}) => {
        const W = m.value;
        W && (x.value = !0, He(), W.play().catch(() => {}), tt() ? W.volume = Qg : Ke(Qg), be && se() && Ze(), F(!0))
      },
      en = ({
        onComplete: be,
        instant: W = !1
      } = {}) => {
        const ye = m.value;
        if (!ye) return;
        const Pe = W || tt();
        if (x.value = !1, Ie(), F(!1), Pe || (oe.value ? pe() : Me(!0)), Pe) {
          He(), ye.volume = 0, ye.pause(), be == null || be();
          return
        }
        Ke(0, () => {
          ye.pause(), be == null || be()
        }, m5)
      },
      St = () => {
        const be = m.value;
        if (be) {
          if (tt()) {
            He(), be.volume = 0, x.value = !1, F(!1), be.paused && be.play().catch(() => {});
            return
          }
          en({
            instant: !0
          })
        }
      },
      tn = () => {
        const be = m.value;
        be && (x.value = !0, He(), be.volume = Qg, be.paused && be.play().catch(() => {}), F(!0))
      },
      Tn = () => {
        if (!S.value) return;
        const be = !x.value;
        $() ? emitter.emit(EVENTS.SHOWREEL_ICON_TOGGLE, {
          playing: be,
          animateClick: !0
        }) : emitter.emit(EVENTS.SHOWREEL_ICON_TOGGLE, be), x.value ? en() : ht({
          hideUiImmediately: !0
        })
      },
      qt = () => {
        const be = m.value;
        be != null && be.duration && (w.value = be.currentTime / be.duration)
      },
      jt = () => {
        const be = m.value;
        be && (be.volume = 0, w.value = 0)
      },
      U = be => {
        const W = m.value,
          ye = v.value;
        if (!(W != null && W.duration) || !ye) return;
        const Pe = ye.getBoundingClientRect(),
          qe = Math.min(Pe.right, Math.max(Pe.left, be)),
          Tt = Math.min(b5, Math.max(0, (qe - Pe.left) / Pe.width));
        W.currentTime = Tt * W.duration, w.value = Tt
      },
      _e = be => {
        k || U(be.clientX)
      },
      xe = be => {
        k && (G = be.clientX, z = be.clientY, U(be.clientX))
      },
      Ae = (be, W) => {
        const ye = v.value;
        if (!ye || be === void 0 || W === void 0) return !1;
        const Pe = ye.getBoundingClientRect(),
          qe = $() ? 80 : 48,
          Tt = Pe.top + Pe.height / 2 - qe / 2,
          vt = Tt + qe;
        return be >= Pe.left && be <= Pe.right && W >= Tt && W <= vt
      },
      De = be => {
        k && (k = !1, window.removeEventListener("pointermove", xe), window.removeEventListener("pointerup", We), window.removeEventListener("pointercancel", We), S.value && ((be == null ? void 0 : be.clientX) !== void 0 && (G = be.clientX, z = be.clientY), Y = !1, $() ? (Ee(!0, {
          animate: !1
        }), tn()) : (emitter.emit(EVENTS.SHOWREEL_ICON_TOGGLE, !0), ht({
          hideUiImmediately: !0
        })), Q = "", F(!0)))
      },
      We = be => {
        De(be)
      },
      nt = be => {
        S.value && (k = !0, G = be.clientX, z = be.clientY, St(), U(be.clientX), F(!1), window.addEventListener("pointermove", xe), window.addEventListener("pointerup", We), window.addEventListener("pointercancel", We))
      },
      ot = be => {
        S.value && (Y = !0, G = be.clientX, z = be.clientY, F())
      },
      pt = be => {
        S.value && (G = be.clientX, z = be.clientY, Y = !1, !k && F())
      },
      _t = () => {
        S.value && (O = !0, F())
      },
      ut = () => {
        S.value && (O = !1, F())
      },
      lt = () => {
        Fn()
      },
      Ct = () => {
        if (S.value) return;
        const be = m.value;
        if (!be) return;
        R == null || R.kill(), B == null || B.kill(), He(), be.pause(), be.currentTime = 0, be.volume = 0, w.value = 0, T.value = !0, S.value = !0, rt(), Fe(), Q = "hidden", K(!0, !0, "hidden"), Oe();
        const W = g.value;
        gsap.set(W, {
          scale: 0,
          opacity: 1
        }), gsap.set(d.value, {
          opacity: 0
        }), gsap.set(f.value, {
          opacity: 0
        }), gsap.set(_.value, {
          opacity: 1
        }), gsap.set(v.value, {
          scaleX: 0,
          opacity: 1,
          transformOrigin: "left center"
        }), gsap.set(A.value, {
          scale: 0
        }), gsap.set(X(), {
          opacity: 1
        }), y.value && $() && (gsap.set(y.value, {
          xPercent: -50,
          scale: 0
        }), gsap.set(b.value, {
          yPercent: 0
        })), D(), mt();
        const ye = gsap.timeline();
        ye.to(d.value, {
          opacity: 1,
          duration: a.WHITE_MASK_DURATION,
          ease: "reveal"
        }, a.WHITE_MASK_START), Te(ye, 1, {
          position: a.WHITE_MASK_START,
          duration: a.WHITE_MASK_DURATION,
          ease: "reveal"
        }), ye.fromTo(W, {
          scale: 0
        }, {
          scale: .5,
          duration: a.VIDEO_SCALE_1_DURATION,
          ease: "reveal"
        }, a.VIDEO_SCALE_1_START), ye.to(W, {
          scale: y5,
          duration: a.VIDEO_SCALE_2_DURATION,
          ease: "reveal"
        }, a.VIDEO_SCALE_2_START), ye.fromTo(A.value, {
          scale: 0
        }, {
          scale: 1,
          duration: a.CLOSE_BUTTON_DURATION,
          ease: "reveal"
        }, a.CLOSE_BUTTON_START), y.value && $() && ye.fromTo(y.value, {
          scale: 0
        }, {
          scale: 1,
          duration: a.CLOSE_BUTTON_DURATION,
          ease: "reveal"
        }, a.CLOSE_BUTTON_START), ye.to(v.value, {
          scaleX: 1,
          duration: h,
          ease: "power2.out"
        }, u), ye.add(() => ht(), a.PLAY_START), ye.add(() => {
          ae = !0, F()
        }, l), ye.add(() => {
          V = !0, ft(), Be(), F()
        }), R = ye
      },
      Kt = () => {
        const be = m.value;
        S.value = !1, T.value = !1, x.value = !1, k = !1, O = !1, Y = !1, Q = "default", w.value = 0, je(), window.removeEventListener("pointermove", xe), window.removeEventListener("pointerup", We), window.removeEventListener("pointercancel", We), mt(), D(), be && (be.pause(), be.currentTime = 0, be.volume = 0), g.value && gsap.set(g.value, {
          scale: 0,
          opacity: 1
        }), d.value && gsap.set(d.value, {
          opacity: 0
        }), f.value && gsap.set(f.value, {
          opacity: 0
        }), _.value && gsap.set(_.value, {
          opacity: 1
        }), v.value && gsap.set(v.value, {
          scaleX: 0,
          opacity: 1,
          transformOrigin: "left center"
        }), A.value && gsap.set(A.value, {
          scale: 0
        }), K(!1, !1), Ge(), at()
      },
      Fn = () => {
        if (!S.value) return;
        const be = m.value;
        if (!be) return;
        S.value = !1, k = !1, O = !1, Y = !1, Q = "default", je(), mt(), V = !1, ae = !1, ge = !1, q = !1, at(), K(!1, !1), R == null || R.kill(), B == null || B.kill(), H == null || H.kill(), gsap.killTweensOf(p.value), gsap.killTweensOf(f.value), gsap.killTweensOf(y.value);
        const W = x.value;
        x.value = !1, W ? Ke(0, void 0, Ol) : (He(), be.pause(), be.volume = 0);
        const ye = g.value,
          Pe = gsap.timeline({
            onComplete: () => {
              T.value = !1, ye && gsap.set(ye, {
                scale: 0,
                opacity: 1
              }), gsap.set(d.value, {
                opacity: 0
              }), f.value && gsap.set(f.value, {
                opacity: 0
              }), gsap.set(_.value, {
                opacity: 1
              }), gsap.set(v.value, {
                scaleX: 0,
                opacity: 1,
                transformOrigin: "left center"
              }), gsap.set(A.value, {
                scale: 0
              }), y.value && gsap.set(y.value, {
                xPercent: -50,
                scale: 0
              }), be.pause(), be.currentTime = 0, be.volume = 0, w.value = 0, ge = !1, P(0), He()
            }
          });
        Pe.add(() => Ge(), 0), ye && Pe.to(ye, {
          opacity: 0,
          duration: Ol,
          ease: "sine.out"
        }, 0), Pe.to(p.value, {
          opacity: 0,
          duration: Ol,
          ease: "sine.out"
        }, 0), Pe.to(v.value, {
          opacity: 0,
          duration: Ol,
          ease: "hide"
        }, 0), Pe.to(A.value, {
          scale: 0,
          duration: Ol,
          ease: "hide"
        }, 0), y.value && $() && Pe.to(y.value, {
          scale: 0,
          duration: Ol,
          ease: "hide"
        }, 0), Pe.to(d.value, {
          opacity: 0,
          duration: dS,
          ease: "sine.inOut"
        }, hS), Te(Pe, 0, {
          position: hS,
          duration: dS,
          ease: "sine.inOut"
        }), B = Pe
      },
      Dn = () => {
        Ct()
      },
      Dt = () => {
        (S.value || T.value) && (C.value = !0)
      },
      yt = () => {
        C.value = !1, !(!S.value && !T.value) && (R == null || R.kill(), B == null || B.kill(), He(), Kt())
      };
    return onMounted(() => {
      gsap.set(d.value, {
        opacity: 0
      }), gsap.set(f.value, {
        opacity: 0
      }), gsap.set(A.value, {
        scale: 0
      }), gsap.set(g.value, {
        scale: 0,
        opacity: 1
      }), gsap.set(p.value, {
        opacity: 0
      }), gsap.set(_.value, {
        opacity: 1
      }), gsap.set(v.value, {
        scaleX: 0,
        opacity: 1,
        transformOrigin: "left center"
      }), y.value && (gsap.set(y.value, {
        xPercent: -50,
        scale: 0
      }), gsap.set(b.value, {
        yPercent: -50
      })), emitter.on(EVENTS.RESIZE, o), emitter.on(EVENTS.SHOWREEL_OPEN, Dn), emitter.on(EVENTS.SHOWREEL_RESET, yt), emitter.on(EVENTS.SHOWREEL_ICON_TOGGLE, Re), emitter.on(EVENTS.WEBGL_SECTION_REVEAL_LOCK, Dt)
    }), onUnmounted(() => {
      emitter.off(EVENTS.RESIZE, o), emitter.off(EVENTS.SHOWREEL_OPEN, Dn), emitter.off(EVENTS.SHOWREEL_RESET, yt), emitter.off(EVENTS.SHOWREEL_ICON_TOGGLE, Re), emitter.off(EVENTS.WEBGL_SECTION_REVEAL_LOCK, Dt), H == null || H.kill(), R == null || R.kill(), B == null || B.kill(), He(), mt(), D(), document.body && (document.body.style.cursor = ""), (S.value || T.value) && at()
    }), e({
      openPopup: Ct,
      closePopup: Fn
    }), (be, W) => (openBlock(), createBlock(Teleport, {
      to: "body"
    }, [createElementVNode("div", {
      ref_key: "wrapperRef",
      ref: c,
      class: normalizeClass(["videoPlayer", {
        "videoPlayer--open": S.value,
        "videoPlayer--visible": T.value,
        "videoPlayer--uiIdle": oe.value,
        "videoPlayer--transitionLocked": C.value,
        "videoPlayer--safari": unref(t)
      }])
    }, [createElementVNode("div", {
      ref_key: "whiteMaskRef",
      ref: d,
      class: "videoPlayer__whiteMask"
    }, null, 512), createElementVNode("div", {
      ref_key: "letterboxMaskRef",
      ref: f,
      class: "videoPlayer__letterboxMask",
      "aria-hidden": "true"
    }, null, 512), createElementVNode("div", d5, [createElementVNode("div", {
      ref_key: "videoMediaRef",
      ref: g,
      class: "videoPlayer__mediaInner",
      onClick: withModifiers(Tn, ["stop"])
    }, [createElementVNode("video", {
      ref_key: "videoRef",
      ref: m,
      class: "videoPlayer__video",
      playsinline: "",
      src: r.value,
      onTimeupdate: qt,
      onLoadedmetadata: jt,
      onEnded: lt
    }, null, 40, f5), createElementVNode("div", {
      ref_key: "videoContrastOverlayRef",
      ref: p,
      class: "videoPlayer__videoContrast",
      "aria-hidden": "true"
    }, null, 512)], 512)]), createElementVNode("div", p5, [createElementVNode("button", {
      ref_key: "closeButtonRef",
      ref: A,
      class: "videoPlayer__close",
      type: "button",
      onClick: withModifiers(Fn, ["stop"]),
      onMouseenter: _t,
      onMouseleave: ut
    }, [createVNode(CrossIcon, {
      class: "close__icon"
    })], 544)]), withDirectives(createElementVNode("button", {
      ref_key: "compactPlayPauseRef",
      ref: y,
      class: "videoPlayer__compactPlayPause",
      type: "button",
      "aria-label": "Play or pause showreel",
      onClick: withModifiers(Tn, ["stop"])
    }, [createElementVNode("div", A5, [createElementVNode("div", {
      ref_key: "compactPlayPauseIconInnerRef",
      ref: b,
      class: "compactPlayPause__iconInner"
    }, [...W[0] || (W[0] = [createElementVNode("div", {
      class: "compactPlayPause__iconLine"
    }, [createElementVNode("span", {
      class: "compactPlayPause__icon compactPlayPause__icon--pause",
      "aria-hidden": "true"
    }, [createElementVNode("span", {
      class: "compactPlayPause__pauseBar"
    }), createElementVNode("span", {
      class: "compactPlayPause__pauseBar"
    })])], -1), createElementVNode("div", {
      class: "compactPlayPause__iconLine"
    }, [createElementVNode("svg", {
      class: "compactPlayPause__icon compactPlayPause__icon--play",
      viewBox: "0 0 9 11",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true"
    }, [createElementVNode("path", {
      d: "M0 0L9 5.5L0 11V0Z",
      fill: "currentColor"
    })])], -1)])], 512)])], 512), [
      [vShow, T.value]
    ]), createElementVNode("div", {
      ref_key: "progressWrapRef",
      ref: _,
      class: "videoPlayer__progressWrap"
    }, [createVNode(GridWrapper, {
      class: "videoPlayer__progressGrid"
    }, {
      default: withCtx(() => [createElementVNode("div", {
        ref_key: "progressRef",
        ref: v,
        class: "videoPlayer__progress",
        onClick: withModifiers(_e, ["stop"]),
        onMouseenter: ot,
        onMouseleave: pt,
        onPointerdown: withModifiers(nt, ["stop"])
      }, [W[1] || (W[1] = createElementVNode("div", {
        class: "progress__track"
      }, null, -1)), createElementVNode("div", {
        class: "progress__fill",
        style: normalizeStyle({
          transform: `scaleX(${w.value})`
        })
      }, null, 4)], 544)]),
      _: 1
    })], 512)], 2)]))
  }
};

export const VideoPlayer = _export_sfc(VideoPlayerSfc, [
  ["__scopeId", "data-v-3426e408"]
]);
