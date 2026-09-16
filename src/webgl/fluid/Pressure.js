import {
  fluidFaceVertexShader
} from './Advection.js';
import {
  FluidShaderPass
} from './ShaderPass.js';

const pressureFragmentShader = `precision highp float;
uniform sampler2D pressure;
uniform sampler2D velocity;
uniform vec2 px;
uniform float dt;
varying vec2 uv;

void main(){
    float step = 1.0;

    float p0 = texture2D(pressure, uv+vec2(px.x * step, 0)).r;
    float p1 = texture2D(pressure, uv-vec2(px.x * step, 0)).r;
    float p2 = texture2D(pressure, uv+vec2(0, px.y * step)).r;
    float p3 = texture2D(pressure, uv-vec2(0, px.y * step)).r;

    vec2 v = texture2D(velocity, uv).xy;
    vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
    v = v - gradP * dt;
    gl_FragColor = vec4(v, 0.0, 1.0);
}`;

export class Pressure extends FluidShaderPass {
  constructor(e) {
    super({
      material: {
        vertexShader: fluidFaceVertexShader,
        fragmentShader: pressureFragmentShader,
        uniforms: {
          boundarySpace: {
            value: e.boundarySpace
          },
          pressure: {
            value: e.src_p.texture
          },
          velocity: {
            value: e.src_v.texture
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
    vel: e,
    pressure: t,
    dt: n
  }) {
    this.uniforms.velocity.value = e.texture, this.uniforms.pressure.value = t.texture, n !== void 0 && (this.uniforms.dt.value = n), super.update()
  }
}
