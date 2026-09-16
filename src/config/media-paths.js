import {
  BREAKPOINTS
} from './breakpoints.js';

const PROJECT_MEDIA_COUNTS = {
  project1: 5,
  project2: 5,
  project4: 5,
  project5: 5
};

const IMAGE_RE = /\.(jpe?g|png|webp)$/i;

const MP4_RE = /\.mp4$/i;

const ARCHIVES_BASE_DIR = "/archives-base/";

const ARCHIVES_COMPRESSED_DIR = "/archives-compressed/";

const SHOWREEL_BASE_DIR = "/showreel-base/";

const SHOWREEL_COMPRESSED_DIR = "/showreel-compressed/";

function swapDir(s, e, t) {
  return !s || !MP4_RE.test(s) || s.includes(t) ? s : s.replace(e, t)
}

export function toCompressedArchiveVideo(s) {
  return swapDir(s, ARCHIVES_BASE_DIR, ARCHIVES_COMPRESSED_DIR)
}

export function toArchivePoster(s) {
  return !s || !MP4_RE.test(s) ? null : (s.includes(ARCHIVES_COMPRESSED_DIR) ? s : s.replace(ARCHIVES_BASE_DIR, ARCHIVES_COMPRESSED_DIR)).replace(/\.mp4$/i, "-poster.webp")
}

function deviceBucket(s = window.innerWidth) {
  return s < BREAKPOINTS.desktop ? "mobile" : "desktop"
}

export function toCompressedShowreel(s, e = typeof window < "u" ? window.innerWidth : BREAKPOINTS.desktop) {
  if (!s || !s.includes(SHOWREEL_BASE_DIR)) return s;
  const t = deviceBucket(e);
  return s.replace(SHOWREEL_BASE_DIR, `${SHOWREEL_COMPRESSED_DIR}${t}/`)
}

export function toCompressedArchiveImage(s) {
  if (!s || !IMAGE_RE.test(s) || !s.includes(ARCHIVES_BASE_DIR) || s.includes(ARCHIVES_COMPRESSED_DIR)) return s;
  const e = s.split("/").pop(),
    t = e.replace(/\.(jpe?g|png)$/i, ".webp");
  return s.replace(ARCHIVES_BASE_DIR, ARCHIVES_COMPRESSED_DIR).replace(e, t)
}

function projectImageSize(s = window.innerWidth) {
  return s < BREAKPOINTS.desktop ? 1024 : 2048
}

export function toWebpMedia(s) {
  if (!s || !IMAGE_RE.test(s)) return s;
  const t = (s.startsWith("/") ? s : `/${s}`).match(/^\/assets\/medias\/(.+)\/([^/]+)\.(jpe?g|png|webp)$/i);
  if (!t) return s;
  const [, n, i] = t;
  return n.endsWith("-webp") ? s : `/assets/medias/${n}-webp/${i}.webp`
}

function toProjectWebp(s, e = window.innerWidth) {
  if (!s) return s;
  const n = (s.startsWith("/") ? s : `/${s}`).match(/\/projects\/(project\d+)\/(\d+)\.(jpe?g|png|webp)$/i);
  if (!n) return s;
  const [, i, r] = n, o = projectImageSize(e);
  return `/assets/medias/home/projects/${i}-webp/${o}/${r}.webp`
}

export function buildProjectMediaUrls(s = window.innerWidth) {
  return Object.fromEntries(Object.entries(PROJECT_MEDIA_COUNTS).map(([e, t]) => [e, Array.from({
    length: t
  }, (n, i) => toProjectWebp(`/assets/medias/home/projects/${e}/${i+1}.webp`, s))]))
}
