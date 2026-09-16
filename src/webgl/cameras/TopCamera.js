import {
  PerspectiveCamera
} from 'three';
import {
  app
} from '../../core/App.js';
import {
  emitter
} from '../../core/events.js';
import {
  mapRange
} from '../../utils/map-range.js';
import {
  cW
} from '../bee/playground-bee-layout.js';

export class TopCamera extends PerspectiveCamera {
  constructor() {
    super(45, app.tools.viewport.ratio, .01, 300), emitter.register(this), this.position.z = 5, this.dimensions = this._calculateDimensions(this, this.position.z)
  }
  onAttach() {}
  _calculateDimensions(e, t) {
    const n = e.fov * Math.PI / 180,
      i = 2 * t * Math.tan(n / 2);
    return {
      width: i * e.aspect,
      height: i
    }
  }
  _computeSectionCameraY(e, t, n) {
    const r = t + n / 2 - window.innerHeight / 2;
    return -mapRange(e, [r - n / 2, r + n / 2], [-1, 1]) * this.dimensions.height / 2
  }
  setScrollPositions(e, t) {
    return this.position.y = this._computeSectionCameraY(e, t.y, t.height), this.position.y
  }
  setContentBeeScrollPosition(e, t) {
    const n = app.playgroundFooterBeeStart || 1 / 0,
      i = cW(e, t, this.dimensions.height, n);
    return i ? (this.position.y = i.cameraY, i.cameraY) : this.position.y
  }
  onTick({
    dt: e
  }) {}
  onResize({
    ratio: e
  }) {
    this.aspect = e, this.updateProjectionMatrix(), this.dimensions = this._calculateDimensions(this, this.position.z)
  }
}
