import {
  AdditiveBlending,
  Mesh,
  PlaneGeometry,
  RawShaderMaterial,
  Vector2
} from 'three';
import {
  fluidMouse
} from './Mouse.js';
import {
  FluidShaderPass
} from './ShaderPass.js';

const externalForceFragmentShader = `precision highp float;

uniform vec2 force;
uniform vec2 center;
uniform vec2 scale;
uniform vec2 px;
varying vec2 vUv;

void main(){
    vec2 circle = (vUv - 0.5) * 2.0;
    float d = 1.0-min(length(circle), 1.0);
    d *= d;
    gl_FragColor = vec4(force * d, 0, 1);
}`;

const externalForceVertexShader = `precision highp float;

attribute vec3 position;
attribute vec2 uv;
uniform vec2 center;
uniform vec2 scale;
uniform vec2 px;
varying vec2 vUv;

void main(){
    vec2 pos = position.xy * scale * 2.0 * px + center;
    vUv = uv;
    gl_Position = vec4(pos, 0.0, 1.0);
}`;

export class ExternalForce extends FluidShaderPass {
  constructor(e) {
    super({
      output: e.dst
    }), this.init(e)
  }
  init(e) {
    super.init();
    const t = new PlaneGeometry(1, 1),
      n = new RawShaderMaterial({
        vertexShader: externalForceVertexShader,
        fragmentShader: externalForceFragmentShader,
        blending: AdditiveBlending,
        uniforms: {
          px: {
            value: e.cellScale
          },
          force: {
            value: new Vector2(0, 0)
          },
          center: {
            value: new Vector2(0, 0)
          },
          scale: {
            value: new Vector2(e.cursor_size, e.cursor_size)
          }
        }
      });
    this.mouse = new Mesh(t, n), this.scene.add(this.mouse)
  }
  update(e) {
    const t = e.mouseDiff ?? fluidMouse.diff,
      n = e.mouseDiffShare ?? 1,
      i = Math.min(Math.max(fluidMouse.coords.x, -1), 1),
      r = Math.min(Math.max(fluidMouse.coords.y, -1), 1),
      o = Math.max(0, (1 - Math.abs(i)) / e.cellScale.x),
      a = Math.max(0, (1 - Math.abs(r)) / e.cellScale.y),
      l = Math.min(e.cursor_size, o, a),
      u = t.x / 2 * e.mouse_force * n,
      h = t.y / 2 * e.mouse_force * n,
      c = this.mouse.material.uniforms;
    c.force.value.set(u, h), c.center.value.set(i, r), c.scale.value.set(l, l), super.update()
  }
}
