import {
  AmbientLight,
  Color,
  Group,
  Mesh,
  MeshNormalMaterial,
  MeshPhongMaterial,
  PointLight,
  Quaternion,
  Scene,
  Texture,
  Vector2,
  Vector3
} from 'three';
import {
  sliderGap,
  sliderOptions
} from '../../config/slider.js';
import {
  getPsCardTexture
} from '../../utils/PsCardRenderer.js';
import {
  app
} from '../../core/App.js';
import {
  emitter
} from '../../core/events.js';
import {
  mapRangeClamped
} from '../../utils/clamp.js';
import {
  isTabletWidth
} from '../../utils/device.js';
import {
  getOffset
} from '../../utils/dom.js';
import {
  ColorMaterial
} from '../materials/ColorMaterial.js';
import {
  MediaMaterial
} from '../materials/MediaMaterial.js';
import {
  TOP_LAYER,
  sharedUniforms
} from '../shared-uniforms.js';

const H8 = 10;

const OI = 1.05;

const Q8 = OI * 1.1;

const z8 = 1.02;

const US = 2e-4;

const V8 = .52;

const W8 = 1600;

const Y8 = .0015;

const ui = .6;

const GS = 20;

const HS = .2;

const X8 = 5e-6;

const q8 = 5e-6;

const j8 = .965;

const nf = .55;

const K8 = .2;

const J8 = .9;

const Z8 = .915;

const $8 = 0;

const eY = 30;

const tY = [0, 0, 0, 0];

const QS = [{
  x: 300,
  y: 0
}, {
  x: 300,
  y: 0
}, {
  x: -300,
  y: 0
}, {
  x: 300,
  y: 0
}];

const nY = new Vector3(1, 0, 0);

const iY = new Vector3(0, 1, 0);

const sY = new Vector3(0, 0, 1);

const zS = new Quaternion;

const VS = new Quaternion;

const WS = new Quaternion;

const YS = new Quaternion;

// slider index → original project asset set (projects 3 & 6 were removed from the page)
const PROJECT_TEXTURE_SET = [1,2,4,5];

export class MainScene extends Scene {
  constructor(e, t) {
    super(), emitter.register(this), this._mediaPlaneGeometry = e, this._planeGeometry = t, this._baseFlowerMesh = null, this._projects = [], this._medias = [], this._backgrounds = [], this._flowers = [], this._lights = {}, this._activeSliders = new Map, this._colors = {
      home: new Color(.9686, .9686, .9686),
      about: new Color(.031, .239, .165),
      playground: new Color(.965, .878, .086)
    }
  }
  onAppLoaded() {
    this._baseFlowerMesh = this._createBaseFlowerMesh()
  }
  onAttach() {}
  _measureLayoutRect(e) {
    const t = getOffset(e);
    return {
      top: t.top,
      left: t.left,
      width: t.width,
      height: t.height
    }
  }
  _getFlowerScenePosition(e) {
    return {
      x: e.left - window.innerWidth / 2 + e.width / 2,
      y: -e.top + window.innerHeight / 2 - e.height / 2
    }
  }
  _computeFlowerCenterProgress(e, t, n) {
    const r = e.top + e.height / 2 - window.innerHeight / 2,
      o = t - window.innerHeight,
      a = t + n;
    return mapRangeClamped(r, [o, a], [-1, 1])
  }
  _smoothstep(e) {
    const t = Math.max(0, Math.min(1, e));
    return t * t * (3 - 2 * t)
  }
  _stepFlowerSpring(e, t, n, i, r = K8, o = J8) {
    return n += (t - e) * r * i, n *= Math.pow(o, i), e += n * i, {
      current: e,
      velocity: n
    }
  }
  _stepFlowerSpin(e, t) {
    e.spinVel.z *= Math.pow(j8, t), e.spin.z += e.spinVel.z * t
  }
  _addFlowerSpinImpulse(e, t, n, i, r) {
    const o = n * X8 + Math.abs(i) * q8;
    e.spinVel.z += -t * o * r, e.spinVel.z = this._clamp(e.spinVel.z, -HS, HS)
  }
  _getFlowerLightKeyframes() {
    const e = [...this._flowers].sort((i, r) => i.index - r.index),
      t = Math.min(e.length, QS.length),
      n = [];
    for (let i = 0; i < t; i++) {
      const r = e[i];
      if (r.lightProgress === void 0) continue;
      const o = QS[i] ?? {
        x: 0,
        y: 0
      };
      n.push({
        progress: r.lightProgress,
        x: r.group.position.x + o.x,
        y: r.group.position.y + o.y
      })
    }
    return n.sort((i, r) => i.progress - r.progress)
  }
  _lerpFlowerLightSegment(e, t, n, i = !1) {
    const r = n.progress - t.progress,
      o = r > 0 ? (e - t.progress) / r : 0,
      a = i ? this._smoothstep(o) : o;
    return {
      x: t.x + (n.x - t.x) * a,
      y: t.y + (n.y - t.y) * a
    }
  }
  _updateFlowerLightPosition(e = 0) {
    if (!this._lights.pointLight) return;
    const t = this._getFlowerLightKeyframes();
    if (!t.length) return;
    if (t.length === 1) {
      this._lights.pointLight.position.x = t[0].x, this._lights.pointLight.position.y = t[0].y;
      return
    }
    const n = t[0],
      i = t[t.length - 1];
    let r;
    if (e <= n.progress) r = this._lerpFlowerLightSegment(e, n, t[1]);
    else if (e >= i.progress) r = this._lerpFlowerLightSegment(e, t[t.length - 2], i);
    else
      for (let o = 0; o < t.length - 1; o++) {
        const a = t[o],
          l = t[o + 1];
        if (!(e < a.progress || e > l.progress)) {
          r = this._lerpFlowerLightSegment(e, a, l, !0);
          break
        }
      }
    r && (this._lights.pointLight.position.x = r.x, this._lights.pointLight.position.y = r.y)
  }
  _createBaseFlowerMesh() {
    const e = app.core.assetsManager.get("flowerModel").clone(),
      t = app.core.assetsManager.get("flowerTex");
    return t.flipY = !1, e.traverse(n => {
      n.isMesh && (n.material = new MeshPhongMaterial({
        map: t
      }), n.geometry = n.geometry.clone(), n.geometry.scale(.25, .25, .25))
    }), e
  }
  _createSliderMediaMaterial(e) {
    return new MediaMaterial({
      uniforms: {
        uTime: sharedUniforms.uTime,
        uTexture: {
          value: new Texture
        },
        uPlaneSizes: {
          value: new Vector2
        },
        uTextureSizes: {
          value: new Vector2
        },
        uDragForce: {
          value: 0
        },
        uCoverBleed: {
          value: isTabletWidth() ? Q8 : OI
        },
        uDragScaleStrength: {
          value: 75e-6
        },
        uDragScaleStrengthZ: {
          value: isTabletWidth() ? .5 : 1.5
        },
        uDragColorStrength: {
          value: 35e-5
        },
        uScrollDeformationDirection: {
          value: e
        },
        uParallaxProgress: {
          value: 0
        },
        uParallaxX: {
          value: 0
        }
      },
      wireframe: !1
    })
  }
  createProjectsGroups() {
    const e = new Group;
    this.add(e), this._projects.push(e)
  }
  _getParallaxX(e) {
    return e / (window.innerWidth * .5) * sliderOptions().parallaxXMultiplier
  }
  _setMeshParallaxX(e) {
    var t, n;
    (n = (t = e.material) == null ? void 0 : t.uniforms) != null && n.uParallaxX && (e.material.uniforms.uParallaxX.value = this._getParallaxX(e.position.x))
  }
  setParallaxUniforms(e, t) {
    this._projects[e].children.forEach(n => {
      n.material.uniforms.uParallaxProgress.value = t
    })
  }
  addMedias(e, t, n) {
    const i = this._measureLayoutRect(e),
      r = new Mesh(this._mediaPlaneGeometry);
    r.layers.set(TOP_LAYER), this._projects[n].add(r), r.position.x = i.left - window.innerWidth / 2 + i.width / 2, r.position.y = -i.top + window.innerHeight / 2 - i.height / 2, r.scale.set(i.width, i.height, 1);
    const o = getPsCardTexture(n, t);
    const a = 1024, l = 1365;
    if (o) {
      const h = this._createSliderMediaMaterial(t % 2);
      h.uniforms.uTexture.value = o, h.uniforms.uPlaneSizes.value.set(i.width, i.height), h.uniforms.uTextureSizes.value.set(a, l), r.material = h, this._setMeshParallaxX(r)
    } else r.material = new MeshNormalMaterial;
    const u = {
      index: t,
      dom: e,
      mesh: r,
      layoutRect: i,
      top: i.top,
      left: i.left,
      width: i.width,
      height: i.height,
      texture: o,
      textureWidth: a,
      textureHeight: l
    };
    this._medias.push(u)
  }
  _setupFlowerLights(e) {
    if (this._lights.pointLight) return;
    const t = new PointLight("#ffffff", 1);
    this.add(t);
    const n = new AmbientLight(16777215, .9);
    this.add(n), t.position.z = -400, t.layers.enable(TOP_LAYER), n.layers.enable(TOP_LAYER), this._updateFlowerLightPosition(), this._lights.pointLight = t, this._lights.ambientLight = n, this._lights.flowersBg = e
  }
  addBackgrounds(e, t, n = !1, i, r = !1, o = !1) {
    var c;
    if (this._backgrounds.find(d => d.index === t)) return;
    const a = (((c = app.webgl) == null ? void 0 : c.usesFluidEffects()) ?? !1) || r;
    if (!a && !n) return;
    const l = this._measureLayoutRect(e);
    let u = null;
    a && (u = new Mesh(this._planeGeometry), u.renderOrder = -1, this.add(u), this._setBackgroundMeshScale(u, l.width, l.height, o), u.position.x = l.left - window.innerWidth / 2 + l.width / 2, u.position.y = -l.top + window.innerHeight / 2 - l.height / 2, u.material = new ColorMaterial({
      uniforms: {
        uColor: {
          value: null
        }
      },
      depthTest: !1
    }), i === "home" && (u.material.uniforms.uColor.value = this._colors.home), i === "about" && (u.material.uniforms.uColor.value = this._colors.about), i === "playground" && (u.material.uniforms.uColor.value = this._colors.playground));
    const h = {
      index: t,
      domBackground: e,
      mesh: u,
      layoutRect: l,
      top: l.top,
      left: l.left,
      width: l.width,
      height: l.height,
      disablePlaneOverscan: o,
      needLight: n
    };
    n && this._setupFlowerLights(h), this._backgrounds.push(h)
  }
  addFlowers(e, t) {
    if (!this._baseFlowerMesh) return;
    const n = new Group,
      i = this._baseFlowerMesh.clone();
    n.add(i), n.layers.set(TOP_LAYER), i.traverse(o => {
      o.isMesh && o.layers.set(TOP_LAYER)
    }), this.add(n);
    const r = {
      index: t,
      dom: e,
      group: n,
      mesh: i,
      baseSize: 0,
      randomRotation: Math.random() * .5 + .5,
      baseRotationZ: 0,
      domCenterX: 0,
      domCenterPageY: 0,
      domHalfSize: 1,
      spinSignX: 1,
      spinSignY: 1,
      tilt: {
        x: 0,
        y: 0
      },
      tiltVel: {
        x: 0,
        y: 0
      },
      tiltTarget: {
        x: 0,
        y: 0
      },
      spin: {
        z: 0
      },
      spinVel: {
        z: 0
      }
    };
    this._flowers.push(r)
  }
  _setFlowerMeshScaleFromRect(e, t, n) {
    const i = Math.max(Math.min(t, n) * .12, 2);
    e.scale.set(t, n, i * H8)
  }
  _setFlowerMeshScale(e, t, n) {
    e.baseSize = t, this._setFlowerMeshScaleFromRect(e.mesh, t, n)
  }
  _applyMediaLayout(e) {
    var n, i;
    const t = e.layoutRect;
    t && (e.mesh.scale.set(t.width, t.height, 1), e.mesh.position.x = t.left - window.innerWidth / 2 + t.width / 2, e.mesh.position.y = -t.top + window.innerHeight / 2 - t.height / 2, this._setMeshParallaxX(e.mesh), (i = (n = e.mesh.material) == null ? void 0 : n.uniforms) != null && i.uPlaneSizes && e.mesh.material.uniforms.uPlaneSizes.value.set(t.width, t.height))
  }
  refreshMediaLayout(e) {
    const t = this._medias.find(n => n.dom === e);
    t && (t.layoutRect = this._measureLayoutRect(e), t.top = t.layoutRect.top, t.left = t.layoutRect.left, t.width = t.layoutRect.width, t.height = t.layoutRect.height, this._applyMediaLayout(t))
  }
  setMediasPositions(e, t) {
    const n = this._medias.find(i => i.dom === e);
    n && this._applyMediaLayout(n)
  }
  _setBackgroundMeshScale(e, t, n, i = !1) {
    const r = i ? 1 : z8;
    e.scale.set(t * r, n * r, r)
  }
  _applyBackgroundLayout(e, t = !1) {
    const n = e.layoutRect;
    n && (e.mesh && (this._setBackgroundMeshScale(e.mesh, n.width, n.height, e.disablePlaneOverscan), e.mesh.position.x = n.left - window.innerWidth / 2 + n.width / 2, e.mesh.position.y = -n.top + window.innerHeight / 2 - n.height / 2), t && this._updateFlowerLightPosition(this._lights.flowersProgress ?? 0))
  }
  refreshBackgroundLayout(e, t = !1) {
    const n = this._backgrounds.find(i => i.index === e);
    n != null && n.domBackground && (n.layoutRect = this._measureLayoutRect(n.domBackground), n.top = n.layoutRect.top, n.left = n.layoutRect.left, n.width = n.layoutRect.width, n.height = n.layoutRect.height, this._applyBackgroundLayout(n, t || n.needLight))
  }
  refreshBackgroundLayoutsFrom(e = 0) {
    this._backgrounds.forEach(t => {
      t.index < e || this.refreshBackgroundLayout(t.index, t.needLight)
    })
  }
  setBackgroundsPositions(e, t, n, i = !1) {
    const r = this._backgrounds.find(o => o.index === t);
    r && this._applyBackgroundLayout(r, i)
  }
  _applyFlowerLayout(e, t = null) {
    const n = e.layoutRect;
    if (!n) return;
    const {
      x: i,
      y: r
    } = this._getFlowerScenePosition(n);
    if (this._setFlowerMeshScale(e, n.width, n.height), e.group.position.x = i, e.group.position.y = r, e.domCenterX = n.left + n.width / 2, e.domCenterPageY = n.top + n.height / 2, e.domHalfSize = Math.min(n.width, n.height) / 2, t) {
      const o = tY[e.index] ?? 0;
      e.lightProgress = this._computeFlowerCenterProgress(e.layoutRect, t.top, t.height) + o
    }
  }
  refreshFlowerLayout(e, t = null) {
    e != null && e.dom && (e.layoutRect = this._measureLayoutRect(e.dom), this._applyFlowerLayout(e, t))
  }
  setFlowersPositions(e, t = window.scrollY, n = null) {
    const i = this._flowers.find(r => r.dom === e);
    i && this._applyFlowerLayout(i, n)
  }
  syncAllFlowersPositions(e) {
    e && (this._flowers.forEach(t => {
      this.refreshFlowerLayout(t, e)
    }), this._updateFlowerLightPosition(this._lights.flowersProgress ?? 0))
  }
  removeBackground(e) {
    var i, r;
    const t = this._backgrounds.findIndex(o => o.index === e);
    if (t === -1) return;
    const n = this._backgrounds[t];
    (r = (i = n.mesh) == null ? void 0 : i.material) == null || r.dispose(), n.mesh && this.remove(n.mesh), this._backgrounds.splice(t, 1)
  }
  destroyAllBackgrounds() {
    this._backgrounds && (this._backgrounds.forEach(e => {
      var t, n, i, r;
      (n = (t = e.mesh) == null ? void 0 : t.geometry) == null || n.dispose(), (r = (i = e.mesh) == null ? void 0 : i.material) == null || r.dispose(), e.mesh && this.remove(e.mesh)
    }), this._backgrounds = []), this._lights.pointLight && (this.remove(this._lights.pointLight), this._lights.pointLight = null), this._lights.ambientLight && (this.remove(this._lights.ambientLight), this._lights.ambientLight = null), this._lights.flowersBg = null, this._lights.flowersProgress = 0
  }
  destroyAllProjects() {
    this._medias && (this._medias.forEach(e => {
      var t, n;
      (t = e.mesh) == null || t.geometry.dispose(), (n = e.mesh) == null || n.material.dispose(), e.mesh && this.remove(e.mesh)
    }), this._medias = []), this._projects && (this._projects.forEach(e => {
      e.traverse(t => {
        var n, i, r;
        t.isMesh && ((n = t.geometry) == null || n.dispose(), t.material && (Array.isArray(t.material) ? (i = t.material) == null || i.forEach(o => o.dispose()) : (r = t.material) == null || r.dispose()))
      }), e && this.remove(e)
    }), this._projects = []), this._activeSliders.clear()
  }
  cleanup() {
    this.destroyAllBackgrounds(), this.destroyAllProjects(), this._flowers && (this._flowers.forEach(e => {
      e.mesh.traverse(t => {
        var n, i;
        t.isMesh && (t.geometry && ((n = t.geometry) == null || n.dispose()), t.material && (Array.isArray(t.material) ? t.material.forEach(r => r.dispose()) : (i = t.material) == null || i.dispose()))
      }), this.remove(e.group)
    }), this._flowers = [])
  }
  setFlowersProgress(e, t = 1 / 60) {
    var r;
    this._lights.flowersProgress = e, this._updateFlowerLightPosition(e);
    const n = t * 60,
      i = Math.pow(Z8, n);
    (r = this._flowers) == null || r.forEach(o => {
      if (!o) return;
      const a = e * 3 * o.randomRotation;
      o.baseRotationZ = a, o.tiltTarget.x *= i, o.tiltTarget.y *= i;
      const l = this._stepFlowerSpring(o.tilt.x, o.tiltTarget.x, o.tiltVel.x, n);
      o.tilt.x = l.current, o.tiltVel.x = l.velocity;
      const u = this._stepFlowerSpring(o.tilt.y, o.tiltTarget.y, o.tiltVel.y, n);
      o.tilt.y = u.current, o.tiltVel.y = u.velocity, this._stepFlowerSpin(o, n), VS.setFromAxisAngle(iY, o.tilt.y), zS.setFromAxisAngle(nY, o.tilt.x), WS.setFromAxisAngle(sY, o.spin.z), YS.copy(VS).multiply(zS).multiply(WS), o.mesh.quaternion.copy(YS), o.group.rotation.z = a, o.group.position.z = $8 + Math.max(Math.abs(o.tilt.x), Math.abs(o.tilt.y)) * eY
    })
  }
  _getFlowerSpinDirection(e, t, n, i, r, o, a, l, u, h) {
    const c = t - e.domCenterX,
      d = n - (e.domCenterPageY - window.scrollY),
      f = c * c + d * d;
    if (o < 1) return 0;
    const A = Math.cos(-e.baseRotationZ),
      m = Math.sin(-e.baseRotationZ),
      g = c * A - d * m,
      p = c * m + d * A,
      _ = i * A - r * m,
      v = i * m + r * A,
      y = g * v - p * _,
      b = Math.sqrt(f),
      S = e.domHalfSize * .3,
      T = Math.max(b, S);
    Math.abs(g) > 2 && (e.spinSignX = Math.sign(g)), Math.abs(p) > 2 && (e.spinSignY = Math.sign(p));
    const C = y / (T * o);
    if (Math.abs(C) > .08) return this._clamp(C, -1, 1);
    if (u) {
      const R = p !== 0 ? Math.sign(-p) : e.spinSignY;
      return this._clamp(-a * R, -1, 1)
    }
    if (h) {
      const R = g !== 0 ? Math.sign(g) : e.spinSignX;
      return this._clamp(-l * R, -1, 1)
    }
    const x = p !== 0 ? Math.sign(-p) : e.spinSignY,
      w = g !== 0 ? Math.sign(g) : e.spinSignX;
    return this._clamp((-a * x + -l * w) * .5, -1, 1)
  }
  _applyFlowerGestureForce(e, {
    vx: t,
    vy: n,
    speed: i,
    ax: r,
    ay: o,
    dt: a,
    clientX: l,
    clientY: u,
    tiltSpeedGain: h = US
  }) {
    const c = Math.hypot(t, n);
    if (c < GS) return;
    const d = i - GS,
      f = t / c,
      A = n / c,
      m = this._clamp(d * h, 0, ui),
      g = a * 60,
      p = Math.abs(f),
      _ = Math.abs(A),
      v = _ > p * nf,
      y = p > _ * nf,
      b = this._getFlowerSpinDirection(e, l, u, t, n, c, f, A, y, v),
      S = Math.cos(-e.baseRotationZ),
      T = Math.sin(-e.baseRotationZ),
      C = f * S - A * T;
    v ? (e.tiltTarget.x = this._clamp(A * m, -ui, ui), this._addFlowerSpinImpulse(e, b, d, o, g)) : y ? (e.tiltTarget.y = this._clamp(C * m, -ui, ui), this._addFlowerSpinImpulse(e, b, d, r, g)) : (e.tiltTarget.x = this._clamp(A * m, -ui, ui), e.tiltTarget.y = this._clamp(C * m, -ui, ui), this._addFlowerSpinImpulse(e, b, d, Math.hypot(r, o), g))
  }
  applyFlowerTouchImpulse(e, {
    clientX: t = 0,
    clientY: n = 0,
    strength: i = 1
  } = {}) {
    const r = this._flowers.find(C => C.dom === e);
    if (!r) return;
    const o = t - r.domCenterX,
      a = n - (r.domCenterPageY - window.scrollY),
      l = Math.hypot(o, a) || 1,
      u = o / l,
      h = a / l,
      c = V8 * i,
      d = W8 * i,
      f = u * d,
      A = h * d,
      m = 1,
      g = Math.abs(u),
      p = Math.abs(h),
      _ = p > g * nf,
      v = g > p * nf,
      y = this._getFlowerSpinDirection(r, t, n, f, A, d, u, h, v, _),
      b = Math.cos(-r.baseRotationZ),
      S = Math.sin(-r.baseRotationZ),
      T = u * b - h * S;
    _ ? (r.tiltTarget.x = this._clamp(h * c, -ui, ui), this._addFlowerSpinImpulse(r, y, d, A * 18, m)) : v ? (r.tiltTarget.y = this._clamp(T * c, -ui, ui), this._addFlowerSpinImpulse(r, y, d, f * 18, m)) : (r.tiltTarget.x = this._clamp(h * c, -ui, ui), r.tiltTarget.y = this._clamp(T * c, -ui, ui), this._addFlowerSpinImpulse(r, y, d, d * .04, m))
  }
  applyFlowerMouseForce(e, {
    vx: t = 0,
    vy: n = 0,
    speed: i = 0,
    ax: r = 0,
    ay: o = 0,
    dt: a = 1 / 60,
    clientX: l = 0,
    clientY: u = 0,
    touchDrag: h = !1
  } = {}) {
    const c = this._flowers.find(d => d.dom === e);
    c && this._applyFlowerGestureForce(c, {
      vx: t,
      vy: n,
      speed: i,
      ax: r,
      ay: o,
      dt: a,
      clientX: l,
      clientY: u,
      tiltSpeedGain: h ? Y8 : US
    })
  }
  update({
    projectIndex: e,
    sliderParams: t
  }) {
    var l;
    const n = this._projects[e].children.length,
      i = (l = this._activeSliders.get(e)) == null ? void 0 : l.config,
      r = (i == null ? void 0 : i.infiniteDrag) ?? !1;
    let o = -1,
      a = 1 / 0;
    this._projects[e].children.forEach((u, h) => {
      const c = u.scale.x + sliderGap(),
        d = n * c;
      let f = h * c - t.smoothCurrentDrag;
      r && (f = this._wrapSliderPosition(f, d)), u.position.x = f, this._setMeshParallaxX(u), u.material.uniforms.uDragForce.value = t.smoothDragForce;
      const A = Math.abs(u.position.x);
      A < a && (a = A, o = h)
    }), o !== -1 && (t.targetIndex = o)
  }
  registerSlider(e, t, n = {
    x: 0,
    y: 0
  }, i = sliderOptions()) {
    const r = this._getSliderPlaneWidth(e);
    i.discreteDrag && this._initSliderActiveIndex(t, r), this._activeSliders.set(e, {
      sliderParams: t,
      delta: n,
      config: i
    })
  }
  setSliderConfig(e, t) {
    const n = this._activeSliders.get(e);
    n && (n.config = t)
  }
  updateSliderDelta(e, t) {
    const n = this._activeSliders.get(e);
    n && (n.delta = {
      ...t
    })
  }
  _getSliderPlaneWidth(e) {
    const t = this._projects[e];
    return t != null && t.children.length ? t.children[0].scale.x + sliderGap() : 0
  }
  _getSliderMaxIndex(e) {
    var n;
    const t = ((n = this._projects[e]) == null ? void 0 : n.children.length) ?? 0;
    return Math.max(0, t - 1)
  }
  _clampSliderDrag(e, t, n) {
    return this._clamp(e, 0, t * n)
  }
  _clampSliderIndex(e, t) {
    return this._clamp(Math.round(e), 0, t)
  }
  _wrapSliderPosition(e, t) {
    const n = t / 2;
    return ((e + n) % t + t) % t - n
  }
  _initSliderActiveIndex(e, t) {
    t && (e.activeIndex = Math.round(e.smoothCurrentDrag / t), e.snapTarget = e.activeIndex * t)
  }
  commitDiscreteStep(e, t) {
    const n = this._activeSliders.get(e);
    if (!(n != null && n.config.discreteDrag) || !t) return;
    const i = this._getSliderPlaneWidth(e);
    if (!i) return;
    const {
      sliderParams: r
    } = n, o = r.activeIndex ?? Math.round(r.smoothCurrentDrag / i);
    r.activeIndex = o + t, r.snapTarget = r.activeIndex * i, r.smoothDragForce = 0, r.dragForce = 0, n.delta.x = 0, n.delta.y = 0
  }
  _animateDiscreteSlider(e, t, n, i) {
    const r = (l, u, h) => this._lerp(l, u, 1 - Math.exp(-h * i)),
      o = e.activeIndex * n,
      a = t.stepSnapLerp ?? t.snapLerp;
    e.snapTarget = o, e.smoothCurrentDrag = r(e.smoothCurrentDrag, o, a), e.currentDrag = r(e.currentDrag, o, a * .85), e.smoothDragForce = r(e.smoothDragForce, 0, t.dragForceSmooth), e.dragForce = 0
  }
  onRender({
    et: e,
    dt: t
  }) {
    var n;
    (n = app.webgl) != null && n.isPlaygroundPageActive || this._activeSliders.size !== 0 && this._activeSliders.forEach((i, r) => {
      const {
        sliderParams: o,
        delta: a,
        config: l
      } = i, u = t * 60, h = (m, g, p) => this._lerp(m, g, 1 - Math.exp(-p * u)), c = this._getSliderPlaneWidth(r);
      if (!c) return;
      const d = this._getSliderMaxIndex(r),
        f = l.infiniteDrag ?? !1;
      if (l.discreteDrag) {
        a.x = 0, a.y = 0, this._animateDiscreteSlider(o, l, c, u), this.update({
          projectIndex: r,
          sliderParams: o
        });
        return
      }
      if (o.currentDrag += a.x * l.dragMultiplier, f || (o.currentDrag = this._clampSliderDrag(o.currentDrag, d, c)), a.x *= l.deltaDecay, a.y *= l.deltaDecay, o.rawDragInput = h(o.rawDragInput, Math.abs(a.x), l.dragForceDecay), o.dragForce = this._clamp(o.rawDragInput * l.dragForceMultiplier, 0, l.dragForceMax), o.smoothDragForce = h(o.smoothDragForce, o.dragForce, l.dragForceSmooth), o.isDragging && (o.smoothDragForce = Math.max(o.smoothDragForce, o.snapThreshold + 1)), !o.isDragging && o.smoothDragForce < o.snapThreshold) {
        let m = Math.round(o.smoothCurrentDrag / c);
        o.forcedSnapIndex != null ? m = o.forcedSnapIndex : f || (m = this._clampSliderIndex(m, d)), o.snapTarget = m * c, o.smoothCurrentDrag = h(o.smoothCurrentDrag, o.snapTarget, l.snapLerp), o.currentDrag = h(o.currentDrag, o.snapTarget, l.snapLerp * .85), f || (o.smoothCurrentDrag = this._clampSliderDrag(o.smoothCurrentDrag, d, c), o.currentDrag = this._clampSliderDrag(o.currentDrag, d, c)), o.forcedSnapIndex != null && Math.abs(o.smoothCurrentDrag - o.snapTarget) < c * .01 && (o.forcedSnapIndex = null)
      } else o.smoothCurrentDrag = h(o.smoothCurrentDrag, o.currentDrag, l.dragFollowLerp), f || (o.smoothCurrentDrag = this._clampSliderDrag(o.smoothCurrentDrag, d, c));
      this.update({
        projectIndex: r,
        sliderParams: o
      })
    })
  }
  _lerp(e, t, n) {
    return e + (t - e) * n
  }
  _clamp(e, t, n) {
    return Math.min(Math.max(e, t), n)
  }
}
