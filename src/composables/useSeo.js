import {
  watch
} from 'vue';
import {
  useRoute
} from 'vue-router';

const stripTrailingSlash = s => s.replace(/\/$/, "");

// no fixed domain yet — canonical / og:url follow wherever the site is deployed
const SITE_URL = stripTrailingSlash(typeof window !== "undefined" ? window.location.origin : "");

const SITE_NAME = "Hack on tracks";

const SITE_LOCALE = "en_US";

const THEME_COLOR = "#083D2A";

const TWITTER_SITE = "";

const TWITTER_CREATOR = "";

const AUTHOR = "AI EXPO HACKATHON";

const PREVIEW_IMAGE_PATH = "/preview.jpg";

const PREVIEW_IMAGE = {
  url: `${SITE_URL}${PREVIEW_IMAGE_PATH}`,
  width: 1200,
  height: 627,
  type: "image/jpeg",
  alt: "Preview of Hack on tracks — AI Expo Hackathon"
};

const DEFAULT_DESCRIPTION = "Hack on tracks — AI Expo Hackathon. Four domains, two rounds, one 24-hour build.";

const SEO_PAGES = {
  home: {
    title: "Hack on tracks",
    description: DEFAULT_DESCRIPTION,
    path: "/"
  },
  login: {
    title: "Log in",
    description: "Log in to your account.",
    path: "/login"
  },
  signup: {
    title: "Create account",
    description: "Create your account.",
    path: "/signup"
  },
  teams: {
    title: "Teams",
    description: "All participating teams, their progress, problem statements and domains.",
    path: "/teams"
  },
  dashboard: {
    title: "Dashboard",
    description: "Your dashboard.",
    path: "/dashboard"
  }
};

const absoluteUrl = (s = "/") => `${SITE_URL}${s.startsWith("/")?s:`/${s}`}`;

const seoForRoute = s => {
  var t;
  const e = ((t = s.meta) == null ? void 0 : t.seoKey) || s.name || "home";
  return SEO_PAGES[e] ?? SEO_PAGES.home
};

const setMeta = (s, e, t = "name") => {
  if (!e) return;
  let n = document.head.querySelector(`meta[${t}="${s}"]`);
  n || (n = document.createElement("meta"), n.setAttribute(t, s), document.head.appendChild(n)), n.setAttribute("content", e)
};

const setLink = (s, e, {
  hreflang: t
} = {}) => {
  if (!e) return;
  const n = t != null ? `link[rel="${s}"][hreflang="${t}"]` : `link[rel="${s}"]:not([hreflang])`;
  let i = document.head.querySelector(n);
  i || (i = document.createElement("link"), i.setAttribute("rel", s), t != null && i.setAttribute("hreflang", t), document.head.appendChild(i)), i.setAttribute("href", e)
};

const applySeo = s => {
  const e = seoForRoute(s),
    t = absoluteUrl(e.path);
  document.documentElement.lang = "en", document.title = e.title, setMeta("description", e.description), setMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"), setMeta("author", AUTHOR), setMeta("application-name", SITE_NAME), setMeta("generator", "Vite + Vue 3"), setMeta("referrer", "strict-origin-when-cross-origin"), setMeta("theme-color", THEME_COLOR), setMeta("color-scheme", "light"), setMeta("og:type", "website", "property"), setMeta("og:locale", SITE_LOCALE, "property"), setMeta("og:site_name", SITE_NAME, "property"), setMeta("og:title", e.title, "property"), setMeta("og:description", e.description, "property"), setMeta("og:url", t, "property"), setMeta("og:image", PREVIEW_IMAGE.url, "property"), setMeta("og:image:secure_url", PREVIEW_IMAGE.url, "property"), setMeta("og:image:type", PREVIEW_IMAGE.type, "property"), setMeta("og:image:width", String(PREVIEW_IMAGE.width), "property"), setMeta("og:image:height", String(PREVIEW_IMAGE.height), "property"), setMeta("og:image:alt", PREVIEW_IMAGE.alt, "property"), setMeta("twitter:card", "summary_large_image"), setMeta("twitter:site", TWITTER_SITE), setMeta("twitter:creator", TWITTER_CREATOR), setMeta("twitter:title", e.title), setMeta("twitter:description", e.description), setMeta("twitter:image", PREVIEW_IMAGE.url), setMeta("twitter:image:alt", PREVIEW_IMAGE.alt), setLink("canonical", t), setLink("alternate", t, {
    hreflang: "en"
  }), setLink("alternate", t, {
    hreflang: "x-default"
  })
};

export const useSeo = () => {
  const s = useRoute();
  watch(() => s.fullPath, () => applySeo(s), {
    immediate: !0
  })
};
