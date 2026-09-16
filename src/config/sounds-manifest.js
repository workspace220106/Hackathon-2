const SOUNDS_DIR = "sounds/compressed";

const SOUNDS_EXT = "aac";

const SOUNDS = [{
  id: "ambient",
  fileBase: "ambient",
  params: {
    loop: !0,
    volume: .375,
    fadeDuration: 500
  },
  compression: {
    bitrate: "128k"
  }
}, {
  id: "fruit1",
  fileBase: "fruit1",
  params: {
    volume: .25,
    replay: !0
  },
  compression: {
    bitrate: "96k"
  }
}, {
  id: "fruit2",
  fileBase: "fruit2",
  params: {
    volume: .25,
    replay: !0
  },
  compression: {
    bitrate: "96k"
  }
}, {
  id: "pageTransition",
  fileBase: "pageTransition",
  params: {
    volume: .36,
    replay: !0,
    startProgress: .15,
    fadeInDuration: 700,
    fadeInEase: "power2.out"
  },
  compression: {
    bitrate: "128k"
  }
}];

function soundPath(s) {
  return `assets/${SOUNDS_DIR}/${s}.${SOUNDS_EXT}`
}

export function buildSoundsManifest(s) {
  return Object.fromEntries(SOUNDS.map(({
    id: e,
    fileBase: t,
    params: n
  }) => [e, {
    path: s(soundPath(t)),
    params: n
  }]))
}
