import {
  Box3,
  Group,
  MeshStandardMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector3
} from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { emitter, EVENTS } from '../../core/events.js';

// The Subway Surfers coin replaces the orange / grapes the train chases.
export const COIN_OBJ = '/assets/models/global/coin/Coin.obj';
export const COIN_TEXTURE = '/assets/models/global/coin/props.png';
export const COIN_SIZE = 0.2;          // world height at scale 1 (the fruits were ~0.2)
export const COIN_SPIN_SPEED = 2.2;    // rad/s

let objPromise = null;
let texture = null;
const loadObj = () => objPromise ??= new Promise((res, rej) => new OBJLoader().load(COIN_OBJ, res, undefined, rej));
const getTexture = () => texture ??= Object.assign(new TextureLoader().load(COIN_TEXTURE), { colorSpace: SRGBColorSpace });

/**
 * Group (named by the caller) → spinning inner pivot → normalised coin mesh.
 * `onMaterial(material)` lets the caller inject the page-transition shader hooks.
 */
export function createCoinModel({ name, size = COIN_SIZE, onMaterial } = {}) {
  const root = new Group();
  root.name = name ?? 'coin';
  const spin = new Group();
  root.add(spin);
  const material = new MeshStandardMaterial({ map: getTexture(), roughness: 0.35, metalness: 0.25 });
  onMaterial?.(material);
  loadObj().then((src) => {
    const obj = src.clone();
    const box = new Box3().setFromObject(obj), sz = new Vector3(), c = new Vector3();
    box.getSize(sz), box.getCenter(c);
    const s = size / sz.y;
    obj.position.copy(c).multiplyScalar(-s), obj.scale.setScalar(s);
    obj.traverse((o) => { if (o.isMesh) { o.material = material; o.castShadow = true; } });
    spin.add(obj);
  }).catch((e) => console.error('[CoinModel] failed to load', e));
  const tick = ({ dt }) => { spin.rotation.y += COIN_SPIN_SPEED * (dt ?? 0.016); };
  emitter.on(EVENTS.TICK, tick);
  root.dispose = () => emitter.off(EVENTS.TICK, tick);
  return root;
}
