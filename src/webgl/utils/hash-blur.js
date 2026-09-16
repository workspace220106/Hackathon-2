import {
  isTabletWidth
} from '../../utils/device.js';

export const DEFAULT_BLUR_RADIUS = 3;

const BLUR_RADIUS_BY_TEXTURE = {
  home: {
    TexFloor: 3
  },
  about: {
    TexGround: 0,
    TexMobilier: 3
  }
};

const HASH_BLUR_TEXTURES = {
  home: new Set(["TexFloor"]),
  about: new Set(["TexGround", "TexMobilier"])
};

export function usesHashBlur(s, e) {
  var t;
  return ((t = HASH_BLUR_TEXTURES[s]) == null ? void 0 : t.has(e)) ?? !1
}

function isDesktopBlur() {
  return !isTabletWidth()
}

export function blurRadiusForDevice(s) {
  return isDesktopBlur() ? s : 0
}

export function blurRadiusFor(s, e) {
  const t = BLUR_RADIUS_BY_TEXTURE[s];
  return t && Object.hasOwn(t, e) ? blurRadiusForDevice(t[e]) : blurRadiusForDevice(DEFAULT_BLUR_RADIUS)
}

export function hashBlurTextureNames(s, e) {
  return s.filter(({
    name: t
  }) => usesHashBlur(e, t)).map(({
    name: t
  }) => t)
}

function filterEntriesByTarget(s, e) {
  return e === "All" ? s : s.filter(({
    name: t
  }) => t === e)
}

export function applyBlurRadius(s, e, t) {
  const n = blurRadiusForDevice(e.blurRadius);
  for (const {
      name: i,
      material: r
    }
    of filterEntriesByTarget(s, e.target)) !usesHashBlur(t, i) || !r.uniforms.uBlurRadius || (r.uniforms.uBlurRadius.value = n)
}

export function applyHashBlurDebug(s, e, t) {
  var r, o;
  const n = s.filter(({
      name: a
    }) => usesHashBlur(t, a)),
    i = e.target === "All" ? n[0] : n.find(({
      name: a
    }) => a === e.target);
  (o = (r = i == null ? void 0 : i.material) == null ? void 0 : r.uniforms) != null && o.uBlurRadius && (e.blurRadius = i.material.uniforms.uBlurRadius.value)
}

export function hashBlurDefines(s, e) {
  return !usesHashBlur(s, e) || !isDesktopBlur() ? {} : {
    USE_HASH_BLUR: 1
  }
}
