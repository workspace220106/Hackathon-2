import {
  __privateAdd,
  __privateGet,
  __privateSet
} from '@/utils/private-fields.js';
import {
  FileLoader,
  Loader
} from 'three';

let Ph;

export class JsonLoader extends Loader {
  constructor(t) {
    super(t);
    __privateAdd(this, Ph);
    __privateSet(this, Ph, new FileLoader)
  }
  load(t, n, i, r) {
    __privateGet(this, Ph).load(t, o => {
      try {
        n(JSON.parse(o))
      } catch (a) {
        r !== void 0 && r(a);
        return
      }
    }, i, r)
  }
}

Ph = new WeakMap;
