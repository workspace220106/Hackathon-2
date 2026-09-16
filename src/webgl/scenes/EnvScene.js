import {
  Color,
  LinearSRGBColorSpace,
  Scene
} from 'three';
import {
  app
} from '../../core/App.js';
import {
  emitter
} from '../../core/events.js';
import {
  HomeEnvironment
} from '../environments/HomeEnvironment.js';

export class EnvScene extends Scene {
  constructor(e) {
    super(), emitter.register(this), this._planeGeometry = e, this._currentRouteName = null, this._pageTransitionHomeVisible = !1, this._pageTransitionAboutVisible = !1
  }
  freezeHomeAboutGroupsForPageTransition() {
    var e, t;
    this._pageTransitionHomeVisible = ((e = this._homeGroup) == null ? void 0 : e.visible) ?? !1, this._pageTransitionAboutVisible = ((t = this._aboutGroup) == null ? void 0 : t.visible) ?? !1, this._homeGroup && (this._homeGroup.visible = this._pageTransitionHomeVisible), this._aboutGroup && (this._aboutGroup.visible = this._pageTransitionAboutVisible)
  }
  setInitialShaderPrewarmVisibility() {
    this._homeGroup && (this._homeGroup.visible = !0), this._aboutGroup && (this._aboutGroup.visible = !0)
  }
  onAppLoaded() {
    this.background = new Color().setHex(0xEDEDED, LinearSRGBColorSpace), this._homeGroup = this._createHomeGroup(), this._aboutGroup = null
  }
  onAttach() {}
  _createHomeGroup() {
    const e = new HomeEnvironment;
    return this.add(e), e
  }
  _createAboutGroup() {
    const e = new AboutEnvironment(this._planeGeometry);
    return this.add(e), e
  }
  syncHomeAboutGroupsVisibility() {
    var i, r, o, a;
    if ((i = app.webgl) != null && i._initialShaderPrewarmActive) {
      this.setInitialShaderPrewarmVisibility();
      return
    }
    if ((r = app.webgl) != null && r._pageTransitionHidingGroups) {
      this._homeGroup && (this._homeGroup.visible = this._pageTransitionHomeVisible), this._aboutGroup && (this._aboutGroup.visible = this._pageTransitionAboutVisible);
      return
    }
    const e = this._currentRouteName,
      t = ((o = app.webgl) == null ? void 0 : o.isHomeAboutGroupsRenderActive) ?? !1;
    if (((a = app.webgl) == null ? void 0 : a.isPlaygroundPageActive) || e === "playground" || !e || !t) {
      this._homeGroup && (this._homeGroup.visible = !1), this._aboutGroup && (this._aboutGroup.visible = !1);
      return
    }
    if (e === "home") {
      this._homeGroup && (this._homeGroup.visible = !0), this._aboutGroup && (this._aboutGroup.visible = !1);
      return
    }
    if (e === "about") {
      this._homeGroup && (this._homeGroup.visible = !1), this._aboutGroup && (this._aboutGroup.visible = !0);
      return
    }
    this._homeGroup && (this._homeGroup.visible = !1), this._aboutGroup && (this._aboutGroup.visible = !1)
  }
  setHomeAboutGroupsRenderActive(e) {
    this.syncHomeAboutGroupsVisibility()
  }
  show(e) {
    this._currentRouteName = e, this.syncHomeAboutGroupsVisibility()
  }
  onRender({
    et: e,
    dt: t
  }) {
    var r, o, a, l, u, h;
    const n = (r = app.webgl) == null ? void 0 : r._initialShaderPrewarmActive,
      i = (o = app.webgl) == null ? void 0 : o._pageTransitionForceGroupsRender;
    !n && !i && ((a = app.webgl) != null && a.isPlaygroundPageActive || !((l = app.webgl) != null && l.isHomeAboutGroupsRenderActive)) || ((u = this._homeGroup) != null && u.visible && this._homeGroup.render(e, t), (h = this._aboutGroup) != null && h.visible && this._aboutGroup.render(e, t))
  }
}
