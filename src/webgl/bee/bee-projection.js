import {
  Box3,
  Vector3
} from 'three';

const tmpVec3A = new Vector3;

const tmpVec3B = new Vector3;

const tmpBox3 = new Box3;

const BEE_PROJ_A = 12;

const BEE_PROJ_B = 12;

const BEE_PROJ_C = 90;

function projectToScreen(s, e, t) {
  return tmpVec3B.copy(s).project(e), {
    x: t.left + (tmpVec3B.x * .5 + .5) * t.width,
    y: t.top + (-tmpVec3B.y * .5 + .5) * t.height
  }
}

function beeTorsoMeshes(s) {
  var e, t;
  if (((e = s == null ? void 0 : s._torsoMeshes) == null ? void 0 : e.length) > 0) return s._torsoMeshes;
  if (s != null && s._meshPursuer) {
    const n = [];
    if (s._meshPursuer.traverse(i => {
        i.isMesh && i.name.includes("bee") && !i.name.includes("aile") && n.push(i)
      }), n.length) return n
  }
  return ((t = s == null ? void 0 : s._raycastTargets) == null ? void 0 : t.filter(n => {
    var i;
    return !((i = n.name) != null && i.includes("aile"))
  })) ?? []
}

function screenBoundsOfMeshes(s, e, t) {
  let n = 1 / 0,
    i = 1 / 0,
    r = -1 / 0,
    o = -1 / 0;
  for (const a of s) {
    if (a.updateWorldMatrix(!0, !1), tmpBox3.setFromObject(a), tmpBox3.isEmpty()) continue;
    const {
      min: l,
      max: u
    } = tmpBox3, h = [
      [l.x, l.y, l.z],
      [l.x, l.y, u.z],
      [l.x, u.y, l.z],
      [l.x, u.y, u.z],
      [u.x, l.y, l.z],
      [u.x, l.y, u.z],
      [u.x, u.y, l.z],
      [u.x, u.y, u.z]
    ];
    for (const [c, d, f] of h) {
      tmpVec3A.set(c, d, f);
      const A = projectToScreen(tmpVec3A, e, t);
      !Number.isFinite(A.x) || !Number.isFinite(A.y) || (n = Math.min(n, A.x), r = Math.max(r, A.x), i = Math.min(i, A.y), o = Math.max(o, A.y))
    }
  }
  return Number.isFinite(n) ? {
    left: n,
    top: i,
    right: r,
    bottom: o,
    width: r - n,
    height: o - i
  } : null
}

export function beeScreenAnchor(s, e, t, n) {
  const i = beeTorsoMeshes(s);
  if (!i.length || !e || !t) return null;
  s.updateWorldMatrix(!0, !0), e.updateMatrixWorld(), e.updateProjectionMatrix();
  const r = t.getBoundingClientRect(),
    o = screenBoundsOfMeshes(i, e, r);
  if (!o || o.height < 1 || o.width < 1) return null;
  const a = o.height / BEE_PROJ_C,
    l = n === "top" ? BEE_PROJ_B : BEE_PROJ_A,
    h = (o.left + o.right) * .5;
  let c;
  return n === "top" ? c = o.top - l : c = o.bottom + l, {
    x: h,
    y: c,
    scale: a,
    placement: n
  }
}
