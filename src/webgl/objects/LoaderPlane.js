import {
  gsap
} from 'gsap';
import {
  Color,
  Mesh,
  Vector2
} from 'three';
import {
  app
} from '../../core/App.js';
import {
  emitter
} from '../../core/events.js';
import {
  LoaderMaterial
} from '../materials/LoaderMaterial.js';

export class LoaderPlane extends Mesh {
  constructor(e) {
    super(), emitter.register(this), this._planeGeometry = e, this._colors = {
      home: {
        r: .9686274509803922,
        g: .9686274509803922,
        b: .9686274509803922
      }
    }
  }
  onAppLoaded() {
    this._cameraDimensions = app.webgl.topCamera.dimensions, this.geometry = this._planeGeometry, this.material = new LoaderMaterial({
      uniforms: {
        uResolution: {
          value: new Vector2(1, 1)
        },
        uGlobalProgress: {
          value: 0
        },
        uScaleProgress: {
          value: 0
        },
        uFinalProgress: {
          value: 0
        },
        uColor: {
          value: new Color(this._colors.home.r, this._colors.home.g, this._colors.home.b)
        }
      },
      transparent: !0,
      depthWrite: !1
    }), this.scale.set(this._cameraDimensions.width, this._cameraDimensions.height, 1e-5)
  }
  onAttach() {}
  show() {
    const e = gsap.timeline();
    return e.fromTo(this.material.uniforms.uGlobalProgress, {
      value: 0
    }, {
      value: 1,
      duration: 1.75,
      ease: "expo.out"
    }, 0), e.fromTo(this.material.uniforms.uScaleProgress, {
      value: 0
    }, {
      value: 1,
      duration: 2.25,
      ease: "expo.out"
    }, 0), e.fromTo(this.material.uniforms.uFinalProgress, {
      value: 0
    }, {
      value: 1,
      duration: 1.4,
      ease: "power4.inOut"
    }, .45), e
  }
  skip() {
    var e;
    (e = this.material) != null && e.uniforms && (this.material.uniforms.uGlobalProgress.value = 1, this.material.uniforms.uScaleProgress.value = 1, this.material.uniforms.uFinalProgress.value = 1), this.visible = !1
  }
  onRender({
    et: e,
    dt: t
  }) {
    this._cameraDimensions = app.webgl.topCamera.dimensions
  }
  onResize({
    width: e,
    height: t
  }) {
    this._cameraDimensions = app.webgl.topCamera.dimensions;
    const n = this._cameraDimensions.width,
      i = this._cameraDimensions.height;
    this.scale.set(n, i, 1e-5), this.material.uniforms.uResolution.value.set(n, i)
  }
}
