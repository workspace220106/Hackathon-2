import {
  GLSL3,
  LinearFilter,
  Mesh,
  PlaneGeometry,
  SRGBColorSpace,
  ShaderMaterial,
  VideoTexture,
  Vector2
} from 'three';

// Fragment shader: samples the video and masks it with rounded corners + a
// soft edge so the panel reads as a screen rather than a hard rectangle.
const heroVideoFragmentShader = `precision highp float;

in vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uSize;          // world size of the plane (width, height)
uniform float uRadius;       // corner radius in world units
uniform float uOpacity;
uniform float uVideoAspect;  // video width / height — used to "cover" the panel without distortion

out vec4 fragColor;

vec2 coverUv(vec2 uv, float panelAspect, float videoAspect) {
	vec2 scale = panelAspect > videoAspect ? vec2(1.0, videoAspect / panelAspect) : vec2(panelAspect / videoAspect, 1.0);
	return (uv - 0.5) * scale + 0.5;
}

float roundedBox(vec2 p, vec2 b, float r) {
	vec2 q = abs(p) - b + r;
	return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
	vec4 texColor = texture(uTexture, coverUv(vUv, uSize.x / uSize.y, uVideoAspect));
	vec2 p = (vUv - 0.5) * uSize;
	float d = roundedBox(p, uSize * 0.5, uRadius);
	float edge = fwidth(d) * 1.5;
	float mask = 1.0 - smoothstep(-edge, edge, d);
	fragColor = vec4(texColor.rgb, texColor.a * mask * uOpacity);
}`;

const heroVideoVertexShader = `out vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export class HeroVideoMaterial extends ShaderMaterial {
  constructor(options = {}) {
    super({
      ...options,
      glslVersion: GLSL3,
      vertexShader: heroVideoVertexShader,
      fragmentShader: heroVideoFragmentShader,
      transparent: true,
      uniforms: {
        uTexture: { value: null },
        uSize: { value: new Vector2(1, 1) },
        uRadius: { value: 0.08 },
        uOpacity: { value: 1 },
        uVideoAspect: { value: 16 / 9 },
        ...options.uniforms,
      },
    });
  }
}

/**
 * A video-textured panel that replaces the daisy sculpture in the home scene.
 * It sits on the floor where the flower stood and faces the camera path, so the
 * existing scroll-driven camera move zooms into it exactly like it did the flower.
 */
export class HeroVideoPlane extends Mesh {
  constructor({
    src,
    height = 4,
    cornerRadius = 0.08,
  } = {}) {
    const video = document.createElement('video');
    video.src = src;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.crossOrigin = 'anonymous';
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    // Chrome pauses "background" (detached) videos to save power, which would freeze the
    // texture — keep the element in the DOM, just invisible.
    Object.assign(video.style, { position: 'fixed', left: '0', top: '0', width: '2px', height: '2px', opacity: '0.01', pointerEvents: 'none', zIndex: '-1' });
    video.setAttribute('aria-hidden', 'true');
    (document.getElementById('webgl-app') || document.body).appendChild(video);

    const texture = new VideoTexture(video);
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.generateMipmaps = false;

    super(new PlaneGeometry(1, 1), new HeroVideoMaterial({ uniforms: { uTexture: { value: texture }, uRadius: { value: cornerRadius } } }));
    this.name = 'HeroVideoPlane';
    this.video = video;
    this.texture = texture;
    this.panelHeight = height;
    this.videoAspect = 16 / 9;
    this.frustumCulled = false;
    this._resize(this.videoAspect);
    video.addEventListener('loadedmetadata', () => {
      this.videoAspect = video.videoWidth / video.videoHeight;
      this.material.uniforms.uVideoAspect.value = this.videoAspect;
      if (!this._fit) this._resize(this.videoAspect);
    });
  }
  _resize(aspect) {
    const h = this.panelHeight, w = h * aspect;
    this.setSize(w, h);
  }
  setSize(w, h) {
    this.scale.set(w, h, 1);
    this.material.uniforms.uSize.value.set(w, h);
  }
  /**
   * Size the panel so it covers the whole camera view at `distance` (full-bleed
   * background). `overscan` leaves margin for the mouse-parallax camera rig.
   */
  fitToView(camera, distance, overscan = 1.25) {
    this._fit = true;
    const vFov = (camera.fov * Math.PI) / 180;
    const h = (2 * distance * Math.tan(vFov / 2)) / (camera.zoom || 1) * overscan;
    const w = h * camera.aspect;
    this.setSize(w, h);
  }
  play() {
    const p = this.video.play();
    if (p && p.catch) p.catch(() => {});
  }
  /** Muted autoplay; if the browser still blocks it, retry on the first user interaction. */
  autoplay() {
    const tryPlay = () => this.video.play().then(() => true).catch((err) => { if (import.meta.env.DEV) console.warn('[HeroVideoPlane] play() rejected:', err?.name, err?.message); return false; });
    tryPlay().then((ok) => {
      if (ok) return;
      const retry = () => { tryPlay(); window.removeEventListener('pointerdown', retry, true); window.removeEventListener('keydown', retry, true); };
      window.addEventListener('pointerdown', retry, true);
      window.addEventListener('keydown', retry, true);
    });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && this.video.paused) tryPlay(); });
  }
  dispose() {
    this.video.pause();
    this.video.remove();
    this.texture.dispose();
    this.material.dispose();
    this.geometry.dispose();
  }
  pause() {
    this.video.pause();
  }
  setOpacity(value) {
    this.material.uniforms.uOpacity.value = value;
  }
}
