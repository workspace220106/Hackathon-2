import {
  GLSL3,
  ShaderMaterial
} from 'three';
import {
  createShaderChunk
} from '../utils/shader-chunk.js';

const leavesFragmentShader = `precision highp float;

uniform sampler2D uTexture;

in vec2 vUv;

out vec4 fragColor;

void main() {
	fragColor = texture(uTexture, vUv);
}`;

const leavesFragmentChunk = createShaderChunk(leavesFragmentShader, "fragmentShader");

const leavesVertexShader = `in vec3 _centerposition;

uniform float uTime;
uniform float uWindStrength;

out vec2 vUv;
out vec3 vPosition;

float hash(float n) {
	return fract(sin(n) * 43758.5453123);
}

void main() {
	vUv = uv;

	vec3 pos = position;

	vec3 localPos = pos - _centerposition;
	float height = localPos.y;

	vPosition = localPos;

	float seed = dot(_centerposition.xz, vec2(12.9898, 78.233));
	float phase = hash(seed) * 6.2831;
	float speed = mix(0., 1., hash(seed + 1.0)) + 1.0;

	float ondulation = uTime * 0.002 * speed + phase;

	if (height > 0.) {
		pos.z -= sin(height * 1. + ondulation) * 0.025;
	}

	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;

const leavesVertexChunk = createShaderChunk(leavesVertexShader, "vertexShader");

export class LeavesMaterial extends ShaderMaterial {
  constructor(e = {}) {
    const t = {
      uTime: {
        value: 0
      },
      uTexture: {
        value: null
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
    }), leavesFragmentChunk.use(this), leavesVertexChunk.use(this)
  }
}
