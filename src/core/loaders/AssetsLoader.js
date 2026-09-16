export class AssetsLoader {
  constructor({
    manifest: e = {},
    loader: t = null,
    isMobile: n = !1,
    assetsInfos: i = new Map,
    loadedAssets: r = new Map,
    progressCallback: o = () => null,
    afterLoadCallback: a = l => l
  } = {}) {
    this.manifest = e, this.loader = t, this.isMobile = n, this.assetsToLoad = new Map, this.assetsInfos = i, this.loadedAssets = r, this.progressCallback = o, this.afterLoadCallback = a, this.add(...Object.keys(e))
  }
  add(...e) {
    for (const t of e) !this.assetsToLoad.has(t) && this.manifest[t] && this.assetsToLoad.set(t, this.manifest[t])
  }
  getAsset(e) {
    return this.loadedAssets.get(e)
  }
  getAssets(...e) {
    return Object.fromEntries(e ? [...this.loadedAssets.entries()].filter(([t]) => e.includes(t)) : this.loadedAssets.entries())
  }
  async loadAsset(e) {
    var t, n;
    if (this.loadedAssets.has(e)) return this.loadedAssets.get(e);
    try {
      const i = this.isMobile && this.manifest[e].pathMobile ? this.manifest[e].pathMobile : this.manifest[e].path,
        r = await this.loader.loadAsync(i, a => this.assetProgress(a, e)),
        o = this.afterLoadCallback ? this.afterLoadCallback(r, e) : r;
      return this.loadedAssets.set(e, (t = o == null ? void 0 : o.scene) != null && t.isObject3D ? o.scene : o), (n = this.manifest[e].callbacks) == null || n.forEach(a => a(this.loadedAssets.get(e))), o
    } catch (i) {
      console.error(`[AssetsLoader] Failed to load "${e}" (${this.manifest[e].path}):`, i);
      return
    }
  }
  loadAssets() {
    return Promise.all([...this.assetsToLoad.keys()].map(e => this.loadAsset(e)))
  }
  loadCriticalAssets() {
    return Promise.all([...this.assetsToLoad.keys()].map(e => this.manifest[e].critical && this.loadAsset(e)))
  }
  assetProgress(e, t) {
    var o;
    const n = e.total > 0 ? e.total : this.manifest[t].size;
    if (!n) return;
    this.assetsInfos.has(t) || this.assetsInfos.set(t, {
      size: n,
      progress: 0
    });
    const i = this.assetsInfos.get(t),
      r = Math.min(e.loaded / i.size, 1);
    i.progress = r, (o = this.progressCallback) == null || o.call(this)
  }
}
