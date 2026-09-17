import {
  CanvasTexture,
  LinearFilter,
  SRGBColorSpace,
} from 'three';

const CARD_W = 1024;
const CARD_H = 1365;

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
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, curY);
  return curY + lineHeight;
}

function drawCard(domainIndex, blockIndex) {
  const canvas = document.createElement('canvas');
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Background behind card
  ctx.fillStyle = '#f1f3f9';
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Main Card Container (White with rounded corners & clean border)
  const mx = 28, my = 28, mw = CARD_W - 56, mh = CARD_H - 56, r = 26;
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(27, 42, 74, 0.08)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 10;
  roundRect(ctx, mx, my, mw, mh, r);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(27, 42, 74, 0.14)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Content Area
  ctx.save();
  const padX = mx + 48;
  const padY = my + 48;
  const contentW = mw - 96;
  ctx.translate(padX, padY);

  const data = getCardData(domainIndex, blockIndex);
  renderDataToCanvas(ctx, data, contentW, mh - 96);
  ctx.restore();

  return canvas;
}

function renderDataToCanvas(ctx, card, w, maxH) {
  let y = 10;

  // Top domain tag & block number
  ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(27, 42, 74, 0.45)';
  ctx.fillText(card.num, 0, y);

  ctx.fillStyle = '#ff5a2e'; // hazard orange
  ctx.fillText(card.tag, 54, y);
  y += 44;

  // Title
  ctx.font = '700 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#1b2a4a';
  y = wrapText(ctx, card.title, 0, y, w, 52) + 2;

  // Subtitle
  if (card.subtitle) {
    ctx.font = '400 23px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(27, 42, 74, 0.65)';
    y = wrapText(ctx, card.subtitle, 0, y, w, 32) + 12;
  }

  // Divider line
  ctx.strokeStyle = 'rgba(27, 42, 74, 0.1)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(w, y);
  ctx.stroke();
  y += 36;

  // Hook quote box (if present)
  if (card.hook) {
    ctx.save();
    ctx.font = '600 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = 'rgba(255, 90, 46, 0.08)';
    roundRect(ctx, 0, y - 6, w, 92, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 90, 46, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ea580c';
    wrapText(ctx, card.hook, 20, y + 34, w - 40, 34);
    ctx.restore();
    y += 114;
  }

  // Render Sections
  if (card.sections) {
    for (const sec of card.sections) {
      if (sec.type === 'text') {
        ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = 'rgba(27, 42, 74, 0.55)';
        ctx.fillText(sec.label.toUpperCase(), 0, y);
        y += 30;

        ctx.font = '400 23px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#243356';
        y = wrapText(ctx, sec.body, 0, y, w, 35) + 24;
      } else if (sec.type === 'steps') {
        ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = 'rgba(27, 42, 74, 0.55)';
        ctx.fillText(sec.label.toUpperCase(), 0, y);
        y += 30;

        for (let i = 0; i < sec.items.length; i++) {
          const step = sec.items[i];
          // Yellow Badge
          ctx.save();
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(18, y - 6, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '700 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(i + 1), 18, y - 6);
          ctx.restore();

          // Step Text
          ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillStyle = '#1b2a4a';
          y = wrapText(ctx, step, 48, y, w - 48, 30) + 12;
        }
        y += 12;
      } else if (sec.type === 'bullets') {
        ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = 'rgba(27, 42, 74, 0.55)';
        ctx.fillText(sec.label.toUpperCase(), 0, y);
        y += 30;

        for (const item of sec.items) {
          // Cyan dot
          ctx.fillStyle = '#00c4cc';
          ctx.beginPath();
          ctx.arc(10, y - 8, 7, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '400 23px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillStyle = '#243356';
          y = wrapText(ctx, item, 32, y, w - 32, 34) + 14;
        }
        y += 12;
      } else if (sec.type === 'badges') {
        ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = 'rgba(27, 42, 74, 0.55)';
        ctx.fillText(sec.label.toUpperCase(), 0, y);
        y += 32;

        let curX = 0;
        for (const badge of sec.items) {
          ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          const textW = ctx.measureText(badge).width;
          const bw = textW + 32, bh = 44;
          if (curX + bw > w) { curX = 0; y += 56; }

          ctx.fillStyle = '#e0f2fe';
          roundRect(ctx, curX, y - 28, bw, bh, 22);
          ctx.fill();
          ctx.strokeStyle = '#bae6fd';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#0369a1';
          ctx.fillText(badge, curX + 16, y);
          curX += bw + 14;
        }
        y += 54;
      } else if (sec.type === 'pitch') {
        // Weak Pitch Box
        ctx.font = '700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = 'rgba(27, 42, 74, 0.5)';
        ctx.fillText('WEAK PITCH', 0, y);
        y += 24;

        ctx.save();
        ctx.fillStyle = '#f8fafc';
        roundRect(ctx, 0, y - 6, w, 84, 14);
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.stroke();
        ctx.font = 'italic 500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#64748b';
        wrapText(ctx, sec.weak, 20, y + 32, w - 40, 28);
        ctx.restore();
        y += 114;

        // Strong Pitch Box
        ctx.font = '700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = 'rgba(27, 42, 74, 0.5)';
        ctx.fillText('STRONG PITCH', 0, y);
        y += 24;

        ctx.save();
        ctx.fillStyle = '#e6fffa';
        roundRect(ctx, 0, y - 6, w, 110, 14);
        ctx.fill();
        ctx.strokeStyle = '#b2f5ea';
        ctx.stroke();
        ctx.font = 'italic 600 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#0d9488';
        wrapText(ctx, sec.strong, 20, y + 34, w - 40, 32);
        ctx.restore();
        y += 136;
      } else if (sec.type === 'warning') {
        ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = 'rgba(27, 42, 74, 0.55)';
        ctx.fillText(sec.label.toUpperCase(), 0, y);
        y += 28;

        ctx.save();
        ctx.fillStyle = '#fef2f2';
        roundRect(ctx, 0, y - 6, w, 100, 14);
        ctx.fill();
        ctx.strokeStyle = '#fca5a5';
        ctx.stroke();

        ctx.font = '600 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#b91c1c';
        wrapText(ctx, sec.body, 20, y + 34, w - 40, 32);
        ctx.restore();
        y += 126;
      } else if (sec.type === 'table') {
        ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = 'rgba(27, 42, 74, 0.55)';
        ctx.fillText(sec.label.toUpperCase(), 0, y);
        y += 28;

        for (const [crit, score] of sec.rows) {
          ctx.font = '400 23px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillStyle = '#1e293b';
          ctx.fillText(crit, 0, y);

          ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillStyle = '#ff5a2e';
          ctx.textAlign = 'right';
          ctx.fillText(String(score), w, y);
          ctx.textAlign = 'left';

          ctx.strokeStyle = 'rgba(27, 42, 74, 0.07)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, y + 10);
          ctx.lineTo(w, y + 10);
          ctx.stroke();

          y += 44;
        }
        y += 12;
      }
    }
  }

  // Subtle bottom footer line on card
  ctx.save();
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = 'rgba(27, 42, 74, 0.35)';
  ctx.fillText('AI EXPO HACKATHON · ROUND 1 IDEA SPRINT', 0, maxH - 12);
  ctx.restore();
}

function getCardData(domainIdx, blockIdx) {
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
        title: 'Trustworthy Digital Info Verification',
        subtitle: 'Claim verification for forwarded messages, screenshots, voice notes, PDFs & URLs',
        hook: 'You receive a message on WhatsApp. It sounds convincing. But is it actually true?',
        sections: [
          { type: 'text', label: 'The Problem', body: 'An accessible system that takes a forwarded WhatsApp message, screenshot, voice note, PDF or URL and verifies its claims against authoritative sources — explaining the result in plain, local-language terms instead of a binary true / false.' },
          { type: 'text', label: 'Worked Example', body: 'A viral message forwarding an alleged government circular is analyzed: claims are extracted, cross-referenced with gazette repositories, and labeled with uncertainty metrics and source citations.' },
        ],
      };
    }
    if (blockIdx === 1) {
      return {
        ...header,
        title: '5 Multi-Verdict Categories',
        subtitle: 'Nuanced, evidence-based fact verification taxonomy',
        sections: [
          { type: 'badges', label: 'Standard Verdict Outcomes', items: ['Verified', 'Contradicted', 'Partially Supported', 'Outdated', 'Insufficient Evidence'] },
          { type: 'text', label: 'Grounding Guarantee', body: 'Important claims must be strictly grounded in retrieved evidence. Retrieved facts are systematically kept separate from AI-generated explanations to eliminate hallucinations and biased synthesis.' },
        ],
      };
    }
    if (blockIdx === 2) {
      return {
        ...header,
        title: 'Verification Architecture',
        subtitle: '7-Step multimodal reasoning pipeline',
        sections: [
          {
            type: 'steps',
            label: 'Processing Pipeline',
            items: [
              'Submit content (message, image, audio, PDF, URL)',
              'Extract verifiable claims via multimodal parsing',
              'Decide what needs verification vs opinion filtering',
              'Search authoritative sources & live indexes',
              'Retrieve evidence with dense cross-encoder ranking',
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
            label: 'Core Guardrails',
            items: [
              'The model must not answer from its own internal knowledge.',
              'Important claims must be strictly grounded in retrieved evidence.',
              'Retrieved facts kept separate from AI-generated explanation.',
              'Speech-to-text, multilingual LLMs, RAG, trusted-source ranking, contradiction detection.',
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
    };
  }

  if (domainIdx === 1) {
    // FINTECH / BFSI AI (PS 1: Super App)
    if (blockIdx === 0) {
      return {
        ...header,
        title: 'Super App: Multi-Asset Investing',
        subtitle: 'Unified multi-asset investing & investor awareness',
        hook: 'Every holding in one place — and a reason behind every number.',
        sections: [
          { type: 'text', label: 'The Problem', body: 'Retail investors\' holdings are fragmented across brokers and depositories with no consolidated view, and participation stays narrow (mostly equities) because alternates like REITs, InvITs and bonds are poorly understood.' },
        ],
      };
    }
    if (blockIdx === 1) {
      return {
        ...header,
        title: 'Worked Example & MVP Scope',
        subtitle: 'Intelligent allocation gap detection and education',
        sections: [
          { type: 'text', label: 'Worked Example', body: 'A consolidated dashboard across linked accounts flags "0% fixed income" → plain-language education explains why that matters → a suitability check gates access before the user can actually invest in the new asset class.' },
          { type: 'text', label: 'MVP Scope', body: 'Mock import from 2–3 sources into one dashboard · allocation + gap-flag view · one interactive explainer module · suitability questionnaire gating a demo "invest" action.' },
        ],
      };
    }
    if (blockIdx === 2) {
      return {
        ...header,
        title: 'Unified Investment Workflow',
        subtitle: 'From Account Aggregator consent to execution',
        sections: [
          {
            type: 'steps',
            label: '8-Step Multi-Asset Pipeline',
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
            label: 'Design Principles',
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
          label: 'Key Evaluation Points',
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
        title: 'Pay-and-Earn: DeFi Payments',
        subtitle: 'Making everyday payments generate sustainable returns',
        hook: 'Can ordinary payments themselves generate returns?',
        sections: [
          { type: 'text', label: 'The Problem', body: 'Earning yield in DeFi needs active management and know-how, so money sits idle between payments. Design a payment system where eligible everyday transactions can earn potential returns, while staying transparent, secure, sustainable and simple to use.' },
        ],
      };
    }
    if (blockIdx === 1) {
      return {
        ...header,
        title: 'Format & Non-Negotiable Rule',
        subtitle: 'Rules of participation & safety constraints',
        sections: [
          { type: 'text', label: 'Submission Format', body: 'Because this PS is judged online, submissions are evaluated as a recorded demo + repo + deck rather than a live on-site build. Every team must explain its reward / economic model in one slide.' },
          { type: 'warning', label: 'Mandatory Rule', body: 'Non-negotiable: no design may promise or imply guaranteed financial returns. Real yield must be clearly separated from promotional incentives.' },
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
            label: 'Design Principles',
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
          label: 'Key Criteria',
          items: [
            'Problem understanding & economic model transparency.',
            'Architecture on paper: Smart contracts, AI routing, oracles.',
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
        { type: 'text', label: 'The Problem', body: 'Given a document portal with a suspected unauthorized-access flaw, build an AI-assisted system that reproduces the vulnerability as a failing test, locates the root cause, proposes a minimal patch, and verifies the patch fixes the security issue without breaking legitimate functionality.' },
        { type: 'text', label: 'Worked Example', body: 'Asha can download Ravi\'s private file (bad). A naive fix that blocks all downloads is equally bad — it also blocks Asha\'s own files. The correct patch must pass all four cases: own document (allow), other\'s private document (deny), explicitly shared document (allow), signed-out visitor (deny).' },
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
          label: 'Why It\'s Hard',
          items: [
            'Telling a real security finding from a scanner false-positive.',
            'Finding the root cause across multiple interconnected files.',
            'Producing a minimal fix instead of disabling the feature.',
            'Testing independently of the model that wrote the patch.',
          ],
        },
        { type: 'badges', label: 'Existing Baselines', items: ['GitHub Copilot Autofix', 'ATLANTIS (DARPA AIxCC)'] },
      ],
    };
  }
  if (blockIdx === 3) {
    return {
      ...header,
      title: 'Weak Pitch vs Strong Pitch',
      subtitle: 'Demonstrating verification over claims',
      sections: [
        {
          type: 'pitch',
          weak: '"An LLM fixes the code."',
          strong: '"A reproducing test establishes the failure; independent security and functional tests evaluate the correction."',
        },
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
        label: 'Judging Breakdown',
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
