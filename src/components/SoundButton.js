import {
  _export_sfc
} from '@/utils/export-sfc.js';
import {
  gsap
} from 'gsap';
import {
  Fragment,
  createElementBlock,
  createElementVNode,
  normalizeClass,
  onMounted,
  onUnmounted,
  openBlock,
  ref,
  renderList
} from 'vue';
import {
  app
} from '../core/App.js';
import {
  EVENTS,
  emitter
} from '../core/events.js';
import {
  mapRange
} from '../utils/map-range.js';

const CG = .005;

const MG = 4;

const SoundButtonSfc = {
  __name: "SoundButton",
  setup(s) {
    const e = ref([]),
      t = ref(!1),
      n = {
        amount: 0
      },
      i = [{
        offset: 0
      }, {
        offset: 1
      }, {
        offset: 2
      }, {
        offset: 3
      }],
      r = a => {
        e.value.forEach((l, u) => {
          const h = Math.sin(a.et * CG + i[u].offset),
            c = mapRange(h, [-1, 1], [0, 1]);
          l.style.transform = `scaleY(${c*n.amount+.1})`
        })
      },
      o = () => {
        const a = app.soundController;
        t.value = !t.value, gsap.to(n, {
          amount: t.value ? 1 : 0,
          duration: .5,
          ease: "power4.out",
          onUpdate: () => {
            a.setAmbientVolume(n.amount)
          }
        }), a.playAmbient()
      };
    return emitter.on(EVENTS.TICK, r), emitter.on(EVENTS.TOGGLE_SOUND, o), onMounted(() => {}), onUnmounted(() => {
      gsap.killTweensOf(n), emitter.off(EVENTS.TICK, r), emitter.off(EVENTS.TOGGLE_SOUND, o)
    }), (a, l) => (openBlock(), createElementBlock("button", {
      class: "soundButton",
      onClick: o
    }, [(openBlock(), createElementBlock(Fragment, null, renderList(MG, (u, h) => createElementVNode("div", {
      ref_for: !0,
      ref_key: "linesRef",
      ref: e,
      key: h,
      class: normalizeClass(["soundButton__line", `soundButton__line--${h}`])
    }, null, 2)), 64))]))
  }
};

export const SoundButton = _export_sfc(SoundButtonSfc, [
  ["__scopeId", "data-v-be39561a"]
]);
