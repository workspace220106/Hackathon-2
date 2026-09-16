import {
  BREAKPOINTS
} from './breakpoints.js';
import {
  LARGE_DESKTOP_MIN
} from './screen.js';

const SCENE_KTX_DIR = "scene-ktx";

export const SCENE_TEXTURES = {
  home: ["TexFleur", "TexProps", "TexMobilier", "TexDecor", "TexTableaux", "TexBibli", "TexFloor", "TexWalls"],
  about: ["TexBook", "TexFleur", "TexGround", "TexRock", "TexProps", "TexDecor", "TexMobilier", "TexArbresFront", "TexArbresBack"]
};

const PROJECT_TEXTURE_COUNTS = {
  project1: 12,
  project2: 12,
  project3: 11,
  project4: 9,
  project5: 10,
  project6: 11
};

const KTX_TEXTURES = [{
  id: "flower",
  sourcePath: "textures/global/flower.jpg",
  ktxDir: "flower-ktx",
  desktop: 1024,
  mobile: 512,
  fileBase: "flower",
  manifestKey: "flowerTex",
  colorSpace: "srgb",
  mipmaps: !1
}, {
  id: "bee",
  sourcePath: "textures/global/bee.jpg",
  ktxDir: "bee-ktx",
  desktop: 1024,
  mobile: 512,
  fileBase: "bee",
  manifestKey: "beeTex",
  colorSpace: "srgb",
  mipmaps: !1
}, {
  id: "noise",
  sourcePath: "textures/global/noise.jpeg",
  ktxDir: "noise-ktx",
  desktop: 512,
  mobile: 256,
  fileBase: "noise",
  manifestKey: "noise",
  colorSpace: "linear",
  mipmaps: !1
}, {
  id: "waterDeformation",
  sourcePath: "textures/global/waterDeformationTexture.jpeg",
  ktxDir: "waterDeformation-ktx",
  desktop: 1024,
  mobile: 512,
  fileBase: "waterDeformation",
  manifestKey: "waterDeformation",
  colorSpace: "linear",
  mipmaps: !1
}, {
  id: "ground",
  sourceDir: "textures/about/ground",
  ktxDir: "ground-ktx",
  desktop: 512,
  mobile: 256,
  pattern: /\.png$/i,
  manifestMap: {
    "roughness.png": "aboutGroundRoughness",
    "ao.png": "aboutGroundAo",
    "diffuse.png": "aboutGroundDiffuse"
  },
  colorSpace: "linear",
  mipmaps: !1
}];

const stripExtension = s => s.replace(/\.[^.]+$/, "");

function sceneTextureSize(s = window.innerWidth) {
  return s < BREAKPOINTS.desktop || s < LARGE_DESKTOP_MIN ? 2048 : 4096
}

function sceneTextureSizeFor(s, e = window.innerWidth) {
  return sceneTextureSize(e)
}

function isMobileKtxWidth(s = window.innerWidth) {
  return s < BREAKPOINTS.desktop
}

function projectTextureSize(s = window.innerWidth) {
  return s < BREAKPOINTS.desktop ? 1024 : 2048
}

function sceneTexturePath(s, e, t) {
  return `assets/textures/${s}/${SCENE_KTX_DIR}/${t}/${e}.ktx2`
}

function ktxTexturePath({
  ktxParentDir: s,
  ktxDir: e,
  desktop: t,
  mobile: n,
  fileBase: i
}, r = window.innerWidth) {
  const o = isMobileKtxWidth(r) ? n : t;
  return `assets/textures/${s}/${e}/${o}/${i}.ktx2`
}

function projectTexturePath(s, e, t = projectTextureSize()) {
  return `assets/medias/home/projects/${s}-ktx/${t}/${e}.ktx2`
}

function ktxParentDir(s) {
  return (s.sourceDir ? s.sourceDir.split("/").slice(0, -1).join("/") : s.sourcePath.split("/").slice(0, -1).join("/")).replace(/^textures\//, "")
}

function resolveKtxTexture(s, e, t, n) {
  return t(ktxTexturePath({
    ktxParentDir: ktxParentDir(s),
    ktxDir: s.ktxDir,
    desktop: s.desktop,
    mobile: s.mobile,
    fileBase: e
  }, n))
}

const textureEntry = (s, e = "srgb") => ({
  path: s,
  colorSpace: e
});

export function buildKtxTexturesManifest(s, e = window.innerWidth) {
  const t = {
    ...Object.fromEntries(SCENE_TEXTURES.home.map(i => [`home${i}`, textureEntry(s(sceneTexturePath("home", i, sceneTextureSizeFor(i, e))))])),
    ...Object.fromEntries(SCENE_TEXTURES.about.map(i => [`about${i}`, textureEntry(s(sceneTexturePath("about", i, sceneTextureSizeFor(i, e))))]))
  };
  for (const i of KTX_TEXTURES) {
    const r = i.colorSpace ?? "srgb";
    if (i.manifestKey) {
      t[i.manifestKey] = textureEntry(resolveKtxTexture(i, i.fileBase, s, e), r);
      continue
    }
    if (i.manifestKeys) {
      for (const o of i.manifestKeys) t[o] = textureEntry(resolveKtxTexture(i, o, s, e), r);
      continue
    }
    if (i.manifestMap)
      for (const [o, a] of Object.entries(i.manifestMap)) {
        const l = stripExtension(o),
          u = l === "diffuse";
        t[a] = textureEntry(resolveKtxTexture(i, l, s, e), u ? "srgb" : r)
      }
  }
  const n = projectTextureSize(e);
  for (const [i, r] of Object.entries(PROJECT_TEXTURE_COUNTS))
    for (let o = 1; o <= r; o++) {
      const a = i.replace("project", "");
      t[`homeProject${a}_${o}`] = textureEntry(s(projectTexturePath(i, o, n)))
    }
  return t
}
