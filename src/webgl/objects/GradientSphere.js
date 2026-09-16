import {
  BackSide,
  Color,
  LinearSRGBColorSpace,
  Mesh,
  SphereGeometry
} from 'three';
import {
  GradientMaterial
} from '../materials/GradientMaterial.js';
import {
  sharedUniforms
} from '../shared-uniforms.js';

export class GradientSphere extends Mesh {
  constructor({
    topColor: e = 11846347,
    bottomColor: t = 12763054,
    gradientSmoothMin: n = 0,
    gradientSmoothMax: i = 1
  } = {}) {
    super(), this._topColor = e, this._bottomColor = t, this._gradientSmoothMin = n, this._gradientSmoothMax = i, this.geometry = this._createGeometry(), this.material = this._createMaterial()
  }
  _createGeometry() {
    return new SphereGeometry(1, 16, 16)
  }
  _createMaterial() {
    return new GradientMaterial({
      uniforms: {
        uTime: sharedUniforms.uTime,
        uTopColor: {
          value: new Color().setHex(this._topColor, LinearSRGBColorSpace)
        },
        uBottomColor: {
          value: new Color().setHex(this._bottomColor, LinearSRGBColorSpace)
        },
        uGradientSmoothMin: {
          value: this._gradientSmoothMin
        },
        uGradientSmoothMax: {
          value: this._gradientSmoothMax
        }
      },
      side: BackSide,
      depthWrite: !1
    })
  }
}
