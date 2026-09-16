import {
  isTabletWidth
} from '../utils/device.js';

const SLIDER_GAP_DESKTOP = 20;

const SLIDER_GAP_MOBILE = 10;

export function sliderGap() {
  return isTabletWidth() ? SLIDER_GAP_MOBILE : SLIDER_GAP_DESKTOP
}

const SLIDER_OPTIONS_DESKTOP = {
  discreteDrag: !1,
  infiniteDrag: !0,
  parallaxXMultiplier: 1.25,
  snapThreshold: 42,
  snapLerp: .055,
  dragFollowLerp: .068,
  dragMultiplier: 3,
  deltaDecay: .9,
  dragForceDecay: .42,
  dragForceSmooth: .065,
  dragForceMultiplier: 400,
  dragForceMax: 600
};

const SLIDER_OPTIONS_MOBILE = {
  discreteDrag: !1,
  infiniteDrag: !0,
  parallaxXMultiplier: 2.75,
  dragActivationThresholdPx: 85,
  stepThresholdPx: 1,
  snapThreshold: 42,
  snapLerp: .14,
  dragFollowLerp: .14,
  dragMultiplier: 4,
  deltaDecay: .9,
  dragForceDecay: .42,
  dragForceSmooth: .14,
  dragForceMultiplier: 400,
  dragForceMax: 600
};

export function sliderOptions() {
  return isTabletWidth() ? SLIDER_OPTIONS_MOBILE : SLIDER_OPTIONS_DESKTOP
}
