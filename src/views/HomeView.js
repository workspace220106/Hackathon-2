import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  Fragment,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createElementVNode,
  createVNode,
  guardReactiveProps,
  mergeProps,
  nextTick,
  normalizeProps,
  onMounted,
  openBlock,
  ref,
  renderList,
  unref
} from 'vue';
import {
  useRoute
} from 'vue-router';
import ScheduleTimeline from '../components/ScheduleTimeline.vue';
import {
  FooterBlock
} from '../components/FooterBlock.js';
import {
  HeaderBlock
} from '../components/HeaderBlock.js';
import ImprintsLayer from '../components/ImprintsLayer.vue';
import {
  HomeHeroBlock
} from '../components/home/HeroBlock.js';
import {
  HomeIntroBlock
} from '../components/home/IntroBlock.js';
import {
  ProjectBlock
} from '../components/ProjectBlock.js';
import {
  WebglSectionBlock
} from '../components/WebglSectionBlock.js';
import {
  useHomeNavbarTheme
} from '../composables/useHomeNavbarTheme.js';
import {
  app
} from '../core/App.js';
import {
  EVENTS,
  emitter
} from '../core/events.js';
import {
  globalData
} from '../data/global.js';
import {
  homeData
} from '../data/home.js';

const E4 = {
  class: "page"
};

const S4 = {
  class: "wrapper"
};

const HomeViewSfc = {
  __name: "HomeView",
  setup(s) {
    const e = useRoute(),
      t = ref(),
      n = ref(),
      i = ref(),
      {
        measure: r,
        update: o
      } = useHomeNavbarTheme({
        webglRef: n,
        firstProjectRef: i
      }),
      a = l => {
        app.webgl.modelCamera.setModelCameraProperties(e.name), app.webgl.modelCamera.show(e.name), app.webgl.camera.setModelCameraFov(e.name), app.webgl.camera.setZoom(e.name), app.webgl.scene.show(e.name), app.resetSmoothScroll(), nextTick(() => {
          r(), o()
        }), l || emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, null, !1)
      };
    return onMounted(() => {
      app.firstReveal && (a(!0), app.firstReveal = !1)
    }), emitter.on(EVENTS.SHOW_HOME_PAGE, () => {
      a(!1)
    }), (l, u) => (openBlock(), createElementBlock("div", E4, [createVNode(ImprintsLayer, { zones: [".heroBlock", ".introBlock", ".footerBlock"], count: 12 }), createVNode(HeaderBlock, mergeProps({
      ref_key: "headerBlockRef",
      ref: t
    }, unref(homeData).header), null, 16), createVNode(HomeHeroBlock, normalizeProps(guardReactiveProps(unref(homeData).hero)), null, 16), createVNode(HomeIntroBlock, normalizeProps(guardReactiveProps(unref(homeData).intro)), null, 16), createElementVNode("div", S4, [(openBlock(!0), createElementBlock(Fragment, null, renderList(unref(homeData).projects, (h, c) => (openBlock(), createElementBlock(Fragment, {
      key: c
    }, [h.sectionType === "slider" && h.projectIndex === 2 ? (openBlock(), createBlock(ProjectBlock, mergeProps({
      key: 0,
      ref_for: !0,
      ref_key: "firstProjectAfterWebglRef",
      ref: i
    }, {
      ref_for: !0
    }, h), null, 16)) : createCommentVNode("", !0), h.sectionType === "slider" && h.projectIndex !== 2 ? (openBlock(), createBlock(ProjectBlock, mergeProps({
      key: 1,
      ref_for: !0
    }, h), null, 16)) : createCommentVNode("", !0), h.sectionType === "webgl" ? (openBlock(), createBlock(WebglSectionBlock, mergeProps({
      key: 2,
      ref_for: !0,
      ref_key: "webglSectionRef",
      ref: n
    }, {
      ref_for: !0
    }, h), null, 16)) : createCommentVNode("", !0)], 64))), 128))]), createVNode(ScheduleTimeline, { title: unref(homeData).archives.title, items: unref(homeData).archives.items }), createVNode(FooterBlock, mergeProps({
      theme: "white"
    }, unref(globalData).footer), null, 16)]))
  }
};

export const HomeView = _export_sfc(HomeViewSfc, [
  ["__scopeId", "data-v-94b09d28"]
]);
