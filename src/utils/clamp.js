import {
  mapRange
} from './map-range.js';

export function clamp(s, e, t) {
  return Math.min(Math.max(s, e), t)
}

export function mapRangeClamped(s, e, t) {
  return clamp(mapRange(s, e, t), Math.min(...t), Math.max(...t))
}
