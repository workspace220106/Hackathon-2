import {
  isTabletWidth
} from '../../utils/device.js';
import {
  getOffset
} from '../../utils/dom.js';

export function bh() {
  return !0 // the train rides the schedule track at every width (was desktop-only)
}

function kg(s) {
  const e = getOffset(s);
  return {
    top: e.top,
    y: e.top,
    height: e.height > 0 ? e.height : window.innerHeight,
    width: e.width
  }
}

export function I4(s, e, t) {
  if (!s || !e || !t) return null;
  const n = kg(s),
    i = kg(e),
    r = kg(t),
    o = n.height > 0 ? n.height : window.innerHeight * .5;
  return {
    topZoneRect: n,
    innerRect: i,
    bottomZoneRect: r,
    bandHeight: o
  }
}

const R4 = 8;

const B4 = 6;

const D4 = 14;

const L4 = 1;

const P4 = 110;

export function qM(s) {
  const e = window.innerHeight * (R4 / 100);
  return s.topZoneRect.top - e
}

function uA(s) {
  const e = window.innerHeight * (B4 / 100);
  return s.topZoneRect.top + e
}

function Kh(s) {
  const e = window.innerHeight * (D4 / 100);
  return s.topZoneRect.top + e
}

function al(s) {
  const e = window.innerHeight * (P4 / 100);
  return s.topZoneRect.top + s.bandHeight * L4 + e
}

function O4(s) {
  return s.topZoneRect.top + s.bandHeight
}

export function jM(s) {
  return s.innerRect.top + s.innerRect.height
}

const F4 = 35;

function N4(s, e = 1 / 0) {
  return Number.isFinite(e) && e > 0 ? e : fA(s)
}

export function hA(s, e = 1 / 0) {
  const t = N4(s, e);
  if (!Number.isFinite(t) || t <= 0) return fA(s);
  const n = window.innerHeight * (F4 / 100);
  return t + n
}

function dA(s, e = 1 / 0) {
  return hA(s, e)
}

function c0(s, e = 1 / 0) {
  const t = uA(s),
    n = dA(s, e),
    i = n - t,
    r = t + i * H4;
  return {
    start: t,
    mid: r,
    end: n,
    length: i
  }
}

function KM(s, e = 1 / 0) {
  return c0(s, e).mid
}

function JM(s, e = 1 / 0) {
  return KM(s, e)
}

export function ZM(s, e = 1 / 0) {
  return Number.isFinite(e) && e > 0 && s >= e
}

export function Th(s) {
  return s.topZoneRect.top
}

export function k4(s, e, t = 0) {
  if (!bh()) return !1;
  const n = Hc(e) ? Th(e) : t;
  return n ? s >= n : !1
}

function fA(s) {
  return s.bottomZoneRect.top + s.bottomZoneRect.height
}

const U4 = 2.65;

const G4 = 2.3;

const H4 = .25;

const Ug = .35;

const Q4 = 6;

const z4 = -.5;

const V4 = 1.55;

const W4 = 1.75;

const Hd = .4;

const Wo = .6;

const Y4 = .78;

const X4 = .52;

const q4 = .55;

const j4 = .85;

const K4 = 5;

const J4 = .5;

const aS = -.9;

const Ch = .95;

const Z4 = -.35;

const $4 = 20;

const eW = 130;

const tW = .012;

const $M = .16;

const nW = 1;

function _p(s) {
  return 1 - (1 - Math.min(1, Math.max(0, s))) ** 3
}

function xu(s, e, t) {
  return s + (e - s) * t
}

function Sr(s) {
  const e = Math.min(1, Math.max(0, s));
  return e * e * e * (e * (e * 6 - 15) + 10)
}

function iW(s, e = 3) {
  return Math.min(1, Math.max(0, s)) ** e
}

function sW(s) {
  const e = Math.min(1, Math.max(0, s));
  if (e <= Ug) return 0;
  const t = (e - Ug) / (1 - Ug);
  return iW(t, Q4)
}

function pA(s, e) {
  const t = Kh(e),
    n = al(e);
  return s <= t ? 0 : s >= n ? 1 : (s - t) / (n - t)
}

function u0(s, e, t = 1 / 0) {
  const {
    mid: n,
    end: i
  } = c0(e, t), r = i - n;
  return r <= 0 ? s >= i ? 1 : 0 : s <= n ? 0 : s >= i ? 1 : (s - n) / r
}

function eI(s, e = 1 / 0) {
  const {
    start: t,
    length: n
  } = c0(s, e);
  return t + n * Y4
}

function h0(s, e, t = 1 / 0) {
  const n = al(e),
    i = eI(e, t);
  return i <= n || s <= n ? 0 : s >= i ? 1 : (s - n) / (i - n)
}

function I_(s) {
  const e = X4,
    t = q4,
    n = j4;
  if (s <= e) return Sr(s / e);
  if (s <= t) return 1;
  if (s <= n) {
    const i = n - t;
    return Sr((n - s) / i)
  }
  return 0
}

function rW(s) {
  if (s <= Wo) return 0;
  if (s >= Ch) return 1;
  const e = Ch - Wo;
  return Sr((s - Wo) / e)
}

function tI(s, e) {
  return e > 0 ? 1 - e : rW(s)
}

function d0(s, e, t = 1 / 0) {
  const n = Kh(e),
    i = al(e),
    r = JM(e, t),
    o = dA(e, t);
  return s < n ? 0 : s < i ? Sr(_p(pA(s, e))) : s < r ? 1 : s >= o ? 0 : Sr(1 - _p(u0(s, e, t)))
}

function oW(s, e = 1 / 0) {
  const t = al(s),
    n = eI(s, e),
    i = n - t;
  return i <= 0 ? n : t + i * Ch
}

function nI(s, e, t = 1 / 0) {
  const n = oW(e, t),
    i = window.innerHeight * ($4 / 100),
    r = n + i,
    o = window.innerHeight * (eW / 100);
  if (o <= 0 || s <= r) return 0;
  if (s >= r + o) return 1;
  const a = (s - r) / o;
  return Sr(Sr(a))
}

function aW(s, e, t) {
  const n = Math.min(1, Math.max(0, s)),
    i = z4 * e,
    r = V4 * e,
    o = W4 * e,
    a = I_(n);
  let l, u = 0;
  if (n <= Hd) {
    const c = Sr(n / Hd);
    l = xu(i, r, c)
  } else if (n <= Wo) {
    const c = Wo - Hd,
      d = Sr((n - Hd) / c);
    l = xu(r, o, d)
  } else if (n <= Ch) {
    const c = Ch - Wo,
      d = Sr((n - Wo) / c),
      f = aS * e,
      A = xu(o, f, d);
    l = xu(o, 0, d), u = A - l
  } else l = 0, u = aS * e;
  const h = K4 * a;
  return {
    x: l,
    postLandOffsetX: u,
    skyZ: h,
    approach: a
  }
}

function lW(s, e, t) {
  if (!Hc(e)) return 0;
  const n = t / 2,
    i = al(e),
    r = pA(s, e);
  return s < Kh(e) ? n : s < i ? n * (1 - _p(r)) : 0
}

export function cW(s, e, t, n = 1 / 0) {
  if (!Hc(e)) return null;
  const i = t / 2,
    r = Th(e),
    o = fA(e),
    a = uA(e),
    l = O4(e),
    u = qM(e),
    h = Kh(e),
    c = al(e),
    d = KM(e, n),
    f = dA(e, n),
    A = jM(e),
    m = o - r,
    g = m > 0 ? Math.min(1, Math.max(0, (s - r) / m)) : 0,
    p = lW(s, e, t),
    _ = iI(s, e, t, n);
  let v, y = null;
  return s < h ? v = s < u ? "before-top" : "entry-hold" : s < c ? (v = "reveal", y = pA(s, e)) : s < d ? v = "hold" : s < f ? (v = "exit", y = u0(s, e, n)) : v = "after-content-bee", {
    scroll: s,
    phase: v,
    cameraY: p,
    beeGroupX: _.x,
    beeGroupY: _.y,
    beePosition: _,
    blockProgress: g,
    blockStart: r,
    blockEnd: o,
    blockCenter: r + m / 2,
    halfCam: i,
    hideOut: i * nW,
    zoneProgress: y,
    topStart: a,
    revealEnd: l,
    hideStart: d,
    hideEnd: A,
    exitEnd: f,
    bandHeight: e.bandHeight,
    revealAnimStart: u,
    entryAnimStart: h,
    revealAnimEnd: c
  }
}

function uW(s, e, t, n = 1 / 0) {
  if (!Hc(e)) return 0;
  const i = Th(e),
    r = dA(e, n),
    o = Kh(e),
    a = al(e),
    l = JM(e, n),
    h = fA(e) - i,
    c = t * U4,
    d = t * G4,
    f = a - o,
    A = r - l;
  if (h <= 0 || f <= 0) return 0;
  if (s <= o) return c;
  if (s >= r) return -d;
  if (s >= l && A > 0) {
    const m = u0(s, e, n);
    return -d * sW(m)
  }
  if (s < a) {
    const m = pA(s, e);
    return c * (1 - _p(m))
  }
  return 0
}

function R_(s, e, t, n = 1 / 0, {
  freezePathBlend: i = !1
} = {}) {
  const r = t / 2,
    o = uW(s, e, r, n);
  let a = d0(s, e, n);
  i && (a = 1);
  const l = h0(s, e, n),
    u = aW(l, r),
    h = a,
    c = u.x * h + u.postLandOffsetX,
    d = nI(s, e, n),
    f = tI(l, d),
    A = Z4 * r,
    m = xu(c, A, d),
    g = u.approach * h,
    p = u.skyZ * h,
    _ = f * J4,
    v = Math.min(1, g + f);
  return {
    x: m,
    y: o,
    z: 0,
    skyZ: p + _,
    pathSkyZ: p,
    landSkyZ: _,
    landSkyApproach: f,
    approach: v,
    pathProgress: l,
    pathBlend: h
  }
}

function hW(s, e, t, n = 1 / 0) {
  const i = Math.max(1, window.innerHeight * .002),
    r = R_(s, e, t, n),
    o = R_(s + i, e, t, n),
    a = o.x - r.x,
    l = o.y - r.y + i * tW;
  return Math.hypot(a, l) < 1e-8 ? 0 : Math.atan2(a, l)
}

function dW(s) {
  const e = Math.min(1, Math.max(0, s)),
    t = .001,
    n = (I_(Math.min(1, e + t)) - I_(e)) / t;
  return Math.abs(n) < 1e-6 ? 0 : n
}

function Gg(s, e) {
  return tI(s, e)
}

function fW(s, e) {
  const n = Gg(s, e);
  return e > 0 ? (Gg(s, Math.min(1, e + .001)) - n) / .001 : s <= Wo ? 0 : (Gg(Math.min(1, s + .001), 0) - n) / .001
}

function pW(s, e, t = 1 / 0) {
  const n = h0(s, e, t),
    i = d0(s, e, t),
    r = dW(n);
  return Math.abs(r) < 1e-8 ? 0 : r * $M * i
}

function AW(s, e, t = 1 / 0) {
  const n = h0(s, e, t),
    i = nI(s, e, t),
    r = d0(s, e, t),
    o = fW(n, i);
  return Math.abs(o) < 1e-8 ? 0 : o * $M * r
}

export function iI(s, e, t, n = 1 / 0, i = {}) {
  return {
    ...R_(s, e, t, n, i),
    heading: hW(s, e, t, n),
    pitch: pW(s, e, n),
    landPitch: AW(s, e, n)
  }
}

export function B_(s, e, t = 1 / 0) {
  const n = uA(e),
    i = hA(e, t);
  return s >= n && s < i
}

export function gW(s, e, t = 1 / 0) {
  const n = uA(e);
  return s < n || ZM(s, t) ? !1 : s < hA(e, t)
}

export function Hc(s) {
  return !(s != null && s.topZoneRect) || !(s != null && s.innerRect) || !(s != null && s.bottomZoneRect) ? !1 : s.bandHeight > 0 && s.innerRect.height > 0
}

export function mW(s, e) {
  const t = window.innerHeight,
    n = window.innerWidth;
  return {
    width: s.width / n * e.width,
    height: s.height / t * e.height
  }
}
