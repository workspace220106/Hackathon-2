import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  createElementBlock,
  createVNode,
  guardReactiveProps,
  mergeProps,
  nextTick,
  normalizeProps,
  onMounted,
  openBlock,
  ref,
  unref
} from 'vue';
import {
  useRoute
} from 'vue-router';
import ScheduleTimeline from '../components/ScheduleTimeline.vue';
import AboutBlock from '../components/AboutBlock.vue';
import TrainDoorsBlock from '../components/TrainDoorsBlock.vue';
import {
  FooterBlock
} from '../components/FooterBlock.js';
import {
  globalData
} from '../data/global.js';
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
  app
} from '../core/App.js';
import {
  EVENTS,
  emitter
} from '../core/events.js';
import {
  homeData
} from '../data/home.js';

const E4 = {
  class: "page"
};

const HomeViewSfc = {
  __name: "HomeView",
  setup(s) {
    const e = useRoute(),
      t = ref(),
      a = l => {
        app.webgl.modelCamera.setModelCameraProperties(e.name), app.webgl.modelCamera.show(e.name), app.webgl.camera.setModelCameraFov(e.name), app.webgl.camera.setZoom(e.name), app.webgl.scene.show(e.name), app.resetSmoothScroll(), nextTick(() => {
          app.refreshScrollLayout?.()
        }), l || emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, null, !1)
      };
    return onMounted(() => {
      app.firstReveal && (a(!0), app.firstReveal = !1)
    }), emitter.on(EVENTS.SHOW_HOME_PAGE, () => {
      a(!1)
    }), (l, u) => (openBlock(), createElementBlock("div", E4, [
      createVNode(ImprintsLayer, { zones: [".heroBlock", ".introBlock", ".aboutBlock", ".scheduleBlock", ".footerBlock"], count: 12 }),
      createVNode(HeaderBlock, mergeProps({
        ref_key: "headerBlockRef",
        ref: t
      }, unref(homeData).header), null, 16),
      createVNode(HomeHeroBlock, normalizeProps(guardReactiveProps(unref(homeData).hero)), null, 16),
      createVNode(HomeIntroBlock, normalizeProps(guardReactiveProps(unref(homeData).intro)), null, 16),
      createVNode(AboutBlock),
      createVNode(TrainDoorsBlock),
      createVNode(ScheduleTimeline, { title: unref(homeData).archives.title, items: unref(homeData).archives.items }),
      createVNode(FooterBlock, mergeProps({ theme: "white" }, unref(globalData).footer), null, 16)
    ]))
  }
};

export const HomeView = _export_sfc(HomeViewSfc, [
  ["__scopeId", "data-v-94b09d28"]
]);
