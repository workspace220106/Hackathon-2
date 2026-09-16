import {
  PerspectiveCamera
} from 'three';
import {
  app
} from '../../core/App.js';
import {
  emitter
} from '../../core/events.js';

export class ScrollCamera extends PerspectiveCamera {
  constructor() {
    super(75, app.tools.viewport.ratio, 1e3, 3500), emitter.register(this), this._cameraPositionZ = 2e3, this.position.z = this._cameraPositionZ
  }
  onAttach() {}
  onTick({
    dt: e
  }) {
    app.lenis && (this.position.y = -window.scrollY)
  }
  onResize({
    ratio: e,
    width: t,
    height: n
  }) {
    this.aspect = e, this.fov = 2 * Math.atan(n / 2 / this._cameraPositionZ) * (180 / Math.PI), this.updateProjectionMatrix()
  }
}
