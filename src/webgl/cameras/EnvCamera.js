import {
  gsap
} from 'gsap';
import {
  PerspectiveCamera
} from 'three';
import {
  app
} from '../../core/App.js';

export class EnvCamera extends PerspectiveCamera {
  constructor() {
    super(22.9, app.tools.viewport.ratio, .01, 500)
  }
  setModelCameraProperties(e) {
    const t = app.core.assetsManager.get(`${e}Model`).getObjectByName("camera");
    this.position.copy(t.position), this.rotation.copy(t.rotation), this.fov = t.fov, this.near = t.near, this.far = t.far
  }
  show(e, t = !1) {
    const n = app.core.assetsManager.get(`${e}Model`).getObjectByName("camera");
    if (app.skipLoader) return this.setModelCameraProperties(e), gsap.timeline();
    const i = gsap.timeline(),
      r = t ? 2.5 : 2,
      o = t ? "expo.inOut" : "expo.out";
    return e === "home" && i.fromTo(this.position, {
      x: n.position.x + (t ? 7 : 5)
    }, {
      x: n.position.x,
      duration: r,
      ease: o
    }), e === "about" && i.fromTo(this.position, {
      x: n.position.x + 8
    }, {
      x: n.position.x,
      duration: r,
      ease: o
    }), i
  }
  hide(e) {
    const t = app.core.assetsManager.get(`${e}Model`).getObjectByName("camera"),
      n = gsap.timeline(),
      i = .5,
      r = "sine.out";
    return e === "home" && n.to(this.position, {
      x: t.position.x + 6,
      duration: i,
      ease: r
    }), e === "about" && n.to(this.position, {
      x: t.position.x - 4,
      duration: i,
      ease: r
    }), n
  }
  onResize({
    ratio: e
  }) {
    this.aspect = e, this.updateProjectionMatrix()
  }
}
