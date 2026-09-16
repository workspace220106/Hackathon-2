import {
  ShaderMaterial
} from 'three';
import {
  createShaderChunk
} from '../utils/shader-chunk.js';

const waterFragmentShader = `uniform float uTime;
uniform float uWaveStrength;
uniform float uWaveSpeed;
uniform float uOpacity;
uniform vec3 uColor;
uniform float uContrast;
uniform float uSaturation;
uniform float uBrightness;
uniform float uBlurRadius;
uniform float uNoiseRepeat;
uniform sampler2D tDiffuse;
uniform sampler2D tDeformation;
uniform sampler2D tNoise;
uniform sampler2D tWaterShadow;

varying vec2 vUv;
varying vec4 vUvRefraction;

#include <logdepthbuf_pars_fragment>

#define PI 3.14159265358
#define TAU 6.28318530718
#define BLUR_ITERATIONS 10

vec3 contrastSaturationBrightness(vec3 color, float con, float sat, float brt) {
	const float AvgLumR = 0.5;
	const float AvgLumG = 0.5;
	const float AvgLumB = 0.5;

	const vec3 LumCoeff = vec3(0.2125, 0.7154, 0.0721);

	vec3 AvgLumin = vec3(AvgLumR, AvgLumG, AvgLumB);
	vec3 brtColor = color * brt;
	vec3 intensity = vec3(dot(brtColor, LumCoeff));
	vec3 satColor = mix(intensity, brtColor, sat);
	vec3 conColor = mix(AvgLumin, satColor, con);

	return conColor;
}

highp float rand(const in vec2 uv) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot(uv.xy, vec2(a, b)), sn = mod(dt, PI);
	return fract(sin(sn) * c);
}

vec2 mult(inout vec2 r) {
	r = fract(r * vec2(12.9898, 78.233));
	return sqrt(r.x + 0.001) * vec2(sin(r.y * TAU), cos(r.y * TAU));
}

vec3 hashBlurTexture(sampler2D tex, vec4 uv, float radius, float aspect, vec2 offset) {
	vec2 circle = vec2(radius);
	circle.x *= aspect;
	vec2 rnd = vec2(rand(vec2(uv.xy + offset)));

	vec3 acc = vec3(0.0);
	for (int i = 0; i < BLUR_ITERATIONS; i++) {
		acc += texture2DProj(tex, uv + vec4(vec2(circle * mult(rnd)), 0.0, 0.0)).xyz;
	}

	return acc / float(BLUR_ITERATIONS);
}

float blendOverlay(float base, float blend) {
	return (base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
	return vec3(blendOverlay(base.r, blend.r), blendOverlay(base.g, blend.g), blendOverlay(base.b, blend.b));
}

void main() {
	#include <logdepthbuf_fragment>

	float texRepeat = 10.0;

	vec2 distortedUv = texture2D(tDeformation, vec2(vUv.x * texRepeat + (uTime * uWaveSpeed * 0.0001), vUv.y * texRepeat + (uTime * uWaveSpeed * 0.0001))).rg * uWaveStrength;
	distortedUv = vUv.xy + vec2(distortedUv.x, distortedUv.y + uTime * uWaveSpeed * 0.0001);
	vec2 distortion = (texture2D(tDeformation, distortedUv).rg * 2.0 - 1.0) * uWaveStrength;

	vec4 fullReflect = vec4(vUvRefraction);
	fullReflect.xy += distortion;

	float noiseValue = texture2D(tNoise, vUv * uNoiseRepeat).r;

	vec3 reflect;
	if (uBlurRadius <= 0.0) {
		reflect = texture2DProj(tDiffuse, fullReflect).rgb;
	} else {
		float blurRadius = uBlurRadius * noiseValue;
		reflect = hashBlurTexture(tDiffuse, fullReflect, blurRadius, 1.0, vec2(noiseValue));
	}

	reflect = contrastSaturationBrightness(reflect, uContrast, uSaturation, uBrightness);

	gl_FragColor.rgb = reflect;
	gl_FragColor.a = uOpacity;

	#include <tonemapping_fragment>
}`;

const waterFragmentChunk = createShaderChunk(waterFragmentShader, "fragmentShader");

const waterVertexShader = `uniform mat4 uTextureMatrix;
varying vec2 vUv;
varying vec4 vUvRefraction;

#include <common>
#include <logdepthbuf_pars_vertex>

void main() {
     vUv = uv;
     vUvRefraction = uTextureMatrix * vec4(position, 1.0);

     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    #include <logdepthbuf_vertex>
}`;

const waterVertexChunk = createShaderChunk(waterVertexShader, "vertexShader");

export class WaterMaterial extends ShaderMaterial {
  constructor(e = {}) {
    super(e), waterFragmentChunk.use(this), waterVertexChunk.use(this)
  }
}
