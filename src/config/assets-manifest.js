import {
  SCENE_TEXTURES,
  buildKtxTexturesManifest
} from './ktx-textures-manifest.js';
import {
  buildProjectMediaUrls
} from './media-paths.js';
import {
  buildSoundsManifest
} from './sounds-manifest.js';
import {
  buildWebpTexturesManifest
} from './webp-textures-manifest.js';

const WEBP_TEXTURE_KEYS = ["aboutTexLeaves", "aboutGroundNormal"];

const CLOUD_TEXTURE_KEYS = ["cloud1", "cloud2", "cloud3", "cloud4", "cloud5", "cloud6"];

const BASE_URL = "/";

const withBase = s => `${BASE_URL}${s}`;

const assetUrl = s => `/assets/${s}`;

const ktxTextures = buildKtxTexturesManifest(withBase);

const webpTextures = buildWebpTexturesManifest(withBase);

const sounds = buildSoundsManifest(withBase);

const usedWebpTextures = Object.fromEntries(WEBP_TEXTURE_KEYS.filter(s => webpTextures[s]).map(s => [s, webpTextures[s]]));

const cloudTextures = Object.fromEntries(CLOUD_TEXTURE_KEYS.map(s => [s, {
  path: withBase(`assets/textures/global/clouds/${s}.png`)
}]));

const mountainTexture = {
  abouttexMontagne: {
    path: withBase("assets/textures/about/scene/texMontagne.png")
  }
};

export const projectMediaUrls = buildProjectMediaUrls();

export const assetPaths = {
  textures: {
    home: Object.fromEntries(SCENE_TEXTURES.home.map(s => [s, ktxTextures[`home${s}`].path])),
    about: {
      ...Object.fromEntries(SCENE_TEXTURES.about.map(s => [s, ktxTextures[`about${s}`].path])),
      texMontagne: mountainTexture.abouttexMontagne.path,
      GroundNormal: usedWebpTextures.aboutGroundNormal.path,
      GroundRoughness: ktxTextures.aboutGroundRoughness.path,
      GroundAo: ktxTextures.aboutGroundAo.path,
      GroundDiffuse: ktxTextures.aboutGroundDiffuse.path,
      TexLeaves: usedWebpTextures.aboutTexLeaves.path
    },
    global: {
      cloud1: cloudTextures.cloud1.path,
      cloud2: cloudTextures.cloud2.path,
      cloud3: cloudTextures.cloud3.path,
      cloud4: cloudTextures.cloud4.path,
      cloud5: cloudTextures.cloud5.path,
      cloud6: cloudTextures.cloud6.path,
      noise: ktxTextures.noise.path,
      waterDeformation: ktxTextures.waterDeformation.path,
      beeTex: ktxTextures.beeTex.path,
      flowerTex: ktxTextures.flowerTex.path
    }
  },
  models: {
    beeModel: withBase("assets/models/global/bee/bee_v4.glb"),
    flowerModel: withBase("assets/models/global/flower/flower_v2.glb"),
    orangeModel: withBase("assets/models/global/fruits/orange.glb"),
    raisinModel: withBase("assets/models/global/fruits/raisin.glb"),
    homeModel: withBase("assets/models/home/scene_v9.glb"),
    aboutModel: withBase("assets/models/about/scene_v15.glb")
  },
  medias: {
    home: {
      // custom reel (played as-is, max quality). Replace public/assets/medias/reel/reel.mp4 with the Instagram reel.
      showreel: assetUrl("medias/reel/reel.mp4")
    }
  }
};

// Strip About-page assets (its 3D scene, textures, ground/leaves maps) — the page no longer exists.
const withoutAbout = (o) => Object.fromEntries(Object.entries(o).filter(([k]) => !/^about/i.test(k)));

export const ASSETS_MANIFEST = {
  images: {},
  textures: withoutAbout(Object.fromEntries(Object.entries(ktxTextures).filter(([k]) => !k.startsWith("homeProject")))),
  webpTextures: withoutAbout({ ...usedWebpTextures, ...cloudTextures, ...mountainTexture, ...Object.fromEntries(Object.entries(ktxTextures).filter(([k]) => k.startsWith("homeProject"))) }),
  envMaps: {},
  models: {
    beeModel: {
      path: assetPaths.models.beeModel
    },
    flowerModel: {
      path: assetPaths.models.flowerModel
    },
    orangeModel: {
      path: assetPaths.models.orangeModel
    },
    raisinModel: {
      path: assetPaths.models.raisinModel
    },
    homeModel: {
      path: assetPaths.models.homeModel
    },
  },
  jsons: {},
  sounds: sounds
};
