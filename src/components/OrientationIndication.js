import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  Teleport,
  Transition,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createElementVNode,
  createVNode,
  onUnmounted,
  openBlock,
  toDisplayString,
  unref,
  watch,
  withCtx
} from 'vue';
import {
  useOrientation
} from '../composables/useOrientation.js';

const Z3 = ["aria-label"];

const $3 = {
  class: "orientationIndication__content"
};

const eG = {
  class: "orientationIndication__title"
};

const tG = {
  class: "orientationIndication__text"
};

const OrientationIndicationSfc = {
  __name: "OrientationIndication",
  props: {
    title: {
      type: String,
      required: !0
    },
    text: {
      type: String,
      required: !0
    }
  },
  setup(s) {
    const {
      isVisible: e
    } = useOrientation();
    return watch(e, t => {
      document.documentElement.style.overflow = t ? "hidden" : ""
    }), onUnmounted(() => {
      document.documentElement.style.overflow = ""
    }), (t, n) => (openBlock(), createBlock(Teleport, {
      to: "body"
    }, [createVNode(Transition, {
      name: "orientationIndication",
      duration: {
        enter: 0,
        leave: 575
      }
    }, {
      default: withCtx(() => [unref(e) ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: "orientationIndication",
        role: "alertdialog",
        "aria-modal": "true",
        "aria-label": s.title
      }, [createElementVNode("div", $3, [n[0] || (n[0] = createElementVNode("div", {
        class: "orientationIndication__phone",
        "aria-hidden": "true"
      }, [createElementVNode("svg", {
        class: "orientationIndication__phoneSvg",
        width: "48",
        height: "96",
        viewBox: "0 0 48 96",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      }, [createElementVNode("rect", {
        x: "4",
        y: "2",
        width: "40",
        height: "92",
        rx: "9",
        stroke: "currentColor",
        "stroke-width": "2"
      }), createElementVNode("rect", {
        x: "18",
        y: "6",
        width: "12",
        height: "3",
        rx: "1.5",
        fill: "currentColor"
      }), createElementVNode("rect", {
        x: "10",
        y: "14",
        width: "28",
        height: "68",
        rx: "3",
        fill: "currentColor",
        "fill-opacity": "0.08"
      }), createElementVNode("rect", {
        x: "19",
        y: "86",
        width: "10",
        height: "2",
        rx: "1",
        fill: "currentColor",
        "fill-opacity": "0.35"
      })])], -1)), createElementVNode("h2", eG, toDisplayString(s.title), 1), createElementVNode("p", tG, toDisplayString(s.text), 1)])], 8, Z3)) : createCommentVNode("", !0)]),
      _: 1
    })]))
  }
};

export const OrientationIndication = _export_sfc(OrientationIndicationSfc, [
  ["__scopeId", "data-v-2887326e"]
]);
