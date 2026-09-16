import {
  createRouter,
  createWebHistory
} from 'vue-router';
import {
  EVENTS,
  emitter
} from '../core/events.js';
import {
  HomeView
} from '../views/HomeView.js';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import { isLoggedIn } from '../auth/session.js';

export let previousRouteName = null;

const ROUTE_NAMES = new Set(["home", "login", "dashboard"]);

const homeUrl = () => new URL("/", window.location.origin).href;

export const router = createRouter({
  history: createWebHistory("/"),
  routes: [{
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      seoKey: "home"
    }
  }, {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      seoKey: "login"
    }
  }, {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: {
      seoKey: "dashboard",
      requiresAuth: true
    }
  }],
  scrollBehavior() {
    return !1
  }
});

router.beforeEach((s, e) => {
  if (!ROUTE_NAMES.has(s.name)) return window.location.replace(homeUrl()), !1;
  if (s.meta.requiresAuth && !isLoggedIn()) return { name: "login", query: { next: s.fullPath } };
  previousRouteName = e.name ?? null, e.name && (emitter.emit(EVENTS.WEBGL_SECTION_REVEAL_LOCK), emitter.emit(EVENTS.PAGE_TRANSITION_SOUND))
});
