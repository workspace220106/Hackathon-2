import {
  fluidFaceVertexShader
} from './Advection.js';
import {
  FluidShaderPass
} from './ShaderPass.js';

const viscousFragmentShader = `precision highp float;
uniform sampler2D velocity;
uniform sampler2D velocity_new;
uniform float v;
uniform vec2 px;
uniform float dt;

varying vec2 uv;

void main(){
    
    vec2 old = texture2D(velocity, uv).xy;
    vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0)).xy;
    vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0)).xy;
    vec2 new2 = texture2D(velocity_new, uv + vec2(0, px.y * 2.0)).xy;
    vec2 new3 = texture2D(velocity_new, uv - vec2(0, px.y * 2.0)).xy;

    vec2 new = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
    new /= 4.0 * (1.0 + v * dt);
    
    gl_FragColor = vec4(new, 0.0, 0.0);
}`;

export class Viscous extends FluidShaderPass {
  constructor(e) {
    super({
      material: {
        vertexShader: fluidFaceVertexShader,
        fragmentShader: viscousFragmentShader,
        uniforms: {
          boundarySpace: {
            value: e.boundarySpace
          },
          velocity: {
            value: e.src.texture
          },
          velocity_new: {
            value: e.dst_.texture
          },
          v: {
            value: e.viscous
          },
          px: {
            value: e.cellScale
          },
          dt: {
            value: e.dt
          }
        }
      },
      output: e.dst,
      output0: e.dst_,
      output1: e.dst
    }), this.init()
  }
  update({
    viscous: e,
    iterations: t,
    dt: n
  }) {
    let i, r;
    this.uniforms.v.value = e;
    for (let o = 0; o < t; o++) o % 2 == 0 ? (i = this.props.output0, r = this.props.output1) : (i = this.props.output1, r = this.props.output0), this.uniforms.velocity_new.value = i.texture, this.props.output = r, this.uniforms.dt.value = n, super.update();
    return r
  }
}
