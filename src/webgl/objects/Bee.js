import {
  gsap
} from 'gsap';
import {
  DirectionalLight,
  MeshPhongMaterial,
  Object3D,
  Raycaster,
  Vector2
} from 'three';
import { createTrainModel } from './TrainModel.js';
import {
  app
} from '../../core/App.js';
import {
  EVENTS,
  emitter
} from '../../core/events.js';
import {
  isTouch
} from '../../utils/device.js';
import {
  lerp
} from '../../utils/math.js';
import {
  beeScreenAnchor
} from '../bee/bee-projection.js';
import {
  BEE_TEXT_A,
  BEE_TEXT_B,
  BEE_TEXT_C,
  BEE_TEXT_D,
  BEE_TEXT_E,
  FRUIT_SOUND_1,
  FRUIT_SOUND_2,
  randomConversation,
  randomHoverText,
  randomIdleText
} from '../bee/bee-texts.js';
import {
  applyPageTransition
} from '../materials/page-transition.js';

const BEE_A = .3;

const BEE_B = 1.5;

const BEE_C = 1;

const BEE_D = 10;

const BEE_E = .0085;

const BEE_F = 5;

const BEE_G = Math.PI * .5;

const BEE_H = Math.PI * .5;

const BEE_I = 0;

const BEE_J = Math.PI;

const BEE_K = .012;

const BEE_L = .42;

export class Bee extends Object3D {
  constructor(e) {
    var t;
    super(), emitter.register(this), this._onHideAllIndications = () => this._onHideAllBeeTextIndications(), emitter.on(EVENTS.BEE_TEXT_HIDE_ALL, this._onHideAllIndications), this._suppressIndications = !1, this._pageTransitionUniforms = e, this._factorShadowSize = 2, this._cameraDimensions = app.webgl.topCamera.dimensions, this._lastScroll = ((t = app.lenis) == null ? void 0 : t.animatedScroll) ?? 0, this._scrollVelocity = 0, this._flapBoost = 0, this._scrollSign = 1, this._scrollDirectionY = BEE_I, this._pathHeadingY = 0, this._pathPitch = 0, this._lastGroupX = 0, this._lastGroupY = 0, this._pathHeadingFromPath = null, this._pathPitchFromPath = null, this._landPitchFromPath = null, this._landSkyZ = 0, this._pathSkyZ = 0, this._wingMeshes = [], this._torsoMeshes = [], this._pointerNdc = new Vector2, this._raycaster = new Raycaster, this._raycastTargets = [], this._isHovered = !1, this._indicationVisible = !1, this._indicationMode = null, this._lastGenericPhrase = null, this._lastHoverPhrase = null, this._indicationPlacement = null, this._genericScheduleCall = null, this._genericHideCall = null, this._leaveHideCall = null, this._hasClicked = !1, this._ambientTeasersActive = !1, this._conversationThread = null, this._conversationStep = -1, this._lastBeeClickTime = 0, this._bounceTimeline = null, this.baseRotation = {
      x: BEE_G,
      y: 0,
      z: BEE_H
    }, this.directionalLight = this._createDirectionalLight(), this._beeMesh = this._createBeeMesh()
  }
  render(e, t) {
    var A, m;
    const n = ((A = app.lenis) == null ? void 0 : A.animatedScroll) ?? this._lastScroll,
      i = n - this._lastScroll;
    this._lastScroll = n, Math.abs(i) > .01 && (this._scrollSign = Math.sign(i));
    const r = Math.abs(i) / Math.max(t, .001),
      o = this._scrollVelocity;
    this._scrollVelocity = lerp(this._scrollVelocity, r, 1 - Math.exp(-12 * t));
    const a = (this._scrollVelocity - o) / Math.max(t, .001),
      l = a > 0 ? Math.min(a * BEE_E, BEE_F) : 0;
    this._flapBoost = lerp(this._flapBoost, l, 1 - Math.exp(-18 * t));
    const u = this.parent,
      h = u ? u.position.x - this._lastGroupX : 0,
      c = u ? u.position.y - this._lastGroupY : 0;
    u && (this._lastGroupX = u.position.x, this._lastGroupY = u.position.y), this._updateScrollDirection(t), this._updatePathHeading(t, h, c, i), this._updatePathPitch(t), this._applyBeeOrientation();
    const d = e * .001,
      f = BEE_D + this._flapBoost;
    if (this._applyWingFlap(d, f), this._indicationVisible) {
      const g = this._getIndicationPlacement();
      this._indicationPlacement !== g && (this._indicationPlacement = g, this._indicationMode === "generic" && ((m = this._genericHideCall) == null || m.kill(), this._genericHideCall = gsap.delayedCall(BEE_TEXT_B, () => {
        this._genericHideCall = null, this._indicationMode === "generic" && (this._hideBeeText(), this.visible && !this._hasClicked && !this._isHovered ? this._scheduleGenericIndication() : this.visible && !this._hasClicked && this._isHovered && (this._ambientTeasersActive = !1, this._revealGenericOnHover()))
      }))), this._updateHoverIndicationAnchor()
    }
  }
  _getIndicationPlacement() {
    return this._scrollSign >= 0 ? "bottomLeft" : "top"
  }
  _setPointerCursor(e) {
    isTouch() || (document.body.style.cursor = e ? "pointer" : "")
  }
  _onHoverEnter() {
    var e;
    this._setPointerCursor(!0), (e = this._leaveHideCall) == null || e.kill(), this._leaveHideCall = null, this._indicationMode !== "conversation" && (this._playHoverEnterSound(), this._playClickBounce(), this._revealGenericOnHover())
  }
  _onHoverLeave() {
    this._setPointerCursor(!1), this._scheduleLeaveHide()
  }
  _ensureAmbientTeasers() {
    var e;
    this._suppressIndications || (e = app.webgl) != null && e._pageTransitionHidingGroups || this._hasClicked || this._ambientTeasersActive || !this.visible || (this._ambientTeasersActive = !0, this._scheduleGenericIndication(!0))
  }
  _stopAmbientTeasers({
    hideGenericText: e = !1
  } = {}) {
    this._ambientTeasersActive = !1, this._killGenericTimers(), e && this._indicationMode === "generic" && this._hideBeeText()
  }
  _scheduleLeaveHide() {
    var e;
    this._indicationVisible && ((e = this._leaveHideCall) == null || e.kill(), this._leaveHideCall = gsap.delayedCall(BEE_TEXT_D, () => {
      if (this._leaveHideCall = null, this._indicationMode === "conversation") {
        this._closeConversation();
        return
      }
      this._hasClicked = !1, this._hideBeeText(), this._ambientTeasersActive = !1, this._ensureAmbientTeasers()
    }))
  }
  _killGenericTimers() {
    var e, t;
    (e = this._genericScheduleCall) == null || e.kill(), this._genericScheduleCall = null, (t = this._genericHideCall) == null || t.kill(), this._genericHideCall = null
  }
  _scheduleGenericIndication(e = !1) {
    var n;
    if (this._hasClicked || !this.visible) {
      this._ambientTeasersActive = !1;
      return
    }(n = this._genericScheduleCall) == null || n.kill();
    const t = e ? BEE_TEXT_A : BEE_TEXT_C;
    this._genericScheduleCall = gsap.delayedCall(t, () => {
      var i;
      if (this._genericScheduleCall = null, this._hasClicked || !this.visible) {
        this._ambientTeasersActive = !1;
        return
      }
      if (this._suppressIndications || (i = app.webgl) != null && i._pageTransitionHidingGroups) {
        this._ambientTeasersActive = !1, this._scheduleGenericIndication();
        return
      }
      this._showGenericIndication()
    })
  }
  _showGenericIndication() {
    var t;
    if (this._suppressIndications || (t = app.webgl) != null && t._pageTransitionHidingGroups) {
      this._ambientTeasersActive = !1, this._scheduleGenericIndication();
      return
    }
    if (this._hasClicked || !this.visible) {
      this._ambientTeasersActive = !1;
      return
    }
    const e = randomIdleText(this._lastGenericPhrase);
    this._lastGenericPhrase = e, this._revealGenericPhrase(e)
  }
  _revealGenericOnHover() {
    if (this._suppressIndications || this._hasClicked || !this.visible || this._indicationMode === "conversation") return;
    this._killGenericTimers();
    const e = randomHoverText(this._lastHoverPhrase);
    this._lastHoverPhrase = e, this._revealGenericPhrase(e)
  }
  _revealGenericPhrase(e) {
    var t;
    this._indicationMode = "generic", this._showBeeText(e), (t = this._genericHideCall) == null || t.kill(), this._genericHideCall = gsap.delayedCall(BEE_TEXT_B, () => {
      this._genericHideCall = null, !(this._indicationMode !== "generic" || this._hasClicked) && (this._hideBeeText(), this.visible && !this._hasClicked && !this._isHovered ? this._scheduleGenericIndication() : this.visible && !this._hasClicked && this._isHovered && (this._ambientTeasersActive = !1, this._revealGenericOnHover()))
    })
  }
  _showBeeText(e) {
    var t;
    this._suppressIndications || (t = app.webgl) != null && t._pageTransitionHidingGroups || (this._indicationVisible = !0, this._indicationPlacement = this._getIndicationPlacement(), emitter.emit(EVENTS.CONTENT_BEE_TEXT_CHANGE, e, !0, {
      placement: this._indicationPlacement,
      mode: this._indicationMode
    }), this._updateHoverIndicationAnchor())
  }
  _hideBeeText() {
    var t, n;
    if ((t = this._genericHideCall) == null || t.kill(), this._genericHideCall = null, (n = this._leaveHideCall) == null || n.kill(), this._leaveHideCall = null, !this._indicationVisible) {
      this._indicationMode = null;
      return
    }
    const e = this._indicationMode;
    this._indicationVisible = !1, this._indicationMode = null, this._indicationPlacement = null, emitter.emit(EVENTS.CONTENT_BEE_TEXT_CHANGE, null, !1, {
      mode: e
    })
  }
  _endConversation() {
    this._conversationThread = null, this._conversationStep = -1
  }
  _closeConversation() {
    var e;
    if ((e = this._leaveHideCall) == null || e.kill(), this._leaveHideCall = null, this._endConversation(), this._hasClicked = !1, this._hideBeeText(), this._ambientTeasersActive = !1, this._isHovered) {
      this._revealGenericOnHover();
      return
    }
    this._ensureAmbientTeasers()
  }
  _releaseSuppressedIndicationsIfReady() {
    var e, t;
    !this._suppressIndications || (e = app.webgl) != null && e._pageTransitionHidingGroups || !((t = app.webgl) != null && t.isPlaygroundPageActive) || !this.visible || (this._suppressIndications = !1, this._ambientTeasersActive = !1)
  }
  _playHoverEnterSound() {
    var e;
    (e = app.soundController) == null || e.playSfx(FRUIT_SOUND_2)
  }
  _playClickSound() {
    var e;
    (e = app.soundController) == null || e.playSfx(FRUIT_SOUND_1)
  }
  _playClickBounce() {
    var n;
    if (!this._beeMesh) return;
    const e = .9,
      t = 1.07;
    (n = this._bounceTimeline) == null || n.kill(), gsap.killTweensOf(this._beeMesh.scale), gsap.killTweensOf(this._beeMesh.position), this._beeMesh.scale.set(1, 1, 1), this._beeMesh.position.y = 0, this._bounceTimeline = gsap.timeline({
      onComplete: () => {
        this._bounceTimeline = null
      }
    }), this._bounceTimeline.to(this._beeMesh.scale, {
      x: e,
      y: e,
      z: e,
      duration: .06,
      ease: "power2.in"
    }, 0), this._bounceTimeline.to(this._beeMesh.position, {
      y: -.025,
      duration: .06,
      ease: "power2.in"
    }, 0), this._bounceTimeline.to(this._beeMesh.scale, {
      x: t,
      y: t,
      z: t,
      duration: .1,
      ease: "power2.out"
    }), this._bounceTimeline.to(this._beeMesh.position, {
      y: .045,
      duration: .1,
      ease: "power2.out"
    }, "-=0.1"), this._bounceTimeline.to(this._beeMesh.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: .32,
      ease: "elastic.out(1, 0.7)"
    }), this._bounceTimeline.to(this._beeMesh.position, {
      y: 0,
      duration: .32,
      ease: "elastic.out(1, 0.7)"
    }, "-=0.32")
  }
  _advanceConversation() {
    var i, r;
    if (this._suppressIndications) return;
    this._stopAmbientTeasers(), this._hasClicked = !0;
    const e = (i = this._conversationThread) == null ? void 0 : i.lines;
    if (this._conversationThread && this._conversationStep >= 0 && this._conversationStep < e.length - 1) this._conversationStep += 1;
    else {
      const o = ((r = this._conversationThread) == null ? void 0 : r.id) ?? null;
      this._conversationThread = randomConversation(o), this._conversationStep = 0
    }
    const n = this._conversationThread.lines[this._conversationStep];
    this._indicationMode = "conversation", this._showBeeText(n)
  }
  _onBeeClick() {
    var t;
    if (!this.visible) return;
    const e = performance.now();
    e - this._lastBeeClickTime < BEE_TEXT_E || (this._lastBeeClickTime = e, (t = this._leaveHideCall) == null || t.kill(), this._leaveHideCall = null, this._playClickBounce(), this._playClickSound(), this._advanceConversation())
  }
  _isPointerOverBee(e, t) {
    return !this.visible || !this._raycastTargets.length ? !1 : (this._pointerNdc.set(e, t), this._raycaster.setFromCamera(this._pointerNdc, app.webgl.topCamera), this._raycaster.intersectObjects(this._raycastTargets, !1).length > 0)
  }
  _updateHoverIndicationAnchor() {
    var i, r, o;
    if (!this._indicationVisible || !this.visible) return;
    const e = (r = (i = app.webgl) == null ? void 0 : i.topRenderer) == null ? void 0 : r.domElement,
      t = (o = app.webgl) == null ? void 0 : o.topCamera,
      n = beeScreenAnchor(this, t, e, this._getIndicationPlacement());
    n && emitter.emit(EVENTS.CONTENT_BEE_CURSOR_ANCHOR_UPDATE, n)
  }
  _updateHoverFromPointer(e, t) {
    if (isTouch() || !this.visible || !this._raycastTargets.length) {
      this._isHovered && (this._isHovered = !1, this._onHoverLeave());
      return
    }
    this._pointerNdc.set(e, t), this._raycaster.setFromCamera(this._pointerNdc, app.webgl.topCamera);
    const i = this._raycaster.intersectObjects(this._raycastTargets, !1).length > 0;
    i !== this._isHovered && (this._isHovered = i, i ? this._onHoverEnter() : this._onHoverLeave())
  }
  onPointerDown({
    webgl: {
      x: e,
      y: t
    }
  }) {
    if (!isTouch()) {
      if (this._isPointerOverBee(e, t)) {
        this._onBeeClick();
        return
      }
      this._indicationMode === "conversation" && this._indicationVisible && this._closeConversation()
    }
  }
  onPointerMove({
    webgl: {
      x: e,
      y: t
    }
  }) {
    isTouch() || this._updateHoverFromPointer(e, t)
  }
  onTick() {
    if (!isTouch()) {
      if (!this.visible) {
        this._isHovered && (this._isHovered = !1, this._onHoverLeave()), this._stopAmbientTeasers({
          hideGenericText: !0
        }), this._indicationVisible && this._hideBeeText();
        return
      }
      this._releaseSuppressedIndicationsIfReady(), !this._suppressIndications && (this._ensureAmbientTeasers(), this._indicationVisible && this._updateHoverIndicationAnchor())
    }
  }
  _onHideAllBeeTextIndications() {
    this._suppressIndications = !0, this._resetHoverState({
      emitTextChange: !1
    })
  }
  _resetHoverState({
    emitTextChange: e = !0
  } = {}) {
    var i, r;
    this._isHovered = !1, this._setPointerCursor(!1), this._killGenericTimers(), (i = this._leaveHideCall) == null || i.kill(), this._leaveHideCall = null, this._ambientTeasersActive = !1, this._endConversation(), this._hasClicked = !1, this._lastBeeClickTime = 0, (r = this._bounceTimeline) == null || r.kill(), this._bounceTimeline = null, this._beeMesh && (gsap.killTweensOf(this._beeMesh.scale), gsap.killTweensOf(this._beeMesh.position), this._beeMesh.scale.set(1, 1, 1), this._beeMesh.position.y = 0);
    const t = this._indicationVisible,
      n = this._indicationMode;
    this._indicationVisible = !1, this._indicationMode = null, this._indicationPlacement = null, t && e && emitter.emit(EVENTS.CONTENT_BEE_TEXT_CHANGE, null, !1, {
      mode: n
    })
  }
  resetMotion() {
    var t;
    const e = this.parent;
    this._lastScroll = ((t = app.lenis) == null ? void 0 : t.animatedScroll) ?? 0, this._scrollVelocity = 0, this._flapBoost = 0, this._resetHoverState({
      emitTextChange: !1
    }), this._suppressIndications = !1, this._scrollSign = 1, this._scrollDirectionY = BEE_I, this._pathHeadingY = 0, this._pathPitch = 0, this._lastGroupX = (e == null ? void 0 : e.position.x) ?? 0, this._lastGroupY = (e == null ? void 0 : e.position.y) ?? 0, this.setPathMotion({
      heading: null,
      pitch: null,
      landPitch: null,
      landSkyZ: 0,
      skyZ: 0
    })
  }
  setPathMotion({
    heading: e = null,
    pitch: t = null,
    landPitch: n = null,
    landSkyZ: i = 0,
    skyZ: r = 0
  } = {}) {
    this._pathHeadingFromPath = typeof e == "number" ? e : null, this._pathPitchFromPath = typeof t == "number" ? t : null, this._landPitchFromPath = typeof n == "number" ? n : null, this._landSkyZ = i, this._pathSkyZ = r, this._beeMesh && (this._beeMesh.position.z = BEE_A + this._pathSkyZ)
  }
  _updateScrollDirection(e) {
    const t = this._scrollSign > 0 ? BEE_I : BEE_J,
      n = 1 - Math.exp(-12 * e);
    this._scrollDirectionY = lerp(this._scrollDirectionY, t, n)
  }
  _updatePathHeading(e, t, n, i) {
    const r = 1 - Math.exp(-14 * e);
    if (typeof this._pathHeadingFromPath == "number") {
      this._pathHeadingY = lerp(this._pathHeadingY, this._pathHeadingFromPath, r);
      return
    }
    const o = t,
      a = n + i * BEE_K;
    if (Math.hypot(o, a) <= 8e-5) return;
    const u = Math.atan2(o, a);
    this._pathHeadingY = lerp(this._pathHeadingY, u, r)
  }
  _clampPitch(e) {
    return Math.min(BEE_L, Math.max(-BEE_L, e))
  }
  _updatePathPitch(e) {
    const t = 1 - Math.exp(-14 * e);
    let n = 0;
    typeof this._pathPitchFromPath == "number" && Math.abs(this._pathPitchFromPath) > 1e-5 ? n = -this._pathPitchFromPath : typeof this._landPitchFromPath == "number" && (n = -this._landPitchFromPath), this._pathPitch = lerp(this._pathPitch, this._clampPitch(n), t)
  }
  syncShadowFrustum(e) {
    this._cameraDimensions = e;
    const t = this.directionalLight.shadow.camera,
      n = e.height * .5,
      i = e.width * .5;
    t.top = n * this._factorShadowSize, t.right = i, t.bottom = -n * this._factorShadowSize, t.left = -i, t.updateProjectionMatrix()
  }
  setCastShadowEnabled(e) {
    this.directionalLight.castShadow = e, this.traverse(t => {
      t.isMesh && (t.castShadow = e)
    })
  }
  _createDirectionalLight() {
    const e = new DirectionalLight(16777215, .5);
    e.position.z = 5, e.castShadow = !0, e.shadow.mapSize.width = 2048, e.shadow.mapSize.height = 2048, e.shadow.camera.near = .05, e.shadow.camera.far = 6;
    const {
      height: t,
      width: n
    } = this._cameraDimensions;
    return e.shadow.camera.top = t * .5 * this._factorShadowSize, e.shadow.camera.right = n * .5, e.shadow.camera.bottom = -t * .5 * this._factorShadowSize, e.shadow.camera.left = -n * .5, this.add(e), e
  }
  _createBeeMaterial() {
    const e = app.core.assetsManager.get("beeTex");
    e.flipY = !1;
    const t = new MeshPhongMaterial({
      map: e
    });
    return applyPageTransition(t, this._pageTransitionUniforms, {
      revealScale: this._pageTransitionUniforms.uBeeRevealScale
    }), t
  }
  _createWingMaterial() {
    const e = new MeshPhongMaterial({
      transparent: !0,
      opacity: .7
    });
    return applyPageTransition(e, this._pageTransitionUniforms, {
      revealScale: this._pageTransitionUniforms.uBeeRevealScale
    }), e
  }
  _applyBeeOrientation() {
    if (!this._beeMesh) return;
    const {
      x: e,
      y: t,
      z: n
    } = this.baseRotation, i = t + this._pathHeadingY + this._scrollDirectionY;
    this._beeMesh.rotation.set(e + this._pathPitch, i, n)
  }
  _applyWingFlap(e, t) {
    this._wingMeshes[0] && (this._wingMeshes[0].rotation.z = Math.abs(Math.sin(e * t)) * BEE_B - BEE_C), this._wingMeshes[1] && (this._wingMeshes[1].rotation.z = Math.abs(Math.cos(e * t)) * BEE_B - BEE_C)
  }
  _createBeeMesh() {
    // The train model stands in for the bee (see TrainModel.js); same pivot/offset as the bee had.
    const e = createTrainModel({
      pageTransitionUniforms: this._pageTransitionUniforms,
      onMesh: (o) => { this._torsoMeshes.push(o), this._raycastTargets.push(o) }
    });
    return e.position.z = BEE_A, this.add(e), e
  }
}
