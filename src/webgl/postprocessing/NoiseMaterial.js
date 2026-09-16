import {
  ShaderMaterial
} from 'three';
import {
  isTabletWidth
} from '../../utils/device.js';
import {
  sharedUniforms
} from '../shared-uniforms.js';
import {
  createShaderChunk
} from '../utils/shader-chunk.js';

const noiseFragmentShader = `uniform sampler2D tDiffuse;
uniform float uNoiseStrength;
uniform float uTime;

varying vec2 vUv;

float hash21(vec2 p) {
	vec3 p3 = fract(vec3(p.xyx) * 0.1031);
	p3 += dot(p3, p3.yzx + 33.33);
	return fract((p3.x + p3.y) * p3.z);
}

void main() {
	vec4 render = texture2D(tDiffuse, vUv);

	if (uNoiseStrength > 0.0) {
		float noise = hash21(gl_FragCoord.xy + uTime * vec2(0.017, 0.013)) - 0.5;
		render.rgb += noise * uNoiseStrength;
	}

	gl_FragColor = render;
}`;

const noiseFragmentChunk = createShaderChunk(noiseFragmentShader, "fragmentShader");

const noiseVertexShader = `varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const noiseVertexChunk = createShaderChunk(noiseVertexShader, "vertexShader");

const NOISE_STRENGTH = .07;

export class NoiseMaterial extends ShaderMaterial {
  constructor(e = {}) {
    const t = {
      tDiffuse: {
        value: null
      },
      uNoiseStrength: {
        value: isTabletWidth() ? 0 : NOISE_STRENGTH
      },
      uTime: sharedUniforms.uTime,
      ...e.uniforms
    };
    super({
      uniforms: t,
      vertexShader: noiseVertexChunk,
      fragmentShader: noiseFragmentChunk,
      depthTest: !1,
      depthWrite: !1,
      ...e
    }), noiseFragmentChunk.use(this), noiseVertexChunk.use(this)
  }
}
