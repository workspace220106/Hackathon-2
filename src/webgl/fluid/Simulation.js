import {
  FloatType,
  HalfFloatType,
  Vector2,
  WebGLRenderTarget
} from 'three';
import {
  Advection
} from './Advection.js';
import {
  Divergence
} from './Divergence.js';
import {
  ExternalForce
} from './ExternalForce.js';
import {
  fluidMouse
} from './Mouse.js';
import {
  Poisson
} from './Poisson.js';
import {
  Pressure
} from './Pressure.js';
import {
  Viscous
} from './Viscous.js';

const FLUID_REFERENCE_WIDTH = 1440;

const FLUID_MIN_DT = 1 / 120;

const FLUID_MAX_DT = 1 / 60;

const FLUID_MAX_STEPS = 8;

export class FluidSimulation {
  constructor() {
    this.fbos = {
      vel_0: null,
      vel_1: null,
      vel_viscous0: null,
      vel_viscous1: null,
      div: null,
      pressure_0: null,
      pressure_1: null
    }, this.options = {
      iterations_poisson: 1,
      iterations_viscous: 0,
      mouse_force: 80,
      resolution: .2,
      cursor_size: 40,
      viscous: 0,
      isBounce: !1,
      dt: .015,
      deltaFactor: 1.75,
      dissipation: .98,
      isViscous: !1,
      BFECC: !1
    }, this.fboSize = new Vector2, this.cellScale = new Vector2, this.boundarySpace = new Vector2, this._simAccumulator = 0, this._mouseDiffAccum = new Vector2, this.init()
  }
  init() {
    this.createAllFBO(), this.createShaderPass()
  }
  createAllFBO() {
    const e = /(iPad|iPhone|iPod)/g.test(navigator.userAgent) ? HalfFloatType : FloatType;
    for (const t in this.fbos) this.fbos[t] = new WebGLRenderTarget(this.fboSize.x, this.fboSize.y, {
      type: e
    })
  }
  createShaderPass() {
    this.advection = new Advection({
      cellScale: this.cellScale,
      fboSize: this.fboSize,
      dt: this.options.dt,
      src: this.fbos.vel_0,
      dst: this.fbos.vel_1
    }), this.externalForce = new ExternalForce({
      cellScale: this.cellScale,
      cursor_size: this.options.cursor_size,
      dst: this.fbos.vel_1
    }), this.viscous = new Viscous({
      cellScale: this.cellScale,
      boundarySpace: this.boundarySpace,
      viscous: this.options.viscous,
      src: this.fbos.vel_1,
      dst: this.fbos.vel_viscous1,
      dst_: this.fbos.vel_viscous0,
      dt: this.options.dt
    }), this.divergence = new Divergence({
      cellScale: this.cellScale,
      boundarySpace: this.boundarySpace,
      src: this.fbos.vel_viscous0,
      dst: this.fbos.div,
      dt: this.options.dt
    }), this.poisson = new Poisson({
      cellScale: this.cellScale,
      boundarySpace: this.boundarySpace,
      src: this.fbos.div,
      dst: this.fbos.pressure_1,
      dst_: this.fbos.pressure_0
    }), this.pressure = new Pressure({
      cellScale: this.cellScale,
      boundarySpace: this.boundarySpace,
      src_p: this.fbos.pressure_0,
      src_v: this.fbos.vel_viscous0,
      dst: this.fbos.vel_0,
      dt: this.options.dt
    })
  }
  calcSize(e, t) {
    const n = 1 / e,
      i = 1 / t;
    this.cellScale.set(n, i), this.fboSize.set(e, t)
  }
  resize(e, t) {
    const n = this.options.resolution,
      i = Math.floor(e * n),
      r = Math.floor(t * n);
    this.calcSize(i, r);
    for (const o in this.fbos) this.fbos[o].setSize(this.fboSize.x, this.fboSize.y)
  }
  getEffectiveCursorSize() {
    const e = Math.floor(FLUID_REFERENCE_WIDTH * this.options.resolution);
    return !e || !this.fboSize.x ? this.options.cursor_size : this.options.cursor_size * (this.fboSize.x / e)
  }
  update(e = FLUID_MAX_DT) {
    const t = Math.min(Math.max(e, 0), .06666666666666667);
    this._mouseDiffAccum.add(fluidMouse.diff), this._simAccumulator += t;
    let n = 0;
    for (; this._simAccumulator >= FLUID_MIN_DT && n < FLUID_MAX_STEPS;) this._simAccumulator -= FLUID_MIN_DT, n++;
    if (n === 0) return;
    const i = 1 / n;
    for (let r = 0; r < n; r++) this._runSimulationStep(i);
    this._mouseDiffAccum.set(0, 0)
  }
  _runSimulationStep(e = 1) {
    this.options.isBounce ? this.boundarySpace.set(0, 0) : this.boundarySpace.copy(this.cellScale);
    const t = .5 * this.options.deltaFactor,
      n = this.options.dt * t,
      i = Math.pow(this.options.dissipation, t);
    this.advection.update({
      ...this.options,
      dt: n,
      dissipation: i
    }), this.externalForce.update({
      cursor_size: this.getEffectiveCursorSize(),
      mouse_force: this.options.mouse_force * this.options.deltaFactor,
      cellScale: this.cellScale,
      mouseDiff: this._mouseDiffAccum,
      mouseDiffShare: e
    });
    let r = this.fbos.vel_1;
    this.options.isViscous && (r = this.viscous.update({
      viscous: this.options.viscous,
      iterations: this.options.iterations_viscous,
      dt: n
    })), this.divergence.update({
      vel: r
    });
    const o = this.poisson.update({
      iterations: this.options.iterations_poisson
    });
    this.pressure.update({
      vel: r,
      pressure: o,
      dt: n
    })
  }
  reset() {
    this._simAccumulator = 0, this._mouseDiffAccum.set(0, 0), this.createShaderPass()
  }
}
