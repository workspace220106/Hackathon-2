// Downloads every asset used by https://www.leoparpeix.com into ./mirror/
// Asset path rules are reverse-engineered from the production bundle
// (see docs/research/bundle.pretty.js ~ lines 19100-19600).
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ORIGIN = 'https://www.leoparpeix.com';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'mirror');
const CONCURRENCY = 6;

const urls = new Set();
const add = (p) => urls.add(p.startsWith('/') ? p : `/${p}`);

// ---------- root / meta ----------
[
  '/favicon.ico', '/favicon-32x32.png', '/favicon-16x16.png', '/apple-touch-icon.png',
  '/safari-pinned-tab.svg', '/preview.jpg', '/site.webmanifest', '/manifest.json',
  '/robots.txt', '/sitemap.xml', '/browserconfig.xml', '/android-chrome-192x192.png',
  '/android-chrome-512x512.png', '/mstile-150x150.png',
].forEach(add);

// ---------- bundle ----------
['/assets/index-BZFBO0Ol.js', '/assets/index-CLH3rn1-.css'].forEach(add);

// ---------- fonts ----------
[
  '/assets/fonts/monumentgrotesk-regular.woff2',
  '/assets/fonts/monumentgrotesk-regular.woff',
  '/assets/fonts/avantt-variable.ttf',
].forEach(add);

// ---------- decoders ----------
[
  '/assets/models/draco/draco_wasm_wrapper.js',
  '/assets/models/draco/draco_decoder.wasm',
  '/assets/models/draco/draco_decoder.js',
  '/assets/basis/basis_transcoder.js',
  '/assets/basis/basis_transcoder.wasm',
].forEach(add);

// ---------- models ----------
[
  'assets/models/global/bee/bee_v4.glb',
  'assets/models/global/flower/flower_v2.glb',
  'assets/models/global/fruits/orange.glb',
  'assets/models/global/fruits/raisin.glb',
  'assets/models/home/scene_v9.glb',
  'assets/models/about/scene_v15.glb',
].forEach(add);

// ---------- scene KTX2 textures (2048 for <1600px / mobile, 4096 for large desktop) ----------
const sceneTex = {
  home: ['TexFleur', 'TexProps', 'TexMobilier', 'TexDecor', 'TexTableaux', 'TexBibli', 'TexFloor', 'TexWalls'],
  about: ['TexBook', 'TexFleur', 'TexGround', 'TexRock', 'TexProps', 'TexDecor', 'TexMobilier', 'TexArbresFront', 'TexArbresBack'],
};
for (const [scene, names] of Object.entries(sceneTex))
  for (const size of [2048, 4096])
    for (const n of names) add(`assets/textures/${scene}/scene-ktx/${size}/${n}.ktx2`);

// ---------- global KTX2 textures (desktop / mobile) ----------
const ktxTex = [
  { dir: 'global', ktxDir: 'flower-ktx', sizes: [1024, 512], files: ['flower'] },
  { dir: 'global', ktxDir: 'bee-ktx', sizes: [1024, 512], files: ['bee'] },
  { dir: 'global', ktxDir: 'noise-ktx', sizes: [512, 256], files: ['noise'] },
  { dir: 'global', ktxDir: 'waterDeformation-ktx', sizes: [1024, 512], files: ['waterDeformation'] },
  { dir: 'about', ktxDir: 'ground-ktx', sizes: [512, 256], files: ['roughness', 'ao', 'diffuse', 'normal'] },
];
for (const t of ktxTex)
  for (const s of t.sizes)
    for (const f of t.files) add(`assets/textures/${t.dir}/${t.ktxDir}/${s}/${f}.ktx2`);

// ---------- webp textures ----------
const webpTex = [
  { dir: 'about', webpDir: 'leaves-webp', sizes: [256, 128], files: ['leaves'] },
  { dir: 'about', webpDir: 'ground-webp', sizes: [512, 256], files: ['normal', 'roughness', 'ao', 'diffuse'] },
  { dir: 'global', webpDir: 'flower-webp', sizes: [1024, 512], files: ['flower'] },
  { dir: 'global', webpDir: 'bee-webp', sizes: [1024, 512], files: ['bee'] },
  { dir: 'global', webpDir: 'noise-webp', sizes: [512, 256], files: ['noise'] },
  { dir: 'global', webpDir: 'waterDeformation-webp', sizes: [1024, 512], files: ['waterDeformation'] },
];
for (const t of webpTex)
  for (const s of t.sizes)
    for (const f of t.files) add(`assets/textures/${t.dir}/${t.webpDir}/${s}/${f}.webp`);

for (let i = 1; i <= 6; i++) add(`assets/textures/global/clouds/cloud${i}.png`);
add('assets/textures/about/scene/texMontagne.png');

// ---------- project image sequences (ktx2 + webp, 2048 desktop / 1024 mobile) ----------
const projectCounts = { project1: 12, project2: 12, project3: 11, project4: 9, project5: 10, project6: 11 };
for (const [p, count] of Object.entries(projectCounts))
  for (const size of [2048, 1024])
    for (let i = 1; i <= count; i++) {
      add(`assets/medias/home/projects/${p}-ktx/${size}/${i}.ktx2`);
      add(`assets/medias/home/projects/${p}-webp/${size}/${i}.webp`);
    }

// ---------- showreel ----------
add('assets/medias/home/showreel-base/showreel.mp4');
add('assets/medias/home/showreel-base/showreel-poster.webp');
for (const v of ['desktop', 'mobile']) {
  add(`assets/medias/home/showreel-compressed/${v}/showreel.mp4`);
  add(`assets/medias/home/showreel-compressed/${v}/showreel-poster.webp`);
}

// ---------- archives ----------
const archiveVideos = [
  '7-PortfolioGab', '8-Unity-2025', '9-Pangaia', '11-Merrel', '13-Tougo', '14-DrakeHotel', '15-Vooban',
  '17-Unity-2024', '18-TheHayAdams', '19-PrisonBoss', '20-Palosanto', '21-Longines', '23-ImmersiveGarden',
  '24-LonginesDolceVita', '25-Omega', '26-Aleph', '28-TourDeFrance', '29-Manza',
];
for (const v of archiveVideos) {
  add(`assets/medias/home/archives-base/${v}.mp4`);
  add(`assets/medias/home/archives-compressed/${v}.mp4`);
  add(`assets/medias/home/archives-compressed/${v}-poster.webp`);
}
const archiveImages = ['16-AubergerLaChatelaine.jpg', '27-Omexom.jpg', 'dna.jpg'];
for (const img of archiveImages) {
  add(`assets/medias/home/archives-base/${img}`);
  add(`assets/medias/home/archives-compressed/${img.replace(/\.(jpe?g|png)$/i, '.webp')}`);
}

// ---------- playground ----------
const pgVideos = [1, 2, 3, 4, 5, 9, 11, 14, 15];
const pgImages = [6, 7, 8, 10, 12, 13];
for (const n of pgVideos) {
  add(`assets/medias/playground/${n}.mp4`);
  add(`assets/medias/playground/${n}.webm`);
  add(`assets/medias/playground-compressed/${n}.mp4`);
  add(`assets/medias/playground-compressed/${n}-poster.webp`);
}
for (const n of pgImages) {
  add(`assets/medias/playground/${n}.jpg`);
  add(`assets/medias/playground-webp/${n}.webp`);
}

// ---------- about medias ----------
add('assets/medias/about/intro/intro.jpg');
add('assets/medias/about/intro-webp/intro.webp');
add('assets/medias/about/content/content.jpg');
add('assets/medias/about/content-webp/content.webp');

// ---------- sounds ----------
for (const s of ['ambient', 'fruit1', 'fruit2', 'pageTransition']) {
  add(`assets/sounds/compressed/${s}.aac`);
  add(`assets/sounds/${s}.mp3`);
  add(`assets/sounds/${s}.wav`);
}

// ---------- routes (SPA — same index.html, but grab them anyway) ----------
['/about', '/playground'].forEach(add);

// =====================================================================
const list = [...urls];
console.log(`Downloading ${list.length} candidate URLs → ${ROOT}`);
const results = { ok: [], missing: [], failed: [] };

async function download(path) {
  const url = ORIGIN + path;
  let local = path;
  if (path === '/about' || path === '/playground') local = `${path}/index.html`;
  const dest = join(ROOT, local);
  try {
    const s = await stat(dest).catch(() => null);
    if (s && s.size > 0) { results.ok.push({ path, bytes: s.size, cached: true }); return; }
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (mirror)' } });
    if (res.status === 404) { results.missing.push(path); return; }
    if (!res.ok) { results.failed.push({ path, status: res.status }); return; }
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    results.ok.push({ path, bytes: buf.length });
    process.stdout.write(`  ✓ ${path} (${(buf.length / 1024).toFixed(0)} KB)\n`);
  } catch (e) {
    results.failed.push({ path, error: String(e.message || e) });
  }
}

let idx = 0;
async function worker() { while (idx < list.length) await download(list[idx++]); }
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const total = results.ok.reduce((a, b) => a + b.bytes, 0);
console.log(`\nDone: ${results.ok.length} ok (${(total / 1048576).toFixed(1)} MB), ${results.missing.length} 404, ${results.failed.length} failed`);
await mkdir(join(ROOT, '..', 'docs', 'research'), { recursive: true });
await writeFile(join(ROOT, '..', 'docs', 'research', 'asset-manifest.json'), JSON.stringify(results, null, 2));
if (results.failed.length) { console.log('FAILED:', results.failed); }
console.log('404 (expected for speculative variants):', results.missing.length);
