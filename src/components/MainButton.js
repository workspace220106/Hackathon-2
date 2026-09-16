import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  createElementBlock,
  normalizeClass,
  openBlock,
  toDisplayString
} from 'vue';

const sG = ["href", "target"];

const MainButtonSfc = {
  __name: "MainButton",
  props: {
    text: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: null
    },
    isExternal: {
      type: Boolean,
      default: !0
    },
    underlineOnHover: {
      type: Boolean,
      default: !0
    }
  },
  setup(s) {
    return (e, t) => (openBlock(), createElementBlock("a", {
      class: normalizeClass(["mainButton", {
        "mainButton--noUnderlineHover": !s.underlineOnHover
      }]),
      href: s.url,
      target: s.isExternal ? "_blank" : "_self"
    }, toDisplayString(s.text), 11, sG))
  }
};

export const MainButton = _export_sfc(MainButtonSfc, [
  ["__scopeId", "data-v-3d08a041"]
]);
