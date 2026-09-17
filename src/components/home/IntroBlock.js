import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  Fragment,
  createBlock,
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
  unref,
  withCtx
} from 'vue';
import {
  EVENTS,
  emitter
} from '../../core/events.js';
import {
  isTabletWidth
} from '../../utils/device.js';
import {
  GridWrapper
} from '../GridWrapper.js';
import {
  MediaComponent
} from '../MediaComponent.js';
import {
  TextComponent
} from '../TextComponent.js';
import {
  WebglBgComponent
} from '../WebglBgComponent.js';

const qV = {
  class: "top__baseline"
};

const jV = {
  class: "bottom__text"
};

const KV = {
  class: "bottom__showreelHint"
};

const HomeIntroBlockSfc = {
  __name: "IntroBlock",
  props: {
    bigTexts: {
      type: Array,
      default: null
    },
    smallTexts: {
      type: Array,
      default: null
    },
    urlReel: {
      type: String,
      default: null
    },
    cursorIndication: {
      type: String,
      default: null
    }
  },
  setup(s) {
    const e = ref(!1),
      t = s,
      n = l => {
        const u = typeof l == "boolean" ? l : !!(l != null && l.active);
        e.value = u
      },
      i = () => {
        if (e.value) return;
        const l = document.querySelector(".introBlock .bottom__video");
        l != null && l.matches(":hover") && emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, t.cursorIndication, !0)
      },
      r = () => {
        e.value || emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, t.cursorIndication, !0)
      },
      o = () => {
        e.value || emitter.emit(EVENTS.CURSOR_INDICATION_CHANGE, null, !1)
      };
    onMounted(() => {
      emitter.on(EVENTS.SHOWREEL_PLAYER_CHANGE, n), emitter.on(EVENTS.SHOWREEL_CURSOR_RESTORE, i)
    }), onUnmounted(() => {
      emitter.off(EVENTS.SHOWREEL_PLAYER_CHANGE, n), emitter.off(EVENTS.SHOWREEL_CURSOR_RESTORE, i)
    });
    const a = () => {
      emitter.emit(EVENTS.SHOWREEL_OPEN)
    };
    return (l, u) => (openBlock(), createBlock(WebglBgComponent, {
      "is-grid-wrapper": !1,
      index: 1,
      "current-page": "home",
      class: "introBlock"
    }, {
      default: withCtx(() => [createVNode(GridWrapper, {
        class: "introBlock__top"
      }, {
        default: withCtx(() => [createElementVNode("p", qV, [(openBlock(!0), createElementBlock(Fragment, null, renderList(s.bigTexts, (h, c) => (openBlock(), createBlock(TextComponent, {
          key: c,
          class: normalizeClass("baseline__text--" + c),
          content: h
        }, null, 8, ["class", "content"]))), 128))])]),
        _: 1
      }), createVNode(GridWrapper, {
        class: "introBlock__bottom"
      }, {
        default: withCtx(() => [u[0] || (u[0] = createElementVNode("p", {
          class: "bottom__stars"
        }, "*", -1)), createElementVNode("p", jV, [(openBlock(!0), createElementBlock(Fragment, null, renderList(s.smallTexts, (h, c) => (openBlock(), createElementBlock("span", null, [createVNode(TextComponent, {
          content: h,
          "reveal-delay": c * .15
        }, null, 8, ["content", "reveal-delay"])]))), 256))]), createVNode(MediaComponent, {
          class: "bottom__video",
          "is-video": !0,
          url2: s.urlReel,
          "parallax-mask-amount": unref(isTabletWidth)() ? 8 : 10,
          "parallax-scale-amount": .1,
          "has-parallax-position": !0,
          "parallax-position-amount": -24, // small drift only — keeps the tile centred in its slot
          onMouseenter: r,
          onMouseleave: o,
          onClick: a
        }, null, 8, ["url2", "parallax-mask-amount"]), createElementVNode("p", KV, toDisplayString(s.cursorIndication), 1)]),
        _: 1
      })]),
      _: 1
    }))
  }
};

export const HomeIntroBlock = _export_sfc(HomeIntroBlockSfc, [
  ["__scopeId", "data-v-668bc637"]
]);
