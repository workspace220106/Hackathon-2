import {
  Color,
  Group,
  LinearSRGBColorSpace,
  Vector3
} from 'three';
import {
  app
} from '../../core/App.js';
import {
  emitter
} from '../../core/events.js';
import {
  isTabletWidth
} from '../../utils/device.js';
import {
  EnvTextureMaterial
} from '../materials/EnvTextureMaterial.js';
import {
  Clouds
} from '../objects/Clouds.js';
import {
  GradientSphere
} from '../objects/GradientSphere.js';
import {
  HeroVideoPlane
} from '../objects/HeroVideoPlane.js';
import {
  ParticlesSimple
} from '../objects/ParticlesSimple.js';
import {
  DEFAULT_BLUR_RADIUS,
  applyBlurRadius,
  applyHashBlurDebug,
  blurRadiusFor,
  hashBlurDefines,
  hashBlurTextureNames,
  usesHashBlur
} from '../utils/hash-blur.js';
import {
  applyTextureDebugSettings,
  applyTextureDefaults,
  applyTextureEntries,
  applyTextureSettings,
  filterTextureEntries,
  setMaterialTexture,
  texelMaxCrossDefines,
  textureDebugParams,
  textureSettings,
  usesTexelMaxCross
} from '../utils/texture-settings.js';

const HOME_CLOUDS_COUNT = 16;

const HOME_PARTICLES_A = 4;

const HOME_PARTICLES_B = 8;

// The studio room (scene_v9.glb) is replaced by a full-bleed video panel: the panel
// sits where the daisy stood (x ≈ 2.84) and is sized to cover the camera's view, so the
// original scroll-driven camera move (forward along -X) becomes a zoom into the video.
const HERO_VIDEO_SRC = '/assets/medias/hero/runner.mp4';
const FLOWER_MESH_NAME = 'TexFleur';
const HERO_VIDEO_OVERSCAN = 1.06;

export class HomeEnvironment extends Group {
  constructor() {
    super(), emitter.register(this), this._texturesName = ["TexFleur", "TexProps", "TexMobilier", "TexTableaux", "TexBibli", "TexFloor", "TexWalls"], this._textureEntries = [], this._createEnvMeshes(), this._createHeroVideo(), this._initTextureDebug(), this._initHashBlurDebug(), this._createBgGradientMesh(), this._cloudsMesh = this._createCloudsMesh(), this._particlesMesh = this._createParticlesMesh(), this._applyBgGradientScale(), this._registerBgGradientDebug(), this._bgGradientMesh.visible = !1, this._cloudsMesh.visible = !1, this._particlesMesh.visible = !1
  }
  onResize() {
    this._applyBgGradientScale(), this._fitHeroVideo()
  }
  _fitHeroVideo() {
    const panel = this.heroVideo, cam = app.webgl?.camera, rig = app.webgl?.modelCamera;
    if (!panel || !cam || !rig) return;
    const distance = Math.abs(rig.position.x - panel.position.x);
    panel.fitToView(cam, distance, HERO_VIDEO_OVERSCAN)
  }
  _applyBgGradientScale() {
    if (!this._bgGradientMesh) return;
    const e = isTabletWidth() ? HOME_PARTICLES_B : HOME_PARTICLES_A;
    this._bgGradientMesh.scale.set(HOME_CLOUDS_COUNT, e, HOME_CLOUDS_COUNT)
  }
  _createMaterial(e) {
    const t = app.core.assetsManager.get(`home${e}`);
    applyTextureDefaults(t);
    const n = new EnvTextureMaterial({
      uniforms: {
        uTexture: {
          value: t
        },
        uBlurRadius: {
          value: usesHashBlur("home", e) ? blurRadiusFor("home", e) : 0
        }
      },
      defines: {
        ...texelMaxCrossDefines("home", e),
        ...hashBlurDefines("home", e)
      }
    });
    return (usesTexelMaxCross("home", e) || usesHashBlur("home", e)) && setMaterialTexture(n, t), this._textureEntries.push({
      name: e,
      texture: t,
      material: n
    }), n
  }
  _initHashBlurDebug() {
    var e;
    this.hashBlurDebug = {
      target: "All",
      blurRadius: DEFAULT_BLUR_RADIUS
    }, (e = app.debug) == null || e.mapping.add(this, "HomeHashBlur", 0, "Hash Blur", "home")
  }
  getHashBlurTextureNames() {
    return hashBlurTextureNames(this._textureEntries, "home")
  }
  syncHashBlurDebugFromTarget() {
    applyHashBlurDebug(this._textureEntries, this.hashBlurDebug, "home")
  }
  applyHashBlurDebugSettings() {
    applyBlurRadius(this._textureEntries, this.hashBlurDebug, "home")
  }
  _initTextureDebug() {
    this._textureDebugSnapshots = new Map(this._textureEntries.map(({
      name: e,
      texture: t
    }) => [e, textureSettings(t)])), this.textureDebug = textureDebugParams(this._textureEntries), this._registerTexturesDebug()
  }
  _registerTexturesDebug() {
    var e;
    (e = app.debug) == null || e.mapping.add(this, "HomeTextures", 0, "Textures", "home")
  }
  getTextureDebugNames() {
    return this._textureEntries.map(({
      name: e
    }) => e)
  }
  getTextureDebugTargets() {
    return filterTextureEntries(this._textureEntries, this.textureDebug.target)
  }
  syncTextureDebugFromTarget() {
    applyTextureDebugSettings(this._textureEntries, this.textureDebug)
  }
  applyTextureDebugSettings() {
    applyTextureSettings(this._textureEntries, this.textureDebug)
  }
  resetTextureDebugSettings() {
    applyTextureEntries(this._textureEntries, this.textureDebug, this._textureDebugSnapshots)
  }
  _createEnvMeshes() {
    const e = app.core.assetsManager.get("homeModel");
    e.traverse(t => {
      this._texturesName.forEach(n => {
        const i = this._createMaterial(n);
        t.isMesh && t.name.includes(`${n}`) && (t.material = i)
      }),
      t.isMesh && t.name.includes(FLOWER_MESH_NAME) && (this._flowerMesh = t)
    }), this._roomModel = e, e.visible = !1, this.add(e)
  }
  // Video panel standing on the floor exactly where the daisy stood, facing the camera (+X).
  _createHeroVideo() {
    const flower = this._flowerMesh;
    let center = { x: 2.84, y: 2.01, z: 0 }, height = 4.02;
    if (flower) {
      flower.geometry.computeBoundingBox();
      const b = flower.geometry.boundingBox;
      center = { x: (b.min.x + b.max.x) / 2, y: (b.min.y + b.max.y) / 2, z: (b.min.z + b.max.z) / 2 };
      height = b.max.y - b.min.y;
    }
    const panel = new HeroVideoPlane({ src: HERO_VIDEO_SRC, height, cornerRadius: 0 });
    // centred on the camera axis (camera looks down -X from the GLB "camera" node)
    const camNode = app.core.assetsManager.get("homeModel").getObjectByName("camera");
    panel.position.set(center.x, camNode ? camNode.position.y : center.y, camNode ? camNode.position.z : center.z);
    panel.rotation.y = Math.PI / 2;
    this.add(panel), this.heroVideo = panel, panel.autoplay(), this._fitHeroVideo()
  }
  _createBgGradientMesh() {
    this._bgGradientMesh = new GradientSphere({
      topColor: 11649739,
      bottomColor: 12763054,
      gradientSmoothMin: 0,
      gradientSmoothMax: 1
    }), this._bgGradientMesh.position.set(-10, 3, 0), this.add(this._bgGradientMesh)
  }
  _registerBgGradientDebug() {
    var e;
    (e = app.debug) == null || e.mapping.add(this._bgGradientMesh, "BgGradient", 0, "BgGradient", "home")
  }
  _createCloudsMesh() {
    var n;
    const e = {
        count: 25,
        rangeX: 19,
        rangeY: 13,
        rangeZ: 20,
        tintColor: new Color().setHex("0xF7EFE4", LinearSRGBColorSpace),
        randomScale: (Math.random() * .25 + .85) * 10,
        translationSpeedFactor: .5,
        deformationSpeedFactor: 1
      },
      t = new Clouds(e);
    return t.position.set(-10, 3, 0), this.add(t), (n = app.debug) == null || n.mapping.add(t, "EnvClouds", 0, "EnvClouds", "home"), t
  }
  _createParticlesMesh() {
    var n;
    const e = {
        particleCount: 2e3,
        area: new Vector3(.1, .15, .5),
        displacement: new Vector3(0, 0, -8.2),
        displacementSpeed: .04,
        deformationAmplitude: new Vector3(0, .25, 0),
        deformationFrequency: new Vector3(.3, .2, .3),
        deformationSpeed: .001,
        scale: isTabletWidth() ? .49 : .7,
        opacity: 1,
        color: new Color().setHex(16052459, LinearSRGBColorSpace)
      },
      t = new ParticlesSimple(e);
    return t.position.set(3, 3, 0), this.add(t), (n = app.debug) == null || n.mapping.add(t, "Particles", 0, "Particles", "home"), t
  }
  render(e, t) {
    this._cloudsMesh && this._cloudsMesh.visible && this._cloudsMesh.render(e, t), this._particlesMesh && this._particlesMesh.visible && this._particlesMesh.render(e, t)
  }
}
