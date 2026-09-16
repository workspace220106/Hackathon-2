const SITE_TITLE = "AI EXPO HACKATHON";

const SITE_INFOS = "Art director, Interactive designer";

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
  date: "Spring 2021",
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
  copyright: "© 2024",
  infos: "about this Portfolio",
  smallTexts: [
    ["A huge shout-out to <a target='_blank' class='text__link' href='https://twitter.com/LecornuThoma'>Thoma Lecornu</a>,", "who jumped onto this project with me."],
    ["His personality and determination", "were, for sure, one of the key elements", "in the success of this portfolio."],
    ["And, a big shout-out to <a target='_blank' class='text__link' href='https://www.instagram.com/vic.rou'>Victor</a>, <a target='_blank' class='text__link' href='https://www.linkedin.com/in/felix-sikora/'>Félix</a>", "and <a target='_blank' class='text__link' href='https://www.instagram.com/lucas_gssr/'>Lucas</a> for their patience and 3D", "crazy skills !"]
  ],
  bigTexts: ["My goal was to strike the right balance between an immersive 3D experience and a clean 2D environment, allowing visitors to explore my projects in a single scroll and understand my skill set in under 10 seconds.", "I built the concept around the moustache daisy, a symbol that reflects both my personality and my creative approach. As the experience unfolds, you'll discover a character meticulously sculpted in an artist's workshop, one that exudes the beauty of nature, or one that becomes a strange and playful magical object."],
  credits: {
    name: "Thoma Lecornu",
    link: "https://twitter.com/LecornuThoma"
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
