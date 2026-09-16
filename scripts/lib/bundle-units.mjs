// Shared analysis of the production bundle: splits the app regions into
// "units" (one per top-level class / function / variable declarator /
// expression statement), computes scope-aware identifier renames and the
// cross-references between units.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'acorn';
import * as walk from 'acorn-walk';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const src = readFileSync(join(root, 'mirror', 'assets', 'index-BZFBO0Ol.js'), 'utf8');
export const map = JSON.parse(readFileSync(join(root, 'docs', 'research', 'identifier-map.json'), 'utf8'));
export const ast = parse(src, { ecmaVersion: 'latest', sourceType: 'module' });

const off = (s) => { const i = src.indexOf(s); if (i < 0) throw new Error('marker: ' + s); return i; };
export const appRegions = [
  ['core', off('let Ra=null,Cd=null;'), off('@vue/shared v3.5.25')],
  ['ui-1', off('const I3=Math.PI/180'), off('paths 3.14.1')],
  ['ui-2', off('const yG={class:"menuButton"}'), off('SplitText 3.14.1')],
  ['ui-3', off('function Kr(s,e,t)'), off('vue-router v4.1.6')],
  ['ui-4', off('const QH=500'), off('Observer 3.14.1')],
  ['app+webgl', off('const o8=["orbit"'), src.length],
];
// vendor code that sits inside the app regions (bundler interleaving) — never emitted
export const vendorRanges = [
  ['three-gltf', off('class AO extends'), off('const JO=!1')],                       // GLTFLoader + DRACOLoader internals
  ['gsap-helpers', off('function RG(s){var e=0'), off('SplitText 3.14.1')],           // babel iterator helpers hoisted from SplitText
  ['lenis', off('function oI(s,e,t){return Math.max'), off('Observer 3.14.1')],      // Lenis + its internal classes
  ['howler', off('var cu=typeof globalThis'), off('var Ds,Ks,Cp,Mp,Ip,LI,Rp,Bp;')],                       // howler.js IIFE
  ['yuka', off('class qS{constructor'), off('const CX="pageTransition"')],            // yuka + its scratch objects
  ['vercel-analytics', off('var z6=()=>{window.va'), off('const J6=()=>{')],       // @vercel/analytics inject()
];
export const inApp = (pos) => appRegions.find(([, a, b]) => pos >= a && pos < b);
export const inVendorRange = (pos) => vendorRanges.find(([, a, b]) => pos >= a && pos < b);
export const vendorLibs = new Set(['three', 'lenis', 'vue', 'gsap', 'vue-router', 'pinia', 'esbuild-helpers', 'vite-plugin-vue', 'yuka', 'howler']);

// ---------- scope analysis ----------
const scopeDecls = new WeakMap();
const isScope = (n) => /Function|ArrowFunctionExpression|Program|BlockStatement|CatchClause|For(In|Of)?Statement|ClassBody|StaticBlock/.test(n.type);
function declare(scope, name) { if (!scopeDecls.has(scope)) scopeDecls.set(scope, new Set()); scopeDecls.get(scope).add(name); }
function patternNames(p, out = []) {
  if (!p) return out;
  switch (p.type) {
    case 'Identifier': out.push(p.name); break;
    case 'ObjectPattern': for (const pr of p.properties) patternNames(pr.type === 'RestElement' ? pr.argument : pr.value, out); break;
    case 'ArrayPattern': for (const el of p.elements) patternNames(el, out); break;
    case 'RestElement': patternNames(p.argument, out); break;
    case 'AssignmentPattern': patternNames(p.left, out); break;
  }
  return out;
}
walk.fullAncestor(ast, (node, _st, ancestors) => {
  const parentScope = (skipSelf) => { for (let i = ancestors.length - (skipSelf ? 2 : 1); i >= 0; i--) if (isScope(ancestors[i])) return ancestors[i]; return ast; };
  const fnScope = (skipSelf) => { for (let i = ancestors.length - (skipSelf ? 2 : 1); i >= 0; i--) if (/Function|Program/.test(ancestors[i].type)) return ancestors[i]; return ast; };
  if (/Function/.test(node.type)) {
    for (const p of node.params) for (const n of patternNames(p)) declare(node, n);
    if (node.type === 'FunctionDeclaration' && node.id) declare(fnScope(true), node.id.name);
    if (node.type === 'FunctionExpression' && node.id) declare(node, node.id.name);
  } else if (node.type === 'VariableDeclaration') {
    const target = node.kind === 'var' ? fnScope(false) : parentScope(false);
    for (const d of node.declarations) for (const n of patternNames(d.id)) declare(target, n);
  } else if (node.type === 'ClassDeclaration' && node.id) declare(parentScope(false), node.id.name);
  else if (node.type === 'ClassExpression' && node.id) declare(node, node.id.name);
  else if (node.type === 'CatchClause' && node.param) for (const n of patternNames(node.param)) declare(node, n);
});
export const topLevel = scopeDecls.get(ast) || new Set();

/** Returns true if the Identifier node (given its ancestors) is a reference to the top-level binding of its name. */
export function isTopLevelRef(node, ancestors) {
  const name = node.name;
  if (!topLevel.has(name)) return false;
  const parent = ancestors[ancestors.length - 2];
  if (!parent) return false;
  if (parent.type === 'MemberExpression' && parent.property === node && !parent.computed) return false;
  if ((parent.type === 'Property' || parent.type === 'MethodDefinition' || parent.type === 'PropertyDefinition') && parent.key === node && !parent.computed) {
    if (!(parent.type === 'Property' && parent.shorthand)) return false;
  }
  if (parent.type === 'LabeledStatement' || parent.type === 'BreakStatement' || parent.type === 'ContinueStatement') return false;
  for (let i = ancestors.length - 2; i >= 1; i--) {
    const a = ancestors[i];
    if (isScope(a) && scopeDecls.get(a)?.has(name)) return false;
  }
  return true;
}

// ---------- units ----------
export const units = []; // { id, names[], kind, start, end, region, refs:Set<topLevelName>, isVendor }
let uid = 0;
function refsOf(node) {
  const refs = new Set();
  walk.fullAncestor(node, (n, _s, anc) => { if (n.type === 'Identifier' && isTopLevelRef(n, anc)) refs.add(n.name); });
  return refs;
}
for (const n of ast.body) {
  const region = inApp(n.start);
  if (!region) continue;
  if (n.type === 'VariableDeclaration') {
    for (const d of n.declarations) {
      const names = patternNames(d.id);
      units.push({ id: uid++, names, kind: n.kind, start: d.start, end: d.end, region: region[0], refs: refsOf(d), node: d });
    }
  } else if (n.type === 'ClassDeclaration' || n.type === 'FunctionDeclaration') {
    units.push({ id: uid++, names: [n.id.name], kind: n.type === 'ClassDeclaration' ? 'class' : 'function', start: n.start, end: n.end, region: region[0], refs: refsOf(n), node: n });
  } else {
    units.push({ id: uid++, names: [], kind: n.type, start: n.start, end: n.end, region: region[0], refs: refsOf(n), node: n });
  }
}
for (const u of units) {
  for (const nm of u.names) u.refs.delete(nm); // self references
  u.isVendor = (u.names.length > 0 && u.names.every(nm => map[nm] && vendorLibs.has(map[nm].lib))) || !!inVendorRange(u.start);
}
export const unitByName = new Map();
for (const u of units) for (const nm of u.names) unitByName.set(nm, u);

/** Source text of a unit with mapped identifiers renamed (scope-aware). Optionally `extraRenames` {min: real}. */
export function renderUnit(u, extraRenames = {}) {
  const edits = [];
  walk.fullAncestor(u.node, (node, _s, anc) => {
    if (node.type !== 'Identifier' || !isTopLevelRef(node, anc)) return;
    const real = extraRenames[node.name] ?? map[node.name]?.name;
    if (!real || real === node.name) return;
    const parent = anc[anc.length - 2];
    if (parent.type === 'Property' && parent.shorthand && parent.value === node) edits.push({ s: node.start, e: node.end, t: `${node.name}: ${real}` });
    else edits.push({ s: node.start, e: node.end, t: real });
  });
  edits.sort((a, b) => a.s - b.s);
  let out = '', pos = u.start;
  for (const e of edits) { out += src.slice(pos, e.s) + e.t; pos = e.e; }
  out += src.slice(pos, u.end);
  return out;
}
