import {
  fluidFaceVertexShader
} from './Advection.js';
import {
  FluidShaderPass
} from './ShaderPass.js';

const poissonFragmentShader = `precision highp float;
uniform sampler2D pressure;
uniform sampler2D divergence;
uniform vec2 px;
varying vec2 uv;

void main(){    
    
    float p0 = texture2D(pressure, uv+vec2(px.x * 2.0,  0)).r;
    float p1 = texture2D(pressure, uv-vec2(px.x * 2.0, 0)).r;
    float p2 = texture2D(pressure, uv+vec2(0, px.y * 2.0 )).r;
    float p3 = texture2D(pressure, uv-vec2(0, px.y * 2.0 )).r;
    float div = texture2D(divergence, uv).r;
    
    float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
    gl_FragColor = vec4(newP);
}`;

export let Poisson = class extends FluidShaderPass {
  constructor(e) {
    super({
      material: {
        vertexShader: fluidFaceVertexShader,
        fragmentShader: poissonFragmentShader,
        uniforms: {
          boundarySpace: {
            value: e.boundarySpace
          },
          pressure: {
            value: e.dst_.texture
          },
          divergence: {
            value: e.src.texture
          },
          px: {
            value: e.cellScale
          }
        }
      },
      output: e.dst,
      output0: e.dst_,
      output1: e.dst
    }), this.init()
  }
  update({
    iterations: e
  }) {
    let t, n;
    for (let i = 0; i < e; i++) i % 2 == 0 ? (t = this.props.output0, n = this.props.output1) : (t = this.props.output1, n = this.props.output0), this.uniforms.pressure.value = t.texture, this.props.output = n, super.update();
    return n
  }
};
