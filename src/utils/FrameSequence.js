/**
 * Plays a folder of numbered JPG frames (001.jpg, 002.jpg, …) on a <canvas>,
 * as a drop-in stand-in for a muted looping <video>. Used where the mp4s
 * refused to decode: hero panel, loader background, page-transition disc.
 *
 * Frames are fetched in order; the first one is painted as soon as it lands,
 * playback simply advances through whatever has loaded so far.
 */
export class FrameSequence {
  /**
   * @param {object} o
   * @param {string} o.dir     folder under public/, e.g. '/assets/medias/frames/hero'
   * @param {number} o.count   number of frames
   * @param {number} [o.fps]   playback rate (frames / original clip seconds)
   * @param {boolean} [o.loop]
   * @param {number} [o.pad]   zero-padding of the file names (001.jpg → 3)
   * @param {string} [o.ext]
   */
  constructor({ dir, count, fps = 10, loop = true, pad = 3, ext = 'jpg' }) {
    this.dir = dir; this.count = count; this.fps = fps; this.loop = loop;
    this.frames = new Array(count).fill(null);
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = 2; // non-zero so it can be uploaded as a texture before the first frame
    this.ctx = this.canvas.getContext('2d');
    this.width = 0; this.height = 0;
    this.frame = -1; this._clock = 0; this._last = 0;
    this.playing = false; this._raf = 0; this._disposed = false;
    this.onFrame = null;      // called after each new frame is painted (texture.needsUpdate hook)
    this.onReady = null;      // called once, when the first frame is decoded (dimensions known)
    this.ready = new Promise((res) => { this._resolveReady = res; });
    this._urls = Array.from({ length: count }, (_, i) => `${dir}/${String(i + 1).padStart(pad, '0')}.${ext}`);
    this._load();
  }

  _load() {
    // sequential-ish loading (4 in flight) so early frames arrive first
    let next = 0;
    const worker = () => {
      if (this._disposed || next >= this.count) return;
      const i = next++;
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        if (this._disposed) return;
        this.frames[i] = img;
        if (!this.width) {
          this.width = this.canvas.width = img.naturalWidth;
          this.height = this.canvas.height = img.naturalHeight;
          this._draw(0);
          this.onReady && this.onReady(this);
          this._resolveReady(this);
        }
        worker();
      };
      img.onerror = () => { if (import.meta.env.DEV) console.warn('[FrameSequence] failed', this._urls[i]); worker(); };
      img.src = this._urls[i];
    };
    for (let k = 0; k < 4; k++) worker();
  }

  _draw(i) {
    const img = this.frames[i];
    if (!img || i === this.frame) return;
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    this.frame = i;
    this.onFrame && this.onFrame(this);
  }

  _tick = (now) => {
    if (!this.playing) return;
    this._raf = requestAnimationFrame(this._tick);
    if (!this.width) return;
    if (this._last) this._clock += (now - this._last) / 1000;
    this._last = now;
    let i = Math.floor(this._clock * this.fps);
    if (i >= this.count) {
      if (!this.loop) { this.pause(); this._draw(this.count - 1); return; }
      this._clock %= this.count / this.fps; i = Math.floor(this._clock * this.fps);
    }
    // if this frame hasn't arrived yet, hold the latest loaded one before it
    while (i > 0 && !this.frames[i]) i--;
    this._draw(i);
  };

  /** Mirrors HTMLVideoElement.play() — resolves immediately, never rejects. */
  play() {
    if (this._disposed) return Promise.resolve();
    if (!this.playing) { this.playing = true; this._last = 0; this._raf = requestAnimationFrame(this._tick); }
    return Promise.resolve();
  }
  pause() { this.playing = false; cancelAnimationFrame(this._raf); this._raf = 0; }
  get paused() { return !this.playing; }
  /** seconds, like video.currentTime */
  get currentTime() { return this._clock; }
  set currentTime(t) { this._clock = t; this._last = 0; if (this.width) this._draw(Math.min(this.count - 1, Math.floor(t * this.fps))); }
  get videoWidth() { return this.width; }
  get videoHeight() { return this.height; }
  get aspect() { return this.width ? this.width / this.height : 16 / 9; }

  dispose() {
    this.pause(); this._disposed = true;
    this.frames.length = 0; this.onFrame = this.onReady = null;
    this.canvas.width = this.canvas.height = 0;
  }
}

/** The three clips the site uses, by role. fps = frames ÷ length of the original mp4. */
export const FRAME_CLIPS = {
  hero:   { dir: '/assets/medias/frames/hero',   count: 100, fps: 16 }, // ~6 s clip, 100 frames
  loader: { dir: '/assets/medias/frames/loader', count: 50, fps: 5 },  // 10 s clip
  guard:  { dir: '/assets/medias/frames/guard',  count: 50, fps: 5 },  // 10 s clip
};
