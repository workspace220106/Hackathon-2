import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  MathUtils,
  Mesh,
  Points
} from 'three';
import {
  ParticlesMaterial,
  particlesFragmentShaderAlt
} from '../materials/ParticlesMaterial.js';

const particlesSimpleVertexShader = `attribute float aScale;
attribute float aSpeed;
attribute float aOpacity;
attribute vec3 aPositions;

uniform float uTime;
uniform float uDisplacementSpeed;
uniform float uDeformationSpeed;
uniform float uScale;
uniform vec3 uArea;
uniform vec3 uDisplacement;
uniform vec3 uDeformationAmplitude;
uniform vec3 uDeformationFrequency;

varying float vRandomOpacity;
varying float vFade;
varying float vCameraFade;

void main() {
  float displacementSpeed = uTime * aSpeed * uDisplacementSpeed * 0.001;
  float life = mod(displacementSpeed + aOpacity, 1.0);

  vec3 particlePosition = position;

  particlePosition.x *= uArea.x;
  particlePosition.y *= uArea.y;
  particlePosition.z *= uArea.z;

  particlePosition.x += (life) * uDisplacement.x;
  particlePosition.y += (life) * uDisplacement.y;
  particlePosition.z += (life) * uDisplacement.z;

  particlePosition.x += sin(uTime * uDeformationSpeed * aSpeed + particlePosition.y * uDeformationFrequency.x) * uDeformationAmplitude.x;
  particlePosition.y += cos(uTime * uDeformationSpeed * aSpeed + particlePosition.x * uDeformationFrequency.y) * uDeformationAmplitude.y;
  particlePosition.z += cos(uTime * uDeformationSpeed * aSpeed + particlePosition.z * uDeformationFrequency.z) * uDeformationAmplitude.z;

  vec4 mv = modelViewMatrix * vec4(particlePosition, 1.0);
  gl_Position = projectionMatrix * mv;

  vRandomOpacity = aOpacity;
  vFade = life;
  vCameraFade = 1.0 - smoothstep(0.45, 0.55, min(10., (10. / length(mv.xyz))));

  gl_PointSize = 10.0 * aScale * uScale;
}`;

export class ParticlesSimple extends Mesh {
  constructor(e) {
    super(), this._params = e, this._attributes = this._setAttributes(), this._geometry = this._createGeometry(), this._material = this._createMaterial(), this._mesh = this._createMesh()
  }
  _setAttributes() {
    const e = new Float32Array(this._params.particleCount * 3),
      t = new Float32Array(this._params.particleCount * 1),
      n = new Float32Array(this._params.particleCount * 1),
      i = new Float32Array(this._params.particleCount * 1);
    for (let r = 0; r < this._params.particleCount; r++) e[r * 3 + 0] = MathUtils.randFloatSpread(50), e[r * 3 + 1] = MathUtils.randFloatSpread(50), e[r * 3 + 2] = MathUtils.randFloatSpread(50), t[r + 0] = MathUtils.randFloat(.15, 1), n[r + 0] = MathUtils.randFloat(1, 4), i[r + 0] = MathUtils.randFloat(.2, 1);
    return {
      positions: e,
      scale: t,
      speed: n,
      opacity: i
    }
  }
  _createGeometry() {
    const e = new BufferGeometry;
    return e.setAttribute("position", new Float32BufferAttribute(this._attributes.positions, 3)), e.setAttribute("aScale", new Float32BufferAttribute(this._attributes.scale, 1)), e.setAttribute("aSpeed", new Float32BufferAttribute(this._attributes.speed, 1)), e.setAttribute("aOpacity", new Float32BufferAttribute(this._attributes.opacity, 1)), e
  }
  _createMaterial() {
    return new ParticlesMaterial({
      vertexShader: particlesSimpleVertexShader,
      fragmentShader: particlesFragmentShaderAlt,
      uniforms: {
        uTime: {
          value: null
        },
        uArea: {
          value: this._params.area
        },
        uDisplacement: {
          value: this._params.displacement
        },
        uDisplacementSpeed: {
          value: this._params.displacementSpeed
        },
        uDeformationAmplitude: {
          value: this._params.deformationAmplitude
        },
        uDeformationFrequency: {
          value: this._params.deformationFrequency
        },
        uDeformationSpeed: {
          value: this._params.deformationSpeed
        },
        uScale: {
          value: this._params.scale
        },
        uOpacity: {
          value: this._params.opacity
        },
        uColor: {
          value: this._params.color
        }
      },
      transparent: !0,
      side: DoubleSide,
      depthWrite: !1
    })
  }
  _createMesh() {
    const e = new Points(this._geometry, this._material);
    return this.add(e), e.frustumCulled = !1, e
  }
  render(e, t) {
    this._material.uniforms.uTime.value = e
  }
}
