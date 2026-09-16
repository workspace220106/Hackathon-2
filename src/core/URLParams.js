import {
  __publicField
} from '@/utils/private-fields.js';

const URL_PARAM_KEYS = ["orbit", "tab", "remindScrollY", "skipLoader"];

export class URLParams {
  constructor() {
    __publicField(this, "params", new Map);
    this.searchParams = new URLSearchParams(window.location.search);
    for (const e of URL_PARAM_KEYS) this.params.set(e, this.searchParams.get(e))
  }
  getBool(e) {
    return this.params.get(e) === "true" || this.params.get(e) === "1"
  }
  getString(e) {
    return this.params.get(e)
  }
  getNumber(e) {
    return parseFloat(this.params.get(e)) || null
  }
  has(e) {
    return this.params.get(e) !== null
  }
}
