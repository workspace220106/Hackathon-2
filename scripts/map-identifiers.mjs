// Maps minified top-level identifiers of the production bundle to their real
// names in the vendor libraries (three, vue, vue-router, pinia, gsap, lenis).
//
// Method: split the bundle into vendor regions (by license comments), then
// fingerprint every top-level declaration (class method sets, string literals,
// member-property names, AST node-type histogram, param counts) and match it
// against the same fingerprint of the library's own (unminified) source.
//
// Output: docs/research/identifier-map.json  (+ .txt for grepping)
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'acorn';
import * as walk from 'acorn-walk';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nm = (p) => join(root, 'node_modules', p);
const bundleSrc = readFileSync(join(root, 'mirror', 'assets', 'index-BZFBO0Ol.js'), 'utf8');

// ---------------- fingerprinting ----------------
function fp(node) {
  const strings = new Set(), props = new Set(), hist = {};
  let nodes = 0;
  walk.full(node, (n) => {
    nodes++;
    hist[n.type] = (hist[n.type] || 0) + 1;
    if (n.type === 'Literal' && typeof n.value === 'string' && n.value.length > 2) strings.add(n.value);
    if (n.type === 'TemplateElement' && n.value.cooked && n.value.cooked.length > 2) strings.add(n.value.cooked);
    if (n.type === 'MemberExpression' && !n.computed && n.property.type === 'Identifier') props.add(n.property.name);
  });
  return { strings: [...strings], props: [...props], hist, nodes };
}
function classFp(node) {
  const methods = [];
  for (const m of node.body.body) {
    if (m.type === 'MethodDefinition' || m.type === 'PropertyDefinition') {
      const k = m.key.type === 'Identifier' ? m.key.name : (m.key.value ?? '?');
      methods.push((m.static ? 'static:' : '') + k);
    }
  }
  return { methods, ...fp(node) };
}
function collect(src) {
  let ast;
  try { ast = parse(src, { ecmaVersion: 'latest', sourceType: 'module' }); } catch (e) { return []; }
  const out = [];
  const push = (kind, name, node, extra = {}) => out.push({ kind, name, start: node.start, end: node.end, ...extra });
  for (let n of ast.body) {
    if ((n.type === 'ExportNamedDeclaration' || n.type === 'ExportDefaultDeclaration') && n.declaration) n = n.declaration;
    if (n.type === 'ClassDeclaration' && n.id) push('class', n.id.name, n, { super: n.superClass?.name ?? null, ...classFp(n) });
    else if (n.type === 'FunctionDeclaration' && n.id) push('function', n.id.name, n, { params: n.params.length, ...fp(n) });
    else if (n.type === 'VariableDeclaration') {
      for (const d of n.declarations) {
        if (!d.init || d.id.type !== 'Identifier') continue;
        const i = d.init;
        if (i.type === 'ClassExpression') push('class', d.id.name, d, { super: i.superClass?.name ?? null, ...classFp(i) });
        else if (i.type === 'ArrowFunctionExpression' || i.type === 'FunctionExpression') push('function', d.id.name, d, { params: i.params.length, ...fp(i) });
        else if (i.type === 'Literal' && typeof i.value === 'string') push('conststr', d.id.name, d, { value: i.value });
        else if (i.type === 'Literal' && typeof i.value === 'number') push('constnum', d.id.name, d, { value: i.value });
        else if (i.type === 'ObjectExpression') push('object', d.id.name, d, { keys: i.properties.map(p => p.key?.name ?? p.key?.value).filter(Boolean), ...fp(i) });
        else if (i.type === 'CallExpression' || i.type === 'NewExpression') push('call', d.id.name, d, { ...fp(i) });
        else push('other', d.id.name, d, { ...fp(i) });
      }
    }
  }
  return out;
}
function walkDir(d, acc = []) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walkDir(p, acc); else if (f.endsWith('.js') || f.endsWith('.mjs')) acc.push(p);
  }
  return acc;
}
function loadRef(files, lib) {
  const out = [];
  for (const f of files) for (const d of collect(readFileSync(f, 'utf8'))) out.push({ ...d, lib, file: f.replace(root, '').replace(/\\/g, '/') });
  return out;
}

// ---------------- reference libraries ----------------
const refs = {
  three: loadRef([nm('three/build/three.module.js'), ...walkDir(nm('three/examples/jsm/loaders')), ...walkDir(nm('three/examples/jsm/postprocessing')), ...walkDir(nm('three/examples/jsm/shaders')), ...walkDir(nm('three/examples/jsm/utils')), ...walkDir(nm('three/examples/jsm/libs')).filter(f => /draco|basis|ktx|meshopt/i.test(f))], 'three'),
  vue: loadRef([nm('@vue/shared/dist/shared.esm-bundler.js'), nm('@vue/reactivity/dist/reactivity.esm-bundler.js'), nm('@vue/runtime-core/dist/runtime-core.esm-bundler.js'), nm('@vue/runtime-dom/dist/runtime-dom.esm-bundler.js')], 'vue'),
  gsap: loadRef([nm('gsap/gsap-core.js'), nm('gsap/CSSPlugin.js'), nm('gsap/utils/paths.js'), nm('gsap/CustomEase.js'), nm('gsap/SplitText.js'), nm('gsap/Observer.js'), nm('gsap/ScrollTrigger.js')], 'gsap'),
  router: loadRef([nm('vue-router/dist/vue-router.mjs')], 'vue-router'),
  pinia: loadRef([nm('pinia/dist/pinia.mjs')], 'pinia'),
  lenis: loadRef([nm('@studio-freight/lenis/dist/lenis.mjs')], 'lenis'),
  yuka: loadRef([nm('yuka/build/yuka.module.js')], 'yuka'),
};
for (const [k, v] of Object.entries(refs)) console.log(`ref ${k}: ${v.length} decls`);

// ---------------- bundle regions (char offsets) ----------------
const off = (s, from = 0) => { const i = bundleSrc.indexOf(s, from); if (i < 0) throw new Error('marker not found: ' + s); return i; };
const M = {
  three0: 0,
  vue0: off('@vue/shared v3.5.25'),
  gsap0: off('GSAP 3.14.1'),
  app1: off('const I3=Math.PI/180'),
  gsapPaths: off('paths 3.14.1'),
  app2: off('const yG={class:"menuButton"}'),
  splitText: off('SplitText 3.14.1'),
  app3: off('function Kr(s,e,t)'),
  router0: off('vue-router v4.1.6'),
  app4: off('const QH=500'),
  observer0: off('Observer 3.14.1'),
  scrollTrigger0: off('ScrollTrigger 3.14.1'),
  pinia0: off('pinia v2.3.1'),
  app5: off('class a8'), // URLParams → start of remaining app code
  yuka0: off('class qS{constructor(e,t,n,i,r){this.sender=e'),
  yukaEnd: off('CX="pageTransition"'),
  end: bundleSrc.length,
};
// Lenis has no license banner: locate its class by its distinctive option name.
M.lenis0 = bundleSrc.lastIndexOf('class ', off('syncTouchLerp'));
M.lenisEnd = off('class ', off('toggleClassName("lenis-locked"')); // next class after Lenis body
const regions = [
  ['three', M.three0, M.vue0],
  ['vue', M.vue0, M.gsap0],
  ['gsap', M.gsap0, M.app1],
  ['gsap', M.gsapPaths, M.app2],
  ['gsap', M.splitText, M.app3],
  ['router', M.router0, M.app4],
  ['lenis', M.lenis0, M.lenisEnd],
  ['gsap', M.observer0, M.pinia0],
  ['pinia', M.pinia0, M.app5],
  ['three', M.app5, M.yuka0], // three/examples postprocessing (Pass, EffectComposer…) live inside the late app region
  ['yuka', M.yuka0, M.yukaEnd],
  ['three', M.yukaEnd, M.end],
];
const bundle = collect(bundleSrc);
console.log(`bundle decls: ${bundle.length}`);
const libOf = (d) => { for (const [lib, a, b] of regions) if (d.start >= a && d.start < b) return lib; return null; };

// ---------------- scoring ----------------
const jacc = (a, b) => { const A = new Set(a), B = new Set(b); if (!A.size && !B.size) return 1; let i = 0; for (const x of A) if (B.has(x)) i++; return i / (A.size + B.size - i); };
const cos = (h1, h2) => { let d = 0, n1 = 0, n2 = 0; for (const k in h1) { n1 += h1[k] ** 2; if (h2[k]) d += h1[k] * h2[k]; } for (const k in h2) n2 += h2[k] ** 2; return d / (Math.sqrt(n1 * n2) || 1); };
function score(b, r) {
  if (b.kind !== r.kind) return 0;
  if (b.kind === 'class') {
    if (!b.methods.length) return 0;
    const sm = jacc(b.methods, r.methods);
    return 0.6 * sm + 0.15 * jacc(b.strings, r.strings) + 0.15 * jacc(b.props, r.props) + 0.1 * cos(b.hist, r.hist);
  }
  if (b.kind === 'function') {
    if (b.params !== r.params) return 0;
    const sizeRatio = Math.min(b.nodes, r.nodes) / Math.max(b.nodes, r.nodes);
    if (sizeRatio < 0.5) return 0;
    return 0.35 * jacc(b.strings, r.strings) + 0.35 * jacc(b.props, r.props) + 0.3 * cos(b.hist, r.hist);
  }
  if (b.kind === 'object') return 0.7 * jacc(b.keys, r.keys) + 0.3 * jacc(b.strings, r.strings);
  if (b.kind === 'conststr') return b.value === r.value ? 1 : 0;
  if (b.kind === 'call' || b.kind === 'other') return 0.4 * jacc(b.strings, r.strings) + 0.3 * jacc(b.props, r.props) + 0.3 * cos(b.hist, r.hist);
  return 0;
}

const map = {}, taken = new Set();
const candidates = [];
for (const b of bundle) {
  const lib = libOf(b);
  if (!lib || b.kind === 'constnum') continue;
  const pool = refs[lib];
  let best = null, s1 = 0, s2 = 0;
  for (const r of pool) {
    const s = score(b, r);
    if (s > s1) { s2 = s1; s1 = s; best = r; } else if (s > s2) s2 = s;
  }
  if (!best) continue;
  const thresh = b.kind === 'class' ? 0.7 : b.kind === 'conststr' ? 1 : b.kind === 'object' ? 0.8 : 0.82;
  const margin = b.kind === 'conststr' ? 0 : 0.04;
  if (s1 >= thresh && s1 - s2 >= margin) candidates.push({ b, r: best, s: s1 });
}
candidates.sort((x, y) => y.s - x.s);
for (const { b, r, s } of candidates) {
  const key = r.lib + ':' + r.name;
  if (taken.has(key) || map[b.name]) continue;
  taken.add(key);
  map[b.name] = { name: r.name, lib: r.lib, kind: b.kind, score: +s.toFixed(3), file: r.file };
}
// superclass propagation for classes
let added = 1;
while (added) {
  added = 0;
  for (const b of bundle.filter(x => x.kind === 'class' && map[x.name] && x.super && !map[x.super])) {
    const r = refs[map[b.name].lib].find(r => r.kind === 'class' && r.name === map[b.name].name);
    if (r && r.super && !taken.has(r.lib + ':' + r.super)) {
      map[b.super] = { name: r.super, lib: r.lib, kind: 'class', score: 0.5, file: r.file, via: 'superclass of ' + b.name };
      taken.add(r.lib + ':' + r.super); added++;
    }
  }
}

// ---------------- three.js numeric constants by declaration order ----------------
const threeConstSrc = readFileSync(nm('three/build/three.module.js'), 'utf8');
const refConsts = [];
for (const m of threeConstSrc.matchAll(/^const (\w+) = (-?[\d.e]+);/gm)) refConsts.push({ name: m[1], value: Number(m[2]) });
const bundleConsts = bundle.filter(b => b.kind === 'constnum' && b.start < M.vue0);
// Greedy in-order alignment: both lists are in source order; a bundle const matches the next ref const with the same value.
let ri = 0;
for (const b of bundleConsts) {
  let j = ri;
  while (j < refConsts.length && refConsts[j].value !== b.value) j++;
  if (j < refConsts.length && j - ri < 40) { map[b.name] = { name: refConsts[j].name, lib: 'three', kind: 'constnum', score: 1, value: b.value }; ri = j + 1; }
}

// ---------------- manual / well-known ----------------
Object.assign(map, {
  Z: { name: 'gsap', lib: 'gsap', kind: 'manual' },
  Bt: { name: 'ScrollTrigger', lib: 'gsap', kind: 'manual' },
  Kn: { name: 'CustomEase', lib: 'gsap', kind: 'manual' },
  jh: { name: 'SplitText', lib: 'gsap', kind: 'manual' },
  Pn: { name: 'Observer', lib: 'gsap', kind: 'manual' },
  k5: { name: 'Lenis', lib: 'lenis', kind: 'manual' },
  ce: { name: 'EVENTS', lib: 'app', kind: 'manual' },
  te: { name: 'emitter', lib: 'app', kind: 'manual' },
  I: { name: 'app', lib: 'app', kind: 'manual' },
  Wu: { name: 'router', lib: 'app', kind: 'manual' },
  // Vue runtime helpers used by compiled SFC render functions
  ee: { name: 'createElementVNode', lib: 'vue', kind: 'manual' },
  ue: { name: 'ref', lib: 'vue', kind: 'manual' },
  we: { name: 'openBlock', lib: 'vue', kind: 'manual' },
  Ye: { name: 'createVNode', lib: 'vue', kind: 'manual' },
  Ot: { name: 'withCtx', lib: 'vue', kind: 'manual' },
  Xt: { name: 'onMounted', lib: 'vue', kind: 'manual' },
  on: { name: 'onUnmounted', lib: 'vue', kind: 'manual' },
  qT: { name: 'onBeforeMount', lib: 'vue', kind: 'manual' },
  ln: { name: 'renderList', lib: 'vue', kind: 'manual' },
  An: { name: 'createCommentVNode', lib: 'vue', kind: 'manual' },
  Wt: { name: 'computed', lib: 'vue', kind: 'manual' },
  Jo: { name: 'watch', lib: 'vue', kind: 'manual' },
  Zo: { name: 'guardReactiveProps', lib: 'vue', kind: 'manual' },
  Jp: { name: 'Teleport', lib: 'vue', kind: 'manual' },
  Zf: { name: 'renderSlot', lib: 'vue', kind: 'manual' },
  rl: { name: 'normalizeStyle', lib: 'vue', kind: 'manual' },
  EC: { name: 'Transition', lib: 'vue', kind: 'manual' },
  JT: { name: 'resolveDynamicComponent', lib: 'vue', kind: 'manual' },
  Pv: { name: 'createTextVNode', lib: 'vue', kind: 'manual' },
  FT: { name: 'withDirectives', lib: 'vue', kind: 'manual' },
  lU: { name: 'createApp', lib: 'vue', kind: 'manual' },
  Ht: { name: '_export_sfc', lib: 'vite-plugin-vue', kind: 'manual' },
  GH: { name: 'createRouter', lib: 'vue-router', kind: 'manual' },
  UM: { name: 'RouterView', lib: 'vue-router', kind: 'manual' },
  Gc: { name: 'useRoute', lib: 'vue-router', kind: 'manual' },
  r8: { name: 'createPinia', lib: 'pinia', kind: 'manual' },
  si: { name: 'Float32BufferAttribute', lib: 'three', kind: 'manual' },
  Do: { name: 'howler', lib: 'howler', kind: 'manual' },
  // esbuild private-field helpers
  Je: { name: '__privateGet', lib: 'esbuild-helpers', kind: 'manual' },
  Qt: { name: '__privateAdd', lib: 'esbuild-helpers', kind: 'manual' },
  ci: { name: '__privateSet', lib: 'esbuild-helpers', kind: 'manual' },
  li: { name: '__publicField', lib: 'esbuild-helpers', kind: 'manual' },
  Br: { name: '__privateMethod', lib: 'esbuild-helpers', kind: 'manual' },
  // app-level helpers whose real names are recoverable from context
  dO: { name: 'initKtxTextureLoader', lib: 'app', kind: 'manual' },
  fO: { name: 'KtxTextureLoader', lib: 'app', kind: 'manual' },
});

const n = Object.keys(map).length;
console.log(`mapped ${n} identifiers`);
const byLib = {};
for (const v of Object.values(map)) byLib[v.lib] = (byLib[v.lib] || 0) + 1;
console.log(byLib);
writeFileSync(join(root, 'docs', 'research', 'identifier-map.json'), JSON.stringify(map, null, 2));
const lines = Object.entries(map).sort((a, b) => (a[1].lib + a[1].name).localeCompare(b[1].lib + b[1].name)).map(([k, v]) => `${k.padEnd(8)} → ${v.name.padEnd(36)} ${v.lib.padEnd(10)} ${String(v.kind).padEnd(9)} ${v.score ?? ''}`);
writeFileSync(join(root, 'docs', 'research', 'identifier-map.txt'), lines.join('\n'));
