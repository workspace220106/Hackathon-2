import {
  PerspectiveCamera
} from 'three';
import {
  app
} from '../../core/App.js';
import {
  emitter
} from '../../core/events.js';
import {
  clamp,
  mapRangeClamped
} from '../../utils/clamp.js';
import {
  isTabletWidth
} from '../../utils/device.js';

export class MainCamera extends PerspectiveCamera {
  constructor() {
    super(22.9, app.tools.viewport.ratio, .01, 500), emitter.register(this)
  }
  onAttach() {
    var e;
    (e = app.debug) == null || e.mapping.add(this, "MainCamera")
  }
  onTick({
    dt: e
  }) {}
  setModelCameraFov(e) {
    const t = app.core.assetsManager.get(`${e}Model`).getObjectByName("camera");
    this.fov = t.fov, this.near = t.near, this.far = t.far, this.updateProjectionMatrix()
  }
  setScrollHeaderPositions(e, t, n, i, r, o) {
    if (!new URLSearchParams(location.search).has("orbit")) {
      const l = -clamp(e / t.height * n.x, 0, n.x),
        u = -clamp(e / t.height * n.y, 0, n.y),
        h = -clamp(e / t.height * n.z, 0, n.z),
        c = -clamp(e / t.height * i.x, 0, i.x),
        d = -clamp(e / t.height * i.y, 0, i.y),
        f = -clamp(e / t.height * i.z, 0, i.z);
      app.isOnHeader && (app.webgl.camera.position.x = l - r.x, app.webgl.camera.position.y = u - r.y, app.webgl.camera.position.z = h - r.z, app.webgl.camera.rotation.x = c - o.x, app.webgl.camera.rotation.y = d - o.y, app.webgl.camera.rotation.z = f - o.z)
    }
  }
  setScrollSectionPositions(e, t, n, i, r, o) {
    if (!new URLSearchParams(location.search).has("orbit")) {
      const l = t.y - window.innerHeight,
        u = t.y + t.height,
        h = -mapRangeClamped(e, [l, u], [0, 1]) * n.x,
        c = -mapRangeClamped(e, [l, u], [0, 1]) * n.y,
        d = -mapRangeClamped(e, [l, u], [0, 1]) * n.z,
        f = -mapRangeClamped(e, [l, u], [0, 1]) * i.x,
        A = -mapRangeClamped(e, [l, u], [0, 1]) * i.y,
        m = -mapRangeClamped(e, [l, u], [0, 1]) * i.z;
      c >= 0 ? app.isOnHeader = !0 : app.isOnHeader = !1, app.isOnHeader || (app.webgl.camera.position.x = h - r.x, app.webgl.camera.position.y = c - r.y, app.webgl.camera.position.z = d - r.z, app.webgl.camera.rotation.x = f - o.x, app.webgl.camera.rotation.y = A - o.y, app.webgl.camera.rotation.z = m - o.z)
    }
  }
  onResize({
    ratio: e
  }) {
    var n, i;
    this.aspect = e;
    const t = (i = (n = app.webgl) == null ? void 0 : n.scene) == null ? void 0 : i._currentRouteName;
    if (t === "home" || t === "about") {
      this.setZoom(t);
      return
    }
    this.updateProjectionMatrix()
  }
  setZoom(e) {
    e === "home" ? this.zoom = isTabletWidth() ? .67 : 1 : e === "about" && (this.zoom = isTabletWidth() ? .89 : 1), this.updateProjectionMatrix()
  }
}
