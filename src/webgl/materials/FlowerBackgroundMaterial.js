import {
  ShaderMaterial
} from 'three';
import {
  createShaderChunk
} from '../utils/shader-chunk.js';

const flowerBgFragmentShader = `varying vec2 vUv;

uniform float uTransition;
uniform vec2 uResolution;
uniform vec3 uColor;

void main() {
	vec2 uv = vUv - 0.5;

	float aspect = uResolution.x / uResolution.y;
	uv.x *= aspect;

	float dist = length(uv);

	float mask = step(uTransition, dist);
	float strength = 1.0 - mask;

	gl_FragColor = vec4(uColor, strength);
}`;

const flowerBgFragmentChunk = createShaderChunk(flowerBgFragmentShader, "fragmentShader");

const flowerBgVertexShader = `varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const flowerBgVertexChunk = createShaderChunk(flowerBgVertexShader, "vertexShader");

export class FlowerBackgroundMaterial extends ShaderMaterial {
  constructor(e = {}) {
    super(e), flowerBgFragmentChunk.use(this), flowerBgVertexChunk.use(this)
  }
}
