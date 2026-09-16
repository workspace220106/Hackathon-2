import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet
} from '@/utils/private-fields.js';
import {
  gsap
} from 'gsap';
import {
  Howl,
  Howler
} from 'howler';
import {
  Euler,
  Vector2
} from 'three';
import {
  ASSETS_MANIFEST
} from '../config/assets-manifest.js';
import {
  app
} from './App.js';
import {
  EVENTS,
  emitter
} from './events.js';

let Ds;

let Ks;

let Cp;

let Mp;

let Ip;

let LI;

let Rp;

let Bp;

export class SoundController {
  constructor() {
    __privateAdd(this, Ip);
    __privateAdd(this, Ds, null);
    __privateAdd(this, Ks, null);
    __privateAdd(this, Cp, () => {
      var u;
      if (this.ambientVolumeFactor <= 0) return;
      const e = this.sounds.pageTransition;
      if (!e) return;
      const {
        howl: t,
        params: n
      } = e, i = (n.volume ?? 1) * this.ambientVolumeFactor, r = n.startProgress ?? .4, o = n.fadeInDuration ?? 450, a = n.fadeInEase ?? "power2.out";
      (u = this._pageTransitionVolumeTween) == null || u.kill(), t.off("fade"), t.stop();
      const l = () => {
        t.volume(0);
        const h = t.play(),
          c = t.duration();
        c > 0 && t.seek(c * r, h);
        const d = {
          value: 0
        };
        this._pageTransitionVolumeTween = gsap.to(d, {
          value: i,
          duration: o / 1e3,
          ease: a,
          onUpdate: () => {
            t.volume(d.value, h)
          }
        })
      };
      t.state() === "loaded" ? l() : t.once("load", l)
    });
    __privateAdd(this, Mp, () => {
      __privateSet(this, Ds, app.webgl.camera.position), __privateSet(this, Ks, app.webgl.camera.rotation), __privateMethod(this, Ip, LI).call(this)
    });
    __privateAdd(this, Rp, () => {
      Howler.mute(document.visibilityState !== "visible")
    });
    __privateAdd(this, Bp, () => {
      __privateGet(this, Ds) && __privateGet(this, Ks) && (__privateGet(this, Ds) instanceof Vector2 ? Howler.pos(__privateGet(this, Ds).x, 0, __privateGet(this, Ds).y) : Howler.pos(__privateGet(this, Ds).x, __privateGet(this, Ds).y, __privateGet(this, Ds).z), __privateGet(this, Ks) instanceof Euler ? Howler.orientation(__privateGet(this, Ks).x, __privateGet(this, Ks).y, __privateGet(this, Ks).z) : Howler.orientation(0, __privateGet(this, Ks).value, 0))
    });
    emitter.on(EVENTS.ATTACH, __privateGet(this, Mp)), emitter.on(EVENTS.PAGE_TRANSITION_SOUND, __privateGet(this, Cp)), emitter.on(EVENTS.TICK, __privateGet(this, Bp)), document.addEventListener("visibilitychange", __privateGet(this, Rp)), this.defaultVolume = .7, Howler.volume(this.defaultVolume), this.sounds = {}, this.ambients = {}, this.currentAmbient = null, this.ambientVolumeFactor = 0, this.ambientShowreelSuppressed = !1, this.howlPosition = null, this.isFaded = !1, this._pageTransitionVolumeTween = null
  }
  setGlobal(e, t) {
    __privateSet(this, Ds, e), __privateSet(this, Ks, t)
  }
  add(e, t = null) {
    const {
      params: n,
      path: i
    } = ASSETS_MANIFEST.sounds[e];
    this.sounds[t || e] = {
      howl: new Howl({
        src: [i],
        loop: n.loop,
        rate: n.rate,
        volume: n.volume
      }),
      params: n
    }
  }
  play(e, t = {}) {
    const n = this.sounds[e];
    if (!n || e !== "ambient" && this.ambientVolumeFactor <= 0) return;
    const i = t.pos || n.params.pos;
    if (i && n.howl.pos(i.x, i.y, i.z), t.rate && n.howl.rate(t.rate || 1), !(t.replay ?? n.params.replay) && n.howl.playing()) return;
    const o = t.volume ?? n.params.volume ?? 1,
      a = e === "ambient" ? o : o * this.ambientVolumeFactor;
    n.howl.volume(a), n.params.fadeDuration && n.howl.fade(0, n.howl.volume(), n.params.fadeDuration), n.howl.play()
  }
  playSfx(e, t = {}) {
    this.play(e, {
      replay: !0,
      ...t
    })
  }
  pause(e) {
    const t = this.sounds[e];
    !t || !t.howl.playing() || (t.params.fadeDuration ? t.howl.fade(t.howl.volume(), 0, t.params.fadeDuration).once("fade", () => this.sounds[e].howl.stop()) : t.howl.stop())
  }
  setParams(e, t) {
    const n = this.sounds[e];
    n && (t.volume && n.howl.volume(t.volume), t.rate && n.howl.rate(t.rate), t.pos && n.howl.pos(t.pos.x, t.pos.y, t.pos.z))
  }
  fadeGlobal() {
    this.sounds.validated.howl.mute(!this.isFaded), this.isFaded = !this.isFaded
  }
  playAmbient() {
    const e = this.sounds.ambient;
    e && (e.howl.playing() || (e.howl.volume(0), e.howl.play()))
  }
  pauseAmbient() {
    const e = this.sounds.ambient;
    !e || !e.howl.playing() || e.howl.pause()
  }
  suppressAmbientForShowreel() {
    this.ambientShowreelSuppressed = !0
  }
  releaseAmbientForShowreel() {
    this.ambientShowreelSuppressed = !1
  }
  fadeOutAmbient(e = null) {
    const t = this.sounds.ambient;
    if (!t || this.ambientVolumeFactor <= 0) return;
    const n = e ?? t.params.fadeDuration;
    if (t.howl.off("fade"), !t.howl.playing()) {
      t.howl.volume(0), t.howl.pause();
      return
    }
    const i = t.howl.volume();
    if (i <= .001) {
      t.howl.pause(), t.howl.volume(0);
      return
    }
    t.howl.fade(i, 0, n).once("fade", () => {
      t.howl.pause(), t.howl.volume(0)
    })
  }
  cancelAmbientFadeIn() {
    const e = this.sounds.ambient;
    e && (e.howl.off("fade"), e.howl.pause(), e.howl.volume(0))
  }
  setAmbientVolume(e) {
    const t = this.sounds.ambient;
    if (!t || (this.ambientVolumeFactor = e, this.ambientShowreelSuppressed)) return;
    const n = t.params.volume * e;
    t.howl.volume(n)
  }
  fadeInAmbient(e = null) {
    const t = this.sounds.ambient;
    if (!t) return;
    const n = t.params.volume * this.ambientVolumeFactor,
      i = e ?? t.params.fadeDuration;
    t.howl.playing() || (t.howl.volume(0), t.howl.play()), t.howl.off("fade"), t.howl.fade(t.howl.volume(), n, i)
  }
}

Ds = new WeakMap, Ks = new WeakMap, Cp = new WeakMap, Mp = new WeakMap, Ip = new WeakSet, LI = function () {
  for (const e of Object.keys(ASSETS_MANIFEST.sounds)) this.add(e)
}, Rp = new WeakMap, Bp = new WeakMap;
