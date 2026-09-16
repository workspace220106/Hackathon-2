import '@/styles/original.css';
import {
  gsap
} from 'gsap';
import {
  CustomEase
} from 'gsap/CustomEase';
import {
  ScrollTrigger
} from 'gsap/ScrollTrigger';
import {
  SplitText
} from 'gsap/SplitText';
import {
  app
} from './core/App.js';

gsap.registerPlugin(CustomEase);

gsap.registerPlugin(ScrollTrigger);

gsap.registerPlugin(SplitText);

gsap.config({
  force3D: !0
});

app.init(document.getElementById("webgl-app"), document.getElementById("canvas-app"), document.getElementById("webgl-top-app"), document.getElementById("canvas-top-app"));

// Handy for debugging from the browser console (window.__app.lenis, window.__app.webgl, …)
if (import.meta.env.DEV) window.__app = app;
