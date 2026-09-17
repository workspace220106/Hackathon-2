import {
  __publicField
} from '@/utils/private-fields.js';
import {
  DataTexture,
  DepthTexture,
  FloatType,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  RawShaderMaterial,
  Scene,
  Vector2,
  WebGLRenderTarget
} from 'three';
import {
  EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {
  RenderPass
} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
  ShaderPass
} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {
  SMAAPass
} from 'three/examples/jsm/postprocessing/SMAAPass.js';
import {
  FXAAShader
} from 'three/examples/jsm/shaders/FXAAShader.js';
import {
  app
} from '../core/App.js';
import {
  EVENTS,
  emitter
} from '../core/events.js';
import {
  isTabletWidth,
  isTouch
} from '../utils/device.js';
import {
  B_,
  Hc,
  bh
} from './bee/playground-bee-layout.js';
import {
  CameraRig
} from './cameras/CameraRig.js';
import {
  EnvCamera
} from './cameras/EnvCamera.js';
import {
  MainCamera
} from './cameras/MainCamera.js';
import {
  OrthoCamera
} from './cameras/OrthoCamera.js';
import {
  ScrollCamera
} from './cameras/ScrollCamera.js';
import {
  TopCamera
} from './cameras/TopCamera.js';
import {
  fluidFaceVertexShader
} from './fluid/Advection.js';
import {
  fluidMouse
} from './fluid/Mouse.js';
import {
  FluidSimulation
} from './fluid/Simulation.js';
import {
  FinalShader
} from './postprocessing/FinalShader.js';
import {
  LayerRenderPass
} from './postprocessing/LayerRenderPass.js';
import {
  NoiseMaterial
} from './postprocessing/NoiseMaterial.js';
import {
  VelocityBlendShader
} from './postprocessing/VelocityBlendShader.js';
import {
  Renderer
} from './Renderer.js';
import {
  EnvScene
} from './scenes/EnvScene.js';
import {
  MainScene
} from './scenes/MainScene.js';
import {
  TopScene
} from './scenes/TopScene.js';
import {
  TOP_LAYER,
  sharedUniforms
} from './shared-uniforms.js';

const velocityOutputFragmentShader = `precision highp float;
uniform sampler2D velocity;
varying vec2 uv;

void main(){
    vec2 vel = texture2D(velocity, uv).xy;
    float len = length(vel);
    vel = vel * 0.5 + 0.5;
    
    vec3 color = vec3(vel.x, vel.y, 1.0);
    color = mix(vec3(1.0), color, len);

    gl_FragColor = vec4(color,  1.0);
}`;

export class WebGL {
  constructor() {
    __publicField(this, "_enableLightweightRender", () => {
      var e, t, n;
      this._skipFluidEffects = !0, this.emptyVelocityTexture || (this.emptyVelocityTexture = this._createEmptyVelocityTexture()), (n = (t = (e = this.finalPass) == null ? void 0 : e.material) == null ? void 0 : t.uniforms) != null && n.tVelocity && (this.finalPass.material.uniforms.tVelocity.value = this.emptyVelocityTexture)
    });
    __publicField(this, "_disableLightweightRender", () => {
      var e, t, n;
      this._skipFluidEffects = !1, this._usesFluidEffects() && ((n = (t = (e = this.finalPass) == null ? void 0 : e.material) == null ? void 0 : t.uniforms) != null && n.tVelocity) && this.simulation && (this.finalPass.material.uniforms.tVelocity.value = this.simulation.fbos.vel_0.texture)
    });
    emitter.register(this), this._disableSimulation = !1 /* fluid sim on every device (Mouse.js handles touch) */, this._skipFluidEffects = !1, this.isPlaygroundPageActive = !1, this.isHomeAboutGroupsRenderActive = !1, this._headerScrollRect = null, this._webglSectionScrollRect = null, this._pageTransitionHidingGroups = !1, this._pageTransitionForceGroupsRender = !1, this._playgroundContentBeeLockedActive = !1, this._webglSectionRevealLocked = !1, this._webglSectionRevealSnapshot = null, this._webglSectionRevealListenersReady = !1, this._initialShaderPrewarmActive = !1, this._disableSimulation && (this.emptyVelocityTexture = this._createEmptyVelocityTexture());
    const e = new PlaneGeometry(1, 1, 1, 1);
    this._createFluidRender(e), this._createMainRender(e), this._createInterfaceRender(e), this.topRenderer = new Renderer(!0, !0, {
      usePostDpr: !0
    }), this.topScene = new TopScene(e), this.topCamera = new TopCamera, this.mainCompRenderPass = this._createMainCompRenderPass(e), this.effectComposer.addPass(this.mainCompRenderPass), this.interfaceRenderPass = new RenderPass(this.interfaceScene, this.interfaceCamera), this.interfaceRenderPass.clear = !1, this.effectComposer.addPass(this.interfaceRenderPass), this.fluidHashBlurPass = new ShaderPass(FinalShader), this.fluidHashBlurPass.material.depthTest = !1, this.fluidHashBlurPass.material.depthWrite = !1, this.effectComposer.addPass(this.fluidHashBlurPass), this.interfaceSharpRenderPass = new LayerRenderPass(this.interfaceScene, this.interfaceCamera, TOP_LAYER), this.interfaceSharpRenderPass.clear = !1, this.interfaceSharpRenderPass.clearDepth = !0, this.effectComposer.addPass(this.interfaceSharpRenderPass), this.finalPass = new ShaderPass(VelocityBlendShader), this.effectComposer.addPass(this.finalPass), this.fxaaPass = new ShaderPass(FXAAShader), this.smaaPass = new SMAAPass(window.innerWidth, window.innerHeight), this._mainCompResolution = new Vector2(1, 1), this.aaRenderTarget = new WebGLRenderTarget(1, 1, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      depthBuffer: !1
    }), this.postProcess = {
      aaType: "none",
      fluidHashBlurRadius: 0,
      fluidDistortionStrength: .003,
      fluidVelocityBlurScale: 15
    }
  }
  _createEmptyVelocityTexture() {
    const t = new Float32Array(262144),
      n = new DataTexture(t, 256, 256, RGBAFormat, FloatType);
    return n.needsUpdate = !0, n
  }
  _usesFluidEffects() {
    return !this._disableSimulation && !this._skipFluidEffects
  }
  usesFluidEffects() {
    return this._usesFluidEffects()
  }
  enablePlaygroundRenderMode() {
    this.isPlaygroundPageActive || (this.isPlaygroundPageActive = !0, this._applyHomeAboutGroupsScrollState(!1))
  }
  disablePlaygroundRenderMode() {
    var e;
    this.isPlaygroundPageActive && (this.isPlaygroundPageActive = !1, this._updateHomeAboutGroupsScrollActive(((e = app.lenis) == null ? void 0 : e.animatedScroll) ?? 0))
  }
  setHeaderScrollRect(e) {
    var t;
    this._headerScrollRect = e ?? null, this._updateHomeAboutGroupsScrollActive(((t = app.lenis) == null ? void 0 : t.animatedScroll) ?? 0)
  }
  setWebglSectionScrollRect(e) {
    var t;
    this._webglSectionScrollRect = e ?? null, this._updateHomeAboutGroupsScrollActive(((t = app.lenis) == null ? void 0 : t.animatedScroll) ?? 0)
  }
  beginInitialShaderPrewarm(e) {
    var t;
    this._initialShaderPrewarmActive = !0, this.isHomeAboutGroupsRenderActive = !0, e && this.scene.show(e), (t = this.scene) == null || t.setInitialShaderPrewarmVisibility()
  }
  endInitialShaderPrewarm(e) {
    var t;
    this._initialShaderPrewarmActive = !1, e && this.scene.show(e), this._updateHomeAboutGroupsScrollActive(((t = app.lenis) == null ? void 0 : t.animatedScroll) ?? 0)
  }
  beginPageTransitionHide() {
    var e, t, n;
    emitter.emit(EVENTS.WEBGL_SECTION_REVEAL_LOCK), this._pageTransitionHidingGroups = !0, this._pageTransitionForceGroupsRender = !0, this._playgroundContentBeeLockedActive = app.showPlaygroundContentBee, this._playgroundContentBeeLockedActive && (app.playgroundContentBeeSuppressHeroUntilScrollReset = !0, (t = (e = this.topScene) == null ? void 0 : e.syncBeeVisibility) == null || t.call(e)), (n = this.scene) == null || n.freezeHomeAboutGroupsForPageTransition()
  }
  hideHomeAboutGroupsOnTransitionCover() {
    this._pageTransitionHidingGroups = !1, this._pageTransitionForceGroupsRender = !1, this._applyHomeAboutGroupsScrollState(!1)
  }
  cancelPageTransitionHide() {
    var e;
    this._pageTransitionHidingGroups && (this._pageTransitionHidingGroups = !1, this._pageTransitionForceGroupsRender = !1, this._playgroundContentBeeLockedActive = !1, app.playgroundContentBeeSuppressHeroUntilScrollReset = !1, this._updateHomeAboutGroupsScrollActive(((e = app.lenis) == null ? void 0 : e.animatedScroll) ?? 0))
  }
  _isInHeaderScrollProgress(e) {
    const t = this._headerScrollRect;
    if (!t || !app.isOnHeader) return !1;
    const n = e / t.height;
    return n >= 0 && n <= 1
  }
  _isInWebglSectionScrollProgress(e) {
    const t = this._webglSectionScrollRect;
    if (!t) return !1;
    const n = t.y - window.innerHeight,
      i = t.y + t.height;
    return e >= n && e <= i
  }
  _updateHomeAboutGroupsScrollActive(e) {
    var o;
    if (this._initialShaderPrewarmActive || this._pageTransitionHidingGroups) return;
    const t = (o = this.scene) == null ? void 0 : o._currentRouteName;
    if (this.isPlaygroundPageActive || t === "playground") {
      this._applyHomeAboutGroupsScrollState(!1);
      return
    }
    const n = this._isInHeaderScrollProgress(e),
      i = this._isInWebglSectionScrollProgress(e),
      r = n || i;
    this._applyHomeAboutGroupsScrollState(r)
  }
  _applyHomeAboutGroupsScrollState(e) {
    var t;
    this.isHomeAboutGroupsRenderActive = e, (t = this.scene) == null || t.setHomeAboutGroupsRenderActive(e)
  }
  enablePlaygroundLightweightRender() {
    this.enablePlaygroundRenderMode()
  }
  disablePlaygroundLightweightRender() {
    this.disablePlaygroundRenderMode()
  }
  onAttach() {
    var e, t;
    app.$wrapper.prepend(this.renderer.domElement), app.$topWrapper.prepend(this.topRenderer.domElement), this._usesFluidEffects() && (fluidMouse.init(), this.simulation.resize(window.innerWidth, window.innerHeight), (e = app.debug) == null || e.mapping.add(this.simulation, "Fluid", 0)), (t = app.debug) == null || t.mapping.add(this, "PostProcess", 0, "Post Process", "Rendering")
  }
  setAaType(e) {
    this._applyAaType(e)
  }
  _applyAaType(e) {
    this.postProcess.aaType = e
  }
  _applyMainCompAa() {
    const e = this.postProcess.aaType;
    return e === "fxaa" ? (this.fxaaPass.render(this.renderer, this.aaRenderTarget, this.mainCompRenderTarget), this.aaRenderTarget.texture) : e === "smaa" ? (this.smaaPass.render(this.renderer, this.aaRenderTarget, this.mainCompRenderTarget), this.aaRenderTarget.texture) : this.mainCompRenderTarget.texture
  }
  _updateFluidHashBlurPass(e) {
    const {
      fluidHashBlurRadius: t,
      fluidDistortionStrength: n,
      fluidVelocityBlurScale: i
    } = this.postProcess, r = this.fluidHashBlurPass.material.uniforms;
    r.tVelocity.value = e, r.uBlurRadius.value = t, r.uDistortionStrength.value = n, r.uVelocityBlurScale.value = i, r.uResolution.value.copy(this._mainCompResolution), this.fluidHashBlurPass.enabled = this._usesFluidEffects() && (i > 0 || n > 0 || t > 0)
  }
  _createFluidRender(e) {
    this._disableSimulation || (this.simulation = new FluidSimulation), this.fluidScene = new Scene, this.fluidCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const t = this._disableSimulation ? this.emptyVelocityTexture : this.simulation.fbos.vel_0.texture;
    this.output = new Mesh(e, new RawShaderMaterial({
      vertexShader: fluidFaceVertexShader,
      fragmentShader: velocityOutputFragmentShader,
      uniforms: {
        velocity: {
          value: t
        },
        boundarySpace: {
          value: new Vector2
        }
      }
    })), this.output.scale.set(2, 2, 1)
  }
  _createMainRender(e) {
    this.renderer = new Renderer(!1, !1), this.scene = new EnvScene(e), this.modelCamera = new EnvCamera, this.mouseMoveCamera = new CameraRig, this.camera = new MainCamera, this.modelCamera.add(this.mouseMoveCamera), this.mouseMoveCamera.add(this.camera), this.scene.add(this.modelCamera)
  }
  _createInterfaceRender(e) {
    const t = new PlaneGeometry(1, 1, 16, 16);
    this.interfaceScene = new MainScene(t, e), this.interfaceCamera = new ScrollCamera
  }
  _createRenderTarget() {
    const e = {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      stencilBuffer: !0,
      samples: 0,
      depthTexture: new DepthTexture(1, 1),
      depthBuffer: !0
    };
    return new WebGLRenderTarget(1, 1, e)
  }
  _createMainCompRenderPass(e) {
    return this.mainCompScene = new Scene, this.mainCompCamera = new OrthoCamera, this.mainCompMaterial = new NoiseMaterial, this.mainCompMesh = new Mesh(e, this.mainCompMaterial), this.mainCompMesh.scale.set(2, 2, 1), this.mainCompScene.add(this.mainCompMesh), this.mainCompRenderTarget = this._createRenderTarget(), this.effectComposer = new EffectComposer(this.renderer), new RenderPass(this.mainCompScene, this.mainCompCamera)
  }
  onResize({
    width: e,
    height: t,
    dpr: n
  }) {
    var o;
    const i = e * n,
      r = t * n;
    this.mainCompRenderTarget.setSize(i, r), this.aaRenderTarget.setSize(i, r), this._mainCompResolution.set(i, r), this.fxaaPass.material.uniforms.resolution.value.set(1 / i, 1 / r), this.smaaPass.setSize(i, r), this.fluidHashBlurPass.material.uniforms.uResolution.value.set(i, r), this.effectComposer.setSize(e, t), this.effectComposer.setPixelRatio(n), this._usesFluidEffects() && ((o = this.simulation) == null || o.resize(e, t), this.output.material.uniforms.boundarySpace.value.set(this.simulation.cellScale.x, this.simulation.cellScale.y))
  }
  /**
   * Schedule track mode (components/ScheduleTimeline.vue): the timeline publishes the
   * screen position of its marker in `app.trackBee`; the content train is shown there,
   * gliding in from the side and following the marker down the rails.
   */
  _updateTrackBee(e) {
    const t = app.trackBee, n = this.topScene, i = this.topCamera;
    if (!t || !t.active) { this._trackBeeWasActive = !1; return !1 }
    const r = i.dimensions,
      o = (t.x / window.innerWidth - .5) * r.width + i.position.x,
      a = (.5 - t.y / window.innerHeight) * r.height + i.position.y,
      l = n.contentBeeGroup.position;
    this._trackBeeWasActive || (this._trackBeeWasActive = !0, l.set(o + r.width * .55, a + r.height * .15, 0), n._contentShadowMesh.scale.set(r.width, r.height * 2, 1e-5));
    const u = 1 - Math.exp(-5 * e);
    l.x += (o - l.x) * u, l.y += (a - l.y) * u, l.z = 0;
    n.setPageTransitionGroupToScrollCamera(i.position.y);
    // heading 0 = along the track (the bee flips it by itself when the scroll direction changes)
    n.contentBeeObject.setPathMotion({ heading: 0, pitch: 0, landPitch: 0, landSkyZ: 0, skyZ: .12 });
    return app.showPlaygroundContentBee = !0, !0
  }
  _updatePlaygroundContentBeeState(dt = 1 / 60) {
    var i;
    if (!bh()) {
      app.showPlaygroundContentBee = !1;
      return
    }
    if (!app.isLoaderRevealComplete) {
      app.showPlaygroundContentBee = !1;
      return
    }
    if (this._pageTransitionHidingGroups) {
      app.showPlaygroundContentBee = this._playgroundContentBeeLockedActive;
      return
    }
    if (this._updateTrackBee(dt)) return;
    if (!this.isPlaygroundPageActive) {
      app.showPlaygroundContentBee = !1;
      return
    }
    const e = app.playgroundContentBeeLayout;
    if (!Hc(e)) {
      app.showPlaygroundContentBee = !1;
      return
    }
    const t = ((i = app.lenis) == null ? void 0 : i.animatedScroll) ?? 0,
      n = app.playgroundFooterBeeStart || 1 / 0;
    app.showPlaygroundContentBee = B_(t, e, n)
  }
  onRender({
    et: e,
    dt: t
  }) {
    var i;
    sharedUniforms.uTime.value = e, this._usesFluidEffects() && fluidMouse.update(), app.isLoaderRevealComplete ? (this._updatePlaygroundContentBeeState(t), this.topScene.syncBeeVisibility()) : this.topScene.hideBeesUntilLoaderReveal(), this.topRenderer.render(this.topScene, this.topCamera);
    const n = ((i = app.lenis) == null ? void 0 : i.animatedScroll) ?? 0;
    this._updateHomeAboutGroupsScrollActive(n), this._renderMainPipeline(t)
  }
  _renderMainPipeline(e) {
    var n;
    this._usesFluidEffects() && ((n = this.simulation) == null || n.update(e)), this.renderer.setRenderTarget(this.mainCompRenderTarget), this.renderer.render(this.scene, this.camera), this.renderer.setRenderTarget(null), this.mainCompMaterial.uniforms.tDiffuse.value = this._applyMainCompAa(), this.emptyVelocityTexture || (this.emptyVelocityTexture = this._createEmptyVelocityTexture());
    const t = this._usesFluidEffects() ? this.simulation.fbos.vel_0.texture : this.emptyVelocityTexture;
    this.finalPass.material.uniforms.tVelocity.value = t, this._updateFluidHashBlurPass(t), this.effectComposer.render()
  }
  cleanupInterfaceScene() {
    this.interfaceScene.cleanup()
  }
}
