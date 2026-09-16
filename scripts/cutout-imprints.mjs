// Keys the (near-)white wall out of the graffiti images → transparent webp.
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
const dir = 'public/assets/imprints';
const SRC = ['/c/Users/araji/Downloads/Spray_painting_cyberpunk_graffit…_2K_20260917014144.jpeg','/c/Users/araji/Downloads/Graffiti_text_spelling_BLOCKCHAIN_2K_20260917014110.jpeg','/c/Users/araji/Downloads/Spray_paint_graffiti_text_2K_20260917014101.jpeg','/c/Users/araji/Downloads/Graffiti_text_FINTECH_spray_painted_2K_20260917014058.jpeg','/c/Users/araji/Downloads/Graffiti_text_reading_UNSTOP_2K_20260917014052.jpeg','/c/Users/araji/Downloads/Spray_paint_graffiti_text_2K_20260917014027.jpeg','/c/Users/araji/Downloads/Graffiti_text_AIDL_spray_paint_2K_20260917014020.jpeg'];
for (let i = 0; i < SRC.length; i++) {
  const img = sharp(SRC[i].replace(/^\/c\//, 'C:/')).resize({ width: 1600 });
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let p = 0, q = 0; p < data.length; p += info.channels, q += 4) {
    const r = data[p], g = data[p + 1], b = data[p + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    // wall = desaturated & not dark (paint is saturated, outlines are black) → transparent with a soft ramp
    let a = 255;
    if (sat < 48 && lum > 95) { const t = (lum - 95) / 45; a = Math.round(255 * (1 - Math.min(1, Math.max(0, t)))); }
    else if (sat < 48) a = 255;
    out[q] = r; out[q + 1] = g; out[q + 2] = b; out[q + 3] = a;
  }
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).webp({ quality: 82, alphaQuality: 90 }).toFile(`${dir}/imprint-${i + 1}.webp`);
  console.log('imprint-' + (i + 1));
}
