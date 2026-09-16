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
  computed,
  createBlock,
  createElementBlock,
  createElementVNode,
  createTextVNode,
  createVNode,
  mergeProps,
  normalizeClass,
  onMounted,
  onUnmounted,
  openBlock,
  ref,
  renderList,
  toDisplayString,
  unref,
  withCtx
} from 'vue';
import {
  useRoute
} from 'vue-router';
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
  isTabletWidth,
  isTouch
} from '../utils/device.js';
import {
  getOffset
} from '../utils/dom.js';
import {
  BeeBlock
} from './BeeBlock.js';
import {
  CrossIcon
} from './icons/CrossIcon.js';
import {
  MainButton
} from './MainButton.js';
import {
  WebglBgComponent
} from './WebglBgComponent.js';

const Az = {
  class: "footerBlock__bottom"
};

const gz = {
  class: "bottom__networks"
};

const mz = ["onClick"];

const _z = {
  class: "bottom__copyright"
};

const vz = {
  class: "popup__top"
};

const yz = {
  class: "top__infos"
};

const xz = {
  class: "popup__content"
};

const Ez = {
  class: "content__left"
};

const Sz = {
  class: "left__content"
};

const wz = ["innerHTML"];

const bz = {
  class: "content__right"
};

const Tz = ["innerHTML"];

const Cz = "Copy to clipboard";

const Ud = 1.25;

const bs = .85;

const tS = .5;

const Mz = .4;

const Iz = 700;

const Rz = 2;

const Bz = 8;

const Dz = 1500;

const FooterBlockSfc = {
  __name: "FooterBlock",
  props: {
    theme: {
      type: String,
      default: "white"
    },
    titles: {
      type: Array,
      default: null
    },
    titlesReveal: {
      type: Array,
      default: null
    },
    creditsBtn: {
      type: String,
      default: null
    },
    networks: {
      type: Object,
      default: null
    },
    copyright: {
      type: String,
      default: null
    },
    alignBottom: {
      type: Boolean,
      default: !0
    },
    infos: {
      type: String,
      default: null
    },
    smallTexts: {
      type: Object,
      default: null
    },
    bigTexts: {
      type: Object,
      default: null
    },
    mobileBigTexts: {
      type: Object,
      default: null
    },
    credits: {
      type: Object,
      default: null
    }
  },
  setup(s) {
    const e = isSafari();
    let t = !1;
    CustomEase.create("reveal", "0.4,0,0,1"), CustomEase.create("hide", "0.86, 0, 0.07, 1");
    let n = !1,
      i = !1;
    const r = useRoute(),
      o = String(r.name),
      a = s,
      l = ref(),
      u = ref(),
      h = ref(),
      c = ref(),
      d = ref(),
      f = ref(),
      A = ref(),
      m = ref(),
      g = ref();
    let p = 0;
    const _ = (ie = Dz) => {
        var me, Le;
        p = performance.now() + ie, S = ((me = app.lenis) == null ? void 0 : me.animatedScroll) ?? ((Le = app.lenis) == null ? void 0 : Le.scroll) ?? window.scrollY
      },
      v = () => performance.now() < p,
      y = () => {
        _()
      },
      b = ref();
    let S = 0,
      T = 0;
    const C = () => [...f.value || [], ...A.value || []],
      x = () => {
        gsap.set(C(), {
          clearProps: "transform,y",
          opacity: 0
        })
      },
      w = computed(() => `© ${new Date().getFullYear()}`),
      R = () => window.innerWidth <= Iz,
      B = () => ({
        variant: "clipboard",
        clipboardTheme: a.theme === "yellow" ? "white" : "default"
      }),
      N = () => {
        t = !1, emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, Cz, !0, B())
      },
      k = () => {
        t = !1, emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, null, !1)
      },
      O = () => {
        const ie = document.querySelector(".footerBlock .networks__link--email");
        ie != null && ie.matches(":hover") && N()
      },
      Y = async ie => {
        if (isTouch()) {
          window.location.href = `mailto:${ie}`;
          return
        }
        if (!t) try {
          await navigator.clipboard.writeText(ie), t = !0, emitter.emit(EVENTS.CURSOR_INDICATION_CLIPBOARD_COPIED)
        } catch {}
      }, G = ie => {
        var me, Le;
        T = ((Le = (me = ie.touches) == null ? void 0 : me[0]) == null ? void 0 : Le.clientY) ?? 0
      }, z = ie => {
        var Le, oe;
        if (!n || !isTabletWidth()) return;
        const me = ((oe = (Le = ie.touches) == null ? void 0 : Le[0]) == null ? void 0 : oe.clientY) ?? T;
        T - me > Bz && ae({
          force: !0
        })
      }, Q = () => {
        var me;
        if (n || i) return;
        (me = b.value) == null || me.kill();
        const ie = gsap.timeline();
        ie.to(l.value, {
          transform: "translate(-85%, 85%)",
          duration: bs,
          ease: "reveal"
        }, 0), ie.to(u.value, {
          transform: "translate(85%, -85%)",
          duration: bs,
          ease: "reveal"
        }, 0), ie.to(c.value, {
          color: "#000000",
          duration: bs,
          ease: "reveal"
        }, 0), x(), b.value = ie
      }, M = () => {
        var me;
        if (n || i) return;
        (me = b.value) == null || me.kill();
        const ie = gsap.timeline();
        ie.to(l.value, {
          transform: "translate(-100%, 100%)",
          duration: bs,
          ease: "reveal"
        }, 0), ie.to(u.value, {
          transform: "translate(100%, -100%)",
          duration: bs,
          ease: "reveal"
        }, 0), ie.to(c.value, {
          color: a.theme === "green" ? "#eed6c8" : "#000000",
          duration: bs,
          ease: "reveal"
        }, 0), b.value = ie
      }, ne = () => {
        var me;
        if (n || i) return;
        n = !0;
        const ie = gsap.timeline();
        (me = b.value) == null || me.kill(), b.value = ie, ie.set(h.value, {
          pointerEvents: "auto"
        }, 0), ie.set(g.value, {
          pointerEvents: "auto"
        }, 0), ie.set(d.value, {
          cursor: "default",
          pointerEvents: "none"
        }, 0), R() ? ie.to(c.value, {
          opacity: 0,
          duration: .2,
          ease: "power2.out"
        }, 0) : (ie.to(c.value, {
          opacity: 0,
          duration: .2,
          ease: "power2.out"
        }, 0), ie.to(c.value, {
          y: "50%",
          duration: Ud * .5,
          ease: "expo.out"
        }, 0)), ie.to(l.value, {
          transform: "translate(0%, 0%)",
          duration: Ud,
          ease: "expo.out"
        }, 0), ie.fromTo(u.value, {
          transform: "translate(85%, -85%)"
        }, {
          transform: "translate(0%, 0%)",
          duration: Ud,
          ease: "expo.out"
        }, 0), ie.to(g.value, {
          opacity: .3,
          duration: Ud,
          ease: "sine.out"
        }, 0), x(), ie.to(C(), {
          opacity: 1,
          duration: tS,
          ease: "power1.inOut"
        }, Mz), ie.fromTo(m.value, {
          scale: "0"
        }, {
          scale: "1",
          duration: .75,
          ease: "reveal"
        }, .5)
      }, V = ie => {
        var Le;
        const me = (ie == null ? void 0 : ie.animatedScroll) ?? ((Le = app.lenis) == null ? void 0 : Le.scroll) ?? window.scrollY;
        if (!n) {
          S = me;
          return
        }
        if (v()) {
          S = me;
          return
        }
        if (me < S - Rz) {
          ae();
          return
        }
        S = me
      }, ae = ({
        force: ie = !1
      } = {}) => {
        var Le, oe, E;
        if (!n) return;
        if (!ie && v()) {
          S = ((Le = app.lenis) == null ? void 0 : Le.animatedScroll) ?? ((oe = app.lenis) == null ? void 0 : oe.scroll) ?? window.scrollY;
          return
        }
        n = !1, i = !0;
        const me = gsap.timeline({
          onComplete: () => {
            n || ge()
          }
        });
        (E = b.value) == null || E.kill(), b.value = me, me.set(h.value, {
          pointerEvents: "none"
        }, 0), me.to(g.value, {
          opacity: 0,
          duration: bs * .5,
          ease: "power1.inOut"
        }, 0), me.set(g.value, {
          pointerEvents: "none"
        }, 0), me.set(d.value, {
          cursor: "default",
          pointerEvents: "none"
        }, 0), me.to(C(), {
          opacity: 0,
          duration: tS,
          ease: "power1.in"
        }, 0), me.to(l.value, {
          transform: "translate(-100%, 100%)",
          duration: bs,
          ease: "hide"
        }, 0), me.to(u.value, {
          transform: "translate(100%, -100%)",
          duration: bs,
          ease: "hide"
        }, 0), R() ? me.fromTo(c.value, {
          opacity: 0
        }, {
          opacity: 1,
          duration: bs,
          ease: "hide"
        }, .15) : (me.fromTo(c.value, {
          opacity: 0
        }, {
          opacity: 1,
          duration: bs * .85,
          ease: "sine.inOut"
        }, .5), me.set(c.value, {
          y: "0%"
        }, 0)), me.to(c.value, {
          color: a.theme === "green" ? "#eed6c8" : "#000000",
          duration: bs,
          ease: "hide"
        }, .15), me.to(m.value, {
          scale: "0",
          duration: .6,
          ease: "hide"
        }, 0)
      }, ge = () => {
        var ie;
        (ie = b.value) == null || ie.kill(), b.value = null, i = !1, gsap.set(h.value, {
          pointerEvents: "none"
        }), gsap.set(g.value, {
          pointerEvents: "none",
          opacity: 0
        }), gsap.set(d.value, {
          cursor: "pointer",
          pointerEvents: "auto"
        }), gsap.set(l.value, {
          clearProps: "transform,translate,x,y,xPercent,yPercent,scale"
        }), gsap.set(u.value, {
          clearProps: "transform,translate,x,y,xPercent,yPercent,scale"
        }), gsap.set(c.value, {
          clearProps: "transform,translate,x,y,xPercent,yPercent,opacity,color"
        }), gsap.set(m.value, {
          clearProps: "transform,scale"
        }), x()
      }, q = () => {
        gsap.set(h.value, {
          pointerEvents: "auto"
        }), gsap.set(g.value, {
          pointerEvents: "auto",
          opacity: .3
        }), gsap.set(d.value, {
          cursor: "default",
          pointerEvents: "none"
        }), gsap.set(l.value, {
          x: 0,
          y: 0,
          xPercent: 0,
          yPercent: 0,
          transform: "translate(0%, 0%)"
        }), gsap.set(u.value, {
          x: 0,
          y: 0,
          xPercent: 0,
          yPercent: 0,
          transform: "translate(0%, 0%)"
        }), gsap.set(C(), {
          opacity: 1,
          clearProps: "transform,y"
        }), gsap.set(m.value, {
          scale: 1
        }), gsap.set(c.value, {
          opacity: 0,
          ...R() ? {
            clearProps: "y"
          } : {
            y: "50%"
          }
        })
      }, de = () => {
        var E, L, X, $;
        const ie = ((E = h.value) == null ? void 0 : E.closest(".webglBg")) ?? ((L = h.value) == null ? void 0 : L.closest(".footerBlock"));
        if (!ie) return !0;
        const me = getOffset(ie),
          Le = ((X = app.lenis) == null ? void 0 : X.animatedScroll) ?? (($ = app.lenis) == null ? void 0 : $.scroll) ?? window.scrollY,
          oe = me.top - window.innerHeight;
        return Le >= oe
      }, he = () => {
        var ie;
        if (_(), !n) {
          ge();
          return
        }
        if (!de()) {
          ae({
            force: !0
          });
          return
        }(ie = b.value) == null || ie.kill(), b.value = null, q()
      };
    return onMounted(() => {
      var ie, me;
      S = ((ie = app.lenis) == null ? void 0 : ie.scroll) ?? window.scrollY, (me = app.lenis) == null || me.on("scroll", V), window.addEventListener("resize", y, {
        capture: !0
      }), emitter.on(EVENTS.SHOWREEL_CURSOR_RESTORE, O), emitter.on(EVENTS.RESIZE, he), emitter.on(EVENTS.LAYOUT_REFRESH, he)
    }), onUnmounted(() => {
      var ie;
      (ie = app.lenis) == null || ie.off("scroll", V), window.removeEventListener("resize", y, {
        capture: !0
      }), emitter.off(EVENTS.SHOWREEL_CURSOR_RESTORE, O), emitter.off(EVENTS.RESIZE, he), emitter.off(EVENTS.LAYOUT_REFRESH, he)
    }), (ie, me) => (openBlock(), createBlock(WebglBgComponent, {
      "is-grid-wrapper": !1,
      index: 9,
      "current-page": unref(o),
      "is-footer": !0,
      class: normalizeClass(["footerBlock", s.theme])
    }, {
      default: withCtx(() => [createVNode(BeeBlock, mergeProps({
        class: "footerBlock__webglBee"
      }, a, {
        "is-footer": !0
      }), null, 16), createElementVNode("div", Az, [createElementVNode("button", {
        ref_key: "creditsWrapperRef",
        ref: d,
        class: "bottom__credits",
        onMouseenter: Q,
        onMouseleave: M,
        onClick: ne
      }, [createElementVNode("div", {
        ref_key: "creditsButtonRef",
        ref: c,
        class: "credits__button"
      }, toDisplayString(s.creditsBtn), 513)], 544), createElementVNode("div", gz, [(openBlock(!0), createElementBlock(Fragment, null, renderList(s.networks, Le => (openBlock(), createElementBlock(Fragment, {
        key: Le.name
      }, [Le.url ? (openBlock(), createBlock(MainButton, {
        key: 0,
        class: normalizeClass(["networks__link", s.theme]),
        text: Le.name,
        url: Le.url
      }, null, 8, ["class", "text", "url"])) : (openBlock(), createElementBlock("p", {
        key: 1,
        class: normalizeClass(["networks__link networks__link--email", s.theme]),
        "data-cursor-indication-preserve": "",
        onMouseenter: N,
        onMouseleave: k,
        onClick: oe => Y(Le.name)
      }, [me[2] || (me[2] = createElementVNode("span", {
        class: "networks__emailHit",
        "aria-hidden": "true"
      }, null, -1)), createTextVNode(" " + toDisplayString(Le.name), 1)], 42, mz))], 64))), 128))]), createElementVNode("p", _z, toDisplayString(w.value), 1)]), createElementVNode("div", {
        ref_key: "popupWrapperRef",
        ref: h,
        class: normalizeClass(["footerBlock__popup", s.theme])
      }, [createElementVNode("div", {
        ref_key: "transitionWrapperOuterRef",
        ref: l,
        class: "popup__transitionWrapper--outer"
      }, [createElementVNode("div", {
        ref_key: "transitionWrapperInnerRef",
        ref: u,
        class: "popup__transitionWrapper--inner"
      }, [createElementVNode("div", vz, [me[3] || (me[3] = createElementVNode("p", {
        class: "top__star"
      }, "*", -1)), createElementVNode("p", yz, toDisplayString(s.infos), 1), createElementVNode("div", {
        ref_key: "creditsCloseButtonRef",
        ref: m,
        class: normalizeClass(["top__cross", [s.theme, {
          "top__cross--safari": unref(e)
        }]]),
        onClick: me[0] || (me[0] = Le => ae({
          force: !0
        }))
      }, [createVNode(CrossIcon, {
        class: "cross__icon"
      })], 2)]), createElementVNode("div", xz, [createElementVNode("div", Ez, [createElementVNode("div", Sz, [(openBlock(!0), createElementBlock(Fragment, null, renderList(s.smallTexts, (Le, oe) => (openBlock(), createElementBlock("div", {
        key: oe,
        ref_for: !0,
        ref_key: "popupTextBlocksLeftRef",
        ref: f,
        class: "content__textWrapper"
      }, [(openBlock(!0), createElementBlock(Fragment, null, renderList(Le, (E, L) => (openBlock(), createElementBlock("p", {
        key: L,
        class: "wrapper__text",
        innerHTML: E
      }, null, 8, wz))), 128))]))), 128))])]), createElementVNode("div", bz, [(openBlock(!0), createElementBlock(Fragment, null, renderList(s.bigTexts, (Le, oe) => (openBlock(), createElementBlock("div", {
        key: oe,
        ref_for: !0,
        ref_key: "popupTextBlocksRightRef",
        ref: A,
        class: "right__textBlock"
      }, [createElementVNode("p", {
        class: "right__text",
        innerHTML: Le
      }, null, 8, Tz)]))), 128))])])], 512)], 512)], 2), createElementVNode("div", {
        ref_key: "popupOverlayRef",
        ref: g,
        class: "footerBlock__overlay",
        onClick: me[1] || (me[1] = Le => ae({
          force: !0
        })),
        onTouchstartPassive: G,
        onTouchmovePassive: z
      }, null, 544)]),
      _: 1
    }, 8, ["current-page", "class"]))
  }
};

export const FooterBlock = _export_sfc(FooterBlockSfc, [
  ["__scopeId", "data-v-063391ad"]
]);
