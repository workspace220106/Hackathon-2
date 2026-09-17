import {
  __publicField
} from '@/utils/private-fields.js';
import Lenis from '@studio-freight/lenis';
import {
  gsap
} from 'gsap';
import {
  ScrollTrigger
} from 'gsap/ScrollTrigger';
import {
  createPinia
} from 'pinia';
import {
  createApp
} from 'vue';
import {
  AppRoot
} from '../AppRoot.js';
import {
  router
} from '../router/index.js';
import {
  isTabletWidth,
  isTouch
} from '../utils/device.js';
import {
  initKtxTextureLoader
} from '../webgl/loaders/ktx-texture-loader.js';
import {
  WebGL
} from '../webgl/WebGL.js';
import {
  createCore
} from './create-core.js';
import {
  EVENTS,
  emitter
} from './events.js';
import {
  SoundController
} from './SoundController.js';
import {
  createTools
} from './tools/index.js';
import {
  URLParams
} from './URLParams.js';

const App = class App {
  async init(e, t, n, i) {
    var r;
    this.$app = e, this.$wrapper = t, this.$topApp = n, this.$topWrapper = i, this.isOnHeader = !0, this.showFooterBee = !1, this.showPlaygroundContentBee = !1, this.trackBee = null, this.playgroundContentBeeLayout = null, this.playgroundContentBeeBlockStartScroll = 0, this.playgroundContentBeeSuppressHeroUntilScrollReset = !1, this.playgroundContentBeeEnd = 0, this.playgroundContentBeeHideEnd = 0, this.playgroundFooterBeeStart = 0, this.firstReveal = !0, this.firstClick = !0, this.isLoaderRevealComplete = !1, this.toggleColorUI = !1, this.forceWhiteNavbarUI = !1, this.urlParams = new URLParams, this.skipLoader = this.urlParams.has("skipLoader"), this.isTouch = isTouch(), this.isTabletWidth = isTabletWidth(), this.hasNoSmoothScroll = this.isTouch, this._scrollSaveRaf = null, this.lenis = this._createLenis(), this.vueApp = this._createVueApp(), this.core = createCore(), this.tools = createTools(), this.webgl = new WebGL, this.soundController = new SoundController, (r = this.debug) == null || r.mapping.init(), this.vueApp.mount("#vue-app"), await this.load()
  }
  _createLenis() {
    const e = new Lenis({
      lerp: isTouch() ? 1 : .085,
      smooth: !0,
      mouseMultiplier: 1,
      smoothTouch: !1,
      syncTouch: !0,
      infinite: !1,
      autoResize: !0,
      orientation: "vertical",
      gestureOrientation: "vertical"
    });
    return e.on("scroll", t => {
      ScrollTrigger.update(), this._scheduleScrollPositionSave()
    }), gsap.ticker.add(t => {
      e.raf(t * 1e3)
    }), gsap.ticker.lagSmoothing(0), e.stop(), e
  }
  resetSmoothScroll() {
    this.lenis.resize(), this.lenis.scrollTo(0, {
      immediate: !0
    }), this.playgroundContentBeeSuppressHeroUntilScrollReset = !1, this.playgroundContentBeeBlockStartScroll = 0
  }
  refreshScrollLayout() {
    this.lenis && requestAnimationFrame(() => {
      this.lenis.resize(), ScrollTrigger.refresh(), emitter.emit(EVENTS.RESIZE, this.tools.viewport.infos)
    })
  }
  _createVueApp() {
    const e = createApp(AppRoot);
    return e.use(createPinia()), e.use(router), e
  }
  async beforeLoad() {}
  async load() {
    await this.beforeLoad(), await initKtxTextureLoader(this.webgl.renderer), await this.core.assetsManager.load(), emitter.emit(EVENTS.APP_LOADED), emitter.on(EVENTS.LOADER_REVEAL_COMPLETE, () => {
      this.isLoaderRevealComplete = !0, this.lenis && (this.lenis.start(), this._restoreScrollPosition(), this.refreshScrollLayout())
    }), emitter.emit(EVENTS.RESIZE, this.tools.viewport.infos), emitter.emit(EVENTS.ATTACH), this._setupFirstClick()
  }
  _scheduleScrollPositionSave() {
    this._scrollSaveRaf === null && (this._scrollSaveRaf = requestAnimationFrame(() => {
      this._scrollSaveRaf = null, this._saveScrollPosition()
    }))
  }
  _saveScrollPosition() {
    if (this.lenis) {
      const e = this.lenis.scroll;
      localStorage.setItem("savedScrollY", e.toString())
    }
  }
  _restoreScrollPosition() {
    if (this.urlParams.has("remindScrollY")) {
      const e = localStorage.getItem("savedScrollY");
      if (e && this.lenis) {
        const t = parseFloat(e);
        setTimeout(() => {
          this.lenis.scrollTo(t, {
            immediate: !0
          })
        }, 1)
      }
    }
  }
  saveScrollPosition() {
    this._saveScrollPosition()
  }
  _setupFirstClick() {
    const e = "awaiting-sound-click";
    document.body.classList.add(e);
    const t = n => {
      var o, a, l, u;
      if (!this.firstClick) return;
      const i = (a = (o = n.target) == null ? void 0 : o.closest) == null ? void 0 : a.call(o, "[data-cursor-indication-preserve]");
      this.firstClick = !1, document.body.classList.remove(e), ((u = (l = n.target) == null ? void 0 : l.closest) == null ? void 0 : u.call(l, ".soundButton")) || emitter.emit(EVENTS.TOGGLE_SOUND), emitter.emit(EVENTS.CURSOR_SOUND_INDICATION_SUPPRESS, !0), i || emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, null, !1), window.removeEventListener("click", t, !0)
    };
    window.addEventListener("click", t, !0)
  }
  static getInstance() {
    return App.instance || (App.instance = new App), App.instance
  }
};

__publicField(App, "instance");

let AppClass = App;

export const app = AppClass.getInstance();
