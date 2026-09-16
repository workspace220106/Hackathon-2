import { units, src, renderUnit } from './lib/bundle-units.mjs';
for (const u of units) {
  if (u.isVendor) continue;
  const t = src.slice(u.start, u.end);
  const isClass = /^(class |[A-Za-z_$][\w$]*=class|[A-Za-z_$][\w$]*=\([A-Za-z_$][\w$]*=class)/.test(t);
  if (!isClass && u.end - u.start < 2500) continue;
  const r = renderUnit(u).replace(/\s+/g, ' ');
  console.log(`\n#${u.id} ${u.region} ${u.names.join(',')} (${u.end - u.start})\n  ${r.slice(0, 420)}`);
}
