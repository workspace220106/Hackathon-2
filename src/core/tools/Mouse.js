import {
  __privateAdd,
  __privateGet,
  __privateSet
} from '@/utils/private-fields.js';
import {
  Vector2
} from 'three';
import {
  app
} from '../App.js';
import {
  EVENTS,
  emitter
} from '../events.js';

let Ua;

let kh;

let Uh;

let Dp;

let Lp;

let Pp;

let Op;

let Qw;

export let Mouse = (Qw = class {
  constructor() {
    __privateAdd(this, Ua);
    __privateAdd(this, kh, e => {
      var t;
      if (this.isTouch ? e.touches && e.touches.length > 0 && this.updateCoordinate(e.touches[0].clientX, e.touches[0].clientY) : this.updateCoordinate(e.clientX, e.clientY), emitter.emit(EVENTS.POINTER_MOVE, this.coordinates), ((t = e.touches) == null ? void 0 : t.length) === 2 && __privateGet(this, Ua)) {
        const n = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        emitter.emit(EVENTS.PINCH, n - __privateGet(this, Ua)), __privateSet(this, Ua, n)
      }
      this.isDown && (this.isDragging = !0, emitter.emit(EVENTS.DRAG, new Vector2().subVectors(this.coordinates.webgl, this.previousCoordinates.webgl)))
    });
    __privateAdd(this, Uh, () => {
      this.isDown && (this.previousCoordinates.webgl.copy(this.coordinates.webgl), this.previousCoordinates.dom.copy(this.coordinates.dom), this.isDown = !1, this.isDragging && (this.isDragging = !1, emitter.emit(EVENTS.DRAG_END, this.coordinates)), emitter.emit(EVENTS.POINTER_UP, this.coordinates))
    });
    __privateAdd(this, Dp, e => {
      if (!this.isDown) {
        switch (e.pointerType) {
          case "mouse":
            this.isTouch = !1;
            break;
          case "touch":
            this.isTouch = !0;
            break;
          case "pen":
            this.isTouch = !0;
            break
        }
        this.updateCoordinate(e.clientX, e.clientY), this.isDown = !0, emitter.emit(EVENTS.POINTER_DOWN, this.coordinates)
      }
    });
    __privateAdd(this, Lp, () => {
      this.isTouch || (this.isDown = !1, emitter.emit(EVENTS.POINTER_UP, this.coordinates))
    });
    __privateAdd(this, Pp, e => {
      var t;
      ((t = e.touches) == null ? void 0 : t.length) === 2 && __privateSet(this, Ua, Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY))
    });
    __privateAdd(this, Op, e => {
      emitter.emit(EVENTS.WHEEL, e.deltaY)
    });
    emitter.register(this), this.isTouch = !!(window.matchMedia("(pointer: coarse)").matches || typeof window.ontouchstart == "function" || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0), this.isDown = !1, this.isDragging = !1
  }
  onAttach() {
    this.coordinates = {
      webgl: new Vector2,
      dom: new Vector2(app.tools.viewport.width * .5, app.tools.viewport.height * .5)
    }, this.previousCoordinates = {
      webgl: this.coordinates.webgl.clone(),
      dom: this.coordinates.dom.clone()
    }, window.addEventListener("mousemove", __privateGet(this, kh)), window.addEventListener("touchmove", __privateGet(this, kh), {
      passive: !0
    }), window.addEventListener("pointerdown", __privateGet(this, Dp)), window.addEventListener("touchstart", __privateGet(this, Pp), {
      passive: !0
    }), window.addEventListener("wheel", __privateGet(this, Op), {
      passive: !0
    }), window.addEventListener("mouseup", __privateGet(this, Uh)), window.addEventListener("touchend", __privateGet(this, Uh)), window.addEventListener("pointerleave", __privateGet(this, Lp))
  }
  updateCoordinate(e, t) {
    this.previousCoordinates.dom.copy(this.coordinates.dom), this.previousCoordinates.webgl.copy(this.coordinates.webgl), this.coordinates.webgl.set(e / app.tools.viewport.width * 2 - 1, -(t / app.tools.viewport.height) * 2 + 1), this.coordinates.dom.set(e, t)
  }
}, Ua = new WeakMap, kh = new WeakMap, Uh = new WeakMap, Dp = new WeakMap, Lp = new WeakMap, Pp = new WeakMap, Op = new WeakMap, Qw);
