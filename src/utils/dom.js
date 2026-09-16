export function getOffset(s) {
  let e = 0,
    t = 0,
    n = s;
  for (; n;) {
    e += n.offsetLeft, t += n.offsetTop;
    const i = n.offsetParent;
    if (!i) break;
    n = i, t -= n.scrollTop, e -= n.scrollLeft
  }
  return new DOMRect(e, t, s.offsetWidth, s.offsetHeight)
}
