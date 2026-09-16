import {
  ShaderMaterial
} from 'three';
import {
  createShaderChunk
} from '../utils/shader-chunk.js';

const mediaFragmentShader = `precision highp float;

uniform float uTime;
uniform float uDragForce;
uniform float uParallaxProgress;
uniform float uParallaxX;
uniform float uDragScaleStrength;
uniform float uDragColorStrength;
uniform float uCoverBleed;
uniform vec2 uPlaneSizes;
uniform vec2 uTextureSizes;
uniform sampler2D uTexture;

varying vec2 vScreenSpace;
varying vec2 vUv;

void main() {

	vec2 ratio = vec2(min((uPlaneSizes.x / uPlaneSizes.y) / (uTextureSizes.x / uTextureSizes.y), 1.0), min((uPlaneSizes.y / uPlaneSizes.x) / (uTextureSizes.y / uTextureSizes.x), 1.0));

	vec2 uv = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);

	uv = (uv - 0.5) / uCoverBleed + 0.5;

	uv.x = uv.x * 2.0 - 1.0;
	uv.x = uv.x * 0.5 + 0.5;
	uv.y += uParallaxProgress * 0.085;
	uv.x += uParallaxX * 0.085;
	uv.y = 1.0 - uv.y;

	vec4 texture = texture2D(uTexture, uv);

	gl_FragColor = texture;
}`;

const mediaFragmentChunk = createShaderChunk(mediaFragmentShader, "fragmentShader");

const mediaVertexShader = `uniform float uTime;
uniform float uDragForce;
uniform float uDragScaleStrength;
uniform float uDragScaleStrengthZ;
uniform float scrollDeformationDirection;

varying vec2 vScreenSpace;
varying vec2 vUv;

void main() {

  vec4 tmpGlPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  vScreenSpace = (tmpGlPosition.xy) / tmpGlPosition.w;
  float dist = smoothstep(0., 5.5, length(vec2(vScreenSpace.x, position.y)));
  float worldSpaceDist = 1. - smoothstep(0., 3., length(vec2(position.x, vScreenSpace.y)));
  vUv = uv;

  vec3 transformedPositions = position.xyz;

  transformedPositions.z -= dist * uDragForce * uDragScaleStrengthZ;

  float speed = uTime * 0.001;

  vec3 transformedPosition = position.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformedPositions, 1.0);
}`;

const mediaVertexChunk = createShaderChunk(mediaVertexShader, "vertexShader");

export class MediaMaterial extends ShaderMaterial {
  constructor(e = {}) {
    super(e), mediaFragmentChunk.use(this), mediaVertexChunk.use(this)
  }
}
