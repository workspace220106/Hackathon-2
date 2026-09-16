import {
  assetPaths,
  projectMediaUrls
} from '../config/assets-manifest.js';
import {
  toArchivePoster,
  toCompressedArchiveImage,
  toCompressedArchiveVideo
} from '../config/media-paths.js';

const DNA_PLACEHOLDER_IMAGE = "/assets/medias/home/archives-base/dna.jpg";

export const homeData = {
  header: {
    // Hero copy removed: the header is a full-bleed video (see webgl/environments/HomeEnvironment.js)
    description: "",
    scrollIndication: "",
    cameraParams: {
      // camera only moves forward through the header scroll → pure zoom into the video
      scrollRangePosition: {
        x: 0,
        y: 0,
        z: 4
      },
      scrollRangeRotation: {
        x: 0,
        y: 0,
        z: 0
      },
      scrollOffsetPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      scrollOffsetRotation: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  },
  hero: {
    // placeholder copy — same reveal animations / fonts as the original
    titles: ["To be", "added", "here"],
    titlesReveal: ["Coming", "very", "soon"],
    indication: "(Click to fuel the train)",
    city: "",
    textAgency: [],
    textFormer: "",
    agencies: []
  },
  intro: {
    bigTexts: ["To be added here.", "To be added here."],
    smallTexts: ["To be added here.", "To be added here."],
    urlReel: assetPaths.medias.home.showreel,
    cursorIndication: "Watch Reel"
  },
  projects: [{
    title: "Presented Domain",
    cursorIndication: "Drag",
    sectionType: "slider",
    projectIndex: 0,
    mediasUrl: projectMediaUrls.project1,
    name: "CORE ML",
    type: "",
    date: "2023",
    team: {
      text: "Team of 2",
      agency: {
        name: "@ImmersiveGarden",
        url: "https://immersive-g.com"
      }
    },
    roles: {
      text: "Roles",
      items: ["Art Director", "UI & Interactive Designer"]
    }
  }, {
    cursorIndication: "Drag",
    sectionType: "slider",
    projectIndex: 1,
    mediasUrl: projectMediaUrls.project2,
    name: "FINTECH",
    type: "",
    date: "2025",
    team: {
      text: "Team of 3",
      agency: {
        name: "Personal Research"
      }
    },
    roles: {
      text: "Roles",
      items: ["Art Director", "UI & Interactive Designer"]
    }
  },  {
    sectionType: "webgl",
    textLines: ["Focus on", "innovation and", "user-centered", "design."],
    cameraParams: {
      scrollRangePosition: {
        x: 0,
        y: 2.75,
        z: 0
      },
      scrollRangeRotation: {
        x: 0,
        y: 0,
        z: 0
      },
      scrollOffsetPosition: {
        x: 0,
        y: 2.75,
        z: 0
      },
      scrollOffsetRotation: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  }, {
    cursorIndication: "Drag",
    sectionType: "slider",
    projectIndex: 2,
    mediasUrl: projectMediaUrls.project4,
    name: "BLOCKCHAIN",
    type: "",
    date: "2025",
    team: {
      text: "Team of 4",
      agency: {
        name: "@Locomotive",
        url: "https://locomotive.ca"
      }
    },
    roles: {
      text: "Roles",
      items: ["Art Director", "UI & Interactive Designer"]
    }
  }, {
    cursorIndication: "Drag",
    sectionType: "slider",
    projectIndex: 3,
    mediasUrl: projectMediaUrls.project5,
    name: "CYBERSECURITY",
    type: "",
    date: "2023",
    team: {
      text: "Team of 5",
      agency: {
        name: "@ImmersiveGarden",
        url: "https://immersive-g.com"
      }
    },
    roles: {
      text: "Roles",
      items: ["Art Director", "UI, 3D & Interactive Designer"]
    }
  }, ],
  archives: {
    title: "Schedule",
    cursorIndication: "Details",
    items: [
    {
      name: "Registration & check-in",
      type: "09:00 – 10:00",
      roles: "To be added here",
      date: "Day 1",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Teams arrive, badges, seating.", "Details to be added here."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Opening ceremony",
      type: "10:00 – 10:45",
      roles: "To be added here",
      date: "Day 1",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Welcome, rules, problem statements reveal.", "Details to be added here."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Hacking begins",
      type: "11:00",
      roles: "To be added here",
      date: "Day 1",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Build phase starts.", "Details to be added here."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Mentor round 1",
      type: "15:00 – 17:00",
      roles: "To be added here",
      date: "Day 1",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Mentors visit every team.", "Details to be added here."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Dinner & networking",
      type: "20:00",
      roles: "To be added here",
      date: "Day 1",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Food, music, breaks.", "Details to be added here."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Midnight checkpoint",
      type: "00:00",
      roles: "To be added here",
      date: "Day 1",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Progress snapshot from each team.", "Details to be added here."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Mentor round 2",
      type: "09:00 – 11:00",
      roles: "To be added here",
      date: "Day 2",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Final guidance before submissions.", "Details to be added here."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Submissions close",
      type: "13:00",
      roles: "To be added here",
      date: "Day 2",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Repos, decks and demos locked.", "Details to be added here."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Team presentations",
      type: "14:00 – 17:00",
      roles: "To be added here",
      date: "Day 2",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["5-minute pitch + Q&A per team.", "Details to be added here."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Jury deliberation",
      type: "17:00 – 18:00",
      roles: "To be added here",
      date: "Day 2",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Scoring and shortlisting.", "Details to be added here."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Awards & closing",
      type: "18:00 – 19:00",
      roles: "To be added here",
      date: "Day 2",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Winners announced, closing notes.", "Details to be added here."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    }
    ]
  }
};

let Gw;

let Hw;

for (const s of homeData.archives.items)(Gw = s.media) != null && Gw.isVideo && s.media.url2 ? (s.media.poster = toArchivePoster(s.media.url2), s.media.url2 = toCompressedArchiveVideo(s.media.url2)) : (Hw = s.media) != null && Hw.url && (s.media.url = toCompressedArchiveImage(s.media.url));
