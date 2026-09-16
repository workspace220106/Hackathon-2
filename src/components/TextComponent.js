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
  SplitText
} from 'gsap/SplitText';
import {
  createBlock,
  createElementBlock,
  onMounted,
  onUnmounted,
  openBlock,
  ref,
  resolveDynamicComponent
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
  GSAP_DEFAULTS,
  setWillChange,
  willChangeDuringTween
} from '../utils/will-change.js';

const TextComponentSfc = {
  __name: "TextComponent",
  props: {
    parallaxPositionAmount: {
      type: Number,
      default: 20
    },
    content: {
      type: String,
      default: null
    },
    stagger: {
      type: Number,
      default: .1
    },
    revealDelay: {
      type: Number,
      default: 0
    },
    revealOnScroll: {
      type: Boolean,
      default: !0
    },
    onlyOneLine: {
      type: Boolean,
      default: !1
    },
    duration: {
      type: Number,
      default: 1.125
    },
    hideDuration: {
      type: Number,
      default: .75
    },
    isFromToReveal: {
      type: Boolean,
      default: !0
    },
    tag: {
      type: String,
      default: "p"
    }
  },
  setup(s, {
    expose: e
  }) {
    CustomEase.create("reveal", ".4,0,0,1");
    const t = s;
    let n = !1,
      i, r = null,
      o = !1;
    const a = ref(),
      l = ref(),
      u = ref(),
      h = () => r ? [...r.lines ?? [], ...r.masks ?? []] : l.value ? [l.value] : [],
      c = ({
        revert: S = !1
      } = {}) => {
        if (!r) return;
        const T = [...r.lines ?? [], ...r.masks ?? []];
        gsap.killTweensOf(T), S ? r.revert() : gsap.set(T, {
          clearProps: "all"
        }), r = null
      },
      d = () => setWillChange(h(), !1),
      f = () => {
        i == null || i.kill(), i = null, d(), c({
          revert: !0
        })
      },
      A = S => {
        const T = S.getBoundingClientRect();
        u.value = new DOMRect(T.x, T.y + window.scrollY, T.width, T.height)
      },
      m = () => {
        l.value && t.content && (l.value.innerHTML = t.content)
      };
    onMounted(() => {
      l.value && (t.isFromToReveal ? t.revealOnScroll || (gsap.set(l.value, {
        opacity: 1,
        clearProps: "transform"
      }), gsap.set(l.value, {
        yPercent: 110,
        ...GSAP_DEFAULTS
      })) : gsap.set(l.value, {
        yPercent: 110,
        ...GSAP_DEFAULTS
      }), m(), A(a.value))
    });
    const g = S => {
        if (t.revealOnScroll) return;
        const T = S.eventCallback("onComplete");
        S.eventCallback("onComplete", () => {
          T == null || T(), o = !0
        })
      },
      p = (S = {}) => {
        var R, B;
        const {
          reuseSplit: T = !1
        } = S, C = l.value;
        if (!C) return gsap.timeline();
        i == null || i.kill(), d(), o = !1;
        const x = {
          yPercent: 0,
          duration: t.duration,
          ease: "reveal",
          stagger: t.stagger,
          ...GSAP_DEFAULTS
        };
        if (T && ((R = r == null ? void 0 : r.lines) != null && R.length)) {
          if (o) return gsap.set(C, {
            opacity: 1,
            clearProps: "transform"
          }), gsap.set(r.lines, {
            yPercent: 0,
            ...GSAP_DEFAULTS
          }), gsap.timeline();
          const N = gsap.timeline();
          return willChangeDuringTween(N, h), N.fromTo(r.lines, {
            yPercent: 110
          }, x, t.revealDelay), g(N), i = N, N
        }
        r && c({
          revert: !0
        });
        const w = gsap.timeline();
        return willChangeDuringTween(w, h), t.onlyOneLine ? w.fromTo(C, {
          yPercent: 110
        }, {
          yPercent: 0,
          duration: t.duration,
          ease: "reveal",
          ...GSAP_DEFAULTS
        }, t.revealDelay) : (gsap.set(C, {
          opacity: 0,
          yPercent: 0,
          clearProps: "transform"
        }), r = SplitText.create(C, {
          type: "lines",
          linesClass: "line",
          autoSplit: !0,
          mask: "lines",
          onSplit: N => {
            if (!l.value || !r) return;
            const k = N.lines;
            if (gsap.set(l.value, {
                opacity: 1
              }), o) {
              gsap.set(k, {
                yPercent: 0,
                ...GSAP_DEFAULTS
              });
              return
            }
            gsap.set(k, {
              yPercent: 110,
              ...GSAP_DEFAULTS
            }), t.isFromToReveal ? w.fromTo(k, {
              yPercent: 110
            }, x, t.revealDelay) : w.to(k, x, t.revealDelay)
          }
        }), (B = r.lines) != null && B.length && !w.getChildren().length && (gsap.set(C, {
          opacity: 1
        }), gsap.set(r.lines, {
          yPercent: 110,
          ...GSAP_DEFAULTS
        }), t.isFromToReveal ? w.fromTo(r.lines, {
          yPercent: 110
        }, x, t.revealDelay) : w.to(r.lines, x, t.revealDelay))), i = w, g(w), w
      },
      _ = () => {
        var S;
        return i == null || i.kill(), d(), (S = r == null ? void 0 : r.lines) != null && S.length ? gsap.set(r.lines, {
          yPercent: 110,
          ...GSAP_DEFAULTS
        }) : l.value && (gsap.set(l.value, {
          opacity: 1,
          clearProps: "transform"
        }), gsap.set(l.value, {
          yPercent: 110,
          ...GSAP_DEFAULTS
        })), i = gsap.timeline(), i
      },
      v = () => {
        var S;
        if (!(t.revealOnScroll || !o)) {
          if ((S = r == null ? void 0 : r.lines) != null && S.length) {
            l.value && gsap.set(l.value, {
              opacity: 1,
              clearProps: "transform"
            }), gsap.set(r.lines, {
              yPercent: 0,
              ...GSAP_DEFAULTS
            });
            return
          }
          l.value && gsap.set(l.value, {
            yPercent: 0,
            opacity: 1,
            clearProps: "transform"
          })
        }
      },
      y = S => {
        if (a.value && (A(a.value), v(), !isTabletDevice() && t.revealOnScroll && (r && c({
            revert: !0
          }), l.value && u.value && app.lenis))) {
          const T = u.value.top - window.innerHeight,
            C = u.value.top + u.value.height,
            x = Number(mapRangeClamped(app.lenis.animatedScroll, [T, C], [0, 1]).toFixed(5)),
            w = n;
          n = !1, w && x > 0 && (p(), n = !0)
        }
      },
      b = S => {
        if (l.value && u.value) {
          const T = u.value.top - window.innerHeight,
            C = u.value.top + u.value.height,
            x = Number(mapRangeClamped(S.animatedScroll, [T, C], [0, 1]).toFixed(5));
          x > 0 && !n && (p(), n = !0), x <= 0 && (n = !1)
        }
      };
    return emitter.on(EVENTS.RESIZE, y), t.revealOnScroll && app.lenis.on("scroll", b), onUnmounted(() => {
      emitter.off(EVENTS.RESIZE, y), t.revealOnScroll && app.lenis.off("scroll", b), f()
    }), e({
      textRevealTL: p,
      textHideTL: _
    }), (S, T) => (openBlock(), createElementBlock("div", {
      ref_key: "textComponentRef",
      ref: a,
      class: "textComponent"
    }, [(openBlock(), createBlock(resolveDynamicComponent(s.tag), {
      ref_key: "textRef",
      ref: l,
      class: "textComponent__content"
    }, null, 512))], 512))
  }
};

export const TextComponent = _export_sfc(TextComponentSfc, [
  ["__scopeId", "data-v-0a0537df"]
]);
