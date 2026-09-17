import {
  CanvasTexture,
  LinearFilter,
  SRGBColorSpace,
} from 'three';

const CARD_W = 1024;
const CARD_H = 1365;

/**
 * Renders a rich, high-resolution Canvas representation of a Problem Statement block
 * matching the hackathon UI screenshots.
 */
function drawCard(domainIndex, blockIndex) {
  const canvas = document.createElement('canvas');
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Background
  ctx.fillStyle = '#f8f9fc';
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Main Card Container (white with rounded corners & shadow)
  const mx = 32, my = 32, mw = CARD_W - 64, mh = CARD_H - 64, r = 28;
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(27, 42, 74, 0.08)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  roundRect(ctx, mx, my, mw, mh, r);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(27, 42, 74, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Draw specific block content
  ctx.save();
  ctx.translate(mx + 44, my + 44);
  const contentW = mw - 88;

  const cards = getCardData(domainIndex, blockIndex);
  renderCardContent(ctx, cards, contentW);
  ctx.restore();

  return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, curY);
  return curY + lineHeight;
}

function renderCardContent(ctx, card, w) {
  let y = 10;

  // Header tag: Number & Domain Tag
  ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(27, 42, 74, 0.4)';
  ctx.fillText(card.num, 0, y);

  ctx.fillStyle = '#ff5a2e'; // hazard/orange
  ctx.fillText(card.tag, 60, y);
  y += 42;

  // Main Title
  ctx.font = '700 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#1b2a4a';
  y = wrapText(ctx, card.title, 0, y, w, 48) - 10;

  // Subtitle
  if (card.subtitle) {
    ctx.font = '400 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(27, 42, 74, 0.65)';
    y = wrapText(ctx, card.subtitle, 0, y, w, 28) + 6;
  }

  // Divider
  ctx.strokeStyle = 'rgba(27, 42, 74, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(w, y);
  ctx.stroke();
  y += 34;

  // Hook (if present)
  if (card.hook) {
    ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ff5a2e';
    y = wrapText(ctx, card.hook, 0, y, w, 36) + 16;
  }

  // Sections
  if (card.sections) {
    for (const sec of card.sections) {
      if (sec.type === 'text') {
        ctx.font = '700 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = 'rgba(27, 42, 74, 0.5)';
        ctx.fillText(sec.title.toUpperCase(), 0, y);
        y += 28;

        ctx.font = '400 21px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#243356';
        y = wrapText(ctx, sec.content, 0, y, w, 30) + 14;
      } else if (sec.type === 'steps') {
        ctx.font = '700 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = 'rgba(27, 42, 74, 0.5)';
        ctx.fillText(sec.title.toUpperCase(), 0, y);
        y += 26;

        for (let i = 0; i < sec.items.length; i++) {
          const step = sec.items[i];
          // Yellow circular number
          ctx.save();
          ctx.fillStyle = '#ffb800';
          ctx.beginPath();
          ctx.arc(16, y - 6, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '700 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(i + 1), 16, y - 6);
          ctx.restore();

          // Step label
          ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillStyle = '#1b2a4a';
          ctx.fillText(step, 44, y);
          y += 38;
        }
        y += 10;
      } else if (sec.type === 'bullets') {
        ctx.font = '700 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = 'rgba(27, 42, 74, 0.5)';
        ctx.fillText(sec.title.toUpperCase(), 0, y);
        y += 26;

        for (const item of sec.items) {
          // Cyan dot
          ctx.fillStyle = '#00c4cc';
          ctx.beginPath();
          ctx.arc(10, y - 7, 5.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '400 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillStyle = '#243356';
          y = wrapText(ctx, item, 28, y, w - 28, 28) + 6;
        }
        y += 8;
      } else if (sec.type === 'badges') {
        ctx.font = '700 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = 'rgba(27, 42, 74, 0.5)';
        ctx.fillText(sec.title.toUpperCase(), 0, y);
        y += 28;

        let curX = 0;
        for (const badge of sec.items) {
          ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          const textW = ctx.measureText(badge).width;
          const bw = textW + 28, bh = 38;
          if (curX + bw > w) { curX = 0; y += 46; }

          ctx.fillStyle = '#38bdf8';
          roundRect(ctx, curX, y - 24, bw, bh, 19);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.fillText(badge, curX + 14, y);
          curX += bw + 14;
        }
        y += 44;
      } else if (sec.type === 'box') {
        ctx.font = '700 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = 'rgba(27, 42, 74, 0.5)';
        ctx.fillText(sec.title.toUpperCase(), 0, y);
        y += 18;

        const boxY = y;
        ctx.font = 'italic 500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        
        // Measure height first
        ctx.save();
        ctx.fillStyle = sec.bg || '#f1f5f9';
        const boxH = 90;
        roundRect(ctx, 0, boxY, w, boxH, 16);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = sec.color || '#1b2a4a';
        wrapText(ctx, sec.content, 20, boxY + 34, w - 40, 28);
        y += boxH + 20;
      } else if (sec.type === 'table') {
        ctx.font = '700 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = 'rgba(27, 42, 74, 0.5)';
        ctx.fillText(sec.title.toUpperCase(), 0, y);
        y += 24;

        for (const [label, score] of sec.rows) {
          ctx.font = '400 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillStyle = '#243356';
          ctx.fillText(label, 0, y);

          ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillStyle = '#1b2a4a';
          ctx.textAlign = 'right';
          ctx.fillText(String(score), w, y);
          ctx.textAlign = 'left';

          y += 34;
        }
        y += 8;
      }
    }
  }
}

function getCardData(domainIdx, blockIdx) {
  // Domain 0: GENERAL AI / GENAI (PS 3)
  // Domain 1: FINTECH / BFSI AI (PS 1)
  // Domain 2: BLOCKCHAIN × AI (PS-01A)
  // Domain 3: CYBERSECURITY & AI (PS 1)

  const DOMAIN_HEADERS = [
    { num: '03', tag: 'GENERAL AI / GENAI INNOVATION · PS 3' },
    { num: '02', tag: 'FINTECH / BFSI AI · PS 1' },
    { num: '04', tag: 'BLOCKCHAIN × AI · PS-01A' },
    { num: '01', tag: 'CYBERSECURITY & AI · PS 1' },
  ];

  const header = DOMAIN_HEADERS[domainIdx] || { num: '01', tag: 'AI HACKATHON' };

  if (domainIdx === 0) {
    // GENERAL AI / GENAI (PS 3)
    if (blockIdx === 0) {
      return {
        ...header,
        title: 'Trustworthy Digital Information Verification',
        subtitle: 'Claim verification for forwarded messages, screenshots, voice notes, PDFs & URLs',
        hook: 'You receive a message on WhatsApp. It sounds convincing. But is it actually true?',
        sections: [
          { type: 'text', title: 'The Problem', content: 'An accessible system that takes a forwarded WhatsApp message, screenshot, voice note, PDF or URL and verifies its claims against authoritative sources — explaining the result in plain, local-language terms instead of a binary true / false.' },
        ],
      };
    }
    if (blockIdx === 1) {
      return {
        ...header,
        title: 'Worked Example & Multi-Verdict',
        subtitle: 'Nuanced, evidence-based verification outcomes',
        sections: [
          { type: 'text', title: 'Worked Example', content: 'Verification outcomes are deliberately not binary: Verified · Contradicted · Partially supported · Outdated · Insufficient evidence.' },
          { type: 'badges', title: 'Verdict Categories', items: ['Verified', 'Contradicted', 'Partially Supported', 'Outdated', 'Insufficient Evidence'] },
        ],
      };
    }
    if (blockIdx === 2) {
      return {
        ...header,
        title: 'Verification Workflow',
        subtitle: 'From multimodal ingestion to uncertainty explanation',
        sections: [
          {
            type: 'steps',
            title: 'Workflow',
            items: [
              'Submit content (message, image, audio, PDF, URL)',
              'Extract verifiable claims',
              'Decide what needs verification',
              'Search authoritative sources & live indexes',
              'Retrieve evidence with source ranking',
              'Compare claim vs retrieved evidence',
              'Explain with references and confidence calibration',
            ],
          },
        ],
      };
    }
    if (blockIdx === 3) {
      return {
        ...header,
        title: 'Focus & Design Principles',
        subtitle: 'Grounded truth and hallucination prevention',
        sections: [
          {
            type: 'bullets',
            title: 'Core Principles',
            items: [
              'The model must not answer from its own internal knowledge.',
              'Important claims must be strictly grounded in retrieved evidence.',
              'Retrieved facts kept separate from AI-generated explanation.',
              'Multimodality: Speech-to-text, OCR, RAG, multilingual ranking, contradiction detection.',
            ],
          },
        ],
      };
    }
    return {
      ...header,
      title: 'Round 1 Judging Rubric',
      subtitle: 'Idea quality over polish (Total: 100%)',
      sections: [
        {
          type: 'table',
          title: 'Rubric Criteria',
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
    };
  }

  if (domainIdx === 1) {
    // FINTECH / BFSI AI (PS 1: Super App)
    if (blockIdx === 0) {
      return {
        ...header,
        title: 'Super App',
        subtitle: 'Unified multi-asset investing & awareness',
        hook: 'Every holding in one place — and a reason behind every number.',
        sections: [
          { type: 'text', title: 'The Problem', content: 'Retail investors\' holdings are fragmented across brokers and depositories with no consolidated view, and participation stays narrow (mostly equities) because alternates like REITs, InvITs and bonds are poorly understood.' },
        ],
      };
    }
    if (blockIdx === 1) {
      return {
        ...header,
        title: 'Worked Example & Scope',
        subtitle: 'Intelligent allocation gap detection and education',
        sections: [
          { type: 'text', title: 'Worked Example', content: 'A consolidated dashboard across linked accounts flags "0% fixed income" → plain-language education explains why that matters → a suitability check gates access before the user can actually invest in the new asset class.' },
          { type: 'text', title: 'MVP Scope', content: 'Mock import from 2–3 sources into one dashboard · allocation + gap-flag view · one interactive explainer module · suitability questionnaire gating a demo "invest" action.' },
        ],
      };
    }
    if (blockIdx === 2) {
      return {
        ...header,
        title: 'Unified Investment Workflow',
        subtitle: 'Account aggregation to multi-asset execution',
        sections: [
          {
            type: 'steps',
            title: 'Workflow',
            items: [
              'Investor accounts ingestion',
              'Account Aggregator / CAS / API ingestion',
              'Unified portfolio store',
              'Risk & exposure analytics',
              'Gap detector across asset classes',
              'Discovery & education layer',
              'Suitability / risk-profiling agent',
              'Multi-asset execution with consent trail',
            ],
          },
        ],
      };
    }
    if (blockIdx === 3) {
      return {
        ...header,
        title: 'Focus & Design Principles',
        subtitle: 'Consent-first, SEBI-aligned architecture',
        sections: [
          {
            type: 'bullets',
            title: 'Design Principles',
            items: [
              'Consent-first data access (Account Aggregator model).',
              'No dark patterns — education must precede any cross-sell.',
              'Alignment with SEBI\'s Unified Investor Platform direction.',
              'A one-line "why" behind every risk score.',
            ],
          },
        ],
      };
    }
    return {
      ...header,
      title: 'How Round 1 Is Judged',
      subtitle: 'Evaluation framework for FinTech',
      sections: [
        {
          type: 'bullets',
          title: 'Evaluation Points',
          items: [
            'Problem understanding & market depth in Indian retail finance.',
            'Architecture on paper: Account Aggregator, security & data models.',
            'Innovation, differentiation and seamless UX.',
            'Suitability guardrails & ethical execution audit trails.',
          ],
        },
      ],
    };
  }

  if (domainIdx === 2) {
    // BLOCKCHAIN × AI (PS-01A: Pay-and-Earn)
    if (blockIdx === 0) {
      return {
        ...header,
        title: 'Pay-and-Earn',
        subtitle: 'DeFi · Payments',
        hook: 'Can ordinary payments themselves generate returns?',
        sections: [
          { type: 'text', title: 'The Problem', content: 'Earning yield in DeFi needs active management and know-how, so money sits idle between payments. Design a payment system where eligible everyday transactions can earn potential returns, while staying transparent, secure, sustainable and simple to use.' },
        ],
      };
    }
    if (blockIdx === 1) {
      return {
        ...header,
        title: 'Format & Non-Negotiable Rule',
        subtitle: 'Rules of participation & safety constraints',
        sections: [
          { type: 'text', title: 'Format', content: 'Because this PS is judged online, submissions are evaluated as a recorded demo + repo + deck rather than a live on-site build. Every team must explain its reward / economic model in one slide.' },
          { type: 'box', title: 'Regulatory Rule', content: 'Non-negotiable: no design may promise or imply guaranteed financial returns.', bg: '#fef2f2', color: '#dc2626' },
        ],
      };
    }
    if (blockIdx === 2) {
      return {
        ...header,
        title: 'Smart Settlement Workflow',
        subtitle: 'Automated yield routing & transparent accounting',
        sections: [
          {
            type: 'steps',
            title: 'Workflow',
            items: [
              'Everyday payment initiation',
              'Eligibility & compliance check',
              'Auto-route eligible funds into audited yield strategies',
              'Smart-contract settlement on-chain',
              'Transparent accounting of rewards, fees and returns',
            ],
          },
        ],
      };
    }
    if (blockIdx === 3) {
      return {
        ...header,
        title: 'Focus & Design Principles',
        subtitle: 'Security, liquidity and transparency',
        sections: [
          {
            type: 'bullets',
            title: 'Design Principles',
            items: [
              'Blockchain payments with built-in incentives.',
              'Risk-aware design for different users and risk appetites.',
              'Do not mix up promotional rewards with real on-chain yield.',
              'Account for transaction costs, liquidity and contract security.',
            ],
          },
        ],
      };
    }
    return {
      ...header,
      title: 'How Round 1 Is Judged',
      subtitle: 'Evaluation framework for Blockchain × AI',
      sections: [
        {
          type: 'bullets',
          title: 'Key Criteria',
          items: [
            'Problem understanding & economic model transparency.',
            'Architecture on paper: Smart contract hygiene, AI routing, oracles.',
            'Innovation, sustainable yield mechanisms and risk management.',
            'Security audit awareness and gas optimization.',
          ],
        },
      ],
    };
  }

  // Domain 3: CYBERSECURITY & AI (PS 1: The Verified Fix)
  if (blockIdx === 0) {
    return {
      ...header,
      title: 'The Verified Fix',
      subtitle: 'Automated vulnerability detection and verified patching',
      hook: 'Fix the flaw — and prove you didn\'t break the feature.',
      sections: [
        { type: 'text', title: 'The Problem', content: 'Given a document portal with a suspected unauthorized-access flaw, build an AI-assisted system that reproduces the vulnerability as a failing test, locates the root cause, proposes a minimal patch, and verifies the patch fixes the security issue without breaking legitimate functionality.' },
        { type: 'text', title: 'Worked Example', content: 'Asha can download Ravi\'s private file (bad). A naive fix that blocks all downloads is equally bad — it also blocks Asha\'s own files. The correct patch must pass all four cases: own document (allow), other\'s private document (deny), explicitly shared document (allow), signed-out visitor (deny).' },
      ],
    };
  }
  if (blockIdx === 1) {
    return {
      ...header,
      title: 'Verified Fix Workflow',
      subtitle: 'From reproduction to verified patch verification',
      sections: [
        {
          type: 'steps',
          title: 'Workflow',
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
    };
  }
  if (blockIdx === 2) {
    return {
      ...header,
      title: 'Why It\'s Hard & Baselines',
      subtitle: 'Real-world automated penetration challenges',
      sections: [
        {
          type: 'bullets',
          title: 'Why It\'s Hard',
          items: [
            'Telling a real security finding from a scanner false-positive.',
            'Finding the root cause across multiple interconnected files.',
            'Producing a minimal fix instead of disabling the feature.',
            'Testing independently of the model that wrote the patch.',
          ],
        },
        { type: 'badges', title: 'Existing Baselines', items: ['GitHub Copilot Autofix', 'ATLANTIS (DARPA AIxCC)'] },
      ],
    };
  }
  if (blockIdx === 3) {
    return {
      ...header,
      title: 'Weak Pitch vs Strong Pitch',
      subtitle: 'Demonstrating verification over claims',
      sections: [
        { type: 'box', title: 'Weak Pitch', content: '"An LLM fixes the code."', bg: '#f1f5f9', color: '#64748b' },
        { type: 'box', title: 'Strong Pitch', content: '"A reproducing test establishes the failure; independent security and functional tests evaluate the correction."', bg: '#e0f7fa', color: '#00695c' },
      ],
    };
  }
  return {
    ...header,
    title: 'Round 1 Deck · 100 Marks',
    subtitle: 'Official evaluation scoring breakdown',
    sections: [
      {
        type: 'table',
        title: 'Judging Breakdown',
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
  };
}

const textureCache = new Map();

/**
 * Gets or creates a Three.js CanvasTexture for a specific domain slider and block index.
 */
export function getPsCardTexture(domainIndex, blockIndex) {
  const key = `${domainIndex}_${blockIndex}`;
  if (textureCache.has(key)) return textureCache.get(key);

  const canvas = drawCard(domainIndex, blockIndex);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;

  textureCache.set(key, texture);
  return texture;
}
