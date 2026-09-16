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
    titles: ["French", "Interactive", "Designer"],
    titlesReveal: ["Creative", "Passionnate", "Art Director"],
    indication: "(Click to feed the bee)",
    city: "Raised in France <br> Designing worldwide",
    textAgency: ["Currently pushing design", "boundaries at", "and in freelance"],
    textFormer: "Former : ",
    agencies: [{
      name: "@Locomotive",
      url: "https://locomotive.ca"
    }, {
      name: "@ImmersiveGarden",
      url: "https://immersive-g.com"
    }]
  },
  intro: {
    bigTexts: ["Bonjour,", "I cherish simplicity, a touch of craziness, a unique identity & pixel-perfect animations."],
    smallTexts: ["Hi there, it looks like you've landed on my portfolio.", "Whether you're curious about me, seeking inspiration, or just wandered in, I'm delighted to welcome you to my creative universe."],
    urlReel: assetPaths.medias.home.showreel,
    cursorIndication: "Watch Reel"
  },
  projects: [{
    title: "Selected projects",
    cursorIndication: "Drag",
    sectionType: "slider",
    projectIndex: 0,
    mediasUrl: projectMediaUrls.project1,
    name: "Creandum",
    type: "Finance",
    date: "2023",
    team: {
      text: "Team of 2",
      agency: {
        name: "@ImmersiveGarden",
        url: "https://immersive-g.com"
      }
    },
    projectLink: {
      text: "Project link",
      url: "https://creandum.com/"
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
    name: "Veillance",
    type: "(Technical clothing)",
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
  }, {
    cursorIndication: "Drag",
    sectionType: "slider",
    projectIndex: 2,
    mediasUrl: projectMediaUrls.project3,
    name: "Mechachain",
    type: "NFT",
    recognitions: ["Awwwards x1"],
    date: "2023",
    team: {
      text: "Team of 3",
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
    projectIndex: 3,
    mediasUrl: projectMediaUrls.project4,
    name: "Dulcedo",
    type: "Model & Talent Agency",
    recognitions: ["Awwwards x1"],
    date: "2025",
    team: {
      text: "Team of 4",
      agency: {
        name: "@Locomotive",
        url: "https://locomotive.ca"
      }
    },
    projectLink: {
      text: "Project link",
      url: "https://dulcedo.com"
    },
    roles: {
      text: "Roles",
      items: ["Art Director", "UI & Interactive Designer"]
    }
  }, {
    cursorIndication: "Drag",
    sectionType: "slider",
    projectIndex: 4,
    mediasUrl: projectMediaUrls.project5,
    name: "Dioriviera",
    type: "(Model & Talent Agency)",
    recognitions: ["Awwwards x1", "FWA x1"],
    date: "2023",
    team: {
      text: "Team of 5",
      agency: {
        name: "@ImmersiveGarden",
        url: "https://immersive-g.com"
      }
    },
    projectLink: {
      text: "Project link",
      url: "http://dioriviera.imm-g-prod.com/dioriviera-2022"
    },
    roles: {
      text: "Roles",
      items: ["Art Director", "UI, 3D & Interactive Designer"]
    }
  }, {
    cursorIndication: "Drag",
    sectionType: "slider",
    projectIndex: 5,
    mediasUrl: projectMediaUrls.project6,
    name: "Trebuchet",
    type: "(Studio Portfolio)",
    date: "2024",
    team: {
      text: "Team of 3",
      agency: {
        name: "@ImmersiveGarden",
        url: "https://immersive-g.com"
      }
    },
    projectLink: {
      text: "Project link",
      url: "https://www.trebuchet.fun"
    },
    roles: {
      text: "Roles",
      items: ["Art Director", "UI & Interactive Designer"]
    }
  }],
  archives: {
    title: "Archives",
    cursorIndication: "Discover More",
    items: [{
      name: "Gab",
      type: "Portfolio",
      roles: "UI & Interactive Design",
      date: "2026",
      agency: {
        name: "Freelance"
      },
      infos: ["A digital portfolio focused on user experience and micro-interactions, designed to enhance clarity, flow, and overall navigation fluidity.", "Every interactions are crafted to feel intentional, seamless, and intuitive, reinforcing content without disrupting the experience and keep the focus on the content."],
      media: {
        url2: "/assets/medias/home/archives-base/7-PortfolioGab.mp4",
        isVideo: !0
      }
    }, {
      name: "Unity",
      type: "Design system",
      roles: "UI & Interactive Design",
      date: "2025",
      agency: {
        name: "@Locomotive",
        url: "https://locomotive.ca"
      },
      infos: ["Design system developed in collaboration with a UX designer and the Unity team.", "A large-scale system addressing complex constraints, multiple modules, and scalability requirements, ensuring consistency, flexibility, and long-term evolution across the platform."],
      projectLink: {
        text: "Project Link",
        url: "https://unity.com"
      },
      media: {
        url2: "/assets/medias/home/archives-base/8-Unity-2025.mp4",
        isVideo: !0
      }
    }, {
      name: "Pangaia",
      type: "Font Specimen",
      roles: "Motion design",
      date: "2025",
      agency: {
        name: "@Locomotive",
        url: "https://locomotive.ca"
      },
      infos: ["Motion design created for an Font specimen, focusing on dynamic visual storytelling and refined animation principles.", "The foundry uses crafted motion to enhance visual rhythm and engagement while reinforcing the concept through deliberate transitions and composition."],
      projectLink: {
        text: "Project Link",
        url: "https://www.instagram.com/p/DObtsCXD5W8/?img_index=1"
      },
      media: {
        url2: "/assets/medias/home/archives-base/9-Pangaia.mp4",
        isVideo: !0
      }
    }, {
      name: "Issey Miyake",
      type: "Immersive Experience",
      roles: "UI & Interactive Design",
      date: "2025",
      agency: {
        name: "Freelance"
      },
      infos: ["An immersive digital experience designed to introduce a new fragrance.", "The website focuses on crafted light transitions and a visual universe aligned with the brand’s artistic direction, creating a sensory and atmospheric journey that elevates the product narrative."],
      media: {
        url: DNA_PLACEHOLDER_IMAGE,
        isVideo: !1
      }
    }, {
      name: "Merrel",
      type: "Digital Concept",
      roles: "UI & Interactive Design",
      date: "2025",
      agency: {
        name: "@Locomotive",
        url: "https://locomotive.ca"
      },
      infos: ["An interactive concept for a new trail shoe, combining 3D and motion design to create a digital experience to showcase the shoe.", "The project balances performance and lifestyle, highlighting technical features through crafted interactions and dynamic visual storytelling."],
      media: {
        url2: "/assets/medias/home/archives-base/11-Merrel.mp4",
        isVideo: !0
      }
    }, {
      name: "L’Oréal",
      type: "Digital magazine",
      roles: "UI & Interactive Design",
      date: "2025",
      agency: {
        name: "Freelance"
      },
      infos: ["A digital magazine concept designed to showcase the history of the brand.", "The experience blends editorial storytelling with refined interactions, creating an engaging and elegant platform to express brand values, products, and expertise."],
      media: {
        url: DNA_PLACEHOLDER_IMAGE,
        isVideo: !1
      }
    }, {
      name: "TOUGO",
      type: "Digital magazine",
      roles: "UI & Interactive Design",
      date: "2025",
      agency: {
        name: "@Locomotive",
        url: "https://locomotive.ca"
      },
      infos: ["The goal was to rethink content pages and structure to give users the most pleasant and seamless reading experience.", "The work focused on content hierarchy, readability patterns, and intuitive flow to support the platform’s diverse health-related topics."],
      media: {
        url2: "/assets/medias/home/archives-base/13-Tougo.mp4",
        isVideo: !0
      }
    }, {
      name: "Drake hotel",
      type: "Digital magazine",
      roles: "UI & Interactive Design",
      date: "2025",
      agency: {
        name: "@Locomotive",
        url: "https://locomotive.ca"
      },
      infos: ["Interactive design research focused on improving experience fluidity and enriching the Art  Direction through motion design.", "The work explored motion-driven transitions, feedback patterns, and purposeful interaction rhythms to elevate visual expression while supporting intuitive user flow."],
      projectLink: {
        text: "Project Link",
        url: "https://thedrake.ca/thedrakehotel/?gad_source=1&gad_campaignid=20477311397&gbraid=0AAAAAD1zSaDEe1nh-HM3NQWr-0IZNzfDE&gclid=CjwKCAiA7LzLBhAgEiwAjMWzCLvXtgXXV08eJ5BGawgS8qhq9zoQDRSU5UrhzNjh6ZNorpgbgIvkuxoCVb0QAvD_BwE"
      },
      media: {
        url2: "/assets/medias/home/archives-base/14-DrakeHotel.mp4",
        isVideo: !0
      }
    }, {
      name: "Vooban",
      type: "Digital magazine",
      roles: "UI & Interactive Design",
      date: "2025",
      agency: {
        name: "@Locomotive",
        url: "https://locomotive.ca"
      },
      infos: ["Interactive design research focused on enhancing experience fluidity and strengthening the Art  Direction through motion design.", "The work explored motion-led transitions, interaction rhythms, and responsive feedback to support a seamless user journey while enriching visual identity."],
      projectLink: {
        text: "Project Link",
        url: "https://vooban.com/?utm_source=google&utm_medium=cpc&utm_campaign=&utm_content=792954902569&utm_term=vooban&utm_term=vooban&utm_campaign=SEM_Brand_Quebec_FR&utm_source=adwords&utm_medium=ppc&hsa_acc=3296514935&hsa_cam=23469546901&hsa_grp=195411009567&hsa_ad=792954902569&hsa_src=g&hsa_tgt=kwd-839849261435&hsa_kw=vooban&hsa_mt=e&hsa_net=adwords&hsa_ver=3&gad_source=1&gad_campaignid=23469546901&gbraid=0AAAAADSJzU_xxfQ7EOQGDITm5FOkQAIMZ&gclid=CjwKCAiA7LzLBhAgEiwAjMWzCBEBtoTw9_1uiOgxi-c5My4iyuK73_NowncQogxWU52_YRTSLX4UnxoCDbkQAvD_BwE"
      },
      media: {
        url2: "/assets/medias/home/archives-base/15-Vooban.mp4",
        isVideo: !0
      }
    }, {
      name: "Auberge La chatelaine",
      type: "Digital magazine",
      roles: "UI & Interactive Design",
      date: "2025",
      agency: {
        name: "Freelance"
      },
      infos: ["Design and development on Webflow for this canadian hostel.", "The project focuses on clarity, elegance, and fluid interactions, translating the venue’s atmosphere into a refined and seamless digital experience."],
      projectLink: {
        text: "Project Link",
        url: "https://www.aubergelachatelaine.com"
      },
      media: {
        url: "/assets/medias/home/archives-base/16-AubergerLaChatelaine.jpg",
        isVideo: !1
      }
    }, {
      name: "Unity 2024",
      type: "Digital magazine",
      roles: "UI & Interactive Design",
      date: "2024",
      agency: {
        name: "@Locomotive",
        url: "https://locomotive.ca"
      },
      infos: ["Work with a UX deisgner on Unity’s Game Report, focused on navigation research and content structuring.", "The goal was to improve readability and make complex information more digestible through clear hierarchy and purposeful interactions."],
      projectLink: {
        text: "Project Link",
        url: "https://unity.com/resources/gaming-report"
      },
      media: {
        url2: "/assets/medias/home/archives-base/17-Unity-2024.mp4",
        isVideo: !0
      }
    }, {
      name: "The Hay Adams",
      type: "Digital magazine",
      roles: "UI & Interactive Design",
      date: "2024",
      agency: {
        name: "@Locomotive",
        url: "https://locomotive.ca"
      },
      infos: ["Art direction and UI design for the luxury digital presence of The Hay-Adams, a historic hotel in Washington, D.C.", "The work aimed to reflect the venue’s refined heritage and tranquil elegance through a thoughtful visual language, intuitive interfaces, and a polished experience rooted in clarity and visual hierarchy."],
      projectLink: {
        text: "Project Link",
        url: "http://hayadams.com"
      },
      media: {
        url2: "/assets/medias/home/archives-base/18-TheHayAdams.mp4",
        isVideo: !0
      }
    }, {
      name: "Prison Boss",
      type: "Digital magazine",
      roles: "UI & Interactive Design",
      date: "2024",
      agency: {
        name: "@Locomotive",
        url: "https://locomotive.ca"
      },
      infos: ["Designed a playful and engaging landing page for the VR game Prison Boss.", "The concept emphasizes dynamic visuals and interactive cues to match the game’s energy, creating an inviting first touchpoint that sets user expectations through expressive UI and purposeful motion."],
      projectLink: {
        text: "Project Link",
        url: "https://prisonboss.fun"
      },
      media: {
        url2: "/assets/medias/home/archives-base/19-PrisonBoss.mp4",
        isVideo: !0
      }
    }, {
      name: "Palosanto",
      type: "Digital magazine",
      roles: "UI & Interactive Design",
      date: "2024",
      agency: {
        name: "Freelance"
      },
      infos: ["Website design for a music events brand and creative agency known for Afro-House and melodic events.", "The project focused on translating the brand’s energetic identity into a dynamic digital presence with intuitive layout, clear hierarchy, and engaging interactions to support events, music, and community engagement."],
      media: {
        url2: "/assets/medias/home/archives-base/20-Palosanto.mp4",
        isVideo: !0
      }
    }, {
      name: "Longines",
      type: "Digital magazine",
      roles: "UI & Interactive Design",
      date: "2024",
      agency: {
        name: "@ImmersiveGarden",
        url: "https://immersive-g.com"
      },
      infos: ["An immersive digital experience created for the launch of the Longines Spirit Flyback timepiece.", "The project blends 3D WebGL environments, interactive storytelling, and motion design to evoke aviation heritage and exploration."],
      projectLink: {
        text: "Project Link",
        url: "https://www.longines.com/fr/spirit-flyback"
      },
      media: {
        url2: "/assets/medias/home/archives-base/21-Longines.mp4",
        isVideo: !0
      }
    }, {
      name: "JMM",
      type: "E-commerce",
      roles: "UI & Interactive Design",
      date: "2024",
      agency: {
        name: "Freelance"
      },
      infos: ["Contributed to UX and UI strategy for the e-commerce experience, focusing on clarity, flow, and refined interface decisions."],
      projectLink: {
        text: "Project Link",
        url: "https://jacquesmariemage.com"
      },
      media: {
        url: DNA_PLACEHOLDER_IMAGE,
        isVideo: !1
      }
    }, {
      name: "Immersive Garden",
      type: "Digital magazine",
      roles: "UI & Interactive Design",
      date: "2024",
      agency: {
        name: "@ImmersiveGarden",
        url: "https://immersive-g.com"
      },
      infos: ["Contributed to the Art Direction and early design research of the portfolio focusing on typographic exploration, layout systems, and visual language development.", "This work shaped the site’s refined expression, supporting clarity, rhythm, and aesthetic cohesion across interactive experiences."],
      projectLink: {
        text: "Project Link",
        url: "https://immersive-g.com"
      },
      media: {
        url2: "/assets/medias/home/archives-base/23-ImmersiveGarden.mp4",
        isVideo: !0
      }
    }, {
      name: "Longines Dolce Vita",
      type: "Digital magazine",
      roles: "UI & Interactive Design",
      date: "2024",
      agency: {
        name: "@ImmersiveGarden",
        url: "https://immersive-g.com"
      },
      infos: ["A digital campaign and microsite for the Longines Mini Dolce Vita collection, designed to reflect the spirit of effortless elegance.", "The experience uses chapter-based navigation, refined motion design, and intuitive UX to guide users through each story and watch variation."],
      projectLink: {
        text: "Project Link",
        url: "https://www.longines.com/fr/mini-dolcevita"
      },
      media: {
        url2: "/assets/medias/home/archives-base/24-LonginesDolceVita.mp4",
        isVideo: !0
      }
    }, {
      name: "Omega",
      type: "Digital magazine",
      roles: "UI & Interactive Design",
      date: "2023",
      agency: {
        name: "@ImmersiveGarden",
        url: "https://immersive-g.com"
      },
      infos: ["A user-centered digital experience designed to help customers identify the Omega watch that best suits their lifestyle and preferences.", "The search engine simplifies product discovery through clear decision paths, intuitive navigation, and refined micro-interactions."],
      media: {
        url2: "/assets/medias/home/archives-base/25-Omega.mp4",
        isVideo: !0
      }
    }, {
      name: "Aleph",
      type: "Digital magazine",
      roles: "UI & Interactive Design",
      date: "2023",
      agency: {
        name: "@ImmersiveGarden",
        url: "https://immersive-g.com"
      },
      infos: ["Conceptualized the digital experience and motion direction for the Aleph Holding website, emphasizing purposeful animations and interaction cues to enhance visual hierarchy and guide users seamlessly through content."],
      media: {
        url2: "/assets/medias/home/archives-base/26-Aleph.mp4",
        isVideo: !0
      }
    }, {
      name: "Omexon",
      type: "Digital magazine",
      roles: "UI & Interactive Design",
      date: "2023",
      agency: {
        name: "@ImmersiveGarden",
        url: "https://immersive-g.com"
      },
      infos: ["A digital magazine designed to reinterpret print editorial codes in a digital context.", "The project focuses on typography, layout rhythm, and subtle interactions to preserve editorial elegance while enhancing reading flow and engagement."],
      media: {
        url: "/assets/medias/home/archives-base/27-Omexom.jpg",
        isVideo: !1
      }
    }, {
      name: "Tour de france",
      type: "Digital magazine",
      roles: "UI & Interactive Design",
      date: "2022",
      agency: {
        name: "@148Agency",
        url: "https://148.fr"
      },
      infos: ["A B2B landingpage designed to present Tour de France audience figures in a clear and compelling way.", "The experience focuses on data readability, structured storytelling, and intuitive navigation to support decision-making and brand partnerships."],
      media: {
        url2: "/assets/medias/home/archives-base/28-TourDeFrance.mp4",
        isVideo: !0
      }
    }, {
      name: "Manza",
      type: "Video agency",
      roles: "Branding",
      date: "2022",
      agency: {
        name: "Freelance"
      },
      infos: ["The goal of this project was to create an eco-system around the agency's universe.", "I worked on modern and raw graphic elements to avoid taking over their projects while creating a clean and assumed identity."],
      projectLink: {
        text: "Project Link",
        url: "https://www.instagram.com/p/CbiNLB1o2bc/?img_index=1"
      },
      media: {
        url2: "/assets/medias/home/archives-base/29-Manza.mp4",
        isVideo: !0
      }
    }]
  }
};

let Gw;

let Hw;

for (const s of homeData.archives.items)(Gw = s.media) != null && Gw.isVideo && s.media.url2 ? (s.media.poster = toArchivePoster(s.media.url2), s.media.url2 = toCompressedArchiveVideo(s.media.url2)) : (Hw = s.media) != null && Hw.url && (s.media.url = toCompressedArchiveImage(s.media.url));
