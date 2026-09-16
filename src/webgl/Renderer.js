import {
  LinearSRGBColorSpace,
  PCFSoftShadowMap,
  WebGLRenderer
} from 'three';
import {
  CHECK_SHADER_ERRORS
} from '../config/debug.js';
import {
  app
} from '../core/App.js';
import {
  emitter
} from '../core/events.js';

export class Renderer extends WebGLRenderer {
  constructor(e, t, {
    usePostDpr: n = !1
  } = {}) {
    super({
      antialias: !1,
      powerPreference: "high-performance",
      alpha: e,
      premultipliedAlpha: !1
    }), emitter.register(this), this._usePostDpr = n, t && (this.shadowMap.type = PCFSoftShadowMap, this.shadowMap.enabled = !0), this.outputColorSpace = LinearSRGBColorSpace, this.debug.checkShaderErrors = CHECK_SHADER_ERRORS, this.autoClear = !1
  }
  onAttach() {
    var e;
    (e = app.debug) == null || e.mapping.add(this, "Stats")
  }
  onResize({
    width: e,
    height: t,
    dpr: n,
    postDpr: i = 1
  }) {
    this.setSize(e, t), this.setPixelRatio(this._usePostDpr ? i : n)
  }
}
