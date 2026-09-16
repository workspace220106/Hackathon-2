// Builds the "Presented Domain" slider images (webp, 2048 + 1024 wide) from the
// downloaded domain photos.  Slider ↔ asset set:  CORE ML = project1,
// FINTECH = project2, BLOCKCHAIN = project4, CYBERSECURITY = project5.
import sharp from 'sharp';
import { readdirSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const DL = 'C:/Users/araji/Downloads';
const files = readdirSync(DL).filter((f) => /\.jpe?g$/i.test(f) && /_2026091702(5|6)|_20260917030/.test(f));
const pick = (re) => files.filter((f) => re.test(f)).sort();
const SETS = {
  project1: pick(/Core_ML|neural_netwo/i),                      // CORE ML
  project2: pick(/Fintech|Trading_floor|financial_marke/i),     // FINTECH
  project4: pick(/Blockchain/i),                                 // BLOCKCHAIN
  project5: pick(/Cybersecurity|SOC_|Security_operators|Secure_operations/i), // CYBERSECURITY
};
const out = 'public/assets/medias/home/projects';
for (const [p, list] of Object.entries(SETS)) {
  console.log(p, list.length, 'images');
  for (const size of [2048, 1024]) {
    const dir = join(out, `${p}-webp`, String(size));
    rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
    for (let i = 0; i < list.length; i++) {
      await sharp(join(DL, list[i])).resize({ width: size, withoutEnlargement: true }).webp({ quality: 86 }).toFile(join(dir, `${i + 1}.webp`));
    }
  }
}
for (const p of ['project1', 'project2', 'project3', 'project4', 'project5', 'project6']) rmSync(join(out, `${p}-ktx`), { recursive: true, force: true });
for (const p of ['project3', 'project6']) rmSync(join(out, `${p}-webp`), { recursive: true, force: true });
console.log('done');
