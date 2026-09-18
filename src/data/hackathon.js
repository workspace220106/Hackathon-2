// AI Summit 2026 hackathon content — sourced from the organiser's problem-statement
// documents (AI_Summit_2026_Online_PS.md / _Offline_PS.md / AI_Hackathon_Problem_Statements.md).
// Only `onlinePS` is rendered on the site for now; `offlinePS` is kept here so the
// Round 2 statements can be switched on later without re-entering them.

export const about = {
  eyebrow: 'About the hackathon',
  title: ['HACK ON TRACKS', '2026'],
  lead: 'A two-stage AI hackathon across four domains — Cybersecurity, FinTech / BFSI, Generative AI and Blockchain × AI. Round 1 is an online idea sprint; the shortlisted teams come back for a 24-hour offline build.',
  theme: '"AI that doesn\'t just generate answers — it understands context, makes decisions, coordinates real-world actions, and can be trusted."',
  organiser: {
    name: 'Artificial Intelligence & Deep Learning Club',
    college: 'Fr. C. Rodrigues Institute of Technology (FCRIT)',
    email: 'fcrit.aidlofficial26@gmail.com',
    instagram: 'https://www.instagram.com/aidl_fcrit/',
    linkedin: 'https://www.linkedin.com/company/artificial-intelligence-and-deep-learning-club-fcrit/',
  },
  stats: [
    { value: '4', label: 'Domains' },
    { value: '2', label: 'Rounds' },
    { value: '4', label: 'Round 1 problem statements' },
    { value: '24', suffix: 'h', label: 'Offline build' },
  ],
  rounds: [
    {
      tag: 'Round 1',
      name: 'Online idea sprint',
      where: 'Unstop',
      summary: 'Idea submission and shortlisting. One problem statement per domain — four in total. No working prototype is required.',
      points: [
        'Pick one of the four online problem statements below.',
        'Submit a deck: problem understanding, architecture-on-paper, innovation.',
        'Judged on clarity of thinking, technical depth and originality — not on polish.',
      ],
    },
    {
      tag: 'Round 2',
      name: 'Offline 24-hour build',
      where: 'On campus · shortlisted teams',
      summary: 'Two problem statements per domain (eight in total). Teams choose one and build a real prototype.',
      points: [
        'Evaluation focuses on correctness, evidence and robustness.',
        'Hidden test cases, equal compute / model budgets, demo on an unseen case.',
        'The AI is never trusted to grade its own work — independent verification counts.',
      ],
    },
  ],
  principles: [
    { title: 'Evidence over claims', text: 'Every track insists on independent verification. A reproducing test, a retrieved source, a signed verdict — not the model\'s word.' },
    { title: 'Humans stay in the loop', text: 'High-stakes decisions escalate to people: licensed advisors, dispatchers, arbiters, security analysts.' },
    { title: 'Explain the why', text: 'A risk score, a verdict or a nudge is only as good as the one-line reason behind it.' },
    { title: 'No guaranteed returns', text: 'Non-negotiable across the Blockchain track: no design may promise or imply guaranteed financial returns.' },
  ],
};

export const DOMAINS = [
  { id: 'cyber', name: 'Cybersecurity & AI', short: 'Cybersecurity', theme: 'Automated vulnerability discovery, patching and intrusion detection', basis: 'Based on DARPA AIxCC, Tencent Intelligent Penetration Challenge, CISA advisories, SANS 2025' },
  { id: 'fintech', name: 'FinTech / BFSI AI', short: 'FinTech', theme: 'Investing, banking engagement, rural finance, trade finance, wealth-building' },
  { id: 'genai', name: 'Generative AI Innovation', short: 'Generative AI', theme: 'Emergency response, marketplaces, trust, agent safety, industrial vision' },
  { id: 'blockchain', name: 'Blockchain × AI', short: 'Blockchain', theme: 'DeFi payments-as-yield, on-chain data intelligence, AI-grounded chain research' },
];

// Round 1 — the four online problem statements (one per domain)
export const onlinePS = [
  {
    domain: 'cyber',
    code: 'PS 1',
    title: 'The Verified Fix',
    topic: 'Automated vulnerability detection and verified patching',
    problem: 'Given a document portal with a suspected unauthorized-access flaw, build an AI-assisted system that reproduces the vulnerability as a failing test, locates the root cause, proposes a minimal patch, and verifies the patch fixes the security issue without breaking legitimate functionality.',
    example: 'Asha can download Ravi\'s private file (bad). A naive fix that blocks all downloads is equally bad — it also blocks Asha\'s own files. The correct patch must pass all four cases: own document (allow), other\'s private document (deny), explicitly shared document (allow), signed-out visitor (deny).',
    flow: ['Input: source + policy + tests', 'Reproduce', 'Locate root cause', 'Patch', 'Verify security', 'Verify functionality', 'Output: diff, evidence, limitations'],
    hard: [
      'Telling a real finding from a scanner false-positive',
      'Finding the root cause across files',
      'Producing a minimal fix instead of disabling the feature',
      'Testing independently of the model that wrote the patch',
    ],
    baselines: ['GitHub Copilot Autofix', 'ATLANTIS (DARPA AIxCC)'],
    weak: '"An LLM fixes the code."',
    strong: '"A reproducing test establishes the failure; independent security and functional tests evaluate the correction."',
    hook: 'Fix the flaw — and prove you didn\'t break the feature.',
    judging: {
      title: 'Round 1 deck · 100 marks',
      rows: [
        ['Problem understanding & formulation', '20'],
        ['Research on existing solutions', '15'],
        ['Technical depth', '20'],
        ['Architecture and approach', '15'],
        ['AI justification and verification', '10'],
        ['Meaningful differentiation', '10'],
        ['24-hour feasibility', '5'],
        ['Evaluation methodology', '5'],
      ],
    },
  },
  {
    domain: 'fintech',
    code: 'PS 1',
    title: 'Super App',
    topic: 'Unified multi-asset investing & awareness',
    problem: 'Retail investors\' holdings are fragmented across brokers and depositories with no consolidated view, and participation stays narrow (mostly equities) because alternates like REITs, InvITs and bonds are poorly understood.',
    example: 'A consolidated dashboard across linked accounts flags "0% fixed income" → plain-language education explains why that matters → a suitability check gates access before the user can actually invest in the new asset class.',
    flow: ['Investor accounts', 'Account Aggregator / CAS / API ingestion', 'Unified portfolio store', 'Risk & exposure analytics', 'Gap detector', 'Discovery & education layer', 'Suitability / risk-profiling agent', 'Multi-asset execution'],
    hard: [
      'Consent-first data access (Account Aggregator model)',
      'No dark patterns — education must precede any cross-sell',
      'Alignment with SEBI\'s Unified Investor Platform direction',
      'A one-line "why" behind every risk score',
    ],
    mvp: 'Mock import from 2–3 sources into one dashboard · allocation + gap-flag view · one interactive explainer module · suitability questionnaire gating a demo "invest" action · consent / recommendation audit trail.',
    hook: 'Every holding in one place — and a reason behind every number.',
  },
  {
    domain: 'genai',
    code: 'PS 3',
    title: 'Trustworthy Digital Information Verification',
    topic: 'Claim verification for forwarded messages, screenshots, voice notes, PDFs and URLs',
    problem: 'An accessible system that takes a forwarded WhatsApp message, screenshot, voice note, PDF or URL and verifies its claims against authoritative sources — explaining the result in plain, local-language terms instead of a binary true / false.',
    example: 'Verification outcomes are deliberately not binary: Verified · Contradicted · Partially supported · Outdated · Insufficient evidence.',
    flow: ['Submit content', 'Extract claims', 'Decide what needs verification', 'Search authoritative sources', 'Retrieve evidence', 'Compare claim vs evidence', 'Explain with references and uncertainty'],
    hard: [
      'The model must not answer from its own internal knowledge',
      'Important claims must be grounded in retrieved evidence',
      'Retrieved facts kept separate from AI-generated explanation',
      'Speech-to-text, multilingual LLMs, RAG, trusted-source ranking, contradiction detection, confidence estimation',
    ],
    hook: 'You receive a message on WhatsApp. It sounds convincing. But is it actually true?',
    judging: {
      title: 'Round 1 rubric · idea quality over polish',
      rows: [
        ['Problem understanding & clarity', '15%'],
        ['Innovation & originality', '20%'],
        ['AI / GenAI depth', '20%'],
        ['Proposed solution & architecture', '15%'],
        ['Real-world impact / value', '15%'],
        ['Feasibility & scalability', '10%'],
        ['Responsible AI / safety', '5%'],
      ],
    },
  },
  {
    domain: 'blockchain',
    code: 'PS-01A',
    title: 'Pay-and-Earn',
    topic: 'DeFi · Payments',
    problem: 'Earning yield in DeFi needs active management and know-how, so money sits idle between payments. Design a payment system where eligible everyday transactions can earn potential returns, while staying transparent, secure, sustainable and simple to use.',
    example: 'Because this PS is judged online, submissions are evaluated as a recorded demo + repo + deck rather than a live on-site build. Every team must explain its reward / economic model in one slide.',
    flow: ['Everyday payment', 'Eligibility check', 'Auto-route eligible funds into yield strategies', 'Smart-contract settlement', 'Transparent accounting of rewards, fees and returns'],
    hard: [
      'Blockchain payments with built-in incentives',
      'Risk-aware design for different users',
      'Do not mix up promotional rewards with real yield',
      'Account for transaction costs, liquidity and contract security',
    ],
    warning: 'Non-negotiable: no design may promise or imply guaranteed financial returns.',
    hook: 'Can ordinary payments themselves generate returns?',
  },
];

// Round 2 — offline problem statements (two per domain). Not rendered yet.
export const offlinePS = [
  { domain: 'cyber', code: 'PS 2', title: 'The Next Move', topic: 'LLM-based intelligent penetration testing' },
  { domain: 'cyber', code: 'PS 3', title: 'The Trusted Account', topic: 'Intrusion detection for valid accounts & ordinary admin tools' },
  { domain: 'fintech', code: 'PS 4', title: 'AI + Blockchain for Trustless Trade Finance', topic: 'Document verification, oracle-signed settlement, fraud rejection' },
  { domain: 'fintech', code: 'PS 5', title: 'AI-Native Financial Ecosystem for Millennials', topic: 'Agentic advisor, simulation, life-event detection' },
  { domain: 'genai', code: 'PS 1', title: 'RapidRescue AI', topic: 'Emergency response intelligence' },
  { domain: 'genai', code: 'PS 2', title: 'Demand2Supply AI', topic: 'Real-time service marketplace' },
  { domain: 'blockchain', code: 'PS-01B', title: 'On-Chain Insight Engine', topic: 'Blockchain analytics · data · AI' },
  { domain: 'blockchain', code: 'PS-01C', title: 'Ask-the-Chain', topic: 'AI · RAG · blockchain research assistant' },
];

export const domainById = (id) => DOMAINS.find((d) => d.id === id);

// ---------------------------------------------------------------------------
// Event date, prizes and sponsors (added 2026-09-18)

// Offline 24-hour build: 8–9 October 2026. The countdown targets the start; the
// time of day is an assumption (09:00 IST) — change it here when it's confirmed.
export const HACKATHON_START = '2026-10-08T09:00:00+05:30';
export const HACKATHON_DATES_LABEL = '8 – 9 October 2026';

// Prize podium: one Subway Surfers character per place (OBJ + texture under
// public/assets/models/global/characters/). `spin` = idle sway in radians.
export const prizes = [
  { place: '1st', amount: '₹50,000', label: 'Winner', character: 'tricky', obj: '/assets/models/global/characters/tricky/Tricky.obj', texture: '/assets/models/global/characters/tricky/avatar_tricky.png', color: '#FF5A2E' },
  { place: '2nd', amount: '₹30,000', label: 'Runner-up', character: 'ninja', obj: '/assets/models/global/characters/ninja/Ninja.obj', texture: '/assets/models/global/characters/ninja/avatar_ninja.png', color: '#00E5D0' },
  { place: '3rd', amount: '₹20,000', label: 'Second runner-up', character: 'tagbot', obj: '/assets/models/global/characters/tagbot/Tagbot.obj', texture: '/assets/models/global/characters/tagbot/avatar_tag.png', color: '#FFC300' },
];

// Six sponsor slots. Fill `logo` (image path, e.g. '/assets/sponsors/acme.png') and
// `name` / `url`; an empty slot renders as a spray-paint patch with a placeholder.
export const sponsors = [
  { name: '', logo: '', url: '' },
  { name: '', logo: '', url: '' },
  { name: '', logo: '', url: '' },
  { name: '', logo: '', url: '' },
  { name: '', logo: '', url: '' },
  { name: '', logo: '', url: '' },
];
