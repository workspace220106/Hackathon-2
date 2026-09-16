import {
  AssetsManager
} from './AssetsManager.js';
import {
  Ticker
} from './Ticker.js';

export function createCore() {
  const s = new AssetsManager,
    e = new Ticker;
  return {
    assetsManager: s,
    ticker: e
  }
}
