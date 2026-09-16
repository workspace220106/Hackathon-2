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
uniform sampler2D uTexture;   // transition video (cover-fitted); uColor is only a fallback tint
uniform float uVideoAspect;
uniform float uHasTexture;

void main() {
	vec2 uv = vUv - 0.5;

	float aspect = uResolution.x / uResolution.y;
	uv.x *= aspect;

	float dist = length(uv);

	float mask = step(uTransition, dist);
	float strength = 1.0 - mask;

	// cover-fit the video into the screen without distortion
	vec2 scale = aspect > uVideoAspect ? vec2(1.0, uVideoAspect / aspect) : vec2(aspect / uVideoAspect, 1.0);
	vec3 video = texture2D(uTexture, (vUv - 0.5) * scale + 0.5).rgb;
	vec3 color = mix(uColor, video, uHasTexture);

	gl_FragColor = vec4(color, strength);
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
