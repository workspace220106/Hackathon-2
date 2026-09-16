import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet,
  __publicField
} from '@/utils/private-fields.js';

let eventId = 0;

export const EVENTS = {
  LOADER_PROGRESS: eventId++,
  APP_LOADED: eventId++,
  LOADER_REVEAL_COMPLETE: eventId++,
  ATTACH: eventId++,
  TICK: eventId++,
  RENDER: eventId++,
  RESIZE: eventId++,
  LAYOUT_REFRESH: eventId++,
  POINTER_MOVE: eventId++,
  POINTER_UP: eventId++,
  POINTER_DOWN: eventId++,
  KEY_DOWN: eventId++,
  DRAG: eventId++,
  DRAG_END: eventId++,
  PINCH: eventId++,
  WHEEL: eventId++,
  WEBGL_SECTION_REVEAL_LOCK: eventId++,
  PAGE_TRANSITION_SOUND: eventId++,
  WEBGL_SECTION_REVEAL_RESET: eventId++,
  SHOW_HOME_PAGE: eventId++,
  SHOW_ABOUT_PAGE: eventId++,
  SHOW_PLAYGROUND_PAGE: eventId++,
  PAGE_TRANSITION_COMPLETE: eventId++,
  PLAYGROUND_INITIAL_HERO_REVEAL: eventId++,
  CURSOR_INDICATION_CHANGE: eventId++,
  CURSOR_INDICATION_CLIPBOARD_COPIED: eventId++,
  CONTENT_BEE_TEXT_CHANGE: eventId++,
  CONTENT_BEE_CURSOR_ANCHOR_UPDATE: eventId++,
  BEE_TEXT_HIDE_ALL: eventId++,
  SHOWREEL_PLAYER_CHANGE: eventId++,
  SHOWREEL_OPEN: eventId++,
  SHOWREEL_ICON_TOGGLE: eventId++,
  SHOWREEL_FORCE_CLOSE: eventId++,
  SHOWREEL_RESET: eventId++,
  SHOWREEL_CURSOR_RESTORE: eventId++,
  CURSOR_SOUND_INDICATION_SUPPRESS: eventId++,
  TOGGLE_SOUND: eventId++,
  NAVBAR_DARK_MODE: eventId++,
  NAVBAR_FORCE_WHITE: eventId++,
  SHOW_PLAIN_PAGE: eventId++,            // a page without a WebGL environment (login, dashboard…)
  PLAIN_PAGE_INITIAL_REVEAL: eventId++
};

const EVENT_HANDLER_NAMES = Object.fromEntries(Object.entries(EVENTS).map(([s, e]) => [e, `on${s.toLowerCase().split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join("")}`]));

let js;

let Go;

let Na;

let ka;

let Tp;

let Yb;

const Emitter = class Emitter {
  constructor() {
    __privateAdd(this, Tp);
    __privateAdd(this, js);
    __privateAdd(this, Go);
    __privateAdd(this, Na);
    __privateAdd(this, ka);
    __privateSet(this, js, new Map), __privateSet(this, Go, new Map), __privateSet(this, Na, new Map), __privateSet(this, ka, new Set)
  }
  on(e, t, n = {}) {
    __privateGet(this, js).has(e) || __privateGet(this, js).set(e, new Set), (n.once ? __privateGet(this, Go) : __privateGet(this, js)).get(e).add(t)
  }
  off(e, t) {
    if (!__privateGet(this, js).has(e)) return;
    __privateGet(this, js).get(e).delete(t)
  }
  register(e) {
    __privateGet(this, ka).add(e)
  }
  unregister(e) {
    __privateGet(this, ka).delete(e)
  }
  emit(e, ...t) {
    if (__privateGet(this, Na).set(e, t), __privateGet(this, js).has(e))
      for (const n of __privateGet(this, js).get(e)) n.call(this, ...t);
    if (__privateGet(this, ka).forEach(n => __privateMethod(this, Tp, Yb).call(this, n, e)), __privateGet(this, Go).has(e)) {
      for (const n of __privateGet(this, Go).get(e)) n.call(this, ...t);
      __privateGet(this, Go).delete(e)
    }
  }
  static getInstance() {
    return Emitter.instance || (Emitter.instance = new Emitter), Emitter.instance
  }
};

js = new WeakMap, Go = new WeakMap, Na = new WeakMap, ka = new WeakMap, Tp = new WeakSet, Yb = function (e, t) {
  const n = e[EVENT_HANDLER_NAMES[t]];
  typeof n == "function" && __privateGet(this, Na).has(t) && n.call(e, ...__privateGet(this, Na).get(t))
}, __publicField(Emitter, "instance");

let EmitterClass = Emitter;

export const emitter = EmitterClass.getInstance();
