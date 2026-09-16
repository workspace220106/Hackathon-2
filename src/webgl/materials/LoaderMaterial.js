import {
  ShaderMaterial
} from 'three';
import {
  createShaderChunk
} from '../utils/shader-chunk.js';

const loaderFragmentShader = `varying vec2 vUv;

uniform float uGlobalProgress;
uniform float uScaleProgress;
uniform float uFinalProgress;
uniform vec2 uResolution;
uniform vec3 uColor;

float box(vec2 position, vec2 halfSize, float cornerRadius) {
   position = abs(position) - halfSize + cornerRadius;
   return length(max(position, 0.0)) + min(max(position.x, position.y), 0.0) - cornerRadius;
}

vec3 rotateX(vec3 p, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}

vec3 rotateZ(vec3 p, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z);
}

void main() {
	vec2 uv = vUv - 0.5;

	float aspect = uResolution.x / uResolution.y;

	float verticalOffset = -0.13;

	float firstOffsetProgressY = mix(1., verticalOffset, uGlobalProgress);
	float lastOffsetProgressY = mix(verticalOffset, 0.0, uFinalProgress);

	float finalOffsetProgressY = mix(firstOffsetProgressY, lastOffsetProgressY, uFinalProgress);

	float lastOffsetProgressX = mix(0.0, 0.0, uFinalProgress);

	float firstOffsetProgressX = mix(0.0, 0.0, uGlobalProgress);

	vec2 pos2D = uv + vec2(firstOffsetProgressX, finalOffsetProgressY);
	
	vec3 pos3D = vec3(pos2D, 0.0);

	float PI = 3.1415926535897932384626433832795;

	float rotateProgressZ = mix(-PI * 0.3, 0.0, uGlobalProgress);
	float rotateProgressX = mix(-PI * 0.4, 0.0, uGlobalProgress);

	vec3 rotated = rotateZ(pos3D, rotateProgressZ);
	rotated = rotateX(rotated, rotateProgressX);

	float perspective = 2.0;
	float z = max(rotated.z + perspective, 1.0);
	vec2 projected = rotated.xy / z * perspective;

	projected.x *= aspect;

	float firstEndScale = 0.5;
	float firstScaleRatio = 1.0 / 2.0;

	float firstScaleProgress = mix(0.0, firstEndScale, uScaleProgress);

	float firstHalfSize = firstScaleProgress * firstScaleRatio;
	vec2 firstBoxScale = vec2(firstHalfSize, firstHalfSize);

	float lastEndScale = max(0.95, 0.5 * max(aspect, 1.0) * 1.02);
	float finalScaleRatio = 1.0;
	float lastHalfSize = lastEndScale * finalScaleRatio;
	vec2 lastBoxScale = vec2(lastHalfSize, lastHalfSize);

	vec2 finalBoxScale = mix(firstBoxScale, lastBoxScale, uFinalProgress);

	float cornerRadius = 0.05;
	
	float sdf = box(projected, finalBoxScale, cornerRadius);

	float mask = step(0.0, sdf);

	gl_FragColor = vec4(uColor, mask);
}`;

const loaderFragmentChunk = createShaderChunk(loaderFragmentShader, "fragmentShader");

const loaderVertexShader = `varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const loaderVertexChunk = createShaderChunk(loaderVertexShader, "vertexShader");

export class LoaderMaterial extends ShaderMaterial {
  constructor(e = {}) {
    super(e), loaderFragmentChunk.use(this), loaderVertexChunk.use(this)
  }
}
