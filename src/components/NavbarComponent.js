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
  Teleport,
  computed,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createElementVNode,
  createVNode,
  normalizeClass,
  onMounted,
  onUnmounted,
  openBlock,
  ref,
  renderList,
  toDisplayString,
  watch,
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
  router
} from '../router/index.js';
import {
  NAV_ROUTES
} from '../data/global.js';
import {
  GridWrapper
} from './GridWrapper.js';
import {
  MainButton
} from './MainButton.js';
import {
  MenuButton
} from './MenuButton.js';
import {
  NavLabButton
} from './NavLabButton.js';
import {
  SoundButton
} from './SoundButton.js';
import {
  TextComponent
} from './TextComponent.js';

const LW = {
  class: "left__title"
};

const PW = {
  class: "left__infos"
};

const OW = {
  class: "right__links"
};

const FW = {
  class: "right__buttons"
};

const NW = {
  class: "menu__links"
};

const kW = .3;

const UW = 1;

const GW = .325;

const HW = ".left__title, .links__link, .links__lab, .soundButton";

const NavbarSfc = {
  __name: "NavbarComponent",
  props: {
    title: {
      type: String,
      default: null
    },
    infos: {
      type: String,
      default: null
    },
    links: {
      type: Object,
      default: null
    },
    lab: {
      type: Object,
      default: null
    },
    contact: {
      type: String,
      default: null
    }
  },
  setup(s) {
    CustomEase.create("reveal", "0.4,0,0,1"), CustomEase.create("hide", "0.86, 0, 0.07, 1");
    const e = ref(!1),
      t = ref(),
      n = ref(),
      i = ref(),
      r = ref(),
      o = ref(),
      a = ref(),
      l = ref(),
      u = ref(!1);
    let h = 0,
      c;
    const d = ref(!1),
      f = ref(!1),
      A = ref(),
      m = s,
      g = Q => {
        // "Work" is the site title (always goes home, even when it is not in the navbar links)
        const target = NAV_ROUTES[Q] ?? (Q === "Work" ? { path: "/", name: "home" } : null);
        target && (A.value = target.name, router.push(target.path))
      },
      p = Q => {
        const M = x.name,
          ne = x.path;
        const target = NAV_ROUTES[Q];
        return !!target && (M === target.name || ne === target.path)
      },
      _ = () => {
        window.location.href = `mailto:${m.contact}`
      },
      v = () => {
        var Q;
        (Q = m.lab) != null && Q.url && window.open(m.lab.url, "_blank", "noopener,noreferrer"), O()
      },
      y = Q => {
        var M;
        return (M = Q == null ? void 0 : Q.closest) == null ? void 0 : M.call(Q, HW)
      };
    let b = 0;
    const S = Q => {
        y(Q.target) && (b += 1, b === 1 && emitter.emit(EVENTS.CURSOR_SOUND_INDICATION_SUPPRESS, !0))
      },
      T = Q => {
        y(Q.target) && (y(Q.relatedTarget) || (b = Math.max(0, b - 1)))
      },
      C = ref(),
      x = useRoute(),
      w = computed(() => x.name === "home" || x.name === "about" ? x.name : null),
      R = Q => {
        var ne, V;
        if (!e.value) {
          h = (Q == null ? void 0 : Q.animatedScroll) ?? ((ne = app.lenis) == null ? void 0 : ne.scroll) ?? window.scrollY;
          return
        }
        const M = (Q == null ? void 0 : Q.animatedScroll) ?? ((V = app.lenis) == null ? void 0 : V.scroll) ?? window.scrollY;
        if (Math.abs(M - h) >= UW) {
          O();
          return
        }
        h = M
      },
      B = () => {
        var M, ne, V, ae, ge, q;
        (M = i.value) == null || M.forEach(de => {
          var he;
          return (he = de == null ? void 0 : de.textHideTL) == null ? void 0 : he.call(de)
        }), (V = (ne = a.value) == null ? void 0 : ne.textHideTL) == null || V.call(ne);
        const Q = Array.isArray(r.value) ? r.value[0] : r.value;
        (ae = Q == null ? void 0 : Q.textHideTL) == null || ae.call(Q), (q = (ge = o.value) == null ? void 0 : ge.textHideTL) == null || q.call(ge)
      },
      N = () => {
        var M, ne, V;
        e.value = !e.value, (M = C.value) == null || M.kill(), e.value && B();
        const Q = gsap.timeline();
        if (l.value && (e.value ? (h = ((ne = app.lenis) == null ? void 0 : ne.scroll) ?? window.scrollY, Q.set(l.value, {
            pointerEvents: "auto"
          }, 0), Q.to(l.value, {
            opacity: kW,
            duration: .75,
            ease: "sine.out"
          }, 0)) : (Q.to(l.value, {
            opacity: 0,
            duration: .5,
            ease: "power1.inOut"
          }, 0), Q.set(l.value, {
            pointerEvents: "none"
          }, .5))), Q.to(t.value.$el, {
            transform: e.value ? "translateY(0%)" : "translateY(-100%)",
            duration: (e.value, .65),
            ease: e.value ? "reveal" : "power3.out"
          }, 0), Q.add((V = n.value) == null ? void 0 : V.animateCross(e.value), 0), i.value.forEach((ae, ge) => {
            e.value && Q.add(ae.textRevealTL(), .075 * ge + .25)
          }), r.value) {
          const ae = Array.isArray(r.value) ? r.value[0] : r.value;
          e.value && Q.add(ae.textRevealTL(), .075 * i.value.length + .25)
        }
        if (o.value && e.value) {
          const ae = i.value.length + (r.value ? 1 : 0);
          Q.add(o.value.textRevealTL(), .075 * (ae + 1) + .25)
        }
        e.value ? Q.add(a.value.textRevealTL(), .25) : Q.call(B, null, .65), C.value = Q
      },
      k = () => {
        c && (clearTimeout(c), c = null)
      },
      O = () => {
        k(), e.value && N()
      },
      Y = () => {
        e.value && (k(), c = setTimeout(() => {
          c = null, O()
        }, GW * 1e3))
      },
      G = Q => {
        const M = !!(w.value && Q);
        d.value !== M && (d.value = M)
      };
    watch(() => x.path, () => {
      Y(), G(!1), z(!1), x.name === "playground" && (app.toggleColorUI = !1, app.forceWhiteNavbarUI = !1)
    }), emitter.on(EVENTS.NAVBAR_DARK_MODE, G);
    const z = Q => {
      const M = !!(w.value === "about" && Q);
      f.value !== M && (f.value = M)
    };
    return emitter.on(EVENTS.NAVBAR_FORCE_WHITE, z), emitter.on(EVENTS.APP_LOADED, () => {
      u.value = !0
    }), onMounted(() => {
      var Q, M;
      h = ((Q = app.lenis) == null ? void 0 : Q.scroll) ?? window.scrollY, (M = app.lenis) == null || M.on("scroll", R)
    }), onUnmounted(() => {
      var Q;
      k(), (Q = app.lenis) == null || Q.off("scroll", R), emitter.off(EVENTS.NAVBAR_DARK_MODE, G), emitter.off(EVENTS.NAVBAR_FORCE_WHITE, z)
    }), (Q, M) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(["navbarBlock", [w.value, {
        visible: u.value,
        toggleColor: d.value,
        forceWhite: f.value
      }]]),
      onMouseover: S,
      onMouseout: T
    }, [createVNode(GridWrapper, {
      class: "navbarBlock__left"
    }, {
      default: withCtx(() => [createElementVNode("h1", LW, [createVNode(MainButton, {
        text: s.title,
        "is-external": !1,
        onClick: M[0] || (M[0] = ne => g("Work"))
      }, null, 8, ["text"])]), createElementVNode("h3", PW, toDisplayString(s.infos), 1)]),
      _: 1
    }), createVNode(GridWrapper, {
      class: "navbarBlock__right"
    }, {
      default: withCtx(() => [createElementVNode("div", OW, [(openBlock(!0), createElementBlock(Fragment, null, renderList(s.links, (ne, V) => (openBlock(), createBlock(MainButton, {
        key: V,
        class: "links__link",
        text: ne,
        "is-external": !1,
        onClick: ae => g(ne)
      }, null, 8, ["text", "onClick"]))), 128)), s.lab ? (openBlock(), createBlock(NavLabButton, {
        key: 0,
        class: "links__lab",
        text: s.lab.text,
        url: s.lab.url
      }, null, 8, ["text", "url"])) : createCommentVNode("", !0), createVNode(SoundButton)]), createElementVNode("div", FW, [createVNode(SoundButton), createVNode(MenuButton, {
        ref_key: "menuButtonRef",
        ref: n,
        onClick: N
      }, null, 512)])]),
      _: 1
    }), createVNode(GridWrapper, {
      ref_key: "menuBlockRef",
      ref: t,
      class: "navbarBlock__menu"
    }, {
      default: withCtx(() => [createVNode(TextComponent, {
        ref_key: "menuInfosRef",
        ref: a,
        class: "menu__infos",
        content: s.infos,
        duration: .75,
        "hide-duration": .75,
        "reveal-on-scroll": !1
      }, null, 8, ["content"]), createElementVNode("div", NW, [(openBlock(!0), createElementBlock(Fragment, null, renderList(s.links, (ne, V) => (openBlock(), createElementBlock(Fragment, {
        key: ne
      }, [createVNode(TextComponent, {
        ref_for: !0,
        ref_key: "menuLinksRef",
        ref: i,
        class: normalizeClass(["links__link", {
          "links__link--current": p(ne)
        }]),
        content: ne,
        duration: .75,
        "hide-duration": .75,
        "reveal-on-scroll": !1,
        "only-one-line": !0,
        "is-from-to-reveal": !1,
        tag: "button",
        onClick: ae => g(ne)
      }, null, 8, ["class", "content", "onClick"]), ne === "Playground" && s.lab ? (openBlock(), createBlock(TextComponent, {
        key: 0,
        ref_for: !0,
        ref_key: "menuLabRef",
        ref: r,
        class: "links__lab",
        content: s.lab.text,
        duration: .75,
        "hide-duration": .75,
        "reveal-on-scroll": !1,
        "only-one-line": !0,
        "is-from-to-reveal": !1,
        tag: "button",
        onClick: v
      }, null, 8, ["content"])) : createCommentVNode("", !0)], 64))), 128)), createVNode(TextComponent, {
        ref_key: "menuContactRef",
        ref: o,
        class: "links__contact",
        content: s.contact,
        duration: .75,
        "hide-duration": .75,
        "reveal-on-scroll": !1,
        "only-one-line": !0,
        "is-from-to-reveal": !1,
        tag: "button",
        onClick: _
      }, null, 8, ["content"])])]),
      _: 1
    }, 512), (openBlock(), createBlock(Teleport, {
      to: "body"
    }, [createElementVNode("div", {
      ref_key: "menuOverlayRef",
      ref: l,
      class: "navbarBlock__overlay",
      onClick: O
    }, null, 512)]))], 34))
  }
};

export const NavbarComponent = _export_sfc(NavbarSfc, [
  ["__scopeId", "data-v-e881037d"]
]);
