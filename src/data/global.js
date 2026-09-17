const SITE_TITLE = "HACK ON TRACKS";

const SITE_INFOS = "";

// Navbar entries → routes. Add / rename entries here (labels are what the navbar shows).
export const NAV_ROUTES = {
  Login: { path: "/login", name: "login" },
  // Work: { path: "/", name: "home" },
  // Teams: { path: "/teams", name: "teams" },
};

export const navbarData = {
  links: Object.keys(NAV_ROUTES),
  lab: null, // the external "Lab" button of the original site — set { text, url } to bring it back
  contact: "fcrit.aidlofficial26@gmail.com"
};

const loaderData = {
  progressText: "World building",
  cursorIndication: ["Click", "to enable sound"]
};

const orientationData = {
  title: "Rotate your device",
  text: "For an optimal navigation, please turn your screen vertically."
};

const footerData = {
  titles: ["Let's create", "a remarkable", "journey"],
  titlesReveal: ["your gateway", "to excitement", "starts here !"],
  date: "2026",
  creditsBtn: "", // credits popup removed — the "About us" section on the home page replaces it
  networks: [{
    name: "Instagram",
    url: "https://www.instagram.com/aidl_fcrit/"
  }, {
    name: "fcrit.aidlofficial26@gmail.com"
  }, {
    name: "Linkedin",
    url: "https://www.linkedin.com/company/artificial-intelligence-and-deep-learning-club-fcrit/"
  }],
  copyright: "© 2026",
  infos: "",
  smallTexts: [],
  bigTexts: [],
  credits: null
};

export const globalData = {
  title: SITE_TITLE,
  infos: SITE_INFOS,
  navbar: navbarData,
  loader: loaderData,
  orientation: orientationData,
  footer: footerData
};
