export function isSafari() {
  if (typeof navigator > "u") return !1;
  const s = navigator.userAgent;
  return /Safari/.test(s) && !/Chrome|Chromium|CriOS|Edg|Firefox|FxiOS/.test(s)
}
