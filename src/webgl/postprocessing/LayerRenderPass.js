import {
  RenderPass
} from 'three/examples/jsm/postprocessing/RenderPass.js';

export class LayerRenderPass extends RenderPass {
  constructor(e, t, n) {
    super(e, t), this.layer = n
  }
  render(e, t, n, i, r) {
    const o = this.camera.layers.mask;
    this.camera.layers.set(this.layer), super.render(e, t, n, i, r), this.camera.layers.mask = o
  }
}
