const DEG2RAD = Math.PI / 180;

export function lerp(s, e, t) {
  return (1 - t) * s + t * e
}

export function degToRad(s) {
  return s * DEG2RAD
}

export function remToPx(s) {
  const e = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return s / 14 * e
}

export function remToPxMap(s) {
  const e = {};
  for (const [t, n] of Object.entries(s)) e[t] = remToPx(n);
  return e
}
