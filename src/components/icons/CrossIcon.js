import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  createElementBlock,
  createElementVNode,
  openBlock
} from 'vue';

const CrossIconSfc = {};

const fz = {
  class: "svg-cross",
  width: "11",
  height: "11",
  viewBox: "0 0 11 11",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};

function renderCrossIcon(s, e) {
  return openBlock(), createElementBlock("svg", fz, [...e[0] || (e[0] = [createElementVNode("rect", {
    y: "5",
    width: "11",
    height: "1"
  }, null, -1), createElementVNode("rect", {
    x: "5",
    y: "11",
    width: "11",
    height: "1",
    transform: "rotate(-90 5 11)"
  }, null, -1)])])
}

export const CrossIcon = _export_sfc(CrossIconSfc, [
  ["render", renderCrossIcon]
]);
