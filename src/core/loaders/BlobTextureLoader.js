import {
  __privateAdd,
  __privateGet,
  __privateSet
} from '@/utils/private-fields.js';
import {
  Cache,
  FileLoader,
  TextureLoader
} from 'three';

let Oh;

let q_;

export class BlobTextureLoader extends FileLoader {
  constructor(t) {
    super(t);
    __privateAdd(this, Oh);
    __privateAdd(this, q_);
    __privateSet(this, Oh, new TextureLoader), this.setResponseType("blob")
  }
  load(t, n, i, r) {
    const o = a => {
      const l = URL.createObjectURL(a),
        u = document.createElement("img");
      u.onload = () => {
        Cache.add(t, u), URL.revokeObjectURL(l), document.body.removeChild(u), __privateGet(this, Oh).load(t, n, () => {}, r)
      }, u.src = l, u.style.visibility = "hidden", document.body.appendChild(u)
    };
    super.load(t, o, i, r)
  }
}

Oh = new WeakMap, q_ = new WeakMap;

Cache.enabled = !0;
