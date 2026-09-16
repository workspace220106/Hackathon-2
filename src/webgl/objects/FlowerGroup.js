import {
  gsap
} from 'gsap';
import {
  Color,
  LinearFilter,
  SRGBColorSpace,
  VideoTexture,
  Group,
  Mesh,
  MeshBasicMaterial
} from 'three';
import {
  resumeMediaAutoplay
} from '../../composables/useMediaAutoplay.js';
import {
  app
} from '../../core/App.js';
import {
  EVENTS,
  emitter
} from '../../core/events.js';
import {
  FlowerBackgroundMaterial
} from '../materials/FlowerBackgroundMaterial.js';
import {
  coverScale
} from '../materials/page-transition.js';

const FLOWER_A = 1;

const FLOWER_PI = Math.PI;

// Page-transition cover: the original showed a dark green disc with a spinning daisy.
// It now plays the "guard" video inside the same growing circle mask (flower hidden).
const TRANSITION_VIDEO_SRC = '/assets/medias/loader/guard.mp4';

function createTransitionVideo() {
  const video = document.createElement('video');
  video.src = TRANSITION_VIDEO_SRC;
  video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'auto';
  video.setAttribute('muted', ''); video.setAttribute('playsinline', ''); video.setAttribute('aria-hidden', 'true');
  Object.assign(video.style, { position: 'fixed', left: '0', top: '0', width: '2px', height: '2px', opacity: '0.01', pointerEvents: 'none', zIndex: '-1' });
  (document.getElementById('webgl-top-app') || document.body).appendChild(video);
  const texture = new VideoTexture(video);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter; texture.magFilter = LinearFilter; texture.generateMipmaps = false;
  return { video, texture };
}

export class FlowerGroup extends Group {
  constructor(e, t) {
    super(), emitter.register(this), this._planeGeometry = e, this._transitionUniforms = t, this._flowerSpinTween = null, this._colors = {
      home: {
        r: .9686274509803922,
        g: .9686274509803922,
        b: .9686274509803922
      },
      about: {
        r: .031,
        g: .239,
        b: .165
      },
      playground: {
        r: .9647,
        g: .8784,
        b: .0863
      }
    }
  }
  onAppLoaded() {
    this._cameraDimensions = app.webgl.topCamera.dimensions, this._flowerMesh = this._createFlowerMesh(), this._flowerMesh.visible = !1, this._transitionVideo = createTransitionVideo(), this._backgroundMesh = this._createBackgroundMesh()
  }
  onAttach() {}
  _createFlowerMesh() {
    const e = app.core.assetsManager.get("flowerModel").clone(),
      t = app.core.assetsManager.get("flowerTex");
    return t.flipY = !1, e.traverse(n => {
      n.isMesh && (n.material = new MeshBasicMaterial({
        map: t,
        transparent: !0
      }), n.renderOrder = FLOWER_A + 1, n.geometry = n.geometry.clone(), n.geometry.scale(.125, .125, .125))
    }), e.scale.set(0, 0, 0), e.position.z = 1, this.add(e), e
  }
  _createBackgroundMesh() {
    const e = new FlowerBackgroundMaterial({
        transparent: !0,
        depthWrite: !1,
        uniforms: {
          uResolution: this._transitionUniforms.uResolution,
          uTransition: this._transitionUniforms.uTransition,
          uColor: {
            value: new Color(this._colors.about.r, this._colors.about.g, this._colors.about.b)
          },
          uTexture: { value: this._transitionVideo.texture },
          uVideoAspect: { value: 16 / 9 },
          uHasTexture: { value: 1 }
        }
      }),
      t = new Mesh(this._planeGeometry, e);
    const v = this._transitionVideo.video;
    v.addEventListener('loadedmetadata', () => { e.uniforms.uVideoAspect.value = v.videoWidth / v.videoHeight });
    return t.scale.set(this._cameraDimensions.width, this._cameraDimensions.height, 1e-5), t.renderOrder = FLOWER_A, this.add(t), t
  }
  _startContinuousFlowerSpin() {
    var e;
    (e = this._flowerSpinTween) == null || e.kill(), this._flowerSpinTween = gsap.to(this._flowerMesh.rotation, {
      z: `+=${Math.PI*2}`,
      duration: FLOWER_PI,
      ease: "none",
      repeat: -1
    })
  }
  hide(e) {
    this._transitionVideo && (this._transitionVideo.video.currentTime = 0, this._transitionVideo.video.play().catch(() => {}));
    const t = gsap.timeline(),
      {
        width: n,
        height: i
      } = this._cameraDimensions,
      r = coverScale(n, i),
      o = 1,
      a = .75;
    return t.fromTo(this._transitionUniforms.uTransition, {
      value: 0
    }, {
      value: r,
      duration: a,
      ease: "expo.out"
    }, 0), t.fromTo(this._flowerMesh.scale, {
      x: 0,
      y: 0,
      z: 0
    }, {
      x: o,
      y: o,
      z: o,
      duration: a,
      ease: "expo.out"
    }, 0), t.fromTo(this._flowerMesh.rotation, {
      x: Math.PI * .25,
      y: Math.PI * .5
    }, {
      x: 0,
      y: 0,
      duration: a,
      ease: "expo.out"
    }, 0), t.call(() => {
      var l;
      (l = app.webgl.topScene) == null || l.resetBeeInteractions(), emitter.emit(EVENTS.SHOWREEL_RESET), emitter.emit(EVENTS.WEBGL_SECTION_REVEAL_RESET), resumeMediaAutoplay(), app.webgl.hideHomeAboutGroupsOnTransitionCover(), app.webgl.cleanupInterfaceScene(), e == null || e()
    }, null, a), t
  }
  show() {
    const e = gsap.timeline();
    return e.to(this._transitionUniforms.uTransition, {
      value: 0,
      duration: .65,
      ease: "power3.inOut"
    }, 0), e.to(this._flowerMesh.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: .65,
      ease: "power3.inOut"
    }, 0), e.to(this._flowerMesh.rotation, {
      x: -Math.PI * .25,
      y: -Math.PI * .5,
      duration: .65,
      ease: "power3.inOut"
    }, 0), e.call(() => { var v; (v = this._transitionVideo) == null || v.video.pause() }, null, .65), e
  }
  onRender({
    _et: e,
    _dt: t
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
    this._backgroundMesh.scale.set(n, i, 1e-5), this._backgroundMesh.material.uniforms.uResolution.value.copy(this._transitionUniforms.uResolution.value)
  }
}
