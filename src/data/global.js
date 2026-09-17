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
  creditsBtn: "Credits",
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
  infos: "about this website",
  smallTexts: [
    ["<span class='popup__colTitle'>Contact us</span>Hack on Tracks is organised by the", "<a target='_blank' class='text__link' href='https://www.instagram.com/aidl_fcrit/'>AIDL Club</a> — Artificial Intelligence &amp;", "Deep Learning Club, FCRIT."],
    ["A huge shout-out to the core team,", "mentors and volunteers who keep", "the trains running on time."],
    ["Get in touch at", "<a class='text__link' href='mailto:fcrit.aidlofficial26@gmail.com'>fcrit.aidlofficial26@gmail.com</a>", "or on <a target='_blank' class='text__link' href='https://www.linkedin.com/company/artificial-intelligence-and-deep-learning-club-fcrit/'>LinkedIn</a>."]
  ],
  bigTexts: ["<span class='popup__colTitle'>About us</span>Hack on Tracks is the AI Summit 2026 hackathon: four domains, two rounds, one subway line. Round 1 is an online idea sprint on Unstop; the shortlisted teams come back to campus for a 24-hour offline build.", "The website was built as a single-scroll experience — a graffiti train that rolls through the four problem statements, a railway timeline for the schedule, and a 3D train that follows you along the way. Experience and interaction design inspired by Léo Parpeix's portfolio."],
  credits: {
    name: "AIDL Club, FCRIT",
    link: "https://www.instagram.com/aidl_fcrit/"
  }
};

export const globalData = {
  title: SITE_TITLE,
  infos: SITE_INFOS,
  navbar: navbarData,
  loader: loaderData,
  orientation: orientationData,
  footer: footerData
};
