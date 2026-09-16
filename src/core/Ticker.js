import {
  __privateAdd,
  __privateGet,
  __privateSet,
  __publicField
} from '@/utils/private-fields.js';
import {
  EVENTS,
  emitter
} from './events.js';

let fc;

let Nh;

export class Ticker {
  constructor() {
    __privateAdd(this, fc, !1);
    __publicField(this, "play", () => {
      __privateSet(this, fc, !0), __privateGet(this, Nh).call(this)
    });
    __publicField(this, "pause", () => {
      __privateSet(this, fc, !1)
    });
    __privateAdd(this, Nh, () => {
      if (!__privateGet(this, fc)) return;
      window.requestAnimationFrame(__privateGet(this, Nh));
      const e = Date.now();
      this.delta = e - this.current, this.elapsed += this.delta, this.current = e, this.delta > 60 && (this.delta = 60), this.params.et = this.elapsed, this.params.dt = this.delta * .001, emitter.emit(EVENTS.TICK, this.params), emitter.emit(EVENTS.RENDER, this.params)
    });
    emitter.register(this), this.current = Date.now(), this.elapsed = 0, this.delta = 16, this.params = {
      et: 0,
      dt: 0
    }
  }
  onAttach() {
    this.play()
  }
}

fc = new WeakMap, Nh = new WeakMap;
