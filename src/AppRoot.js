import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  gsap
} from 'gsap';
import {
  Teleport,
  Transition,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createVNode,
  nextTick,
  normalizeClass,
  openBlock,
  ref,
  resolveDynamicComponent,
  unref,
  watch,
  withCtx
} from 'vue';
import {
  RouterView,
  useRoute
} from 'vue-router';
import {
  BeeTextIndication
} from './components/BeeTextIndication.js';
import {
  CursorIndication
} from './components/CursorIndication.js';
import {
  LoaderBlock
} from './components/LoaderBlock.js';
import {
  NavbarComponent
} from './components/NavbarComponent.js';
import {
  OrientationIndication
} from './components/OrientationIndication.js';
import {
  VideoPlayer
} from './components/VideoPlayer.js';
import {
  suspendMediaAutoplay
} from './composables/useMediaAutoplay.js';
import {
  useSeo
} from './composables/useSeo.js';
import {
  app
} from './core/App.js';
import {
  EVENTS,
  emitter
} from './core/events.js';
import {
  globalData
} from './data/global.js';
import {
  homeData
} from './data/home.js';
import {
  previousRouteName
} from './router/index.js';

function hideAllBeeTexts() {
  emitter.emit(EVENTS.BEE_TEXT_HIDE_ALL)
}

const I5 = 1;

const R5 = 2.25;

const rI = R5 + I5;

const fS = .1 + rI;

const pS = .225 + rI;

const B5 = 500;

const D5 = {
  key: 0,
  class: "pageTransitionOverlay",
  "aria-hidden": "true"
};

const AppRootSfc = {
  __name: "App",
  setup(s) {
    useSeo();
    const e = ref(!1),
      t = ref(),
      n = ref(!1),
      i = useRoute(),
      r = c => c === "home",
      o = (c, d) => r(c) && r(d),
      a = () => {
        nextTick(() => {
          app.refreshScrollLayout()
        })
      },
      l = () => {
        if (app.isLoaderRevealComplete) {
          a();
          return
        }
        const c = () => {
          emitter.off(EVENTS.LOADER_REVEAL_COMPLETE, c), a()
        };
        emitter.on(EVENTS.LOADER_REVEAL_COMPLETE, c)
      };
    watch(() => i.name, (c, d) => {
      e.value && (o(d, c) || l())
    }), emitter.on(EVENTS.APP_LOADED, () => {
      if (e.value = !0, document.getElementById("webgl-app").classList.add("visible"), document.getElementById("webgl-top-app").classList.add("visible"), app.skipLoader) {
        setTimeout(() => {
          app.webgl.beginInitialShaderPrewarm(i.name), app.webgl.endInitialShaderPrewarm(i.name), app.webgl.topScene.loaderMaskMesh.skip(), emitter.emit(EVENTS.LOADER_REVEAL_COMPLETE)
        }, 1);
        return
      }
      setTimeout(() => {
        app.webgl.beginInitialShaderPrewarm(i.name), setTimeout(() => {
          app.webgl.endInitialShaderPrewarm(i.name);
          const f = gsap.timeline(),
            A = app.webgl.topScene.loaderMaskMesh.show();
          f.add(A, pS), f.call(() => {
            emitter.emit(EVENTS.LOADER_REVEAL_COMPLETE)
          }, null, pS), i.name !== "home" ? f.call(() => {
            emitter.emit(EVENTS.PLAIN_PAGE_INITIAL_REVEAL)
          }, null, fS) : f.add(app.webgl.modelCamera.show(i.name, !0), fS)
        }, B5)
      }, 1)
    });

    function u(c, d) {
      d(), !o(previousRouteName, i.name) && l()
    }

    function h(c, d, f) {
      var m, g;
      if (!d) {
        f();
        return
      }(m = t.value) == null || m.kill(), hideAllBeeTexts(), (g = app.webgl) == null || g.beginPageTransitionHide();
      const A = gsap.timeline();
      t.value = A, n.value = !0, A.add(app.webgl.topScene.hide(f), 0).call(() => {
        app.isLoaderRevealComplete && app.resetSmoothScroll()
      }).call(() => {
        c === "home" ? emitter.emit(EVENTS.SHOW_HOME_PAGE) : emitter.emit(EVENTS.SHOW_PLAIN_PAGE, c)
      }).add(app.webgl.topScene.show()).call(() => {
        n.value = !1, emitter.emit(EVENTS.PAGE_TRANSITION_COMPLETE), o(previousRouteName, c) && a()
      })
    }
    return (c, d) => (openBlock(), createElementBlock("main", {
      class: normalizeClass(["app", {
        visible: e.value
      }])
    }, [createVNode(LoaderBlock, {
      "progress-text": unref(globalData).loader.progressText,
      title: unref(globalData).title,
      infos: unref(globalData).infos,
      "cursor-indication": unref(globalData).loader.cursorIndication
    }, null, 8, ["progress-text", "title", "infos", "cursor-indication"]), createVNode(NavbarComponent, {
      links: unref(globalData).navbar.links,
      lab: unref(globalData).navbar.lab,
      title: unref(globalData).title,
      infos: unref(globalData).infos,
      contact: unref(globalData).navbar.contact
    }, null, 8, ["links", "lab", "title", "infos", "contact"]), createVNode(CursorIndication, {
      "cursor-indication": unref(globalData).loader.cursorIndication
    }, null, 8, ["cursor-indication"]), createVNode(BeeTextIndication), createVNode(unref(RouterView), null, {
      default: withCtx(({
        Component: f,
        route: A
      }) => [e.value && f ? (openBlock(), createBlock(Transition, {
        key: 0,
        mode: "out-in",
        css: !1,
        onEnter: u,
        onLeave: (m, g) => h(A.name, m, g)
      }, {
        default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(f), {
          key: A.fullPath
        }))]),
        _: 2
      }, 1032, ["onLeave"])) : createCommentVNode("", !0)]),
      _: 1
    }), (openBlock(), createBlock(Teleport, {
      to: "body"
    }, [createVNode(VideoPlayer, {
      url: unref(homeData).intro.urlReel
    }, null, 8, ["url"]), createVNode(OrientationIndication, {
      title: unref(globalData).orientation.title,
      text: unref(globalData).orientation.text
    }, null, 8, ["title", "text"]), n.value ? (openBlock(), createElementBlock("div", D5)) : createCommentVNode("", !0)]))], 2))
  }
};

export const AppRoot = _export_sfc(AppRootSfc, [
  ["__scopeId", "data-v-0bf0eb22"]
]);
