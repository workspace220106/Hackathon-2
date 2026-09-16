import {
  gsap
} from 'gsap';
import {
  Box3,
  BoxGeometry,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  Object3D,
  Plane,
  Raycaster,
  Vector2,
  Vector3
} from 'three';
import {
  EntityManager,
  GameEntity,
  PursuitBehavior,
  SeekBehavior,
  Vector3 as YukaVector3,
  Vehicle
} from 'yuka';
import {
  app
} from '../../core/App.js';
import { createTrainModel } from './TrainModel.js';
import { COIN_SIZE, createCoinModel } from './CoinModel.js';
import {
  isSafari
} from '../../utils/browser.js';
import {
  lerp
} from '../../utils/math.js';
import {
  FRUIT_A,
  FRUIT_B,
  FRUIT_C,
  FRUIT_SCALE_A,
  FRUIT_SCALE_B,
  applyLitPageTransition,
  applyPageTransition
} from '../materials/page-transition.js';

export class Fruits extends Object3D {
  constructor(e, t) {
    super(), this._pageTransitionUniforms = t, this.enterScaleGroup = new Group, this.add(this.enterScaleGroup), this._debugMaterial = new MeshNormalMaterial, this._cameraDimensions = app.webgl.topCamera.dimensions, this._mouseCoords = new Vector2(0, 0), this._cursorLerp = 14, this._factorShadowSize = 2, this._params = e, this._pointerNdc = new Vector2, this._raycaster = new Raycaster, this._worldHit = new Vector3, this._pointerPlane = new Plane(new Vector3(0, 0, 1), -.48), this.directionalLight = this._createDirectionalLight(), this._meshPursuer = this._createMeshPursuer(), this._entityPursuer = this._createEntityPursuer(this._meshPursuer), this._entityPursuer.mass = this._params.massPursuer, this._entityPursuer.maxForce = this._params.maxForcePursuer, this._entityPursuer.maxSpeed = this._params.maxSpeedPursuer, this._meshEvader = this._createMeshEvader(), this._meshEvader.visible = !1, this._entityEvader = this._createEntityEvader(this._meshEvader), this._entityEvader.mass = this._params.massEvader, this._entityEvader.maxForce = this._params.maxForceEvader, this._entityEvader.maxSpeed = this._params.maxSpeedEvader, this._pursuitBehavior = new PursuitBehavior(this._entityEvader, 5), this._entityPursuer.steering.add(this._pursuitBehavior), this._entityEvaderTarget = new YukaVector3, this._meshEvaderTarget = this._createMeshEvaderTarget(), this._meshEvaderTarget.visible = !1;
    const n = new SeekBehavior(this._entityEvaderTarget);
    this._entityEvader.steering.add(n), this._groupTarget = this._createGroupTarget(), this._entityTarget = this._createEntityTarget(), this._groupTarget.matrixAutoUpdate = !0, this._pursuerSeekBehavior = new SeekBehavior(this._entityTarget.position), this._entityManager = new EntityManager, this._entityManager.add(this._entityPursuer), this._entityManager.add(this._entityEvader), this._fruitCounter = 0, this._selectedFruit = null, this._fruitTimeline = null, this._spawnTimeline = null, this._scaleTimeline = null, this._fruitMode = "hidden", this._zoneActive = !1, this._isBeeChasing = !1, this._previousPointer = {
      x: 0,
      y: 0
    }, this._hasPointerHistory = !1, this._targetRotationZ = 0, this._currentRotationZ = 0, this._lastPointerMoveTime = 0, this._pointerSpeedResetMs = 50, this._rotationDamping = 6, this._speedScaleDamping = 6, this._pointerSpeedFactor = .02, this._rotationVisualDegrees = 110, this._targetSpeedScale = 1, this._currentSpeedScale = 1, this._fruitGroundZ = isSafari() ? FRUIT_C : FRUIT_B, this._fruitHoverZ = .48, this._hideDuration = .22, this._gravity = 18, this._fallVelocityZ = 0, this._fallAngularVelX = 0, this._fallAngularVelZ = 0, this._fallLandX = 0, this._fallLandY = 0, this._fallSettled = !1, this._fallDisappearStarted = !1, this._fallHasLanded = !1, this._fallImpactTween = null, this._fallDisappearTween = null, this._fruit1SoundCall = null, this._dropCallback = null, this._isSpawning = !1, this._cursorFruitHidden = !1, this._spawnWhileFalling = !1, this._playFruit2OnDisappear = !1, this._orbitRadius = .75, this._orbitSpeed = 9
  }
  setFruitsVisible(e) {
    const t = this._groupTarget.getObjectByName("orange"),
      n = this._groupTarget.getObjectByName("raisin");
    t && (t.visible = e), n && (n.visible = e)
  }
  setCastShadowEnabled(e) {
    this.directionalLight.castShadow = e, this.traverse(t => {
      t.isMesh && (t.castShadow = e)
    })
  }
  syncShadowFrustum(e) {
    const t = this.directionalLight.shadow.camera,
      n = e.height * .5,
      i = e.width * .5;
    this._params.hasCutShadow ? t.top = n : t.top = n * this._factorShadowSize, t.right = i, t.bottom = -e.height * .5 * this._factorShadowSize, t.left = -i, t.updateProjectionMatrix()
  }
  _createDirectionalLight() {
    const e = new DirectionalLight(16777215, .5);
    return e.position.z = 5, e.castShadow = !0, e.shadow.mapSize.width = 2048, e.shadow.mapSize.height = 2048, e.shadow.camera.near = .05, e.shadow.camera.far = 6, this._params.hasCutShadow ? e.shadow.camera.top = this._cameraDimensions.height * .5 : e.shadow.camera.top = this._cameraDimensions.height * .5 * this._factorShadowSize, e.shadow.camera.right = this._cameraDimensions.width * .5, e.shadow.camera.bottom = -this._cameraDimensions.height * .5 * this._factorShadowSize, e.shadow.camera.left = -this._cameraDimensions.width * .5, this.add(e), e
  }
  _sync(e, t) {
    t.matrix.copy(e.worldMatrix)
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
  _createMeshPursuer() {
    // the fruit-chasing flyer is the train too (see TrainModel.js)
    const e = createTrainModel({ pageTransitionUniforms: this._pageTransitionUniforms });
    return e.matrixAutoUpdate = !1, this.enterScaleGroup.add(e), e
  }
  _createEntityPursuer(e) {
    const t = new Vehicle;
    return t.setRenderComponent(e, this._sync), t
  }
  _createMeshEvader() {
    const t = new BoxGeometry(.1, .1, .1, 1),
      n = new Mesh(t, this._debugMaterial);
    return n.matrixAutoUpdate = !1, this.enterScaleGroup.add(n), n
  }
  _createEntityEvader(e) {
    const t = new Vehicle;
    return t.setRenderComponent(e, this._sync), t
  }
  _createMeshEvaderTarget() {
    const t = new Mesh(new BoxGeometry, new MeshBasicMaterial({
      color: new Color("#00FF00")
    }));
    return this.enterScaleGroup.add(t), t.scale.set(.05, .05, .05), t
  }
  _createGroupTarget() {
    // Both "fruits" are coins now (see CoinModel.js); the names are kept so the
    // existing spawn / chase / catch logic keeps working unchanged.
    const e = new Group,
      lit = (revealScale, strength) => (mat) => applyLitPageTransition(mat, this._pageTransitionUniforms, strength, {
        revealScale: this._pageTransitionUniforms.uFruitRevealScale
      }),
      t = createCoinModel({ name: "orange", size: COIN_SIZE / 1.25, onMaterial: lit(1, 1.25) }),
      n = createCoinModel({ name: "raisin", size: COIN_SIZE / 2, onMaterial: lit(1, 1.4) });
    return t.scale.set(0, 0, 0), t.visible = !1, n.scale.set(0, 0, 0), n.visible = !1, e.add(t, n), e
  }
  _createEntityTarget() {
    return new GameEntity
  }
  _screenToWorld(e, t, n) {
    const i = app.webgl.topCamera,
      o = app.webgl.topRenderer.domElement.getBoundingClientRect();
    this._pointerNdc.x = (e - o.left) / o.width * 2 - 1, this._pointerNdc.y = -((t - o.top) / o.height) * 2 + 1, this._pointerPlane.constant = -n, this._raycaster.setFromCamera(this._pointerNdc, i);
    const a = this._raycaster.ray.intersectPlane(this._pointerPlane, this._worldHit);
    return a ? {
      x: a.x,
      y: a.y
    } : {
      x: this._mouseCoords.x,
      y: this._mouseCoords.y
    }
  }
  _hideAllFruits() {
    this._groupTarget.children.forEach(e => {
      e.scale.set(0, 0, 0), e.position.set(0, 0, 0)
    }), this._selectedFruit = null
  }
  _getFruitAnchorMinZ(e) {
    if (e.userData.anchorMinZ !== void 0) return e.userData.anchorMinZ;
    const t = e.scale.clone(),
      n = e.position.clone(),
      i = e.userData.targetScale ?? 1;
    e.scale.set(i, i, i), e.position.set(0, 0, 0), e.updateMatrixWorld(!0);
    const r = new Box3().setFromObject(e);
    return e.userData.anchorMinZ = r.min.z / i, e.scale.copy(t), e.position.copy(n), e.userData.anchorMinZ
  }
  _setFruitScaleFromBottom(e, t, n, i) {
    const r = this._getFruitAnchorMinZ(e);
    e.scale.set(t, n, i), e.position.z = -r * i
  }
  _resetFruitMeshPosition(e) {
    e && e.position.set(0, 0, 0)
  }
  _killFruit1SoundCall() {
    this._fruit1SoundCall && (this._fruit1SoundCall.kill(), this._fruit1SoundCall = null)
  }
  _scheduleFruit1Sound() {
    this._killFruit1SoundCall(), this._fruit1SoundCall = gsap.delayedCall(FRUIT_A, () => {
      var e;
      this._fruit1SoundCall = null, (e = app.soundController) == null || e.playSfx("fruit1")
    })
  }
  _pickNextFruit() {
    const e = this._fruitCounter % 2 === 0;
    this._fruitCounter++;
    const t = e ? "orange" : "raisin",
      n = e ? 1.25 : 2;
    return {
      mesh: this._groupTarget.getObjectByName(t),
      targetScale: n
    }
  }
  _killSpawnTimeline() {
    this._spawnTimeline && (this._spawnTimeline.kill(), this._spawnTimeline = null), this._isSpawning = !1
  }
  _playFruit2Sound() {
    var e;
    (e = app.soundController) == null || e.playSfx("fruit2")
  }
  _playSpawnAnimation(e, t) {
    e && (this._killSpawnTimeline(), this._playFruit2Sound(), this._isSpawning = !0, gsap.killTweensOf(e.scale), gsap.killTweensOf(e.position), e.rotation.set(0, 0, 0), e.position.set(0, 0, 0), e.scale.set(0, 0, 0), this._spawnTimeline = gsap.timeline({
      onComplete: () => {
        this._isSpawning = !1, this._spawnTimeline = null
      }
    }), this._spawnTimeline.to(e.scale, {
      x: t,
      y: t,
      z: t,
      duration: .5,
      ease: "power3.out"
    }, 0))
  }
  _showCursorFruit({
    hidden: e = !1
  } = {}) {
    this._fruitTimeline && this._fruitTimeline.kill(), this._killSpawnTimeline(), this.enterScaleGroup.add(this._groupTarget), this._hideAllFruits();
    const {
      mesh: t,
      targetScale: n
    } = this._pickNextFruit();
    if (t) {
      if (this._selectedFruit = t, t.userData.targetScale = n, delete t.userData.anchorMinZ, this._fruitMode = "cursor", this._cursorFruitHidden = e, this._groupTarget.position.set(this._mouseCoords.x, this._mouseCoords.y, this._fruitHoverZ), this._groupTarget.rotation.set(0, 0, 0), this._groupTarget.scale.set(1, 1, 1), this._targetRotationZ = 0, this._currentRotationZ = 0, this._targetSpeedScale = 1, this._currentSpeedScale = 1, this._hasPointerHistory = !1, this._groupTarget.children.forEach(i => {
          gsap.killTweensOf(i.scale), gsap.killTweensOf(i.position)
        }), gsap.killTweensOf(t.scale), t.rotation.set(0, 0, 0), t.position.set(0, 0, 0), e) {
        t.scale.set(0, 0, 0);
        return
      }
      this._playSpawnAnimation(t, n)
    }
  }
  isCursorFruitHidden() {
    return this._cursorFruitHidden
  }
  canPlaceFruit() {
    return this._fruitMode === "hidden"
  }
  canDropHeldFruit() {
    return this._fruitMode === "cursor" && !!this._selectedFruit
  }
  isInteractionLocked() {
    return this._isBeeChasing || this._fruitMode === "falling"
  }
  enterZone() {
    this._zoneActive = !0
  }
  leaveZone() {
    this._zoneActive = !1
  }
  abortFruitInteraction() {
    var e, t;
    this._dropCallback = null, this._killFruit1SoundCall(), this._fruitTimeline && (this._fruitTimeline.kill(), this._fruitTimeline = null), this._killSpawnTimeline(), this._fallImpactTween && (this._fallImpactTween.kill(), this._fallImpactTween = null), this._fallDisappearTween && (this._fallDisappearTween.kill(), this._fallDisappearTween = null), this._scaleTimeline && (this._scaleTimeline.kill(), this._scaleTimeline = null), gsap.killTweensOf((e = this._selectedFruit) == null ? void 0 : e.scale), gsap.killTweensOf((t = this._selectedFruit) == null ? void 0 : t.position), this._hideAllFruits(), this._groupTarget.rotation.set(0, 0, 0), this._groupTarget.scale.set(1, 1, 1), this._fruitMode = "hidden", this._cursorFruitHidden = !1, this._fallSettled = !1, this._fallDisappearStarted = !1, this._fallHasLanded = !1, this._fallVelocityZ = 0, this._isSpawning = !1, this._spawnWhileFalling = !1, this._playFruit2OnDisappear = !1, this._isBeeChasing = !1, this._targetRotationZ = 0, this._currentRotationZ = 0, this._targetSpeedScale = 1, this._currentSpeedScale = 1, this.enterScaleGroup.remove(this._groupTarget)
  }
  resetInteraction() {
    this.abortFruitInteraction(), this.leaveZone(), gsap.killTweensOf(this._entityPursuer), gsap.killTweensOf(this._groupTarget), gsap.killTweensOf(this._groupTarget.scale), this._entityPursuer.mass = this._params.massPursuer, this._entityPursuer.maxForce = this._params.maxForcePursuer, this._entityPursuer.maxSpeed = this._params.maxSpeedPursuer, this._entityPursuer.velocity.set(0, 0, 0), this._hasPointerHistory = !1, this._entityPursuer.steering.remove(this._pursuerSeekBehavior), this._entityPursuer.steering.behaviors.includes(this._pursuitBehavior) || this._entityPursuer.steering.add(this._pursuitBehavior)
  }
  updatePointer(e, t, {
    skipVelocity: n = !1
  } = {}) {
    if (e == null || t == null || this.isInteractionLocked()) return;
    const i = this._screenToWorld(e, t, this._fruitHoverZ);
    if (this._mouseCoords.set(i.x, i.y), !n) {
      const r = e - this._previousPointer.x,
        o = t - this._previousPointer.y,
        a = r !== 0 || o !== 0;
      if (this._hasPointerHistory && a) {
        const l = Math.sqrt(r * r + o * o);
        let u;
        Math.abs(r) > Math.abs(o) ? u = r > 0 ? l : -l : u = o > 0 ? l : -l;
        const h = Math.max(-1, Math.min(u * this._pointerSpeedFactor, 1));
        this._targetRotationZ = h, this._targetSpeedScale = 1 + Math.abs(h), this._lastPointerMoveTime = performance.now()
      }
      this._hasPointerHistory || (this._hasPointerHistory = !0, this._lastPointerMoveTime = performance.now())
    }
    this._previousPointer.x = e, this._previousPointer.y = t
  }
  _followCursor(e) {
    const t = 1 - Math.exp(-this._cursorLerp * e);
    this._groupTarget.position.x += (this._mouseCoords.x - this._groupTarget.position.x) * t, this._groupTarget.position.y += (this._mouseCoords.y - this._groupTarget.position.y) * t, this._groupTarget.position.z += (this._fruitHoverZ - this._groupTarget.position.z) * t
  }
  _getFruitBaseScale() {
    var e, t;
    return ((t = (e = this._selectedFruit) == null ? void 0 : e.userData) == null ? void 0 : t.targetScale) ?? 1
  }
  _applyCursorFruitVisual() {
    if (!this._selectedFruit || this._isSpawning || this._cursorFruitHidden) return;
    const e = this._currentRotationZ * this._rotationVisualDegrees * (Math.PI / 180),
      n = this._getFruitBaseScale() * this._currentSpeedScale;
    this._groupTarget.rotation.set(0, 0, e), this._groupTarget.scale.set(1, 1, 1), this._selectedFruit.rotation.set(0, 0, 0), this._resetFruitMeshPosition(this._selectedFruit), this._selectedFruit.scale.set(n, n, n)
  }
  _getFallScaleUpDuration() {
    return .5 + FRUIT_SCALE_A + FRUIT_SCALE_B
  }
  _resetFruitRotations() {
    this._groupTarget.rotation.set(0, 0, 0), this._selectedFruit && this._selectedFruit.rotation.set(0, 0, 0)
  }
  _updateCursorRotation(e) {
    performance.now() - this._lastPointerMoveTime > this._pointerSpeedResetMs && (this._targetRotationZ = 0, this._targetSpeedScale = 1);
    const t = 1 - Math.exp(-this._rotationDamping * e),
      n = 1 - Math.exp(-this._speedScaleDamping * e);
    if (this._currentRotationZ = lerp(this._currentRotationZ, this._targetRotationZ, t), this._currentSpeedScale = lerp(this._currentSpeedScale, this._targetSpeedScale, n), !this._cursorFruitHidden) {
      if (this._isSpawning) {
        const i = this._currentRotationZ * this._rotationVisualDegrees * (Math.PI / 180);
        this._groupTarget.rotation.set(0, 0, i), this._selectedFruit && this._selectedFruit.rotation.set(0, 0, 0);
        return
      }
      this._applyCursorFruitVisual()
    }
  }
  _updateFallStretch() {
    if (!this._selectedFruit || this._fallHasLanded || this._spawnWhileFalling) return;
    const e = this._selectedFruit,
      t = this._getFruitBaseScale(),
      n = Math.abs(this._fallVelocityZ),
      i = Math.min(n * .028, .35),
      r = 1 + i,
      o = 1 - i * .25;
    e.position.set(0, 0, 0), e.scale.set(t * o, t * o, t * r)
  }
  _playFallLandSquash() {
    if (!this._selectedFruit || this._fallHasLanded) return;
    const e = this._selectedFruit,
      t = this._getFruitBaseScale(),
      n = this._getFruitAnchorMinZ(e),
      i = t * 1.4,
      r = t * 1.4,
      o = t * .5;
    this._fallHasLanded = !0, this._fallSettled = !0, this._fallVelocityZ = 0, this._fallAngularVelX = 0, this._fallAngularVelZ = 0, this._resetFruitRotations(), this._fallImpactTween && this._fallImpactTween.kill(), this._scheduleFallDisappear(), this._setFruitScaleFromBottom(e, i, r, o), this._fallImpactTween = gsap.timeline(), this._fallImpactTween.to(e.scale, {
      x: t,
      y: t,
      z: t,
      duration: 1.25,
      ease: "elastic.out(1.25)"
    }, 0), this._fallImpactTween.to(e.position, {
      z: -n * t,
      duration: 1.25,
      ease: "elastic.out(1.25)"
    }, 0)
  }
  _updateBeeOrbitTarget(e) {
    this._entityTarget.position.x = this._mouseCoords.x + Math.cos(e * this._orbitSpeed) * this._orbitRadius, this._entityTarget.position.y = this._mouseCoords.y + Math.sin(e * this._orbitSpeed) * this._orbitRadius, this._entityTarget.position.z = this._params.zTargetPosition
  }
  _updateFallPhysics(e) {
    this._fallHasLanded || (this._groupTarget.position.x = this._fallLandX, this._groupTarget.position.y = this._fallLandY, this._fallVelocityZ -= this._gravity * e, this._groupTarget.position.z += this._fallVelocityZ * e, this._updateFallStretch(), this._groupTarget.position.z <= this._fruitGroundZ && (this._groupTarget.position.z = this._fruitGroundZ, this._alignGroupToFruitBottom(), this._playFallLandSquash()))
  }
  _alignGroupToFruitBottom() {
    if (!this._selectedFruit) return;
    const e = this._selectedFruit,
      t = this._getFruitBaseScale(),
      n = this._getFruitAnchorMinZ(e);
    e.position.set(0, 0, 0), e.scale.set(t, t, t), e.updateMatrixWorld(!0);
    const i = this._groupTarget.position.z + n * t;
    this._groupTarget.position.z += this._fruitGroundZ - i
  }
  _scheduleFallDisappear() {
    if (this._fallDisappearStarted || !this._selectedFruit) return;
    this._fallDisappearStarted = !0;
    const e = this._selectedFruit,
      t = e.userData.targetScale ?? e.scale.x;
    e.userData.targetScale = t, this._fallDisappearTween && this._fallDisappearTween.kill(), this._getFruitAnchorMinZ(e), this._fallDisappearTween = gsap.timeline({
      delay: FRUIT_SCALE_A,
      overwrite: "auto",
      onStart: () => {
        this._fallImpactTween && this._fallImpactTween.kill()
      },
      onComplete: () => {
        this._fallDisappearTween = null, this._onFallComplete()
      }
    }), this._fallDisappearTween.to(e.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: FRUIT_SCALE_B,
      ease: "elastic.in(1)"
    }, 0), this._fallDisappearTween.to(e.position, {
      z: 0,
      duration: FRUIT_SCALE_B,
      ease: "elastic.in(1)"
    }, 0)
  }
  showCursorFruit({
    hidden: e = !1
  } = {}) {
    this._fruitMode === "hidden" && this._showCursorFruit({
      hidden: e
    })
  }
  hideCursorFruit(e) {
    if (this._fruitMode !== "cursor" || !this._selectedFruit) return;
    this._fruitTimeline && this._fruitTimeline.kill(), this._killSpawnTimeline();
    const t = this._selectedFruit,
      n = t.userData.targetScale ?? t.scale.x;
    this._fruitMode = "hiding", this._fruitTimeline = gsap.timeline({
      onComplete: () => {
        this._hideAllFruits(), this._groupTarget.rotation.set(0, 0, 0), this._groupTarget.scale.set(1, 1, 1), this._targetRotationZ = 0, this._currentRotationZ = 0, this._targetSpeedScale = 1, this._currentSpeedScale = 1, this._cursorFruitHidden = !1, this._fruitMode = "hidden", this.enterScaleGroup.remove(this._groupTarget), e == null || e()
      }
    }), this._fruitTimeline.to(t.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: this._hideDuration,
      ease: "power2.out"
    }, 0), this._fruitTimeline.to(this._groupTarget.scale, {
      x: .55,
      y: .55,
      z: .55,
      duration: this._hideDuration,
      ease: "power2.in"
    }, 0), t.userData.targetScale = n
  }
  _finishDrop(e) {
    const t = e ?? this._dropCallback;
    this._dropCallback = null, t == null || t()
  }
  _interruptFall(e = !1) {
    var t, n;
    this._fruitTimeline && this._fruitTimeline.kill(), this._fallImpactTween && this._fallImpactTween.kill(), this._fallDisappearTween && this._fallDisappearTween.kill(), this._scaleTimeline && this._scaleTimeline.kill(), gsap.killTweensOf((t = this._selectedFruit) == null ? void 0 : t.scale), gsap.killTweensOf((n = this._selectedFruit) == null ? void 0 : n.position), this._hideAllFruits(), this._groupTarget.rotation.set(0, 0, 0), this._groupTarget.scale.set(1, 1, 1), this._fruitMode = "hidden", this._cursorFruitHidden = !1, this._fallSettled = !1, this._fallDisappearStarted = !1, this._fallHasLanded = !1, this._fallVelocityZ = 0, this._isSpawning = !1, this._spawnWhileFalling = !1, this.enterScaleGroup.remove(this._groupTarget), e ? this._finishDrop() : this._dropCallback = null
  }
  _cancelFruit() {
    this._killSpawnTimeline();
    const e = this._fruitMode === "falling";
    this._interruptFall(!1), this._isBeeChasing = !1, this._targetRotationZ = 0, this._currentRotationZ = 0, this._targetSpeedScale = 1, this._currentSpeedScale = 1, this.resetDefaultMovement(), e && this._finishDrop()
  }
  dropFruit(e, {
    spawnWhileFalling: t = !1
  } = {}) {
    if (this._fruitMode !== "cursor" || !this._selectedFruit) return !1;
    this._fruitTimeline && this._fruitTimeline.kill(), this._killSpawnTimeline(), this._fallImpactTween && this._fallImpactTween.kill(), this._fallDisappearTween && this._fallDisappearTween.kill(), this._scaleTimeline && this._scaleTimeline.kill();
    const n = this._selectedFruit,
      i = n.userData.targetScale ?? n.scale.x;
    return n.userData.targetScale = i, this._resetFruitMeshPosition(n), this._cursorFruitHidden = !1, gsap.killTweensOf(n.scale), t ? (this._spawnWhileFalling = !0, n.scale.set(0, 0, 0), this._spawnTimeline = gsap.to(n.scale, {
      x: i,
      y: i,
      z: i,
      duration: .5,
      ease: "power3.out",
      onComplete: () => {
        this._spawnWhileFalling = !1, this._spawnTimeline = null
      }
    })) : (this._spawnWhileFalling = !1, n.scale.set(i, i, i)), this._fallLandX = this._groupTarget.position.x, this._fallLandY = this._groupTarget.position.y, this._fallVelocityZ = -1.2, this._fallAngularVelX = 0, this._fallAngularVelZ = 0, this._resetFruitRotations(), this._fallSettled = !1, this._fallDisappearStarted = !1, this._fallHasLanded = !1, this._dropCallback = e ?? null, this._playFruit2OnDisappear = t, this._scheduleFruit1Sound(), this._fruitMode = "falling", this._isBeeChasing = !0, this._mouseCoords.set(this._fallLandX, this._fallLandY), this._entityPursuer.steering.remove(this._pursuitBehavior), this._entityPursuer.steering.add(this._pursuerSeekBehavior), gsap.to(this._entityPursuer, {
      mass: this._params.massPursuerClick,
      maxForce: this._params.maxForcePursuerClick,
      maxSpeed: this._params.maxSpeedPursuerClick,
      duration: .4,
      ease: "power2.out",
      overwrite: !0
    }), this._groupTarget.scale.set(.75, .75, .75), this._scaleTimeline = gsap.to(this._groupTarget.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: this._getFallScaleUpDuration(),
      ease: "power1.out"
    }), !0
  }
  _onFallComplete() {
    this._playFruit2OnDisappear && (this._playFruit2OnDisappear = !1, this._playFruit2Sound()), this._hideAllFruits(), this._groupTarget.rotation.set(0, 0, 0), this._groupTarget.scale.set(1, 1, 1), this._fruitMode = "hidden", this._cursorFruitHidden = !1, this._fallSettled = !1, this._fallDisappearStarted = !1, this._fallHasLanded = !1, this._fallVelocityZ = 0, this._isSpawning = !1, this._spawnWhileFalling = !1, this._scaleTimeline && this._scaleTimeline.kill(), this._fallImpactTween && this._fallImpactTween.kill(), this._fallDisappearTween && this._fallDisappearTween.kill(), this.enterScaleGroup.remove(this._groupTarget), this._finishDrop()
  }
  resetDefaultMovement() {
    this._fruitTimeline && this._fruitMode !== "falling" && this._fruitTimeline.kill(), this._isBeeChasing = !1, this._entityPursuer.steering.add(this._pursuitBehavior), this._entityPursuer.steering.remove(this._pursuerSeekBehavior), gsap.to(this._entityPursuer, {
      mass: this._params.massPursuer,
      maxForce: this._params.maxForcePursuer,
      maxSpeed: this._params.maxSpeedPursuer,
      duration: .4,
      ease: "power2.inOut"
    })
  }
  render(e, t) {
    this._cameraDimensions = app.webgl.topCamera.dimensions, this._entityManager.update(t);
    const n = e * .001;
    if (this._entityEvaderTarget.x = Math.cos(n) * Math.sin(n * .2) * this._params.xRange, this._entityEvaderTarget.y = Math.sin(n * .8) * this._params.yRange, this._entityEvaderTarget.z = this._params.zTargetPosition + Math.abs(Math.sin(n)) * this._params.zRange, this._meshEvaderTarget.position.copy(this._entityEvaderTarget), this._isBeeChasing && this._updateBeeOrbitTarget(n), this._fruitMode === "falling") this._updateFallPhysics(t);
    else if (this._fruitMode === "cursor" || this._fruitMode === "hiding")
      if (this._followCursor(t), this._fruitMode === "cursor") this._updateCursorRotation(t);
      else {
        const o = 1 - Math.exp(-12 * t),
          a = 1 - Math.exp(-12 * t);
        this._currentRotationZ = lerp(this._currentRotationZ, 0, o), this._currentSpeedScale = lerp(this._currentSpeedScale, 1, a), this._applyCursorFruitVisual()
      } const r = 2 * this._entityPursuer.getSpeedSquared() + 15;
    /* wing flap removed: the pursuer is the train model (no wings) */ void n, void r
  }
  destroy() {
    this.resetInteraction()
  }
}
