// Produces docs/research/app.deminified.js: the application's own code from the
// production bundle (vendor libraries stripped) with every mapped identifier
// renamed to its real library name. Renaming is scope-aware so locals that
// happen to shadow a top-level name are left alone.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'acorn';
import * as walk from 'acorn-walk';
import beautify from 'js-beautify';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'mirror', 'assets', 'index-BZFBO0Ol.js'), 'utf8');
const map = JSON.parse(readFileSync(join(root, 'docs', 'research', 'identifier-map.json'), 'utf8'));
const ast = parse(src, { ecmaVersion: 'latest', sourceType: 'module' });

const off = (s) => { const i = src.indexOf(s); if (i < 0) throw new Error('marker: ' + s); return i; };
const appRegions = [
  ['core',        off('function dO(s){'), off('@vue/shared v3.5.25')],           // ktx init, events, emitter, loaders(vendor), manifest, core
  ['ui-1',        off('function Wi(s,e,t)'), off('paths 3.14.1')],
  ['ui-2',        off('__name:"MenuButton"'), off('SplitText 3.14.1')],
  ['ui-3',        off('function Kr(s,e,t)'), off('vue-router v4.1.6')],
  ['ui-4',        off('function GM(){'), off('Observer 3.14.1')],
  ['app+webgl',   off('class a8'), src.length],
];
const inApp = (pos) => appRegions.find(([, a, b]) => pos >= a && pos < b);

// ---- vendor statements living inside app regions that we do NOT want to emit ----
// (three/examples loaders inside 'core', Lenis + gsap postprocessing classes inside later regions)
const skipIfMappedToLib = new Set(['three', 'lenis', 'vue', 'gsap', 'vue-router', 'pinia', 'esbuild-helpers']);

// ---- scope analysis ----
const scopeDecls = new WeakMap(); // scope node -> Set(names)
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
// first pass: collect declarations into their scopes
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
const topLevel = scopeDecls.get(ast) || new Set();

// second pass: collect renames (only identifiers that resolve to the top-level binding)
const edits = [];
walk.fullAncestor(ast, (node, _st, ancestors) => {
  if (node.type !== 'Identifier') return;
  const name = node.name;
  if (!map[name] || !topLevel.has(name)) return;
  const parent = ancestors[ancestors.length - 2];
  // skip non-reference positions
  if (parent.type === 'MemberExpression' && parent.property === node && !parent.computed) return;
  if ((parent.type === 'Property' || parent.type === 'MethodDefinition' || parent.type === 'PropertyDefinition') && parent.key === node && !parent.computed) {
    if (!(parent.type === 'Property' && parent.shorthand)) return;
  }
  if (parent.type === 'LabeledStatement' || parent.type === 'BreakStatement' || parent.type === 'ContinueStatement') return;
  // is it shadowed by an inner scope?
  for (let i = ancestors.length - 2; i >= 1; i--) {
    const a = ancestors[i];
    if (isScope(a) && scopeDecls.get(a)?.has(name)) return; // shadowed → local
  }
  const real = map[name].name;
  if (parent.type === 'Property' && parent.shorthand && parent.value === node) edits.push({ start: node.start, end: node.end, text: `${name}: ${real}` });
  else edits.push({ start: node.start, end: node.end, text: real });
});
edits.sort((a, b) => a.start - b.start);

// ---- emit app statements, region by region ----
const importsByLib = {};
const addImport = (lib, name) => { (importsByLib[lib] ||= new Set()).add(name); };
let out = '';
const index = [];
function applyEdits(a, b) {
  let s = '', pos = a;
  for (const e of edits) {
    if (e.end <= a) continue;
    if (e.start >= b) break;
    s += src.slice(pos, e.start) + e.text; pos = e.end;
  }
  return s + src.slice(pos, b);
}
function declName(n) {
  if (n.type === 'ClassDeclaration' || n.type === 'FunctionDeclaration') return n.id?.name;
  if (n.type === 'VariableDeclaration') return n.declarations.map(d => d.id.type === 'Identifier' ? d.id.name : '?').join(',');
  return null;
}
for (const n of ast.body) {
  const region = inApp(n.start);
  if (!region) continue;
  const name = declName(n);
  // drop vendor declarations that were matched to a library
  if (name && !name.includes(',') && map[name] && skipIfMappedToLib.has(map[name].lib)) continue;
  if (n.type === 'VariableDeclaration' && n.declarations.every(d => d.id.type === 'Identifier' && map[d.id.name] && skipIfMappedToLib.has(map[d.id.name].lib))) continue;
  const text = applyEdits(n.start, n.end);
  index.push({ region: region[0], name, start: n.start, end: n.end, outStart: out.length, kind: n.type });
  out += `// ---- [${region[0]}] ${name ?? n.type} @${n.start}\n` + text + '\n';
}
// which vendor names are referenced by the emitted code?
for (const e of edits) {
  const r = inApp(e.start);
  if (!r) continue;
  const m = map[src.slice(e.start, e.end)];
  if (m && skipIfMappedToLib.has(m.lib)) addImport(m.lib, m.name);
}
let header = '// Auto-generated by scripts/deminify.mjs — the app code of leoparpeix.com with vendor identifiers restored.\n';
for (const [lib, names] of Object.entries(importsByLib)) header += `// uses from ${lib}: ${[...names].sort().join(', ')}\n`;
const pretty = beautify.js(out, { indent_size: 2, max_preserve_newlines: 2, brace_style: 'collapse' });
writeFileSync(join(root, 'docs', 'research', 'app.deminified.js'), header + '\n' + pretty);
writeFileSync(join(root, 'docs', 'research', 'app.index.json'), JSON.stringify(index, null, 1));
console.log(`emitted ${index.length} statements, ${pretty.split('\n').length} lines; ${edits.length} identifier renames`);
console.log(Object.fromEntries(Object.entries(importsByLib).map(([k, v]) => [k, v.size])));
