import {
  GLSL3,
  ShaderMaterial,
  Vector2
} from 'three';
import {
  createShaderChunk
} from '../utils/shader-chunk.js';

const envFragmentShader = `precision highp float;

vec4 sampleTexelMaxCross(sampler2D tex, vec2 uv, vec2 resolution) {
	ivec2 maxCoord = ivec2(resolution) - ivec2(1);
	ivec2 coord = ivec2(uv * resolution);
	coord = clamp(coord, ivec2(0), maxCoord);

	vec4 result = texelFetch(tex, coord, 0);
	result = max(result, texelFetch(tex, clamp(coord + ivec2(1, 0), ivec2(0), maxCoord), 0));
	result = max(result, texelFetch(tex, clamp(coord + ivec2(-1, 0), ivec2(0), maxCoord), 0));
	result = max(result, texelFetch(tex, clamp(coord + ivec2(0, 1), ivec2(0), maxCoord), 0));
	result = max(result, texelFetch(tex, clamp(coord + ivec2(0, -1), ivec2(0), maxCoord), 0));

	return result;
}
#ifndef PI
	#define PI 3.14159265358
#endif
#ifndef TAU
	#define TAU 6.28318530718
#endif
#ifndef BLUR_ITERATIONS
	#define BLUR_ITERATIONS 10
#endif

highp float hashBlurRand(const in vec2 uv) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot(uv.xy, vec2(a, b)), sn = mod(dt, PI);
	return fract(sin(sn) * c);
}

vec2 hashBlurMult(inout vec2 r) {
	r = fract(r * vec2(12.9898, 78.233));
	return sqrt(r.x + 0.001) * vec2(sin(r.y * TAU), cos(r.y * TAU));
}

vec3 hashBlurTexture(sampler2D tex, vec2 uv, float radius, float aspect, vec2 offset) {
	vec2 circle = vec2(radius);
	circle.x *= aspect;
	vec2 rnd = vec2(hashBlurRand(uv + offset));

	vec3 acc = vec3(0.0);
	for (int i = 0; i < BLUR_ITERATIONS; i++) {
		acc += texture(tex, uv + circle * hashBlurMult(rnd)).rgb;
	}

	return acc / float(BLUR_ITERATIONS);
}

in vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uTextureResolution;
uniform float uBlurRadius;

out vec4 fragColor;

vec4 sampleBaseColor() {
	#if defined(USE_TEXEL_MAX_CROSS)
		return sampleTexelMaxCross(uTexture, vUv, uTextureResolution);
	#else
		return texture(uTexture, vUv);
	#endif
}

void main() {
	vec4 texColor = sampleBaseColor();

	#ifndef USE_HASH_BLUR
		fragColor = texColor;
	#else
		if (uBlurRadius <= 0.0) {
			fragColor = texColor;
		} else {
			float radius = uBlurRadius / uTextureResolution.x;
			float aspect = uTextureResolution.x / uTextureResolution.y;
			vec3 blurred = hashBlurTexture(uTexture, vUv, radius, aspect, vec2(0.0));
			fragColor = vec4(blurred, texColor.a);
		}
	#endif
}`;

const envFragmentChunk = createShaderChunk(envFragmentShader, "fragmentShader");

const envVertexShader = `out vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const envVertexChunk = createShaderChunk(envVertexShader, "vertexShader");

export class EnvTextureMaterial extends ShaderMaterial {
  constructor(e = {}) {
    const t = {
      uTexture: {
        value: null
      },
      uTextureResolution: {
        value: new Vector2(1, 1)
      },
      uBlurRadius: {
        value: 0
      },
      ...e.uniforms
    };
    super({
      ...e,
      uniforms: t,
      glslVersion: GLSL3,
      defines: {
        ...e.defines
      }
    }), envFragmentChunk.use(this), envVertexChunk.use(this)
  }
}
