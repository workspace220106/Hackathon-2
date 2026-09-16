import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  gsap
} from 'gsap';
import {
  CustomEase
} from 'gsap/CustomEase';
import {
  createElementBlock,
  createElementVNode,
  onMounted,
  openBlock,
  ref
} from 'vue';

const yG = {
  class: "menuButton"
};

const MenuButtonSfc = {
  __name: "MenuButton",
  setup(s, {
    expose: e
  }) {
    CustomEase.create("reveal", "0.4,0,0,1");
    const t = ref(null),
      n = ref(null),
      i = ref(null),
      r = ref(null),
      o = ref(null),
      a = ref(null);
    return onMounted(() => {}), e({
      animateCross: u => {
        if (!n.value || !i.value || !r.value) return;
        const h = gsap.timeline();
        return h.to(t.value, {
          transform: u ? "translateY(100%)" : "translateY(0%)",
          duration: .75,
          ease: "reveal"
        }, 0), h.to(n.value, {
          transform: u ? "translateY(0)" : "translateY(-100%)",
          duration: .75,
          ease: "reveal"
        }, 0), h.to(i.value, {
          strokeDashoffset: u ? 0 : 11,
          duration: .75,
          ease: "reveal"
        }, u ? .1 : 0), h.to(r.value, {
          strokeDashoffset: u ? 0 : 11,
          duration: .75,
          ease: "reveal"
        }, u ? .2 : 0), h.to(o.value, {
          strokeDashoffset: u ? -10 : 0,
          duration: .75,
          ease: "reveal"
        }, u ? 0 : .1), h.to(a.value, {
          strokeDashoffset: u ? -10 : 0,
          duration: .75,
          ease: "reveal"
        }, u ? 0 : .2), h
      }
    }), (u, h) => (openBlock(), createElementBlock("button", yG, [(openBlock(), createElementBlock("svg", {
      ref_key: "defaultRef",
      ref: t,
      class: "menuButton__default",
      width: "12",
      height: "8",
      viewBox: "0 0 12 8",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, [createElementVNode("path", {
      ref_key: "defaultLine1Ref",
      ref: o,
      class: "default__line default__line--1",
      d: "M1 1H11",
      "stroke-width": "2",
      "stroke-linecap": "round"
    }, null, 512), createElementVNode("path", {
      ref_key: "defaultLine2Ref",
      ref: a,
      class: "default__line default__line--2",
      d: "M1 7H11",
      "stroke-width": "2",
      "stroke-linecap": "round"
    }, null, 512)], 512)), (openBlock(), createElementBlock("svg", {
      ref_key: "crossRef",
      ref: n,
      class: "menuButton__cross",
      width: "40",
      height: "40",
      viewBox: "0 0 40 40",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, [createElementVNode("path", {
      ref_key: "crossLine1Ref",
      ref: i,
      class: "cross__line cross__line--1",
      d: "M23.5391 16.4729L16.468 23.544",
      "stroke-width": "2",
      "stroke-linecap": "round"
    }, null, 512), createElementVNode("path", {
      ref_key: "crossLine2Ref",
      ref: r,
      class: "cross__line cross__line--2",
      d: "M23.5322 23.5439L16.4612 16.4729",
      "stroke-width": "2",
      "stroke-linecap": "round"
    }, null, 512)], 512))]))
  }
};

export const MenuButton = _export_sfc(MenuButtonSfc, [
  ["__scopeId", "data-v-13eb05a0"]
]);
