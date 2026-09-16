const PROPER_NOUNS = ["About", "Playground", "Home", "Work", "Lab", "Navbar", "Tuesday", "Instagram", "Linkedin", "Footer", "Hero"];

const CONTRACTIONS = [
  [/\bi'm\b/g, "I'm"],
  [/\bi've\b/g, "I've"],
  [/\bi'll\b/g, "I'll"],
  [/\bi'd\b/g, "I'd"],
  [/\bi\b/g, "I"]
];

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function isAllCaps(s) {
  return /[a-z]/.test(s) === !1 && /[A-Z]/.test(s)
}

function collectProperNouns(s) {
  const e = new Set(PROPER_NOUNS);
  for (const t of s.matchAll(/\b[A-Z]{2,}\b/g)) e.add(t[0]);
  for (const t of s.matchAll(/\b[A-Z][a-z]+(?:'[a-z]+)?\b/g)) e.add(t[0]);
  return [...e].sort((t, n) => n.length - t.length)
}

function capitalizeSentences(s) {
  return s.replace(/(^|[.!?…]\s+|\n+)([a-z])/g, (e, t, n) => t + n.toUpperCase())
}

function restoreProperNouns(s, e) {
  let t = s;
  for (const [n, i] of CONTRACTIONS) t = t.replace(n, i);
  for (const n of e) {
    if (n === "I" || /^I'/.test(n)) continue;
    const i = new RegExp(`\\b${escapeRegExp(n.toLowerCase())}\\b`, "g");
    t = t.replace(i, n)
  }
  return t
}

export function formatBeeText(s) {
  if (!s || typeof s != "string" || isAllCaps(s)) return s;
  const e = collectProperNouns(s),
    t = s.toLowerCase();
  return restoreProperNouns(capitalizeSentences(t), e)
}
