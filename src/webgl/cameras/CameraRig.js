import {
  Object3D
} from 'three';
import {
  app
} from '../../core/App.js';
import {
  emitter
} from '../../core/events.js';
import {
  isTouch
} from '../../utils/device.js';
import {
  degToRad,
  lerp
} from '../../utils/math.js';

export class CameraRig extends Object3D {
  constructor() {
    super(), emitter.register(this), this._rotateForceX = .2, this._rotateForceY = .75, this._rotateCoef = 2, this._rotateTargetX = 0, this._rotateTargetY = 0, this._movementForceX = 4 * .1, this._movementForceY = 4 * .1, this._movementCoef = .1, this._movementTargetX = 0, this._movementTargetY = 0
  }
  onPointerMove({
    webgl: {
      x: e,
      y: t
    }
  }) {
    if (isTouch()) return;
    const n = this._rotateForceX,
      i = this._rotateForceY;
    this._rotateTargetX = degToRad(t * n), this._rotateTargetY = degToRad(-e * i)
  }
  onTick({
    dt: e
  }) {
    var t, n;
    (t = app.webgl) != null && t.isPlaygroundPageActive || !((n = app.webgl) != null && n.isHomeAboutGroupsRenderActive) || isTouch() || this.mouseMoveCamera(e)
  }
  mouseMoveCamera(e) {
    const t = this._rotateCoef,
      n = 1 - Math.exp(-t * e);
    this.rotation.x !== this._rotateTargetX && (this.rotation.x = lerp(this.rotation.x, this._rotateTargetX, n)), this.rotation.y !== this._rotateTargetY && (this.rotation.y = lerp(this.rotation.y, this._rotateTargetY, n))
  }
}
