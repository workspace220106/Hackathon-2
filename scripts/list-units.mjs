import { units, src, map } from './lib/bundle-units.mjs';
import { writeFileSync } from 'node:fs';
const lines = [];
for (const u of units) {
  if (u.isVendor) continue;
  const head = src.slice(u.start, Math.min(u.end, u.start + 90)).replace(/\s+/g, ' ');
  const nm = u.names.join(',') || `(${u.kind})`;
  lines.push(`${String(u.id).padStart(4)} ${u.region.padEnd(9)} ${String(u.end - u.start).padStart(6)} ${nm.padEnd(22)} ${head}`);
}
writeFileSync('docs/research/units.txt', lines.join('\n'));
console.log(lines.length, 'app units');
