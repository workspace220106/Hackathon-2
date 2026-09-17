// Small self-contained Three.js stage for PrizesBlock.vue: loads the three
// Subway Surfers character OBJs, lines them up, idles them (bob + sway) and
// plays a hop + spin when a column is hovered. Independent of the main WebGL
// scene so it can't disturb the hero / train logic.
import {
  AmbientLight,
  CircleGeometry,
  Mesh,
  MeshBasicMaterial,
  Box3,
  DirectionalLight,
  Group,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const CHAR_HEIGHT = 1.15;       // world units; every character is normalised to this
const SPACING = 1.7;            // distance between characters
const FLOOR_Y = -0.82;          // where the feet stand (low, so the price tag fits above the head)
const FACE_CAMERA = 0;          // the OBJs already face +z (the camera)

export function createPrizeStage(canvas, prizes) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0.1, 4.1);
  camera.lookAt(0, -0.15, 0);

  scene.add(new AmbientLight(0xffffff, 0.85));
  const key = new DirectionalLight(0xffffff, 1.1);
  key.position.set(2, 3, 4);
  scene.add(key);
  const rim = new DirectionalLight(0xbfe9ff, 0.5);
  rim.position.set(-3, 2, -2);
  scene.add(rim);

  const loader = new OBJLoader();
  const texLoader = new TextureLoader();
  const chars = prizes.map((p, i) => {
    const group = new Group();
    group.position.x = (i - (prizes.length - 1) / 2) * SPACING;
    group.position.y = FLOOR_Y;
    scene.add(group);
    // soft contact shadow so the characters read as standing on something
    const shadow = new Mesh(new CircleGeometry(0.42, 40), new MeshBasicMaterial({ color: 0x1b2a4a, transparent: true, opacity: 0.16, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(group.position.x, FLOOR_Y + 0.005, 0);
    scene.add(shadow);
    const state = { group, shadow, hop: 0, hopV: 0, spin: 0, spinTarget: 0, hover: false, phase: i * 1.7 };
    const tex = texLoader.load(p.texture);
    tex.colorSpace = SRGBColorSpace;
    const material = new MeshPhongMaterial({ map: tex, shininess: 12 });
    loader.load(p.obj, (obj) => {
      obj.traverse((m) => { if (m.isMesh) m.material = material; });
      const box = new Box3().setFromObject(obj), size = new Vector3(), center = new Vector3();
      box.getSize(size), box.getCenter(center);
      const s = CHAR_HEIGHT / size.y;
      obj.scale.setScalar(s);
      obj.position.set(-center.x * s, -box.min.y * s, -center.z * s); // feet on the group's origin
      obj.rotation.y = FACE_CAMERA;
      group.add(obj);
    });
    return state;
  });

  let hovered = -1;
  function setHover(i) {
    if (hovered === i) return;
    hovered = i;
    chars.forEach((c, k) => {
      const on = k === i;
      if (on && !c.hover) { c.hopV = 2.6; c.spinTarget += Math.PI * 2; }
      c.hover = on;
    });
  }

  let w = 0, h = 0;
  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height || (r.width === w && r.height === h)) return;
    w = r.width, h = r.height;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // pull the camera back on narrow screens so the whole row stays in frame
    const halfRow = (SPACING * (prizes.length - 1)) / 2 + 0.75;
    const halfH = Math.tan((camera.fov * Math.PI) / 360);
    camera.position.z = Math.max(4.1, halfRow / (halfH * camera.aspect));
    camera.lookAt(0, -0.15, 0);
    camera.updateProjectionMatrix();
  }

  let raf = 0, last = performance.now(), visible = true, t = 0;
  const G = 9;
  function tick(now) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible) return;
    resize();
    t += dt;
    for (const c of chars) {
      // idle: bob + sway; hover adds a hop (simple gravity) and a full spin
      c.hopV -= G * dt;
      c.hop = Math.max(0, c.hop + c.hopV * dt);
      if (c.hop === 0 && c.hopV < 0) c.hopV = 0;
      c.spin += (c.spinTarget - c.spin) * Math.min(1, dt * 6);
      const bob = Math.sin(t * 2.2 + c.phase) * 0.025;
      c.group.position.y = FLOOR_Y + bob + c.hop;
      c.group.rotation.y = Math.sin(t * 1.1 + c.phase) * 0.22 + c.spin;
      c.group.rotation.z = Math.sin(t * 1.6 + c.phase) * 0.03 * (c.hover ? 3 : 1);
      c.shadow.scale.setScalar(1 - Math.min(0.5, c.hop * 0.6));
      const target = c.hover ? 1.12 : 1;
      c.group.scale.setScalar(c.group.scale.x + (target - c.group.scale.x) * Math.min(1, dt * 8));
    }
    renderer.render(scene, camera);
  }

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '100px' });
  io.observe(canvas);
  raf = requestAnimationFrame(tick);

  return {
    setHover,
    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      scene.traverse((o) => { o.geometry?.dispose?.(); o.material?.map?.dispose?.(); o.material?.dispose?.(); });
      renderer.dispose();
    },
  };
}
