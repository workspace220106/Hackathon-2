import {
  GLSL3,
  ShaderMaterial
} from 'three';
import {
  createShaderChunk
} from '../utils/shader-chunk.js';

const cloudsFragmentShader = `precision highp float;

uniform float uTime;
uniform float uDeformationSpeedFactor;
uniform vec3 uTintColor;
uniform sampler2D uTextures[6];
uniform sampler2D uNoiseTexture;

flat in float vRandomTextureIndex;
flat in float vRandomTextureDirection;
in vec2 vUv;

out vec4 fragColor;

void main() {
	float time = -uTime * 0.00004 * uDeformationSpeedFactor;

	vec2 uv = vUv;
	uv.x -= time;

	vec4 noiseTexture = texture(uNoiseTexture, uv * 0.05);
	float cloudDeformation = noiseTexture.r * 0.04;

	vec2 baseUv = vRandomTextureDirection < 0.5 ? vUv : vec2(1.0 - vUv.x, vUv.y);
	vec2 textureUv = baseUv + cloudDeformation;

	
	vec2 uvDx = dFdx(baseUv);
	vec2 uvDy = dFdy(baseUv);

	vec4 randomTexture;
	int intRandomTextureIndex = int(vRandomTextureIndex);

	if(intRandomTextureIndex == 0) {
		randomTexture = textureGrad(uTextures[0], textureUv, uvDx, uvDy);
	} else if(intRandomTextureIndex == 1) {
		randomTexture = textureGrad(uTextures[1], textureUv, uvDx, uvDy);
	} else if(intRandomTextureIndex == 2) {
		randomTexture = textureGrad(uTextures[2], textureUv, uvDx, uvDy);
	} else if(intRandomTextureIndex == 3) {
		randomTexture = textureGrad(uTextures[3], textureUv, uvDx, uvDy);
	} else if(intRandomTextureIndex == 4) {
		randomTexture = textureGrad(uTextures[4], textureUv, uvDx, uvDy);
	} else if(intRandomTextureIndex == 5) {
		randomTexture = textureGrad(uTextures[5], textureUv, uvDx, uvDy);
	}

	fragColor = vec4(randomTexture.rgb * uTintColor, randomTexture.a);
}`;

const cloudsFragmentChunk = createShaderChunk(cloudsFragmentShader, "fragmentShader");

const cloudsVertexShader = `in float aRandomSpeed;
in float aRandomScale;
in float aRandomTextureIndex;
in float aRandomTextureDirection;
in vec3 aPositions;

uniform float uTime;
uniform float uRangeZ;
uniform float uTranslationSpeedFactor;

flat out float vRandomTextureIndex;
flat out float vRandomTextureDirection;
out vec2 vUv;

void main() {
  float time = -uTime * 0.0004 * aRandomSpeed * uTranslationSpeedFactor;

  vec3 transformedPositions = aPositions;

  transformedPositions.z += time;
  transformedPositions.z = mod(transformedPositions.z + uRangeZ, uRangeZ * 2.0) - uRangeZ;

  vec4 basePosition = vec4(position * aRandomScale, 0.);

  vec4 finalPositions = basePosition + vec4(transformedPositions, 1.);

  vec4 mv = modelViewMatrix * finalPositions;

  gl_Position = projectionMatrix * mv;

  vRandomTextureIndex = aRandomTextureIndex;
  vRandomTextureDirection = aRandomTextureDirection;
  vUv = uv;
}`;

const cloudsVertexChunk = createShaderChunk(cloudsVertexShader, "vertexShader");

export class CloudsMaterial extends ShaderMaterial {
  constructor(e = {}) {
    super({
      ...e,
      glslVersion: GLSL3
    }), cloudsFragmentChunk.use(this), cloudsVertexChunk.use(this)
  }
}
