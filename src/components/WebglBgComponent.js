import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  computed,
  createBlock,
  createElementBlock,
  normalizeClass,
  onMounted,
  onUnmounted,
  openBlock,
  ref,
  renderSlot,
  withCtx
} from 'vue';
import {
  app
} from '../core/App.js';
import {
  EVENTS,
  emitter
} from '../core/events.js';
import {
  getOffset
} from '../utils/dom.js';
import {
  GridWrapper
} from './GridWrapper.js';

const WebglBgSfc = {
  __name: "WebglBgComponent",
  props: {
    index: {
      type: Number,
      default: null
    },
    needLight: {
      type: Boolean,
      default: !1
    },
    currentPage: {
      type: String,
      default: null
    },
    isGridWrapper: {
      type: Boolean,
      default: !0
    },
    isFooter: {
      type: Boolean,
      default: !1
    },
    isProject: {
      type: Boolean,
      default: !1
    },
    forceWebgl: {
      type: Boolean,
      default: !1
    },
    disablePlaneOverscan: {
      type: Boolean,
      default: !1
    }
  },
  setup(s, {
    expose: e
  }) {
    const t = ref(),
      n = ref(),
      i = s,
      r = computed(() => {
        var d;
        return ((d = app.webgl) == null ? void 0 : d.usesFluidEffects()) ?? !1
      }),
      o = computed(() => i.isProject || i.forceWebgl),
      a = computed(() => r.value || o.value),
      l = computed(() => a.value || i.needLight),
      u = computed(() => !a.value && i.currentPage ? `webglBg--${i.currentPage}` : ""),
      h = d => {
        const f = getOffset(d);
        n.value = new DOMRect(f.x, f.y, f.width, f.height)
      },
      c = () => {
        t.value && l.value && (app.webgl.interfaceScene.refreshBackgroundLayout(i.index, i.needLight), h(t.value))
      };
    return emitter.on(EVENTS.RESIZE, c), emitter.on(EVENTS.LAYOUT_REFRESH, c), onMounted(() => {
      l.value && (app.webgl.interfaceScene.addBackgrounds(t.value, i.index, i.needLight, i.currentPage, o.value, i.disablePlaneOverscan), h(t.value))
    }), onUnmounted(() => {
      emitter.off(EVENTS.RESIZE, c), emitter.off(EVENTS.LAYOUT_REFRESH, c)
    }), e({
      handleResize: c,
      getContentElement: () => {
        var d;
        return ((d = t.value) == null ? void 0 : d.querySelector(".webglBg__content")) ?? t.value
      }
    }), (d, f) => (openBlock(), createElementBlock("div", {
      ref_key: "webglBgRef",
      ref: t,
      class: normalizeClass(["webglBg", u.value])
    }, [s.isGridWrapper ? (openBlock(), createBlock(GridWrapper, {
      key: 0,
      class: normalizeClass(["webglBg__content", d.$attrs.class])
    }, {
      default: withCtx(() => [renderSlot(d.$slots, "default", {}, void 0, !0)]),
      _: 3
    }, 8, ["class"])) : (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass(["webglBg__content", [d.$attrs.class, {
        isFooter: s.isFooter
      }]])
    }, [renderSlot(d.$slots, "default", {}, void 0)], 2))], 2))
  }
};

export const WebglBgComponent = _export_sfc(WebglBgSfc, [
  ["__scopeId", "data-v-bdd5ee4a"]
]);
