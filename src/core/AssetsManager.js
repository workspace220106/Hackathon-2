import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet
} from '@/utils/private-fields.js';
import {
  AudioLoader,
  NoColorSpace
} from 'three';
import {
  DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  RGBELoader
} from 'three/examples/jsm/loaders/RGBELoader.js';
import {
  ASSETS_MANIFEST
} from '../config/assets-manifest.js';
import {
  KtxTextureLoader
} from '../webgl/loaders/ktx-texture-loader.js';
import {
  EVENTS,
  emitter
} from './events.js';
import {
  AssetsLoader
} from './loaders/AssetsLoader.js';
import {
  BlobImageLoader
} from './loaders/BlobImageLoader.js';
import {
  BlobTextureLoader
} from './loaders/BlobTextureLoader.js';
import {
  JsonLoader
} from './loaders/JsonLoader.js';

let Rs;

let Bs;

let Fh;

let go;

let Ym;

let nT;

let iT;

let pr;

export class AssetsManager {
  constructor({
    blockingLoad: e = !0,
    withPriority: t = !1,
    withCriticals: n = !1,
    isMobile: i = !1
  } = {}) {
    __privateAdd(this, go);
    __privateAdd(this, Rs, new Map);
    __privateAdd(this, Bs, new Map);
    __privateAdd(this, Fh, 0);
    __privateAdd(this, pr, () => {
      __privateSet(this, Fh, [...__privateGet(this, Rs).values()].map(e => e.progress).reduce((e, t) => e + t, 0) / __privateGet(this, Rs).size), emitter.emit(EVENTS.LOADER_PROGRESS, __privateGet(this, Fh))
    });
    this.blockingLoad = e, this.withPriority = t, this.withCriticals = n, this.isMobile = i;
    const r = new GLTFLoader,
      o = new DRACOLoader;
    o.setDecoderPath("assets/models/draco/"), o.preload(), r.setDRACOLoader(o), this.loaders = {
      images: new AssetsLoader({
        manifest: ASSETS_MANIFEST.images,
        isMobile: this.isMobile,
        loader: new BlobImageLoader,
        assetsInfos: __privateGet(this, Rs),
        loadedAssets: __privateGet(this, Bs),
        progressCallback: __privateGet(this, pr)
      }),
      textures: new AssetsLoader({
        manifest: ASSETS_MANIFEST.textures,
        isMobile: this.isMobile,
        loader: new KtxTextureLoader,
        assetsInfos: __privateGet(this, Rs),
        loadedAssets: __privateGet(this, Bs),
        progressCallback: __privateGet(this, pr),
        afterLoadCallback: (a, l) => (a != null && a.isTexture && (a.colorSpace = NoColorSpace, a.flipY = !1), a)
      }),
      webpTextures: new AssetsLoader({
        manifest: ASSETS_MANIFEST.webpTextures,
        isMobile: this.isMobile,
        loader: new BlobTextureLoader,
        assetsInfos: __privateGet(this, Rs),
        loadedAssets: __privateGet(this, Bs),
        progressCallback: __privateGet(this, pr),
        afterLoadCallback: (a, l) => (a != null && a.isTexture && (a.colorSpace = NoColorSpace, typeof l == "string" && l.startsWith("homeProject") && (a.flipY = !1)), a)
      }),
      envMaps: new AssetsLoader({
        manifest: ASSETS_MANIFEST.envMaps,
        isMobile: this.isMobile,
        loader: new RGBELoader,
        assetsInfos: __privateGet(this, Rs),
        loadedAssets: __privateGet(this, Bs),
        progressCallback: __privateGet(this, pr)
      }),
      models: new AssetsLoader({
        manifest: ASSETS_MANIFEST.models,
        isMobile: this.isMobile,
        loader: r,
        assetsInfos: __privateGet(this, Rs),
        loadedAssets: __privateGet(this, Bs),
        progressCallback: __privateGet(this, pr),
        afterLoadCallback: a => (a.scene.animations = a.animations, a.scene)
      }),
      jsons: new AssetsLoader({
        manifest: ASSETS_MANIFEST.jsons,
        isMobile: this.isMobile,
        loader: new JsonLoader,
        assetsInfos: __privateGet(this, Rs),
        loadedAssets: __privateGet(this, Bs),
        progressCallback: __privateGet(this, pr)
      }),
      sounds: new AssetsLoader({
        manifest: {},
        loader: new AudioLoader,
        assetsInfos: __privateGet(this, Rs),
        loadedAssets: __privateGet(this, Bs),
        progressCallback: __privateGet(this, pr)
      })
    }
  }
  async load() {
    this.withCriticals && await __privateMethod(this, go, nT).call(this), this.blockingLoad ? await __privateMethod(this, go, Ym).call(this) : this.withPriority ? __privateMethod(this, go, iT).call(this) : __privateMethod(this, go, Ym).call(this)
  }
  get(...e) {
    return e.length > 1 ? e.map(t => __privateGet(this, Bs).get(t)) : __privateGet(this, Bs).get(e[0])
  }
}

Rs = new WeakMap, Bs = new WeakMap, Fh = new WeakMap, go = new WeakSet, Ym = function () {
  return Promise.all(Object.values(this.loaders).map(e => e.loadAssets()))
}, nT = function () {
  return Promise.all(Object.values(this.loaders).map(e => e.loadCriticalAssets()))
}, iT = function () {
  return Promise.all(Object.values(this.loaders).map(e => [...e.assetsToLoad.entries()].map(([t, n]) => ({
    loader: e,
    key: t,
    priority: n.priority || 0
  }))).flat().sort((e, t) => e.priority - t.priority).map(({
    loader: e,
    key: t
  }) => e.loadAsset(t)))
}, pr = new WeakMap;
