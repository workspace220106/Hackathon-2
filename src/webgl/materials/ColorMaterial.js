import {
  ShaderMaterial
} from 'three';
import {
  createShaderChunk
} from '../utils/shader-chunk.js';

const colorFragmentShader = `uniform vec3 uColor;

void main() {
	gl_FragColor = vec4(uColor, 1.0);
}`;

const colorFragmentChunk = createShaderChunk(colorFragmentShader, "fragmentShader");

const colorVertexShader = `void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const colorVertexChunk = createShaderChunk(colorVertexShader, "vertexShader");

export class ColorMaterial extends ShaderMaterial {
  constructor(e = {}) {
    super(e), colorFragmentChunk.use(this), colorVertexChunk.use(this)
  }
}
