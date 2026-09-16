import {
  BREAKPOINTS
} from './breakpoints.js';

const WEBP_TEXTURES = [{
  id: "leaves",
  sourcePath: "about/leaves.png",
  webpDir: "leaves-webp",
  desktop: 256,
  mobile: 128,
  fileBase: "leaves",
  manifestKey: "aboutTexLeaves"
}, {
  id: "flower",
  sourcePath: "global/flower.jpg",
  webpDir: "flower-webp",
  desktop: 1024,
  mobile: 512,
  fileBase: "flower",
  manifestKey: "flowerTex"
}, {
  id: "bee",
  sourcePath: "global/bee.jpg",
  webpDir: "bee-webp",
  desktop: 1024,
  mobile: 512,
  fileBase: "bee",
  manifestKey: "beeTex"
}, {
  id: "noise",
  sourcePath: "global/noise.jpeg",
  webpDir: "noise-webp",
  desktop: 512,
  mobile: 256,
  fileBase: "noise",
  manifestKey: "noise"
}, {
  id: "waterDeformation",
  sourcePath: "global/waterDeformationTexture.jpeg",
  webpDir: "waterDeformation-webp",
  desktop: 1024,
  mobile: 512,
  fileBase: "waterDeformation",
  manifestKey: "waterDeformation"
}, {
  id: "ground",
  sourceDir: "about/ground",
  webpDir: "ground-webp",
  desktop: 512,
  mobile: 256,
  pattern: /\.png$/i,
  manifestMap: {
    "normal.png": "aboutGroundNormal",
    "roughness.png": "aboutGroundRoughness",
    "ao.png": "aboutGroundAo",
    "diffuse.png": "aboutGroundDiffuse"
  }
}];

const stripExt = s => s.replace(/\.[^.]+$/, "");

function isMobileTextureWidth(s = window.innerWidth) {
  return s < BREAKPOINTS.desktop
}

function webpTexturePath({
  webpParentDir: s,
  webpDir: e,
  desktop: t,
  mobile: n,
  fileBase: i
}, r = window.innerWidth) {
  const o = isMobileTextureWidth(r) ? n : t;
  return `assets/textures/${s}/${e}/${o}/${i}.webp`
}

function webpParentDir(s) {
  if (s.sourceDir) {
    const e = s.sourceDir.split("/");
    return e.pop(), e.join("/")
  }
  return s.sourcePath.split("/").slice(0, -1).join("/")
}

function resolveWebpTexture(s, e, t, n) {
  return t(webpTexturePath({
    webpParentDir: webpParentDir(s),
    webpDir: s.webpDir,
    desktop: s.desktop,
    mobile: s.mobile,
    fileBase: e
  }, n))
}

export function buildWebpTexturesManifest(s, e = window.innerWidth) {
  return WEBP_TEXTURES.reduce((t, n) => {
    if (n.manifestKey) return t[n.manifestKey] = {
      path: resolveWebpTexture(n, n.fileBase, s, e)
    }, t;
    if (n.manifestKeys) {
      for (const i of n.manifestKeys) t[i] = {
        path: resolveWebpTexture(n, i, s, e)
      };
      return t
    }
    if (n.manifestMap)
      for (const [i, r] of Object.entries(n.manifestMap)) t[r] = {
        path: resolveWebpTexture(n, stripExt(i), s, e)
      };
    return t
  }, {})
}
