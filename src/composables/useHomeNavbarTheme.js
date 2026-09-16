import {
  nextTick,
  onMounted,
  onUnmounted,
  ref
} from 'vue';
import {
  isCompactNavbar
} from '../config/navbar.js';
import {
  app
} from '../core/App.js';
import {
  EVENTS,
  emitter
} from '../core/events.js';

export function useHomeNavbarTheme({
  webglRef: s,
  firstProjectRef: e
}) {
  const t = ref({
      webgl: null,
      firstProject: null
    }),
    n = ref(null),
    i = c => {
      const d = c.getBoundingClientRect();
      return {
        top: d.top + window.scrollY,
        height: d.height
      }
    },
    r = c => {
      const d = c == null ? void 0 : c.value,
        f = Array.isArray(d) ? d[0] : d,
        A = (f == null ? void 0 : f.$el) ?? f;
      return A != null && A.getBoundingClientRect ? A : null
    },
    o = () => {
      const c = r(s),
        d = r(e);
      if (!c) return;
      t.value = {
        webgl: i(c),
        firstProject: d ? i(d) : null
      };
      const f = document.querySelector(".navbarBlock");
      if (!f) return;
      const A = document.querySelector(".navbarBlock .left__title"),
        g = (isCompactNavbar() && A ? A : f).getBoundingClientRect();
      n.value = g.top + g.height / 2
    },
    a = c => {
      app.toggleColorUI !== c && (app.toggleColorUI = c, emitter.emit(EVENTS.NAVBAR_DARK_MODE, c))
    },
    l = () => {
      const {
        webgl: c,
        firstProject: d
      } = t.value;
      if (!c || n.value === null) return;
      const A = window.scrollY + n.value,
        m = c.top + c.height,
        g = d ? A >= c.top && A < d.top : A >= c.top && A < m;
      a(g)
    },
    u = () => l(),
    h = () => {
      o(), l()
    };
  return onMounted(() => {
    nextTick(() => {
      o(), app.lenis.on("scroll", u), l()
    }), emitter.on(EVENTS.RESIZE, h)
  }), onUnmounted(() => {
    app.lenis.off("scroll", u), emitter.off(EVENTS.RESIZE, h), a(!1)
  }), {
    measure: o,
    update: l
  }
}
