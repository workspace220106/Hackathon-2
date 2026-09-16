import {
  Vector2
} from 'three';
import {
  app
} from '../../core/App.js';

class FluidMouse {
  constructor() {
    this.mouseMoved = !1, this.coords = new Vector2, this.coords_old = new Vector2, this.diff = new Vector2, this.timer = null, this.count = 0
  }
  init() {
    document.body.addEventListener("mousemove", this.onDocumentMouseMove.bind(this), !1), document.body.addEventListener("touchstart", this.onDocumentTouchStart.bind(this), !1), document.body.addEventListener("touchmove", this.onDocumentTouchMove.bind(this), !1)
  }
  setCoords(e, t) {
    this.timer && clearTimeout(this.timer), this.coords.set(e / app.tools.viewport.width * 2 - 1, -(t / app.tools.viewport.height) * 2 + 1), this.mouseMoved = !0, this.timer = setTimeout(() => {
      this.mouseMoved = !1
    }, 100)
  }
  onDocumentMouseMove(e) {
    this.setCoords(e.clientX, e.clientY)
  }
  onDocumentTouchStart(e) {
    e.touches.length === 1 && this.setCoords(e.touches[0].pageX, e.touches[0].pageY)
  }
  onDocumentTouchMove(e) {
    e.touches.length === 1 && this.setCoords(e.touches[0].pageX, e.touches[0].pageY)
  }
  update() {
    this.diff.subVectors(this.coords, this.coords_old), this.coords_old.copy(this.coords), this.coords_old.x === 0 && this.coords_old.y === 0 && this.diff.set(0, 0)
  }
}

export const fluidMouse = new FluidMouse;
