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
  createStaticVNode,
  normalizeClass,
  onUnmounted,
  openBlock,
  ref,
  toDisplayString
} from 'vue';

const cV = ["href"];

const uV = {
  class: "arrowButton__text"
};

const hV = {
  class: "arrowButton__wrapper"
};

const ArrowButtonSfc = {
  __name: "ArrowButton",
  props: {
    text: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: null
    },
    alwaysVisible: {
      type: Boolean,
      default: !1
    }
  },
  setup(s, {
    expose: e
  }) {
    CustomEase.create("reveal", ".4,0,0,1");
    const t = ref(),
      n = ref(),
      i = ref(),
      r = ref(),
      o = () => {
        var h;
        const u = t.value;
        u && ((h = r.value) == null || h.kill(), u.classList.remove("visible"), u.classList.add("is-resetting"), n.value && gsap.set(n.value, {
          transform: "scale(1.2) rotate(15deg) translateY(110%)"
        }), i.value && gsap.set(i.value, {
          transform: "translate(-100%, 100%)"
        }))
      },
      a = u => {
        o();
        const h = gsap.timeline();
        return r.value = h, h.fromTo(n.value, {
          transform: "scale(1.2) rotate(15deg) translateY(110%)"
        }, {
          transform: "scale(1) rotate(0deg) translateY(0%)",
          duration: 1.125,
          ease: "reveal"
        }, u), h.fromTo(i.value, {
          transform: "translate(-100%, 100%)"
        }, {
          transform: "translate(-0%, 0%)",
          duration: 1.125,
          ease: "reveal"
        }, u + .2), h.call(() => {
          var c, d;
          (c = t.value) == null || c.classList.remove("is-resetting"), (d = t.value) == null || d.classList.add("visible")
        }, null, u), h
      },
      l = () => {
        var u;
        (u = r.value) == null || u.kill()
      };
    return onUnmounted(() => {
      var u;
      (u = r.value) == null || u.kill()
    }), e({
      resetState: o,
      revealTL: a,
      hideTL: l
    }), (u, h) => (openBlock(), createElementBlock("a", {
      ref_key: "arrowButtonRef",
      ref: t,
      class: normalizeClass(["arrowButton", {
        alwaysVisible: s.alwaysVisible
      }]),
      href: s.url,
      target: "_blank"
    }, [createElementVNode("div", uV, [createElementVNode("div", {
      ref_key: "textRef",
      ref: n,
      class: "text"
    }, toDisplayString(s.text), 513)]), createElementVNode("div", hV, [createElementVNode("div", {
      ref_key: "arrowsRef",
      ref: i,
      class: "arrowButton__arrows"
    }, [...h[0] || (h[0] = [createStaticVNode('<svg class="arrows__arrow arrows__arrow--default" width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-fbcd8e8f><rect class="arrow__rect" x="6.66797" y="0.819092" width="4.28576" height="1.09424" transform="rotate(90 6.66797 0.819092)" fill="#022016" data-v-fbcd8e8f></rect><rect class="arrow__rect" x="2.38184" y="0.818359" width="4.28576" height="1.09424" fill="#022016" data-v-fbcd8e8f></rect><rect class="arrow__rect" x="0.748047" y="6.02832" width="6.61779" height="1.09424" transform="rotate(-45 0.748047 6.02832)" fill="#022016" data-v-fbcd8e8f></rect></svg><svg class="arrows__arrow arrows__arrow--hover" width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-fbcd8e8f><rect class="arrow__rect" x="6.66797" y="0.819092" width="4.28576" height="1.09424" transform="rotate(90 6.66797 0.819092)" fill="#022016" data-v-fbcd8e8f></rect><rect class="arrow__rect" x="2.38184" y="0.818359" width="4.28576" height="1.09424" fill="#022016" data-v-fbcd8e8f></rect><rect class="arrow__rect" x="0.748047" y="6.02832" width="6.61779" height="1.09424" transform="rotate(-45 0.748047 6.02832)" fill="#022016" data-v-fbcd8e8f></rect></svg>', 2)])], 512)])], 10, cV))
  }
};

export const ArrowButton = _export_sfc(ArrowButtonSfc, [
  ["__scopeId", "data-v-fbcd8e8f"]
]);
