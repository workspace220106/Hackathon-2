import {
  Mouse
} from './Mouse.js';
import {
  Viewport
} from './Viewport.js';

export function createTools() {
  const s = new Mouse,
    e = new Viewport;
  return {
    mouse: s,
    viewport: e
  }
}
