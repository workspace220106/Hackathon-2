import {
  ClampToEdgeWrapping,
  LinearFilter,
  LinearMipmapLinearFilter,
  LinearMipmapNearestFilter,
  MirroredRepeatWrapping,
  NearestFilter,
  NearestMipmapLinearFilter,
  NearestMipmapNearestFilter,
  RepeatWrapping
} from 'three';

const MIN_FILTERS = {
  Linear: LinearFilter,
  Nearest: NearestFilter,
  "Nearest Mipmap Nearest": NearestMipmapNearestFilter,
  "Linear Mipmap Nearest": LinearMipmapNearestFilter,
  "Nearest Mipmap Linear": NearestMipmapLinearFilter,
  "Linear Mipmap Linear": LinearMipmapLinearFilter
};

const MAG_FILTERS = {
  Linear: LinearFilter,
  Nearest: NearestFilter
};

const WRAPPINGS = {
  Repeat: RepeatWrapping,
  Clamp: ClampToEdgeWrapping,
  "Mirrored Repeat": MirroredRepeatWrapping
};

export function setLinearFilters(s) {
  s && (s.minFilter = LinearFilter, s.magFilter = LinearFilter, s.needsUpdate = !0)
}

const TEXEL_MAX_CROSS_TEXTURES = {
  home: new Set(["TexBibli", "TexProps", "TexWalls"]),
  about: new Set(["TexBook"])
};

export function usesTexelMaxCross(s, e) {
  var t;
  return ((t = TEXEL_MAX_CROSS_TEXTURES[s]) == null ? void 0 : t.has(e)) ?? !1
}

export function texelMaxCrossDefines(s, e) {
  return usesTexelMaxCross(s, e) ? {
    USE_TEXEL_MAX_CROSS: ""
  } : {}
}

export function applyTextureDefaults(s) {
  setLinearFilters(s)
}

function textureResolution(s) {
  var i;
  const e = (s == null ? void 0 : s.image) ?? ((i = s == null ? void 0 : s.source) == null ? void 0 : i.data),
    t = (e == null ? void 0 : e.width) ?? 1,
    n = (e == null ? void 0 : e.height) ?? 1;
  return {
    width: t,
    height: n
  }
}

export function setMaterialTexture(s, e) {
  var i;
  if (!((i = s == null ? void 0 : s.uniforms) != null && i.uTextureResolution) || !e) return;
  const {
    width: t,
    height: n
  } = textureResolution(e);
  s.uniforms.uTextureResolution.value.set(t, n)
}

function filterName(s, e) {
  var n;
  const t = e === "min" ? MIN_FILTERS : e === "mag" ? MAG_FILTERS : WRAPPINGS;
  return ((n = Object.entries(t).find(([, i]) => i === s)) == null ? void 0 : n[0]) ?? Object.keys(t)[0]
}

export function textureSettings(s) {
  return {
    minFilter: s.minFilter,
    magFilter: s.magFilter,
    wrapS: s.wrapS,
    wrapT: s.wrapT,
    generateMipmaps: s.generateMipmaps,
    anisotropy: s.anisotropy,
    flipY: s.flipY
  }
}

export function textureDebugParams(s) {
  var t;
  const e = (t = s[0]) == null ? void 0 : t.texture;
  return {
    target: "All",
    minFilter: filterName(e == null ? void 0 : e.minFilter, "min"),
    magFilter: filterName(e == null ? void 0 : e.magFilter, "mag"),
    wrapS: filterName(e == null ? void 0 : e.wrapS, "wrap"),
    wrapT: filterName(e == null ? void 0 : e.wrapT, "wrap"),
    generateMipmaps: (e == null ? void 0 : e.generateMipmaps) ?? !1,
    anisotropy: (e == null ? void 0 : e.anisotropy) ?? 1,
    flipY: (e == null ? void 0 : e.flipY) ?? !1
  }
}

export function filterTextureEntries(s, e) {
  return e === "All" ? s : s.filter(({
    name: t
  }) => t === e)
}

export function applyTextureDebugSettings(s, e) {
  const t = filterTextureEntries(s, e.target)[0];
  if (!(t != null && t.texture)) return;
  const {
    texture: n
  } = t;
  e.minFilter = filterName(n.minFilter, "min"), e.magFilter = filterName(n.magFilter, "mag"), e.wrapS = filterName(n.wrapS, "wrap"), e.wrapT = filterName(n.wrapT, "wrap"), e.generateMipmaps = n.generateMipmaps, e.anisotropy = n.anisotropy, e.flipY = n.flipY
}

export function applyTextureSettings(s, e) {
  const {
    minFilter: t,
    magFilter: n,
    wrapS: i,
    wrapT: r,
    generateMipmaps: o,
    anisotropy: a,
    flipY: l
  } = e;
  for (const {
      texture: u
    }
    of filterTextureEntries(s, e.target)) u.minFilter = MIN_FILTERS[t], u.magFilter = MAG_FILTERS[n], u.wrapS = WRAPPINGS[i], u.wrapT = WRAPPINGS[r], u.generateMipmaps = o, u.anisotropy = a, u.flipY = l, u.needsUpdate = !0
}

export function applyTextureEntries(s, e, t) {
  for (const {
      name: n,
      texture: i
    }
    of filterTextureEntries(s, e.target)) {
    const r = t.get(n);
    r && (Object.assign(i, r), i.needsUpdate = !0)
  }
  applyTextureDebugSettings(s, e)
}
