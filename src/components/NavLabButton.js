import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  createElementBlock,
  createElementVNode,
  createStaticVNode,
  openBlock,
  toDisplayString
} from 'vue';

const SG = ["href"];

const wG = {
  class: "navLabButton__text"
};

const NavLabButtonSfc = {
  __name: "NavLabButton",
  props: {
    text: {
      type: String,
      default: "lab"
    },
    url: {
      type: String,
      default: null
    }
  },
  setup(s) {
    return (e, t) => (openBlock(), createElementBlock("a", {
      class: "navLabButton",
      href: s.url,
      target: "_blank",
      rel: "noopener noreferrer"
    }, [createElementVNode("span", wG, toDisplayString(s.text), 1), t[0] || (t[0] = createStaticVNode('<div class="navLabButton__arrowWrapper" data-v-68201abb><div class="navLabButton__arrows" data-v-68201abb><svg class="navLabButton__arrow navLabButton__arrow--default" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-v-68201abb><path d="M7.47503 5.00038H6.47514V1.65681L0.70711 7.42484L2.76905e-06 6.71774L5.71762 1.00011H2.47488V0.000221195H7.47434L7.47503 5.00038Z" fill="currentColor" data-v-68201abb></path></svg><svg class="navLabButton__arrow navLabButton__arrow--hover" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-v-68201abb><path d="M7.47503 5.00038H6.47514V1.65681L0.70711 7.42484L2.76905e-06 6.71774L5.71762 1.00011H2.47488V0.000221195H7.47434L7.47503 5.00038Z" fill="currentColor" data-v-68201abb></path></svg></div></div>', 1))], 8, SG))
  }
};

export const NavLabButton = _export_sfc(NavLabButtonSfc, [
  ["__scopeId", "data-v-68201abb"]
]);
