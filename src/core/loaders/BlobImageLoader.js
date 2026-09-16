import {
  __privateAdd,
  __privateGet,
  __privateSet
} from '@/utils/private-fields.js';
import {
  Cache,
  FileLoader,
  ImageLoader
} from 'three';

let Lh;

export class BlobImageLoader extends FileLoader {
  constructor(t) {
    super(t);
    __privateAdd(this, Lh);
    __privateSet(this, Lh, new ImageLoader), this.setResponseType("blob")
  }
  load(t, n, i, r) {
    const o = a => {
      const l = URL.createObjectURL(a),
        u = document.createElement("img");
      u.onload = () => {
        Cache.add(t, u), URL.revokeObjectURL(l), document.body.removeChild(u), __privateGet(this, Lh).load(t, n, () => {}, r)
      }, u.src = l, u.style.visibility = "hidden", document.body.appendChild(u)
    };
    super.load(t, o, i, r)
  }
}

Lh = new WeakMap;
