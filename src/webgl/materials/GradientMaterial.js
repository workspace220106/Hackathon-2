import {
  ShaderMaterial
} from 'three';
import {
  createShaderChunk
} from '../utils/shader-chunk.js';

const gradientFragmentShader = `precision highp float;

uniform float uTime;
uniform vec3 uTopColor;
uniform vec3 uBottomColor;
uniform float uGradientSmoothMin;
uniform float uGradientSmoothMax;

varying vec2 vUv;

void main() {
	float dist = vUv.y;
	float gradientMix = smoothstep(uGradientSmoothMin, uGradientSmoothMax, dist);
	vec3 color = mix(uBottomColor, uTopColor, gradientMix);

	gl_FragColor = vec4(color, 1.0);
}`;

const gradientFragmentChunk = createShaderChunk(gradientFragmentShader, "fragmentShader");

const gradientVertexShader = `uniform float uTime;

varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);

}`;

const gradientVertexChunk = createShaderChunk(gradientVertexShader, "vertexShader");

export class GradientMaterial extends ShaderMaterial {
  constructor(e = {}) {
    super(e), gradientFragmentChunk.use(this), gradientVertexChunk.use(this)
  }
}
