// Splits the de-minified app code into ES modules under src/ according to
// scripts/module-plan.mjs, generating imports/exports between modules and
// from vendor packages. Run:  node scripts/split-modules.mjs
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import beautify from 'js-beautify';
import { units, unitByName, map, root, renderUnit, src, vendorLibs } from './lib/bundle-units.mjs';
import { plan, renames, dropUnits } from './module-plan.mjs';

const OUT = join(root, 'src');
// Safety: once src/ has been hand-edited, refuse to overwrite it unless --force is passed.
if (existsSync(join(OUT, '.hand-edited')) && !process.argv.includes('--force')) {
  console.error('src/ contains hand edits (src/.hand-edited exists). Re-run with --force to overwrite generated files.');
  process.exit(1);
}

// yuka re-uses many three.js class names — alias them as Yuka<Name> everywhere
const YUKA_ALIASED = new Set(['Vector3', 'Matrix3', 'Matrix4', 'Quaternion', 'Ray', 'MathUtils', 'AABB', 'BoundingSphere', 'Logger']);
for (const [min, info] of Object.entries(map)) if (info.lib === 'yuka' && YUKA_ALIASED.has(info.name) && !renames[min]) renames[min] = 'Yuka' + info.name;
const appUnits = units.filter(u => !u.isVendor && !dropUnits.includes(u.id));
const byId = new Map(appUnits.map(u => [u.id, u]));
const order = appUnits.map(u => u.id);
const posOf = (id) => order.indexOf(id);

// ---- resolve plan ranges → unit ids ----
function resolveRef(ref) {
  if (ref === 'END') return order[order.length - 1];
  const m = ref.match(/^(.+?)(?:\+(\d+))?$/);
  const u = unitByName.get(m[1]);
  if (!u) throw new Error(`unknown unit in plan: ${ref}`);
  const p = posOf(u.id) + (m[2] ? Number(m[2]) : 0);
  return order[p];
}
const unitFile = new Map();
for (const entry of plan) {
  const [a, b] = entry.range.split('..');
  const from = posOf(resolveRef(a)), to = posOf(resolveRef(b));
  if (from < 0 || to < 0 || to < from) throw new Error(`bad range ${entry.range}`);
  for (let i = from; i <= to; i++) {
    const id = order[i];
    if (unitFile.has(id)) throw new Error(`unit ${id} (${byId.get(id).names}) assigned twice: ${unitFile.get(id)} & ${entry.file}`);
    unitFile.set(id, entry.file);
  }
}
const unassigned = appUnits.filter(u => !unitFile.has(u.id));
if (unassigned.length) {
  console.error('UNASSIGNED UNITS:');
  for (const u of unassigned) console.error(`  #${u.id} ${u.names.join(',') || u.kind} ${src.slice(u.start, u.start + 80).replace(/\s+/g, ' ')}`);
  process.exit(1);
}

// ---- ownership of names ----
const ownerFile = new Map(); // top-level name → file
for (const u of appUnits) for (const nm of u.names) ownerFile.set(nm, unitFile.get(u.id));
const realName = (nm) => renames[nm] ?? map[nm]?.name ?? nm;

// ---- vendor import specs ----
function vendorSpec(nm) {
  const m = map[nm];
  const lib = m.lib;
  const name = m.name;
  switch (lib) {
    case 'three': {
      const f = m.file || '';
      if (f.includes('three/examples/jsm/')) return { pkg: 'three/examples/jsm/' + f.split('three/examples/jsm/')[1], name };
      return { pkg: 'three', name };
    }
    case 'vue': return { pkg: 'vue', name };
    case 'vue-router': return { pkg: 'vue-router', name };
    case 'pinia': return { pkg: 'pinia', name };
    case 'yuka': return YUKA_ALIASED.has(name) ? { pkg: 'yuka', name, alias: 'Yuka' + name } : { pkg: 'yuka', name };
    case 'lenis': return { pkg: '@studio-freight/lenis', name, isDefault: true };
    case 'howler': return { pkg: 'howler', name: 'howler', isNamespace: true };
    case 'gsap': {
      if (name === 'gsap') return { pkg: 'gsap', name: 'gsap' };
      return { pkg: `gsap/${name}`, name };
    }
    case 'esbuild-helpers': return { pkg: '@/utils/private-fields.js', name };
    case 'vite-plugin-vue': return { pkg: '@/utils/export-sfc.js', name };
    default: throw new Error(`no import rule for ${lib}:${name}`);
  }
}

// ---- collect per-file units, refs ----
const files = new Map(); // file → { units: [], refs:Set, exports:Set }
for (const u of appUnits) {
  const f = unitFile.get(u.id);
  if (!files.has(f)) files.set(f, { units: [], refs: new Set(), exports: new Set() });
  const entry = files.get(f);
  entry.units.push(u);
  for (const r of u.refs) entry.refs.add(r);
}
// exports: names referenced from other files (or explicitly wanted)
for (const [f, entry] of files) {
  for (const r of entry.refs) {
    const owner = ownerFile.get(r);
    if (owner && owner !== f) files.get(owner).exports.add(r);
  }
}
// cross-module assignment check (ES imports are read-only bindings)
for (const u of appUnits) {
  const f = unitFile.get(u.id);
  const text = src.slice(u.start, u.end);
  for (const r of u.refs) {
    const owner = ownerFile.get(r);
    if (owner && owner !== f && new RegExp(`(^|[^.\\w$])${r.replace('$', '\\$')}\\s*=[^=]`).test(text)) {
      console.warn(`WARN: ${f} assigns to ${r} (${realName(r)}) owned by ${owner}`);
    }
  }
}

// ---- helpers for emitting ----
function relImport(fromFile, toFile) {
  let p = relative(dirname(fromFile), toFile).replace(/\\/g, '/');
  if (!p.startsWith('.')) p = './' + p;
  return p;
}
const KIND_OF = new Map(); // unit id → 'const'|'let'|'var'|'class'|'function'|stmt
for (const u of appUnits) KIND_OF.set(u.id, u.kind);

function emitUnit(u, exportsSet) {
  const text = renderUnit(u, renames);
  const isExported = u.names.some(n => exportsSet.has(n));
  const exp = isExported ? 'export ' : '';
  if (u.kind === 'const' || u.kind === 'let' || u.kind === 'var') {
    const kind = u.kind === 'var' ? 'let' : u.kind;
    // `name=init` or bare `name`
    const nm = u.names[0];
    const declared = text.startsWith(realName(nm)) ? text : text; // renderUnit already renamed the declarator id
    if (!u.node.init) return `${exp}${kind} ${realName(nm)};`;
    return `${exp}${kind} ${declared};`;
  }
  if (u.kind === 'class' || u.kind === 'function') return `${exp}${text}`;
  // statement
  return text.endsWith(';') ? text : text + ';';
}

// ---- write files ----
// (generated files are overwritten in place; hand-written files under src/ are kept)
let count = 0;
for (const [f, entry] of files) {
  const own = new Set(entry.units.flatMap(u => u.names));
  const importsByPkg = new Map(); // pkg → Set(names) | {default} | {namespace}
  const addImp = (pkg, spec) => { if (!importsByPkg.has(pkg)) importsByPkg.set(pkg, { names: new Set(), def: null, ns: null }); const e = importsByPkg.get(pkg); if (spec.isDefault) e.def = spec.name; else if (spec.isNamespace) e.ns = spec.name; else e.names.add(spec.alias ? `${spec.name} as ${spec.alias}` : spec.name); };
  for (const r of entry.refs) {
    if (own.has(r)) continue;
    const owner = ownerFile.get(r);
    if (owner) { addImp(relImport(f, owner), { name: realName(r) }); continue; }
    if (map[r] && vendorLibs.has(map[r].lib)) { addImp(vendorSpec(r).pkg, vendorSpec(r)); continue; }
    console.warn(`WARN: ${f} references unknown top-level ${r}`);
  }
  let out = f === 'src/main.js' ? "import '@/styles/original.css';\n" : '';
  const pkgs = [...importsByPkg.keys()].sort((a, b) => (a.startsWith('.') ? 1 : 0) - (b.startsWith('.') ? 1 : 0) || a.localeCompare(b));
  for (const pkg of pkgs) {
    const e = importsByPkg.get(pkg);
    const parts = [];
    if (e.def) parts.push(e.def);
    if (e.ns) parts.push(`* as ${e.ns}`);
    if (e.names.size) parts.push(`{ ${[...e.names].sort().join(', ')} }`);
    out += `import ${parts.join(', ')} from '${pkg}';\n`;
  }
  if (pkgs.length) out += '\n';
  for (const u of entry.units) out += emitUnit(u, entry.exports) + '\n\n';
  // howler namespace usage → named
  if (out.includes('howler.')) out = out.replace(/\bhowler\.(Howl|Howler)\b/g, '$1').replace(`import * as howler from 'howler';`, `import { Howl, Howler } from 'howler';`);
  const pretty = beautify.js(out, { indent_size: 2, max_preserve_newlines: 2, brace_style: 'collapse', keep_array_indentation: false, space_after_anon_function: true, end_with_newline: true });
  const dest = join(OUT, f.replace(/^src\//, ''));
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, pretty);
  count++;
}

// ---- original stylesheet (scoped selectors still match: the compiled components keep their __scopeId) ----
mkdirSync(join(OUT, 'styles'), { recursive: true });
if (!existsSync(join(OUT, 'styles', 'original.css'))) writeFileSync(join(OUT, 'styles', 'original.css'), readFileSync(join(root, 'mirror', 'assets', 'index-CLH3rn1-.css'), 'utf8'));

// ---- helper modules that replace bundler-injected code ----
mkdirSync(join(OUT, 'utils'), { recursive: true });
writeFileSync(join(OUT, 'utils', 'private-fields.js'), `// Runtime helpers for the private-field pattern used across the codebase
// (equivalent to what esbuild emits for \`#private\` class members).
export const __publicField = (obj, key, value) => Object.defineProperty(obj, typeof key !== 'symbol' ? key + '' : key, { enumerable: true, configurable: true, writable: true, value });
const accessCheck = (obj, member, msg) => { if (!member.has(obj)) throw TypeError('Cannot ' + msg); };
export const __privateGet = (obj, member, getter) => (accessCheck(obj, member, 'read from private field'), getter ? getter.call(obj) : member.get(obj));
export const __privateAdd = (obj, member, value) => member.has(obj) ? (() => { throw TypeError('Cannot add the same private member more than once'); })() : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
export const __privateSet = (obj, member, value, setter) => (accessCheck(obj, member, 'write to private field'), setter ? setter.call(obj, value) : member.set(obj, value), value);
export const __privateMethod = (obj, member, method) => (accessCheck(obj, member, 'access private method'), method);
`);
writeFileSync(join(OUT, 'utils', 'export-sfc.js'), `// Same helper @vitejs/plugin-vue injects for compiled SFCs: attaches
// __scopeId / render / etc. to a component definition object.
export const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) target[key] = val;
  return target;
};
`);
console.log(`wrote ${count} modules to src/`);
