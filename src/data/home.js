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
    titles: ["AI Summit", "2026", "Hackathon"],
    titlesReveal: ["Ideate.", "Build.", "Verify."],
    indication: "(Click to fuel the train)",
    city: "",
    textAgency: [],
    textFormer: "",
    agencies: []
  },
  intro: {
    bigTexts: ["Four domains. Two rounds.", "One 24-hour build."],
    smallTexts: ["Round 1 is an online idea sprint on Unstop — one problem statement per domain, judged on understanding, architecture and originality.", "Shortlisted teams return for a 24-hour offline build where only evidence, correctness and robustness count."],
    urlReel: assetPaths.medias.home.showreel,
    cursorIndication: "Watch Reel"
  },
  projects: [{
    title: "Presented Domain",
    cursorIndication: "Drag",
    sectionType: "slider",
    projectIndex: 0,
    mediasUrl: projectMediaUrls.project1,
    name: "GENERAL AI / GENAI",
    type: "",
    date: "PS 3 · Info Verification",
    team: {
      text: "Team of 2",
      agency: {
        name: "@ImmersiveGarden",
        url: "https://immersive-g.com"
      }
    },
    roles: {
      text: "Theme",
      items: ["Emergency response", "Marketplaces", "Information trust", "Agent safety", "Industrial vision"]
    }
  }, {
    cursorIndication: "Drag",
    sectionType: "slider",
    projectIndex: 1,
    mediasUrl: projectMediaUrls.project2,
    name: "FINTECH / BFSI AI",
    type: "",
    date: "PS 1 · Super App",
    team: {
      text: "Team of 3",
      agency: {
        name: "Personal Research"
      }
    },
    roles: {
      text: "Theme",
      items: ["Investing", "Banking engagement", "Rural finance", "Trade finance", "Wealth-building"]
    }
  },  {
    sectionType: "webgl",
    textLines: ["AI that", "understands,", "decides and", "can be trusted."],
    cameraParams: {
      scrollRangePosition: {
        x: 0,
        y: 0,
        z: 2
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
  }, {
    cursorIndication: "Drag",
    sectionType: "slider",
    projectIndex: 2,
    mediasUrl: projectMediaUrls.project4,
    name: "BLOCKCHAIN × AI",
    type: "",
    date: "PS-01A · Pay-and-Earn",
    team: {
      text: "Team of 4",
      agency: {
        name: "@Locomotive",
        url: "https://locomotive.ca"
      }
    },
    roles: {
      text: "Theme",
      items: ["DeFi payments-as-yield", "On-chain data intelligence", "AI-grounded chain research"]
    }
  }, {
    cursorIndication: "Drag",
    sectionType: "slider",
    projectIndex: 3,
    mediasUrl: projectMediaUrls.project5,
    name: "CYBERSECURITY & AI",
    type: "",
    date: "PS 1 · The Verified Fix",
    team: {
      text: "Team of 5",
      agency: {
        name: "@ImmersiveGarden",
        url: "https://immersive-g.com"
      }
    },
    roles: {
      text: "Theme",
      items: ["Vulnerability discovery", "Verified patching", "Intrusion detection"]
    }
  }, ],
  archives: {
    title: "Schedule",
    cursorIndication: "Details",
    items: [
    {
      name: "Registration & check-in",
      type: "09:00 – 10:00",
      roles: "",
      date: "Day 1",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Teams arrive, badges, seating.", "Timings will be confirmed with the Round 2 shortlist."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Opening ceremony",
      type: "10:00 – 10:45",
      roles: "",
      date: "Day 1",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Welcome, rules, problem statements reveal.", "Timings will be confirmed with the Round 2 shortlist."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Hacking begins",
      type: "11:00",
      roles: "",
      date: "Day 1",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Build phase starts.", "Timings will be confirmed with the Round 2 shortlist."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Mentor round 1",
      type: "15:00 – 17:00",
      roles: "",
      date: "Day 1",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Mentors visit every team.", "Timings will be confirmed with the Round 2 shortlist."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Dinner & networking",
      type: "20:00",
      roles: "",
      date: "Day 1",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Food, music, breaks.", "Timings will be confirmed with the Round 2 shortlist."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Midnight checkpoint",
      type: "00:00",
      roles: "",
      date: "Day 1",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Progress snapshot from each team.", "Timings will be confirmed with the Round 2 shortlist."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Mentor round 2",
      type: "09:00 – 11:00",
      roles: "",
      date: "Day 2",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Final guidance before submissions.", "Timings will be confirmed with the Round 2 shortlist."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Submissions close",
      type: "13:00",
      roles: "",
      date: "Day 2",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Repos, decks and demos locked.", "Timings will be confirmed with the Round 2 shortlist."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Team presentations",
      type: "14:00 – 17:00",
      roles: "",
      date: "Day 2",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["5-minute pitch + Q&A per team.", "Timings will be confirmed with the Round 2 shortlist."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Jury deliberation",
      type: "17:00 – 18:00",
      roles: "",
      date: "Day 2",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Scoring and shortlisting.", "Timings will be confirmed with the Round 2 shortlist."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    },
    {
      name: "Awards & closing",
      type: "18:00 – 19:00",
      roles: "",
      date: "Day 2",
      agency: { name: "AI EXPO HACKATHON" },
      infos: ["Winners announced, closing notes.", "Timings will be confirmed with the Round 2 shortlist."],
      media: { url: DNA_PLACEHOLDER_IMAGE, isVideo: !1 }
    }
    ]
  }
};

let Gw;

let Hw;

for (const s of homeData.archives.items)(Gw = s.media) != null && Gw.isVideo && s.media.url2 ? (s.media.poster = toArchivePoster(s.media.url2), s.media.url2 = toCompressedArchiveVideo(s.media.url2)) : (Hw = s.media) != null && Hw.url && (s.media.url = toCompressedArchiveImage(s.media.url));
