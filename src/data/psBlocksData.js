export const DOMAIN_PS_BLOCKS = [
  // Domain 0: GENERAL AI / GENAI INNOVATION (PS 3)
  {
    domainIndex: 0,
    domainCode: '03',
    domainName: 'GENERAL AI / GENAI INNOVATION · PS 3',
    title: 'Trustworthy Digital Information Verification',
    subtitle: 'Claim verification for forwarded messages, screenshots, voice notes, PDFs & URLs',
    hook: 'You receive a message on WhatsApp. It sounds convincing. But is it actually true?',
    blocks: [
      {
        id: 1,
        tag: 'Block 1 · Overview & The Problem',
        title: 'The Core Challenge',
        subtitle: 'Unchecked misinformation across messaging apps',
        sections: [
          {
            type: 'text',
            label: 'The Problem',
            body: 'An accessible system that takes a forwarded WhatsApp message, screenshot, voice note, PDF or URL and verifies its claims against authoritative sources — explaining the result in plain, local-language terms instead of a binary true / false.',
          },
          {
            type: 'text',
            label: 'Worked Example',
            body: 'Verification outcomes are deliberately not binary: Verified · Contradicted · Partially supported · Outdated · Insufficient evidence.',
          },
        ],
      },
      {
        id: 2,
        tag: 'Block 2 · Multi-Verdict Categories',
        title: 'Nuanced Verdict System',
        subtitle: 'Going beyond simple true/false flags',
        sections: [
          {
            type: 'badges',
            label: 'Five Verification Outcomes',
            items: ['Verified', 'Contradicted', 'Partially Supported', 'Outdated', 'Insufficient Evidence'],
          },
          {
            type: 'text',
            label: 'Grounding Guarantee',
            body: 'Important claims must be grounded in retrieved evidence. Retrieved facts are strictly kept separate from AI-generated explanations to eliminate hallucinations.',
          },
        ],
      },
      {
        id: 3,
        tag: 'Block 3 · 7-Step Workflow Pipeline',
        title: 'Verification Architecture',
        subtitle: 'From multimodal ingestion to calibrated explanation',
        sections: [
          {
            type: 'steps',
            label: 'Processing Pipeline',
            items: [
              'Submit content (message, image, audio, PDF, URL)',
              'Extract verifiable claims via multimodal parsing',
              'Decide what needs verification',
              'Search authoritative sources & live indexes',
              'Retrieve evidence with source ranking',
              'Compare claim vs retrieved evidence',
              'Explain with references and confidence calibration',
            ],
          },
        ],
      },
      {
        id: 4,
        tag: 'Block 4 · Focus & Design Principles',
        title: 'Safety & Evidence Principles',
        subtitle: 'Responsible GenAI guardrails',
        sections: [
          {
            type: 'bullets',
            label: 'Non-Negotiable Principles',
            items: [
              'The model must not answer from its own internal knowledge.',
              'Important claims must be strictly grounded in retrieved evidence.',
              'Retrieved facts kept separate from AI-generated explanation.',
              'Speech-to-text, multilingual LLMs, RAG, trusted-source ranking, contradiction detection.',
            ],
          },
        ],
      },
      {
        id: 5,
        tag: 'Block 5 · Round 1 Judging Rubric',
        title: 'Evaluation Criteria (100%)',
        subtitle: 'Idea quality over polish',
        sections: [
          {
            type: 'table',
            label: 'Scoring Breakdown',
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
        ],
      },
    ],
  },

  // Domain 1: FINTECH / BFSI AI (PS 1)
  {
    domainIndex: 1,
    domainCode: '02',
    domainName: 'FINTECH / BFSI AI · PS 1',
    title: 'Super App',
    subtitle: 'Unified multi-asset investing & awareness',
    hook: 'Every holding in one place — and a reason behind every number.',
    blocks: [
      {
        id: 1,
        tag: 'Block 1 · The Problem Statement',
        title: 'Portfolio Fragmentation',
        subtitle: 'Closing the retail awareness gap in alternate assets',
        sections: [
          {
            type: 'text',
            label: 'The Problem',
            body: 'Retail investors\' holdings are fragmented across brokers and depositories with no consolidated view, and participation stays narrow (mostly equities) because alternates like REITs, InvITs and bonds are poorly understood.',
          },
        ],
      },
      {
        id: 2,
        tag: 'Block 2 · Worked Example & Scope',
        title: 'Intelligent Education in Action',
        subtitle: 'Education before cross-sell',
        sections: [
          {
            type: 'text',
            label: 'Worked Example',
            body: 'A consolidated dashboard across linked accounts flags "0% fixed income" → plain-language education explains why that matters → a suitability check gates access before the user can actually invest in the new asset class.',
          },
          {
            type: 'text',
            label: 'MVP Scope',
            body: 'Mock import from 2–3 sources into one dashboard · allocation + gap-flag view · one interactive explainer module · suitability questionnaire gating a demo "invest" action.',
          },
        ],
      },
      {
        id: 3,
        tag: 'Block 3 · 8-Step Multi-Asset Workflow',
        title: 'System Pipeline',
        subtitle: 'From Account Aggregator consent to execution',
        sections: [
          {
            type: 'steps',
            label: 'End-to-End Workflow',
            items: [
              'Investor accounts ingestion',
              'Account Aggregator / CAS / API ingestion',
              'Unified portfolio store',
              'Risk & exposure analytics',
              'Gap detector across asset classes',
              'Discovery & education layer',
              'Suitability / risk-profiling agent',
              'Multi-asset execution with consent audit trail',
            ],
          },
        ],
      },
      {
        id: 4,
        tag: 'Block 4 · Focus & Design Principles',
        title: 'Consent-First Principles',
        subtitle: 'Alignment with SEBI direction & ethical UX',
        sections: [
          {
            type: 'bullets',
            label: 'Design Principles',
            items: [
              'Consent-first data access (Account Aggregator model).',
              'No dark patterns — education must precede any cross-sell.',
              'Alignment with SEBI\'s Unified Investor Platform direction.',
              'A one-line "why" behind every risk score.',
            ],
          },
        ],
      },
      {
        id: 5,
        tag: 'Block 5 · How Round 1 Is Judged',
        title: 'FinTech Evaluation',
        subtitle: 'Depth of formulation & regulatory guardrails',
        sections: [
          {
            type: 'bullets',
            label: 'Judging Criteria',
            items: [
              'Problem understanding & retail investor pain points.',
              'Architecture on paper: Account Aggregator, security & data stores.',
              'Meaningful differentiation from existing robo-advisors.',
              'Suitability enforcement & ethical cross-sell prevention.',
            ],
          },
        ],
      },
    ],
  },

  // Domain 2: BLOCKCHAIN × AI (PS-01A)
  {
    domainIndex: 2,
    domainCode: '04',
    domainName: 'BLOCKCHAIN × AI · PS-01A',
    title: 'Pay-and-Earn',
    subtitle: 'DeFi · Payments',
    hook: 'Can ordinary payments themselves generate returns?',
    blocks: [
      {
        id: 1,
        tag: 'Block 1 · The Problem Statement',
        title: 'Idle Capital in DeFi Payments',
        subtitle: 'Making everyday payments generate sustainable returns',
        sections: [
          {
            type: 'text',
            label: 'The Problem',
            body: 'Earning yield in DeFi needs active management and know-how, so money sits idle between payments. Design a payment system where eligible everyday transactions can earn potential returns, while staying transparent, secure, sustainable and simple to use.',
          },
        ],
      },
      {
        id: 2,
        tag: 'Block 2 · Format & Mandatory Rule',
        title: 'Submission Guidelines & Constraints',
        subtitle: 'Strict safety and compliance boundaries',
        sections: [
          {
            type: 'text',
            label: 'Submission Format',
            body: 'Because this PS is judged online, submissions are evaluated as a recorded demo + repo + deck rather than a live on-site build. Every team must explain its reward / economic model in one slide.',
          },
          {
            type: 'warning',
            label: 'Mandatory Rule',
            body: 'Non-negotiable: no design may promise or imply guaranteed financial returns.',
          },
        ],
      },
      {
        id: 3,
        tag: 'Block 3 · 5-Step Settlement Workflow',
        title: 'Payment & Yield Workflow',
        subtitle: 'Automated on-chain routing and settlement',
        sections: [
          {
            type: 'steps',
            label: 'Workflow Pipeline',
            items: [
              'Everyday payment initiation',
              'Eligibility & compliance check',
              'Auto-route eligible funds into audited yield strategies',
              'Smart-contract settlement on-chain',
              'Transparent accounting of rewards, fees and returns',
            ],
          },
        ],
      },
      {
        id: 4,
        tag: 'Block 4 · Focus & Design Principles',
        title: 'Sustainable Economics',
        subtitle: 'Security, liquidity and gas efficiency',
        sections: [
          {
            type: 'bullets',
            label: 'Key Principles',
            items: [
              'Blockchain payments with built-in incentives.',
              'Risk-aware design for different user profiles.',
              'Do not mix up promotional rewards with real on-chain yield.',
              'Account for transaction costs, liquidity and contract security.',
            ],
          },
        ],
      },
      {
        id: 5,
        tag: 'Block 5 · How Round 1 Is Judged',
        title: 'Blockchain × AI Evaluation',
        subtitle: 'Tokenomics clarity & smart contract hygiene',
        sections: [
          {
            type: 'bullets',
            label: 'Evaluation Criteria',
            items: [
              'Problem understanding & economic model transparency.',
              'Architecture on paper: Smart contracts, AI routing, oracles.',
              'Innovation, sustainable yield mechanisms and risk management.',
              'Security audit awareness and gas optimization.',
            ],
          },
        ],
      },
    ],
  },

  // Domain 3: CYBERSECURITY & AI (PS 1)
  {
    domainIndex: 3,
    domainCode: '01',
    domainName: 'CYBERSECURITY & AI · PS 1',
    title: 'The Verified Fix',
    subtitle: 'Automated vulnerability detection and verified patching',
    hook: 'Fix the flaw — and prove you didn\'t break the feature.',
    blocks: [
      {
        id: 1,
        tag: 'Block 1 · Problem & Worked Example',
        title: 'Minimal Verified Patching',
        subtitle: 'Reproduce flaw as test without breaking legitimate features',
        sections: [
          {
            type: 'text',
            label: 'The Problem',
            body: 'Given a document portal with a suspected unauthorized-access flaw, build an AI-assisted system that reproduces the vulnerability as a failing test, locates the root cause, proposes a minimal patch, and verifies the patch fixes the security issue without breaking legitimate functionality.',
          },
          {
            type: 'text',
            label: 'Worked Example',
            body: 'Asha can download Ravi\'s private file (bad). A naive fix that blocks all downloads is equally bad — it also blocks Asha\'s own files. The correct patch must pass all four cases: own document (allow), other\'s private document (deny), explicitly shared document (allow), signed-out visitor (deny).',
          },
        ],
      },
      {
        id: 2,
        tag: 'Block 2 · 7-Step Verified Fix Workflow',
        title: 'Automated Remediation Flow',
        subtitle: 'Independent security and regression verification',
        sections: [
          {
            type: 'steps',
            label: 'Pipeline Steps',
            items: [
              'Input: source code + security policy + test suite',
              'Reproduce vulnerability as a failing test case',
              'Locate root cause across files and dependencies',
              'Generate a minimal, targeted patch',
              'Verify security flaw is eliminated',
              'Verify existing functionality stays completely intact',
              'Output: verified diff, test evidence, limitations',
            ],
          },
        ],
      },
      {
        id: 3,
        tag: 'Block 3 · Why It\'s Hard & Baselines',
        title: 'Technical Complexity',
        subtitle: 'Real-world automated penetration challenges',
        sections: [
          {
            type: 'bullets',
            label: 'Key Difficulties',
            items: [
              'Telling a real security finding from a scanner false-positive.',
              'Finding the root cause across multiple interconnected files.',
              'Producing a minimal fix instead of disabling the feature.',
              'Testing independently of the model that wrote the patch.',
            ],
          },
          {
            type: 'badges',
            label: 'Existing Baselines',
            items: ['GitHub Copilot Autofix', 'ATLANTIS (DARPA AIxCC)'],
          },
        ],
      },
      {
        id: 4,
        tag: 'Block 4 · Pitch Comparison',
        title: 'Weak vs Strong Pitch',
        subtitle: 'Evidence over superficial claims',
        sections: [
          {
            type: 'pitch',
            weak: '"An LLM fixes the code."',
            strong: '"A reproducing test establishes the failure; independent security and functional tests evaluate the correction."',
          },
        ],
      },
      {
        id: 5,
        tag: 'Block 5 · Round 1 Deck (100 Marks)',
        title: 'Official Marks Breakdown',
        subtitle: 'Round 1 presentation evaluation',
        sections: [
          {
            type: 'table',
            label: 'Score Criteria',
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
        ],
      },
    ],
  },
];
