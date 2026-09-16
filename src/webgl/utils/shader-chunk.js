let shaderChunkId = 0;

export function createShaderChunk(s, e, t) {
  const n = () => {};
  return {
    c: ++shaderChunkId,
    shader: s,
    use: r => {
      const o = r.material || r;
      return o[e] = s, o.needsUpdate = !0, r
    },
    unuse: n,
    clear: n
  }
}
