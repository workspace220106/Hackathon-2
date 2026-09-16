export function throttle(s, e = 1, t = {}) {
  const n = t.bind || null,
    i = t.trail !== null ? !!t.trail : !0;
  let r, o, a, l, u = i;

  function h() {
    l = null, i && (u = !0), s.call(n, r, o, a)
  }
  return function (c, d, f) {
    l && clearTimeout(l), r = c, o = d, a = f, i && u && (u = !1, s.call(n, r, o, a)), l = setTimeout(h, e)
  }
}
