import {
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  MathUtils,
  Mesh,
  PlaneGeometry,
  RepeatWrapping
} from 'three';
import {
  app
} from '../../core/App.js';
import {
  CloudsMaterial
} from '../materials/CloudsMaterial.js';
import {
  setLinearFilters
} from '../utils/texture-settings.js';

export class Clouds extends Mesh {
  constructor(e) {
    super(), this._params = e, this._texturesName = ["cloud1", "cloud2", "cloud3", "cloud4", "cloud5", "cloud6"], this._textures = [], this._createInstancesClouds()
  }
  _createInstancesClouds() {
    const e = new PlaneGeometry(1, 1, 1, 1);
    e.rotateY(Math.PI * .5);
    const t = new InstancedBufferGeometry;
    t.index = e.index, t.attributes.position = e.attributes.position, t.attributes.uv = e.attributes.uv;
    const n = new Float32Array(this._params.count * 3),
      i = new Float32Array(this._params.count * 1),
      r = new Float32Array(this._params.count * 1),
      o = new Float32Array(this._params.count * 1),
      a = new Float32Array(this._params.count * 1);
    this._texturesName.forEach(h => {
      const c = app.core.assetsManager.get(`${h}`);
      setLinearFilters(c), c.generateMipmaps = !1, c.needsUpdate = !0, this._textures.push(c)
    });
    const l = app.core.assetsManager.get("noise");
    l && (setLinearFilters(l), l.generateMipmaps = !1, l.wrapS = RepeatWrapping, l.wrapT = RepeatWrapping, l.needsUpdate = !0);
    const u = new CloudsMaterial({
      uniforms: {
        uTime: {
          value: 0
        },
        uRangeZ: {
          value: this._params.rangeZ
        },
        uTranslationSpeedFactor: {
          value: this._params.translationSpeedFactor ?? 1
        },
        uDeformationSpeedFactor: {
          value: this._params.deformationSpeedFactor ?? 1
        },
        uTextures: {
          value: this._textures
        },
        uNoiseTexture: {
          value: app.core.assetsManager.get("noise")
        },
        uTintColor: {
          value: this._params.tintColor
        }
      },
      transparent: !0,
      depthWrite: !1
    });
    for (let h = 0; h < this._params.count; h++) {
      const c = h * 3,
        d = h % 2;
      n[c + 0] = Math.random() * this._params.rangeX - this._params.rangeX * .5, n[c + 1] = Math.random() * this._params.rangeY - this._params.rangeY * .5, n[c + 2] = MathUtils.randFloat(-this._params.rangeZ, this._params.rangeZ), i[h] = Math.random() * .5 + .5, r[h] = this._params.randomScale, o[h] = Number((Math.random() * (this._textures.length - 1)).toFixed(0)), a[h] = d
    }
    t.setAttribute("aPositions", new InstancedBufferAttribute(n, 3, !1)), t.setAttribute("aRandomSpeed", new InstancedBufferAttribute(i, 1, !1)), t.setAttribute("aRandomScale", new InstancedBufferAttribute(r, 1, !1)), t.setAttribute("aRandomTextureIndex", new InstancedBufferAttribute(o, 1, !1)), t.setAttribute("aRandomTextureDirection", new InstancedBufferAttribute(a, 1, !1)), this.geometry = t, this.material = u, this.frustumCulled = !1
  }
  render(e, t) {
    this.material.uniforms.uTime.value = e
  }
}
