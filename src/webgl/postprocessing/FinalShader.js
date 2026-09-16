import {
  Color,
  Vector2
} from 'three';

const finalFragmentShader = `precision highp float;

varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform sampler2D tVelocity;
uniform vec2 uResolution;
uniform float uBlurRadius;
uniform float uDistortionStrength;
uniform float uVelocityBlurScale;
uniform vec3 uTrailColor;      // cursor trail tint (white-ish) — visible on every page, not only over media
uniform float uTrailStrength;  // 0 = off

#ifndef PI
	#define PI 3.14159265358
#endif
#ifndef TAU
	#define TAU 6.28318530718
#endif
#ifndef BLUR_ITERATIONS
	#define BLUR_ITERATIONS 15
#endif

highp float rand(const in vec2 uv) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot(uv.xy, vec2(a, b)), sn = mod(dt, PI);
	return fract(sin(sn) * c);
}

vec2 mult(inout vec2 r) {
	r = fract(r * vec2(12.9898, 78.233));
	return sqrt(r.x + 0.001) * vec2(sin(r.y * TAU), cos(r.y * TAU));
}

vec3 hashBlurTexture(sampler2D tex, vec2 uv, float radius, float aspect, vec2 offset) {
	vec2 circle = vec2(radius);
	circle.x *= aspect;
	vec2 rnd = vec2(rand(uv + offset));

	vec3 acc = vec3(0.0);
	for (int i = 0; i < BLUR_ITERATIONS; i++) {
		acc += texture2D(tex, uv + circle * mult(rnd)).rgb;
	}

	return acc / float(BLUR_ITERATIONS);
}

void main() {
	vec2 vel = texture2D(tVelocity, vUv).xy;
	float velMag = length(vel);

	vec2 uv = vUv + vel * uDistortionStrength;
	vec4 texColor = texture2D(tDiffuse, uv);

	float blurRadius = uBlurRadius + velMag * uVelocityBlurScale;

	// glow that follows the fluid velocity (the "white smear" behind the cursor)
	float trail = smoothstep(0.01, 0.45, velMag) * uTrailStrength;

	if (blurRadius <= 0.0) {
		gl_FragColor = vec4(mix(texColor.rgb, uTrailColor, trail), texColor.a);
		return;
	}

	float radius = blurRadius / uResolution.x;
	float aspect = uResolution.x / uResolution.y;
	vec3 blurred = hashBlurTexture(tDiffuse, uv, radius * 1.5, aspect, vec2(velMag));

	gl_FragColor = vec4(mix(blurred, uTrailColor, trail), texColor.a);
}`;

const finalVertexShader = `varying vec2 vUv;

void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	vUv = uv;
}`;

export const FinalShader = {
  uniforms: {
    tDiffuse: {
      value: null
    },
    tVelocity: {
      value: null
    },
    uResolution: {
      value: new Vector2(1, 1)
    },
    uBlurRadius: {
      value: 0
    },
    uDistortionStrength: {
      value: .003
    },
    uVelocityBlurScale: {
      value: 15
    },
    uTrailColor: {
      value: new Color('#ffffff') // white glow (the page background is kept slightly off-white so it shows)
    },
    uTrailStrength: {
      value: 1
    }
  },
  vertexShader: finalVertexShader,
  fragmentShader: finalFragmentShader
};
