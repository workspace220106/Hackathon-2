import {
  __publicField
} from '@/utils/private-fields.js';
import {
  gsap
} from 'gsap';
import {
  AmbientLight,
  Group,
  Mesh,
  Scene,
  ShadowMaterial,
  Vector2
} from 'three';
import {
  HERO_TRANSITIONS,
  nonZero
} from '../../config/hero-transitions.js';
import {
  app
} from '../../core/App.js';
import {
  EVENTS,
  emitter
} from '../../core/events.js';
import {
  bh,
  k4,
  mW
} from '../bee/playground-bee-layout.js';
import {
  applyShadowPageTransition
} from '../materials/page-transition.js';
import {
  Bee
} from '../objects/Bee.js';
import {
  FlowerGroup
} from '../objects/FlowerGroup.js';
import {
  Fruits
} from '../objects/Fruits.js';
import {
  LoaderPlane
} from '../objects/LoaderPlane.js';

const TOP_SCENE_A = .25;

export class TopScene extends Scene {
  constructor(t) {
    super();
    __publicField(this, "_onLoaderRevealComplete", () => {
      this._setBeeSceneVisible(!0), this._setFruitsVisible(!0), this._playLoadRevealFade()
    });
    emitter.register(this), this._planeGeometry = t
  }
  onAppLoaded() {
    this._cameraDimensions = app.webgl.topCamera.dimensions, this._factorShadowSize = 2;
    const {
      width: t,
      height: n,
      postDpr: i = 1
    } = app.tools.viewport.infos;
    this.pageTransitionUniforms = {
      uTransition: {
        value: 0
      },
      uResolution: {
        value: new Vector2(this._cameraDimensions.width, this._cameraDimensions.height)
      },
      uViewport: {
        value: new Vector2(t * i, n * i)
      },
      uBeeRevealScale: {
        value: 0
      },
      uFruitRevealScale: {
        value: 0
      },
      uShadowReveal: {
        value: 0
      }
    }, this._loadRevealFadePlayed = !1, this._loadRevealFadeTimeline = null, this._playgroundEnterTimeline = null, this._createAmbientLight(), this.heroBeeEnterGroup = new Group, this.add(this.heroBeeEnterGroup), this._beeBackgroundMesh = this._createBeeBackgroundMesh(), this.heroBeeEnterGroup.add(this._beeBackgroundMesh), this.heroBeeObject = this._createHeroBeeObject(), this.footerBeeEnterGroup = new Group, this.add(this.footerBeeEnterGroup), this._footerBackgroundMesh = this._createBeeBackgroundMesh(), this.footerBeeEnterGroup.add(this._footerBackgroundMesh), this.footerBeeObject = this._createFooterBeeObject(), this.contentBeeGroup = new Group, this.add(this.contentBeeGroup), this._contentShadowMesh = this._createContentShadowMesh(), this.contentBeeGroup.add(this._contentShadowMesh), this.contentBeeObject = this._createContentBeeObject(), this.contentBeeObject.visible = !1, this.contentBeeObject.directionalLight.visible = !1, this.contentBeeGroup.add(this.contentBeeObject), this.contentBeeGroup.visible = !1, this._contentShadowMesh.visible = !1, this.loaderMaskMesh = this._createLoaderMaskMesh(), this.pageTransitionGroup = this._createPageTransitionGroup(), this.add(this.pageTransitionGroup), this._setBeeSceneVisible(!1), emitter.on(EVENTS.LOADER_REVEAL_COMPLETE, this._onLoaderRevealComplete)
  }
  onAttach() {
    var t;
    (t = app.debug) == null || t.mapping.add(this.contentBeeObject, "ContentBee", 0, "Content bee", "playground")
  }
  hideBeesUntilLoaderReveal() {
    this._setBeeSceneVisible(!1)
  }
  _setFruitsVisible(t) {
    var n, i;
    (n = this.heroBeeObject) == null || n.setFruitsVisible(t), (i = this.footerBeeObject) == null || i.setFruitsVisible(t)
  }
  _resetLoadRevealScale() {
    this.pageTransitionUniforms.uBeeRevealScale.value = 0, this.pageTransitionUniforms.uFruitRevealScale.value = 0, this.pageTransitionUniforms.uShadowReveal.value = 0
  }
  _setAllBeeCastShadow(t) {
    var n, i, r;
    (n = this.heroBeeObject) == null || n.setCastShadowEnabled(t), (i = this.footerBeeObject) == null || i.setCastShadowEnabled(t), (r = this.contentBeeObject) == null || r.setCastShadowEnabled(t)
  }
  _hideShadowPlanes() {
    this._beeBackgroundMesh.visible = !1, this._footerBackgroundMesh.visible = !1, this._contentShadowMesh.visible = !1, this.pageTransitionUniforms.uShadowReveal.value = 0
  }
  _killLoadRevealFade() {
    var t;
    (t = this._loadRevealFadeTimeline) == null || t.kill(), this._loadRevealFadeTimeline = null
  }
  _playLoadRevealFade() {
    if (this._loadRevealFadePlayed) return;
    this._loadRevealFadePlayed = !0, this._setAllBeeCastShadow(!1);
    const {
      uBeeRevealScale: t,
      uFruitRevealScale: n,
      uShadowReveal: i
    } = this.pageTransitionUniforms, r = .6, o = .1;
    this._killLoadRevealFade(), this._loadRevealFadeTimeline = gsap.timeline(), this._loadRevealFadeTimeline.to(t, {
      value: 1,
      duration: r,
      ease: "power2.out"
    }).to(i, {
      value: 1,
      duration: r,
      ease: "power2.out",
      onStart: () => {
        this._setAllBeeCastShadow(!0)
      },
      onUpdate: () => {
        this.syncBeeVisibility()
      }
    }, `+=${o}`).to(n, {
      value: 1,
      duration: r,
      ease: "power2.out"
    }, `+=${o}`)
  }
  _setBeeSceneVisible(t) {
    if (this.pageTransitionGroup.visible = t, !t) {
      this.heroBeeEnterGroup.visible = !1, this.footerBeeEnterGroup.visible = !1, this.heroBeeObject.visible = !1, this.footerBeeObject.visible = !1, this.contentBeeGroup.visible = !1, this.contentBeeObject.visible = !1, this.heroBeeObject.directionalLight.visible = !1, this.footerBeeObject.directionalLight.visible = !1, this.contentBeeObject.directionalLight.visible = !1, this._setFruitsVisible(!1), this._setAllBeeCastShadow(!1), this._hideShadowPlanes(), this._resetLoadRevealScale(), this._killLoadRevealFade(), this._loadRevealFadePlayed = !1;
      return
    }
    this.syncBeeVisibility()
  }
  _isPlaygroundContentBeeDisplayed() {
    var n, i;
    const t = ((n = app.webgl) == null ? void 0 : n._pageTransitionHidingGroups) && ((i = app.webgl) == null ? void 0 : i._playgroundContentBeeLockedActive);
    return bh() && (t || app.showPlaygroundContentBee)
  }
  syncBeeVisibility() {
    var u, h;
    const t = ((u = app.lenis) == null ? void 0 : u.animatedScroll) ?? 0,
      n = app.playgroundContentBeeLayout,
      i = ((h = app.webgl) == null ? void 0 : h.isPlaygroundPageActive) && k4(t, n, app.playgroundContentBeeBlockStartScroll),
      r = this._isPlaygroundContentBeeDisplayed(),
      o = app.showFooterBee && !r,
      a = !r && !o && !i && !app.playgroundContentBeeSuppressHeroUntilScrollReset;
    this.heroBeeEnterGroup.visible = a, this.heroBeeObject.visible = a, this.heroBeeObject.directionalLight.visible = a, this.contentBeeGroup.visible = r, this.contentBeeObject.visible = r, this.contentBeeObject.directionalLight.visible = r, this.footerBeeEnterGroup.visible = o, this.footerBeeObject.visible = o, this.footerBeeObject.directionalLight.visible = o;
    const l = this.pageTransitionUniforms.uShadowReveal.value > .001;
    this._beeBackgroundMesh.visible = a && l, this._footerBackgroundMesh.visible = o && l, this._contentShadowMesh.visible = r && l
  }
  _createAmbientLight() {
    const t = new AmbientLight(16777215, .5);
    this.add(t)
  }
  _createBeeBackgroundMesh() {
    const t = new ShadowMaterial({
      transparent: !0,
      opacity: TOP_SCENE_A,
      depthWrite: !1
    });
    applyShadowPageTransition(t, this.pageTransitionUniforms);
    const n = new Mesh(this._planeGeometry, t);
    return n.visible = !1, n.scale.set(this._cameraDimensions.width, this._cameraDimensions.height * this._factorShadowSize, 1e-5), n.receiveShadow = !0, n
  }
  _createHeroBeeObject() {
    const t = {
        massPursuer: .2,
        maxForcePursuer: 100,
        maxSpeedPursuer: 2.5,
        massPursuerClick: .2,
        maxForcePursuerClick: 100,
        maxSpeedPursuerClick: 7,
        massEvader: 1,
        maxForceEvader: 100,
        maxSpeedEvader: 2.5,
        xRange: 3,
        yRange: .65,
        zRange: 1.5,
        zTargetPosition: .3,
        flapStrength: 1.5,
        flapRotationOffset: 1,
        hasCutShadow: !0
      },
      n = new Fruits(t, this.pageTransitionUniforms);
    return n.enterScaleGroup.removeFromParent(), this.heroBeeEnterGroup.add(n.enterScaleGroup), this.add(n), n
  }
  _createContentShadowMesh() {
    const t = new ShadowMaterial({
      transparent: !0,
      opacity: TOP_SCENE_A,
      depthWrite: !1
    });
    applyShadowPageTransition(t, this.pageTransitionUniforms);
    const n = new Mesh(this._planeGeometry, t);
    return n.visible = !1, n.receiveShadow = !0, n
  }
  _createContentBeeObject() {
    return new Bee(this.pageTransitionUniforms)
  }
  updateContentBeeLayout(t) {
    const n = app.webgl.topCamera.dimensions,
      i = mW(t, n);
    this._contentShadowMesh.scale.set(i.width, i.height, 1e-5)
  }
  _applyContentBeePosition(t = {
    x: 0,
    y: 0
  }) {
    var o, a;
    const n = (t == null ? void 0 : t.x) ?? 0,
      i = (t == null ? void 0 : t.y) ?? 0,
      r = (t == null ? void 0 : t.z) ?? 0;
    this.contentBeeGroup.position.set(n, i, r), (a = (o = this.contentBeeObject) == null ? void 0 : o.setPathMotion) == null || a.call(o, {
      heading: t == null ? void 0 : t.heading,
      pitch: t == null ? void 0 : t.pitch,
      landPitch: t == null ? void 0 : t.landPitch,
      landSkyZ: (t == null ? void 0 : t.landSkyZ) ?? 0,
      skyZ: (t == null ? void 0 : t.skyZ) ?? 0
    })
  }
  setContentBeeGroupScroll(t, n = {
    x: 0,
    y: 0
  }) {
    this._applyContentBeePosition(n), this.setPageTransitionGroupToScrollCamera(t)
  }
  setContentBeeGroupPosition(t = {
    x: 0,
    y: 0
  }) {
    this._applyContentBeePosition(t)
  }
  setContentBeeGroupY(t = 0) {
    this.contentBeeGroup.position.y = t
  }
  resetContentBee() {
    this.contentBeeGroup.position.set(0, 0, 0)
  }
  resetBeeInteractions() {
    var t, n, i, r;
    (t = this.heroBeeObject) == null || t.resetInteraction(), (n = this.footerBeeObject) == null || n.resetInteraction(), app.webgl && (app.webgl._playgroundContentBeeLockedActive = !1), app.showPlaygroundContentBee = !1, app.playgroundContentBeeLayout = null, app.playgroundContentBeeEnd = 0, app.playgroundContentBeeHideEnd = 0, app.playgroundFooterBeeStart = 0, this.resetContentBee(), (r = (i = this.contentBeeObject) == null ? void 0 : i.resetMotion) == null || r.call(i), this.syncBeeVisibility()
  }
  _createFooterBeeObject() {
    const t = {
        massPursuer: .2,
        maxForcePursuer: 100,
        maxSpeedPursuer: 2.5,
        massPursuerClick: .2,
        maxForcePursuerClick: 100,
        maxSpeedPursuerClick: 5,
        massEvader: 1,
        maxForceEvader: 100,
        maxSpeedEvader: 2.5,
        xRange: 3,
        yRange: .65,
        zRange: 1.5,
        zTargetPosition: .3,
        flapStrength: 1.5,
        flapRotationOffset: 1,
        hasCutShadow: !0
      },
      n = new Fruits(t, this.pageTransitionUniforms);
    return this.add(n), n
  }
  _createLoaderMaskMesh() {
    const t = new LoaderPlane(this._planeGeometry);
    return this.add(t), t
  }
  _createPageTransitionGroup() {
    return new FlowerGroup(this._planeGeometry, this.pageTransitionUniforms)
  }
  setPageTransitionGroupToScrollCamera(t) {
    this.pageTransitionGroup.position.y = t, this.loaderMaskMesh.position.y = t
  }
  hide(t) {
    const n = gsap.timeline();
    return n.add(this.pageTransitionGroup.hide(t), 0), n
  }
  show() {
    const t = gsap.timeline();
    return t.add(this.pageTransitionGroup.show(), 0), t
  }
  onRender({
    et: t,
    dt: n
  }) {
    if (!app.isLoaderRevealComplete) {
      this.hideBeesUntilLoaderReveal();
      return
    }
    this._isPlaygroundContentBeeDisplayed() ? this.contentBeeObject.render(t, n) : app.showFooterBee ? this.footerBeeObject.render(t, n) : this.heroBeeObject.render(t, n), this.syncBeeVisibility()
  }
  onResize({
    width: t,
    height: n,
    postDpr: i = 1
  }) {
    app.webgl.topCamera.onResize({
      ratio: t / n
    }), this.syncBeeCameraFrustum(), this.pageTransitionUniforms.uViewport.value.set(t * i, n * i)
  }
  syncBeeCameraFrustum() {
    var n, i, r;
    const t = app.webgl.topCamera.dimensions;
    this._cameraDimensions = t, this._beeBackgroundMesh.scale.set(t.width, t.height * this._factorShadowSize, 1e-5), this._footerBackgroundMesh.scale.set(t.width, t.height * this._factorShadowSize, 1e-5), this.pageTransitionUniforms.uResolution.value.set(t.width, t.height), (n = this.heroBeeObject) == null || n.syncShadowFrustum(t), (i = this.footerBeeObject) == null || i.syncShadowFrustum(t), (r = this.contentBeeObject) == null || r.syncShadowFrustum(t)
  }
  playgroundHeroEnterZoom(t = !1) {
    this.killPlaygroundHeroEnter();
    const n = t ? HERO_TRANSITIONS.INITIAL_LOAD : HERO_TRANSITIONS.PAGE_TRANSITION,
      i = nonZero(n.from);
    return gsap.killTweensOf(this.heroBeeEnterGroup.scale), this.heroBeeEnterGroup.scale.set(i, i, i), this._playgroundEnterTimeline = gsap.timeline({
      onComplete: () => {
        this._playgroundEnterTimeline = null, this.heroBeeEnterGroup.scale.set(1, 1, 1)
      }
    }), this._playgroundEnterTimeline.to(this.heroBeeEnterGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: n.duration,
      ease: n.ease
    }), this._playgroundEnterTimeline
  }
  killPlaygroundHeroEnter() {
    var t, n;
    (t = this._playgroundEnterTimeline) == null || t.kill(), this._playgroundEnterTimeline = null, gsap.killTweensOf(this.heroBeeEnterGroup.scale), (n = this.heroBeeEnterGroup) == null || n.scale.set(1, 1, 1)
  }
}
