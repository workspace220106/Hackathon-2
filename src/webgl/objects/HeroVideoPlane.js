import {
  CanvasTexture,
  GLSL3,
  LinearFilter,
  Mesh,
  PlaneGeometry,
  SRGBColorSpace,
  ShaderMaterial,
  Vector2
} from 'three';
import {
  FrameSequence
} from '../../utils/FrameSequence.js';

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
    frames,
    height = 4,
    cornerRadius = 0.08,
  } = {}) {
    // JPG frame sequence painted on a canvas (the mp4 wouldn't decode); see src/utils/FrameSequence.js
    const video = new FrameSequence(frames);
    const texture = new CanvasTexture(video.canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.generateMipmaps = false;
    video.onFrame = () => { texture.needsUpdate = true; };

    super(new PlaneGeometry(1, 1), new HeroVideoMaterial({ uniforms: { uTexture: { value: texture }, uRadius: { value: cornerRadius } } }));
    this.name = 'HeroVideoPlane';
    this.video = video;
    this.texture = texture;
    this.panelHeight = height;
    this.videoAspect = 16 / 9;
    this.frustumCulled = false;
    this._resize(this.videoAspect);
    video.onReady = () => {
      // the GL texture was allocated at the placeholder size — drop it so three re-uploads at full size
      texture.dispose();
      this.videoAspect = video.aspect;
      this.material.uniforms.uVideoAspect.value = this.videoAspect;
      if (!this._fit) this._resize(this.videoAspect);
    };
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
    this.video.play();
  }
  /** Canvas playback is never blocked by autoplay policy; just resume if the tab was hidden. */
  autoplay() {
    this.video.play();
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && this.video.paused) this.video.play(); });
  }
  dispose() {
    this.video.dispose();
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
