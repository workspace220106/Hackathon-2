import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  createElementBlock,
  defineComponent,
  normalizeClass,
  openBlock,
  renderSlot
} from 'vue';

const GridWrapperSfc = defineComponent({
  __name: "GridWrapper",
  props: {
    hasPadding: {
      type: Boolean,
      default: !0
    }
  },
  setup(s) {
    return (e, t) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(["gridWrapper", {
        hasPadding: s.hasPadding
      }])
    }, [renderSlot(e.$slots, "default", {}, void 0)], 2))
  }
});

export const GridWrapper = _export_sfc(GridWrapperSfc, [
  ["__scopeId", "data-v-56dff9b3"]
]);
