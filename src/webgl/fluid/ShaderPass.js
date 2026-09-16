import {
  Camera,
  Mesh,
  PlaneGeometry,
  RawShaderMaterial,
  Scene
} from 'three';
import {
  app
} from '../../core/App.js';

export class FluidShaderPass {
  constructor(e) {
    var t;
    this.props = e, this.uniforms = (t = this.props.material) == null ? void 0 : t.uniforms
  }
  init() {
    this.scene = new Scene, this.camera = new Camera, this.uniforms && (this.material = new RawShaderMaterial(this.props.material), this.geometry = new PlaneGeometry(2, 2), this.plane = new Mesh(this.geometry, this.material), this.scene.add(this.plane))
  }
  update() {
    app.webgl.renderer.setRenderTarget(this.props.output), app.webgl.renderer.render(this.scene, this.camera), app.webgl.renderer.setRenderTarget(null)
  }
}
