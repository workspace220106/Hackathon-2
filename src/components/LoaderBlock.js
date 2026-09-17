import {
  gsap
} from 'gsap';
import {
  CustomEase
} from 'gsap/CustomEase';
import {
  computed,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createElementVNode,
  createVNode,
  nextTick,
  onBeforeUnmount,
  onMounted,
  openBlock,
  ref,
  toDisplayString,
  withCtx
} from 'vue';
import {
  app
} from '../core/App.js';
import {
  EVENTS,
  emitter
} from '../core/events.js';
import {
  isTabletWidth,
  isTouch
} from '../utils/device.js';
import {
  CursorIndication
} from './CursorIndication.js';
import {
  GridWrapper
} from './GridWrapper.js';

import {
  FrameSequence,
  FRAME_CLIPS
} from '../utils/FrameSequence.js';

// Background clip shown while the site loads: a JPG frame sequence painted onto a <canvas>
// (see also src/styles/original.css → .loaderBlock__video)
const LOADER_VIDEO_FRAMES = FRAME_CLIPS.loader;

const n5 = {
  class: "container__title"
};

const i5 = {
  class: "container__infos"
};

const s5 = {
  class: "container__bottom"
};

const r5 = {
  class: "bottom__progress"
};

const o5 = {
  class: "progress__circle",
  width: "8",
  height: "8",
  viewBox: "0 0 8 8",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};

const a5 = {
  transform: "rotate(-90 4 4)"
};

const l5 = {
  ref: "progressCircleRef",
  class: "circle--animated",
  cx: "4",
  cy: "4",
  r: "3.25",
  stroke: "black",
  "stroke-width": "1"
};

const c5 = {
  class: "progress__text"
};

const uS = 1.5;

const u5 = 2.25;

export const LoaderBlock = {
  __name: "LoaderBlock",
  props: {
    progressText: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    infos: {
      type: String,
      default: null
    },
    cursorIndication: {
      type: [String, Array],
      default: null
    }
  },
  setup(s) {
    CustomEase.create("reveal", ".4,0,0,1");
    const e = computed(() => isTabletWidth() && isTouch()),
      t = ref(!1),
      n = ref(),
      i = ref(),
      r = ref(),
      o = ref(),
      a = ref();
    // frame sequence → the loader's own <canvas> (the site's canvas element, so CSS cover-fit applies)
    let loaderClip = null;
    const startLoaderClip = (canvas) => {
      if (app.skipLoader) return;
      loaderClip = new FrameSequence(LOADER_VIDEO_FRAMES);
      const ctx = canvas.getContext("2d");
      loaderClip.onReady = (c) => { canvas.width = c.width; canvas.height = c.height };
      loaderClip.onFrame = (c) => { ctx.drawImage(c.canvas, 0, 0) };
      loaderClip.play();
    };
    onBeforeUnmount(() => { loaderClip && loaderClip.dispose() });
    onMounted(async () => {
      if (await nextTick(), app.skipLoader) {
        gsap.set(n.value, {
          display: "none"
        });
        return
      }
      l()
    });
    const l = () => {
      var d;
      const u = gsap.timeline({
          delay: uS
        }),
        h = .15,
        c = h * 2;
      u.to(i.value, {
        y: 0,
        rotate: 0,
        duration: 1,
        ease: "reveal"
      }, h * 0), u.to(r.value, {
        y: 0,
        rotate: 0,
        duration: 1,
        ease: "reveal"
      }, h * 1), u.to(o.value, {
        y: 0,
        rotate: 0,
        duration: 1,
        ease: "reveal"
      }, c), (d = a.value) == null || d.revealStaticSoundIndication(u, c)
    };
    return emitter.on(EVENTS.APP_LOADED, () => {
      if (t.value = !0, app.skipLoader) return;
      const u = gsap.timeline({
        delay: uS + u5
      });
      u.to(i.value, {
        transform: "translateY(-100%)",
        duration: .45,
        ease: "power2.out"
      }, 0), u.to(r.value, {
        transform: "translateY(-100%)",
        duration: .45,
        ease: "power2.out"
      }, 0), u.to(o.value, {
        transform: "translateY(-100%)",
        duration: .45,
        ease: "power2.out"
      }, 0), u.to(n.value, {
        opacity: 0,
        duration: .35,
        ease: "power2.out",
        onComplete: () => { loaderClip && loaderClip.dispose(); loaderClip = null }
      }, 0)
    }), (u, h) => (openBlock(), createElementBlock("div", {
      ref_key: "loaderBlockRef",
      ref: n,
      class: "loaderBlock"
    }, [createElementVNode("canvas", {
      class: "loaderBlock__video",
      "aria-hidden": "true",
      onVnodeMounted: ({ el }) => { startLoaderClip(el) }
    }), createElementVNode("div", { class: "loaderBlock__scrim", "aria-hidden": "true" }), createVNode(GridWrapper, {
      class: "loaderBlock__container"
    }, {
      default: withCtx(() => [createElementVNode("div", n5, [createElementVNode("h2", {
        ref_key: "titleRef",
        ref: i,
        class: "title__content"
      }, toDisplayString(s.title), 513)]), createElementVNode("div", i5, [createElementVNode("h3", {
        ref_key: "infosRef",
        ref: r,
        class: "infos__content"
      }, toDisplayString(s.infos), 513)]), createElementVNode("div", s5, [e.value ? (openBlock(), createBlock(CursorIndication, {
        key: 0,
        ref_key: "soundIndicationRef",
        ref: a,
        "cursor-indication": s.cursorIndication,
        "is-static": !0,
        class: "bottom__indication"
      }, null, 8, ["cursor-indication"])) : createCommentVNode("", !0), createElementVNode("div", r5, [createElementVNode("div", {
        ref_key: "progressRef",
        ref: o,
        class: "progress__content"
      }, [(openBlock(), createElementBlock("svg", o5, [h[0] || (h[0] = createElementVNode("circle", {
        class: "circle--inactive",
        opacity: "0.2",
        cx: "4",
        cy: "4",
        r: "3.25",
        stroke: "black",
        "stroke-width": "1"
      }, null, -1)), createElementVNode("g", a5, [createElementVNode("circle", l5, null, 512)])])), createElementVNode("p", c5, toDisplayString(s.progressText), 1)], 512)])])]),
      _: 1
    })], 512))
  }
};
