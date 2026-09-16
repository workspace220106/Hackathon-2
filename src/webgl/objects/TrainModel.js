import {
  Box3,
  Group,
  MeshPhongMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector3
} from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { applyPageTransition } from '../materials/page-transition.js';

// The Subway Surfers train replaces the bee everywhere the bee model was used
// (hero flyer, fruit-chasing pursuer). The OBJ + texture are loaded once and cloned.
export const TRAIN_OBJ = '/assets/models/global/train/Subway.obj';
export const TRAIN_TEXTURE = '/assets/models/global/train/trains.png';
export const TRAIN_LENGTH = 0.55; // world units along the long axis (the bee body was ~0.32)

let objPromise = null;
let texture = null;

function loadObj() {
  return objPromise ??= new Promise((resolve, reject) => new OBJLoader().load(TRAIN_OBJ, resolve, undefined, reject));
}
function getTexture() {
  if (!texture) {
    texture = new TextureLoader().load(TRAIN_TEXTURE);
    texture.colorSpace = SRGBColorSpace;
  }
  return texture;
}

/**
 * Returns a Group immediately (callers keep a reference); the normalised train
 * (centred, scaled to `length`) is added to it once loaded. `onMesh` is called
 * for every mesh so callers can register raycast / bounds targets.
 */
export function createTrainModel({ pageTransitionUniforms, length = TRAIN_LENGTH, onMesh } = {}) {
  const group = new Group();
  group.name = 'train';
  const material = new MeshPhongMaterial({ map: getTexture(), shininess: 20 });
  if (pageTransitionUniforms) applyPageTransition(material, pageTransitionUniforms, { revealScale: pageTransitionUniforms.uBeeRevealScale });
  loadObj().then((src) => {
    const obj = src.clone();
    const box = new Box3().setFromObject(obj), size = new Vector3(), center = new Vector3();
    box.getSize(size), box.getCenter(center);
    const s = length / Math.max(size.x, size.y, size.z);
    obj.position.copy(center).multiplyScalar(-s), obj.scale.setScalar(s);
    obj.traverse((o) => { if (o.isMesh) { o.material = material; o.castShadow = true; onMesh?.(o); } });
    group.add(obj);
  }).catch((e) => console.error('[TrainModel] failed to load', e));
  return group;
}
