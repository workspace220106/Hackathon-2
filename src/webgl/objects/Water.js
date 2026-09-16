import {
  FrontSide,
  HalfFloatType,
  Matrix4,
  Mesh,
  PerspectiveCamera,
  Plane,
  Vector3,
  Vector4,
  WebGLRenderTarget
} from 'three';
import {
  WaterMaterial
} from '../materials/WaterMaterial.js';

export class Water extends Mesh {
  constructor(e, t) {
    super(e), this._params = t;
    const n = this,
      i = new Plane,
      r = new Vector3,
      o = new Vector3,
      a = new Vector3,
      l = new Matrix4,
      u = new Vector3(0, 0, -1),
      h = new Vector4,
      c = new Vector3,
      d = new Vector3,
      f = new Vector4;
    this._textureMatrix = new Matrix4, this._updateInterval = t.updateInterval ?? 3, this._frameCounter = 0;
    const A = new PerspectiveCamera;
    this.renderTarget = new WebGLRenderTarget(this._params.textureWidth, this._params.textureWidth, {
      samples: this._params.multisample,
      type: HalfFloatType
    }), this.material = this._createMaterial(), this.onBeforeRender = function (m, g, p) {
      if (o.setFromMatrixPosition(n.matrixWorld), a.setFromMatrixPosition(p.matrixWorld), l.extractRotation(n.matrixWorld), r.set(0, 0, 1), r.applyMatrix4(l), c.subVectors(o, a), c.dot(r) > 0) return;
      c.reflect(r).negate(), c.add(o), l.extractRotation(p.matrixWorld), u.set(0, 0, -1), u.applyMatrix4(l), u.add(a), d.subVectors(o, u), d.reflect(r).negate(), d.add(o), A.position.copy(c), A.up.set(0, 1, 0), A.up.applyMatrix4(l), A.up.reflect(r), A.lookAt(d), A.far = p.far, A.updateMatrixWorld(), A.projectionMatrix.copy(p.projectionMatrix), this._textureMatrix.set(.5, 0, 0, .5, 0, .5, 0, .5, 0, 0, .5, .5, 0, 0, 0, 1), this._textureMatrix.multiply(A.projectionMatrix), this._textureMatrix.multiply(A.matrixWorldInverse), this._textureMatrix.multiply(n.matrixWorld), i.setFromNormalAndCoplanarPoint(r, o), i.applyMatrix4(A.matrixWorldInverse), h.set(i.normal.x, i.normal.y, i.normal.z, i.constant);
      const _ = A.projectionMatrix;
      if (f.x = (Math.sign(h.x) + _.elements[8]) / _.elements[0], f.y = (Math.sign(h.y) + _.elements[9]) / _.elements[5], f.z = -1, f.w = (1 + _.elements[10]) / _.elements[14], h.multiplyScalar(2 / h.dot(f)), _.elements[2] = h.x, _.elements[6] = h.y, _.elements[10] = h.z + 1 - this._params.clipBias, _.elements[14] = h.w, n._frameCounter++, n._frameCounter % n._updateInterval !== 0) return;
      n.visible = !1;
      const v = m.getRenderTarget(),
        y = m.xr.enabled,
        b = m.shadowMap.autoUpdate;
      m.xr.enabled = !1, m.shadowMap.autoUpdate = !1, m.setRenderTarget(this.renderTarget), m.state.buffers.depth.setMask(!0), m.autoClear === !1 && m.clear(), m.render(g, A), m.xr.enabled = y, m.shadowMap.autoUpdate = b, m.setRenderTarget(v);
      const S = p.viewport;
      S !== void 0 && m.state.viewport(S), n.visible = !0
    }, this.getRenderTarget = () => this.renderTarget, this.dispose = () => {
      this.renderTarget.dispose(), n.material.dispose()
    }
  }
  _createMaterial() {
    return new WaterMaterial({
      uniforms: {
        tDiffuse: {
          value: this.renderTarget.texture
        },
        tDeformation: {
          value: this._params.tDeformation
        },
        tNoise: {
          value: this._params.tNoise
        },
        tWaterShadow: {
          value: this._params.shadowTexture
        },
        uColor: {
          value: this._params.color
        },
        uTime: {
          value: 0
        },
        uTextureMatrix: {
          value: this._textureMatrix
        },
        uWaveStrength: {
          value: this._params.waveStrength
        },
        uWaveSpeed: {
          value: this._params.waveSpeed
        },
        uOpacity: {
          value: this._params.opacity
        },
        uContrast: {
          value: this._params.contrast ?? .72
        },
        uSaturation: {
          value: this._params.saturation ?? 1
        },
        uBrightness: {
          value: this._params.brightness ?? 1.22
        },
        uBlurRadius: {
          value: this._params.blurRadius ?? .239
        },
        uNoiseRepeat: {
          value: this._params.noiseRepeat ?? 40.3
        }
      },
      transparent: !0,
      side: FrontSide
    })
  }
  update(e) {
    this.material.uniforms.uTime.value = e
  }
}
