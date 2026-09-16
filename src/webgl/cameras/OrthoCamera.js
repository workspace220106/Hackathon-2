import {
  OrthographicCamera
} from 'three';
import {
  emitter
} from '../../core/events.js';

export class OrthoCamera extends OrthographicCamera {
  constructor() {
    super(-1, 1, 1, -1, .1, 1), emitter.register(this), this.position.z = 1
  }
  onAttach() {}
  onTick({
    _dt: e
  }) {}
  onResize({
    _ratio: e
  }) {
    this.left = -1, this.right = 1, this.top = 1, this.bottom = -1, this.updateProjectionMatrix()
  }
}
