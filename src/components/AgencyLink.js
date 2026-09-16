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
  createElementBlock,
  nextTick,
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

const DV = ["href"];

const sS = .4;

const LV = 1;

const PV = .05;

const Ng = .15;

const OV = .3;

const FV = .4;

const NV = .3;

const kV = 1025;

const AgencyLinkSfc = {
  __name: "AgencyLink",
  props: {
    name: {
      type: String,
      required: !0
    },
    url: {
      type: String,
      required: !0
    }
  },
  setup(s) {
    const e = {
        type: "chars",
        charsClass: "agency-char",
        autoSplit: !1
      },
      t = s,
      n = ref();
    let i = null,
      r = null,
      o = null,
      a = [];
    const l = {
      value: 0
    };
    let u = null,
      h = !1,
      c = null;
    const d = () => {
        var M;
        return ((M = app.webgl) == null ? void 0 : M._webglSectionRevealLocked) ?? !1
      },
      f = () => window.innerWidth >= kV,
      A = () => t.name.replace(/\s/g, "").length,
      m = M => M.filter(ne => {
        var V;
        return (V = ne.textContent) == null ? void 0 : V.length
      }).length,
      g = M => {
        const ne = A(),
          V = Math.max(3, Math.floor(ne * .6));
        return m(M) >= V
      },
      p = () => {
        var M, ne;
        return (M = i == null ? void 0 : i.chars) != null && M.length ? i.chars : [...((ne = n.value) == null ? void 0 : ne.querySelectorAll(".agency-char")) ?? []]
      },
      _ = () => {
        n.value && (n.value.replaceChildren(), n.value.textContent = t.name)
      },
      v = M => sS + (LV - sS) * M * l.value,
      y = M => {
        M.forEach((ne, V) => {
          var ge;
          const ae = ((ge = a[V]) == null ? void 0 : ge.value) ?? 0;
          ne.style.opacity = String(v(ae))
        })
      },
      b = M => {
        a = M.map(() => ({
          value: 0
        })), l.value = 0
      },
      S = ({
        force: M = !1
      } = {}) => {
        if (!(d() && !M)) {
          if (o == null || o.kill(), o = null, gsap.killTweensOf(l), r == null || r.kill(), r = null, a = [], l.value = 0, h) {
            _(), h = !1, i = null;
            return
          }
          i == null || i.revert(), i = null
        }
      },
      T = M => {
        const ne = M.textContent ?? "",
          V = [];
        M.replaceChildren();
        for (const ae of ne) {
          const ge = document.createElement("span");
          ge.className = "agency-char", ge.textContent = ae, ge.style.display = "inline-block", M.appendChild(ge), V.push(ge)
        }
        return V
      },
      C = M => {
        b(M), gsap.set(M, {
          display: "inline-block"
        }), y(M)
      },
      x = () => {
        const M = p();
        M.length && (o == null || o.kill(), gsap.killTweensOf(l), o = gsap.to(l, {
          value: 0,
          duration: NV,
          ease: "power2.out",
          onUpdate: () => y(M),
          onComplete: () => {
            o = null, r == null || r.kill(), r = null, a.forEach(ne => {
              ne.value = 0
            }), C(M)
          }
        }))
      },
      w = () => {
        const M = p();
        if (!M.length || d() || (o == null || o.kill(), o = null, gsap.killTweensOf(l), a.length !== M.length && b(M), l.value < 1 ? gsap.to(l, {
            value: 1,
            duration: Ng,
            ease: "power2.out",
            onUpdate: () => y(M)
          }) : l.value = 1, r)) return;
        const ne = gsap.timeline({
          repeat: -1,
          repeatDelay: FV,
          onUpdate: () => y(M)
        });
        M.forEach((V, ae) => {
          const ge = a[ae],
            q = ae * PV;
          ne.to(ge, {
            value: 1,
            duration: Ng,
            ease: "sine.inOut"
          }, q), ne.to(ge, {
            value: 0,
            duration: OV,
            ease: "sine.inOut"
          }, q + Ng)
        }), r = ne, y(M)
      },
      R = () => {
        f() && w()
      },
      B = () => {
        f() && x()
      },
      N = async ({
        retry: M = 0
      } = {}) => {
        var ge, q;
        if (d() || ((ge = document.fonts) != null && ge.ready && await document.fonts.ready, await nextTick(), !n.value)) return;
        const ne = ((q = n.value.textContent) == null ? void 0 : q.replace(/\s/g, "")) ?? "",
          V = A();
        if (!ne.length || V > 0 && ne.length < V * .5) {
          M < 6 && (clearTimeout(u), u = setTimeout(() => {
            N({
              retry: M + 1
            })
          }, 80));
          return
        }
        S(), i = SplitText.create(n.value, e);
        let ae = i.chars;
        if (g(ae)) h = !1;
        else {
          if (S(), M < 6) {
            clearTimeout(u), u = setTimeout(() => {
              N({
                retry: M + 1
              })
            }, 120);
            return
          }
          _(), h = !0, ae = T(n.value)
        }
        C(ae)
      }, k = () => {
        clearTimeout(u), u = setTimeout(() => {
          N()
        }, 80)
      }, O = () => {
        !document.fonts || c || (c = () => {
          if (d()) return;
          const M = p();
          g(M) || k()
        }, document.fonts.addEventListener("loadingdone", c))
      }, Y = () => {
        !document.fonts || !c || (document.fonts.removeEventListener("loadingdone", c), c = null)
      }, G = () => {
        d() || k()
      }, z = () => {
        k()
      }, Q = () => {
        k()
      };
    return onMounted(() => {
      O(), k(), app.isLoaderRevealComplete || emitter.on(EVENTS.LOADER_REVEAL_COMPLETE, Q), emitter.on(EVENTS.RESIZE, G), emitter.on(EVENTS.WEBGL_SECTION_REVEAL_RESET, z)
    }), onUnmounted(() => {
      emitter.off(EVENTS.LOADER_REVEAL_COMPLETE, Q), emitter.off(EVENTS.RESIZE, G), emitter.off(EVENTS.WEBGL_SECTION_REVEAL_RESET, z), Y(), clearTimeout(u), u = null, r == null || r.kill(), o == null || o.kill(), d() ? i = null : S({
        force: !0
      })
    }), (M, ne) => (openBlock(), createElementBlock("a", {
      ref_key: "linkRef",
      ref: n,
      class: "agencyLink",
      href: s.url,
      target: "_blank",
      rel: "noopener noreferrer",
      onMouseenter: R,
      onMouseleave: B
    }, toDisplayString(s.name), 41, DV))
  }
};

export const AgencyLink = _export_sfc(AgencyLinkSfc, [
  ["__scopeId", "data-v-7544a4c6"]
]);
