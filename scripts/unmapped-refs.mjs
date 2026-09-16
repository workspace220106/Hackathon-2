// Lists vendor identifiers referenced from the app's own code that are not yet
// in identifier-map.json, with a snippet of their declaration for manual mapping.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'acorn';
import * as walk from 'acorn-walk';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'mirror', 'assets', 'index-BZFBO0Ol.js'), 'utf8');
const map = JSON.parse(readFileSync(join(root, 'docs', 'research', 'identifier-map.json'), 'utf8'));
const ast = parse(src, { ecmaVersion: 'latest', sourceType: 'module' });

const off = (s, from = 0) => { const i = src.indexOf(s, from); if (i < 0) throw new Error('marker: ' + s); return i; };
// app regions (everything else is vendor)
const appRegions = [
  [off('LOADER_PROGRESS:') - 40, off('@vue/shared v3.5.25')],
  [off('const I3=Math.PI/180'), off('paths 3.14.1')],
  [off('__name:"MenuButton"'), off('SplitText 3.14.1')],
  [off('function Kr(s,e,t)'), off('vue-router v4.1.6')],
  [off('const QH=500'), off('Observer 3.14.1')],
  [off('class a8'), src.length],
];
const inApp = (pos) => appRegions.some(([a, b]) => pos >= a && pos < b);

const decl = new Map();
for (const n of ast.body) {
  if (n.type === 'ClassDeclaration' || n.type === 'FunctionDeclaration') decl.set(n.id.name, n);
  else if (n.type === 'VariableDeclaration') for (const d of n.declarations) if (d.id.type === 'Identifier') decl.set(d.id.name, d);
}
const used = new Map();
for (const n of ast.body) {
  if (!inApp(n.start)) continue;
  walk.full(n, (id) => { if (id.type === 'Identifier' && decl.has(id.name)) used.set(id.name, (used.get(id.name) || 0) + 1); });
}
const rows = [];
for (const [name, count] of used) {
  const d = decl.get(name);
  if (inApp(d.start)) continue;
  if (map[name]) continue;
  rows.push({ name, count, at: d.start, snippet: src.slice(d.start, Math.min(d.end, d.start + 120)).replace(/\s+/g, ' ') });
}
rows.sort((a, b) => b.count - a.count);
for (const r of rows) console.log(`${r.name.padEnd(8)} x${String(r.count).padEnd(4)} @${r.at}  ${r.snippet}`);
console.log(`\n${rows.length} unmapped vendor identifiers referenced from app code`);
