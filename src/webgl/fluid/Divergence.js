import {
  fluidFaceVertexShader
} from './Advection.js';
import {
  FluidShaderPass
} from './ShaderPass.js';

const divergenceFragmentShader = `precision highp float;
uniform sampler2D velocity;
uniform float dt;
uniform vec2 px;
varying vec2 uv;

void main(){
    float x0 = texture2D(velocity, uv-vec2(px.x, 0)).x;
    float x1 = texture2D(velocity, uv+vec2(px.x, 0)).x;
    float y0 = texture2D(velocity, uv-vec2(0, px.y)).y;
    float y1 = texture2D(velocity, uv+vec2(0, px.y)).y;
    float divergence = (x1-x0 + y1-y0) / 2.0;

    gl_FragColor = vec4(divergence / dt);
}`;

export let Divergence = class extends FluidShaderPass {
  constructor(e) {
    super({
      material: {
        vertexShader: fluidFaceVertexShader,
        fragmentShader: divergenceFragmentShader,
        uniforms: {
          boundarySpace: {
            value: e.boundarySpace
          },
          velocity: {
            value: e.src.texture
          },
          px: {
            value: e.cellScale
          },
          dt: {
            value: e.dt
          }
        }
      },
      output: e.dst
    }), this.init()
  }
  update({
    vel: e
  }) {
    this.uniforms.velocity.value = e.texture, super.update()
  }
};
