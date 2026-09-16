import {
  __privateAdd,
  __privateGet,
  __privateMethod
} from '@/utils/private-fields.js';
import {
  BREAKPOINTS
} from '../../config/breakpoints.js';
import {
  throttle
} from '../../utils/throttle.js';
import {
  app
} from '../App.js';
import {
  EVENTS,
  emitter
} from '../events.js';

let Fp;

let Np;

let Gh;

let z_;

export class Viewport {
  constructor() {
    __privateAdd(this, Gh);
    __privateAdd(this, Fp, e => {
      if (e[0].contentBoxSize) {
        const t = Array.isArray(e[0].contentBoxSize) ? e[0].contentBoxSize[0] : e[0].contentBoxSize;
        this.width = t.inlineSize, this.height = t.blockSize
      } else this.width = e[0].contentRect.width, this.height = e[0].contentRect.height;
      __privateMethod(this, Gh, z_).call(this), emitter.emit(EVENTS.RESIZE, this.infos)
    });
    __privateAdd(this, Np, throttle(__privateGet(this, Fp), 200));
    emitter.register(this);
    const e = app.$wrapper.getBoundingClientRect();
    this.width = Math.min(window.innerWidth, e.width), this.height = e.height, __privateMethod(this, Gh, z_).call(this), this.isMobileAtLaunch = this.breakpoint === "mobile"
  }
  onAttach() {
    new ResizeObserver(__privateGet(this, Np)).observe(app.$wrapper)
  }
  get infos() {
    return {
      width: this.width,
      height: this.height,
      dpr: this.dpr,
      postDpr: this.postDpr,
      ratio: this.ratio,
      device: this.breakpoint
    }
  }
}

Fp = new WeakMap, Np = new WeakMap, Gh = new WeakSet, z_ = function () {
  this.dpr = Math.min(2, window.devicePixelRatio), this.postDpr = 2, this.ratio = this.width / this.height, this.breakpoint = window.innerWidth < BREAKPOINTS.tablet ? "mobile" : window.innerWidth < BREAKPOINTS.desktop ? "tablet" : "desktop"
};
