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
  normalizeProps,
  openBlock,
  renderList,
  toDisplayString,
  withCtx
} from 'vue';
import {
  AgencyLink
} from '../AgencyLink.js';
import {
  BeeBlock
} from '../BeeBlock.js';
import {
  GridWrapper
} from '../GridWrapper.js';
import {
  WebglBgComponent
} from '../WebglBgComponent.js';

const GV = ["innerHTML"];

const HV = {
  class: "top__infos"
};

const QV = {
  key: 0,
  class: "wrapper"
};

const zV = {
  key: 1
};

const VV = {
  class: "infos__agencies"
};

const WV = {
  class: "agencies__text"
};

const HomeHeroBlockSfc = {
  __name: "HeroBlock",
  props: {
    titles: {
      type: Array,
      default: null
    },
    titlesReveal: {
      type: Array,
      default: null
    },
    indication: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    textAgency: {
      type: Array,
      default: null
    },
    textFormer: {
      type: String,
      default: null
    },
    agencies: {
      type: Array,
      default: () => []
    }
  },
  setup(s) {
    const e = s;
    return (t, n) => (openBlock(), createBlock(WebglBgComponent, {
      "is-grid-wrapper": !1,
      index: 0,
      "current-page": "home",
      "disable-plane-overscan": !0,
      class: "heroBlock"
    }, {
      default: withCtx(() => [createVNode(GridWrapper, {
        class: "heroBlock__top"
      }, {
        default: withCtx(() => [createElementVNode("p", {
          class: "top__city",
          innerHTML: s.city
        }, null, 8, GV), n[0] || (n[0] = createElementVNode("p", {
          class: "top__star"
        }, "*", -1)), createElementVNode("div", HV, [createElementVNode("div", null, [(openBlock(!0), createElementBlock(Fragment, null, renderList(s.textAgency, (i, r) => (openBlock(), createElementBlock("div", {
          key: r,
          class: "infos__text"
        }, [r === 1 ? (openBlock(), createElementBlock("div", QV, [createElementVNode("p", null, toDisplayString(i), 1), s.agencies[0] ? (openBlock(), createBlock(AgencyLink, {
          key: 0,
          name: String(s.agencies[0].name),
          url: String(s.agencies[0].url)
        }, null, 8, ["name", "url"])) : createCommentVNode("", !0)])) : (openBlock(), createElementBlock("p", zV, toDisplayString(i), 1))]))), 128))]), createElementVNode("div", VV, [createElementVNode("div", WV, toDisplayString(s.textFormer), 1), s.agencies[1] ? (openBlock(), createBlock(AgencyLink, {
          key: 0,
          name: String(s.agencies[1].name),
          url: String(s.agencies[1].url)
        }, null, 8, ["name", "url"])) : createCommentVNode("", !0)])])]),
        _: 1
      }), createVNode(BeeBlock, normalizeProps(guardReactiveProps(e)), null, 16)]),
      _: 1
    }))
  }
};

export const HomeHeroBlock = _export_sfc(HomeHeroBlockSfc, [
  ["__scopeId", "data-v-17c2e66f"]
]);
