import {
  KTX2Loader
} from 'three/examples/jsm/loaders/KTX2Loader.js';

let ktx2Loader = null;

let ktx2LoaderReady = null;

export function initKtxTextureLoader(s) {
  if (ktx2LoaderReady) return ktx2LoaderReady;
  const t = "/assets/basis/";
  return ktx2Loader = new KTX2Loader, ktx2Loader.setTranscoderPath(t), ktx2Loader.detectSupport(s), ktx2LoaderReady = ktx2Loader.init().then(() => ktx2Loader), ktx2LoaderReady
}

export class KtxTextureLoader {
  loadAsync(e, t) {
    return ktx2Loader ? ktx2Loader.loadAsync(e, t) : Promise.reject(new Error("KTX2Loader not initialized — call initKtxTextureLoader(renderer) first"))
  }
}
