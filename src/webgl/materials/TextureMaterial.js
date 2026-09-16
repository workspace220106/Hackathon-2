import {
  GLSL3,
  ShaderMaterial
} from 'three';
import {
  createShaderChunk
} from '../utils/shader-chunk.js';

const textureFragmentShader = `precision highp float;

in vec2 vUv;

uniform sampler2D uTexture;

out vec4 fragColor;

void main() {
	float dist = smoothstep(0.3, 0.4, vUv.y);

	vec4 texColor = texture(uTexture, vUv);

	fragColor = vec4(texColor.rgb, texColor.a * dist);
}`;

const textureFragmentChunk = createShaderChunk(textureFragmentShader, "fragmentShader");

const textureVertexShader = `out vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const textureVertexChunk = createShaderChunk(textureVertexShader, "vertexShader");

export class TextureMaterial extends ShaderMaterial {
  constructor(e = {}) {
    const t = {
      uTexture: {
        value: null
      },
      ...e.uniforms
    };
    super({
      ...e,
      uniforms: t,
      glslVersion: GLSL3
    }), textureFragmentChunk.use(this), textureVertexChunk.use(this)
  }
}
