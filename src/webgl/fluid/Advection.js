import {
  BufferAttribute,
  BufferGeometry,
  LineSegments,
  RawShaderMaterial
} from 'three';
import {
  FluidShaderPass
} from './ShaderPass.js';

const advectionFragmentShader = `precision highp float;
uniform sampler2D velocity;
uniform float dt;
uniform float dissipation;
uniform bool isBFECC;

uniform vec2 fboSize;
uniform vec2 px;
varying vec2 uv;

void main(){
    vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;

    if(isBFECC == false){
        vec2 vel = texture2D(velocity, uv).xy;
        vec2 uv2 = uv - vel * dt * ratio;
        vec2 newVel = texture2D(velocity, uv2).xy;
        newVel *= dissipation;
        gl_FragColor = vec4(newVel, 0.0, 0.0);
    } else {
        vec2 spot_new = uv;
        vec2 vel_old = texture2D(velocity, uv).xy;
        
        vec2 spot_old = spot_new - vel_old * dt * ratio;
        vec2 vel_new1 = texture2D(velocity, spot_old).xy;

        
        vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
        
        vec2 error = spot_new2 - spot_new;

        vec2 spot_new3 = spot_new - error / 2.0;
        vec2 vel_2 = texture2D(velocity, spot_new3).xy;

        
        vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
        
        vec2 newVel2 = texture2D(velocity, spot_old2).xy;
        newVel2 *= dissipation;
        gl_FragColor = vec4(newVel2, 0.0, 0.0);
    }
}`;

export const fluidFaceVertexShader = `attribute vec3 position;
uniform vec2 px;
uniform vec2 boundarySpace;
varying vec2 uv;

precision highp float;

void main(){
    vec3 pos = position;
    
    
    
    uv = vec2(0.5)+(pos.xy)*0.5;
    gl_Position = vec4(pos, 1.0);
}`;

const fluidLineVertexShader = `attribute vec3 position;
varying vec2 uv;
uniform vec2 px;

precision highp float;

void main(){
    vec3 pos = position;
    uv = 0.5 + pos.xy * 0.5;
    vec2 n = sign(pos.xy);
    pos.xy = abs(pos.xy) - px * 1.0;
    pos.xy *= n;
    gl_Position = vec4(pos, 1.0);
}`;

export class Advection extends FluidShaderPass {
  constructor(e) {
    super({
      material: {
        vertexShader: fluidFaceVertexShader,
        fragmentShader: advectionFragmentShader,
        uniforms: {
          boundarySpace: {
            value: e.cellScale
          },
          px: {
            value: e.cellScale
          },
          fboSize: {
            value: e.fboSize
          },
          velocity: {
            value: e.src.texture
          },
          dt: {
            value: e.dt
          },
          dissipation: {
            value: .98
          },
          isBFECC: {
            value: !0
          }
        }
      },
      output: e.dst
    }), this.init()
  }
  init() {
    super.init(), this.createBoundary()
  }
  createBoundary() {
    const e = new BufferGeometry,
      t = new Float32Array([-1, -1, 0, -1, 1, 0, -1, 1, 0, 1, 1, 0, 1, 1, 0, 1, -1, 0, 1, -1, 0, -1, -1, 0]);
    e.setAttribute("position", new BufferAttribute(t, 3));
    const n = new RawShaderMaterial({
      vertexShader: fluidLineVertexShader,
      fragmentShader: advectionFragmentShader,
      uniforms: this.uniforms
    });
    this.line = new LineSegments(e, n), this.scene.add(this.line)
  }
  update({
    dt: e,
    isBounce: t,
    BFECC: n,
    dissipation: i
  }) {
    this.uniforms.dt.value = e, this.uniforms.dissipation.value = i, this.line.visible = t, this.uniforms.isBFECC.value = n, super.update()
  }
}
