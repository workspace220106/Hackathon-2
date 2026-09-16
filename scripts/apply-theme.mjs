// Generates src/styles/original.css from the scraped stylesheet with the site's
// palette swapped for ours (see THEME below), then appends theme overrides.
// Run:  node scripts/apply-theme.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export const THEME = {
  brand: '#FFC300',      // subway yellow — CTA / primary
  sky: '#4FC3F7',        // bright sky blue — colour-blocked sections
  navy: '#1B2A4A',       // body text
  hazard: '#FF5A2E',     // headings / hero type
  cyan: '#00E5D0',       // links / hover
  orange: '#FFA630',     // secondary accent
  bg: '#F7F7F7',         // page background (kept light; sky blue is used for blocks)
};

// original colour → replacement (case-insensitive, all syntaxes normalised to lowercase hex)
const MAP = {
  '#022016': THEME.navy,     // near-black green body text
  '#083d2a': THEME.sky,      // deep green blocks (footer "green" theme, cursor clip, playground bg)
  '#eed6c8': THEME.navy,     // cream text on green blocks → navy on sky blue
  '#f6e016': THEME.brand,    // yellow accents (tags, cursor label, footer bottom)
  '#008841': THEME.cyan,     // "current job" dot
  '#ececec': THEME.orange,   // mobile nav pills
};

let css = readFileSync(join(root, 'mirror', 'assets', 'index-CLH3rn1-.css'), 'utf8');
for (const [from, to] of Object.entries(MAP)) css = css.replace(new RegExp(from, 'gi'), to);
// the cursor label is cream-on-green in the original; after the swap it would be navy-on-navy → yellow label
css = css.replace(/color:#1B2A4A;background:#1B2A4A/gi, `color:${THEME.navy};background:${THEME.brand}`);

css += `

/* ===================== theme overrides (scripts/apply-theme.mjs) ===================== */
:root {
  --c-brand: ${THEME.brand};
  --c-sky: ${THEME.sky};
  --c-navy: ${THEME.navy};
  --c-hazard: ${THEME.hazard};
  --c-cyan: ${THEME.cyan};
  --c-orange: ${THEME.orange};
  --c-bg: ${THEME.bg};
}
/* big display titles (hero + footer) */
.beeBlock .title, .footerBlock .title, .webglSectionBlock .textWrapper__inner { color: var(--c-hazard); }
/* links & hover states */
.mainButton:hover, .links__link:hover, .navLabButton:hover, .agencyLink:hover, .arrowButton:hover, .text__link:hover { color: var(--c-cyan); }
a.text__link { color: var(--c-cyan); }
/* selection */
::selection { background: var(--c-brand); color: var(--c-navy); }
`;

writeFileSync(join(root, 'src', 'styles', 'original.css'), css);
console.log('themed stylesheet written to src/styles/original.css');
