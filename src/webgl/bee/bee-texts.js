import {
  playgroundData
} from '../../data/playground.js';

const contentBeeTexts = playgroundData.contentBee ?? {};

const BEE_IDLE_TEXTS = contentBeeTexts.idle ?? [];

const BEE_HOVER_TEXTS = contentBeeTexts.hover ?? [];

const BEE_CONVERSATIONS = contentBeeTexts.conversation ?? [];

export const BEE_TEXT_A = .4;

export const BEE_TEXT_B = 2.5;

export const BEE_TEXT_C = 2;

export const BEE_TEXT_D = 4;

export const BEE_TEXT_E = 300;

export const FRUIT_SOUND_2 = "fruit2";

export const FRUIT_SOUND_1 = "fruit1";

function pickRandomExcept(s, e, t) {
  const n = e ? s.filter(i => i !== e) : s;
  return n.length ? n[Math.floor(Math.random() * n.length)] : t ?? s[0] ?? ""
}

export function randomIdleText(s = null) {
  return pickRandomExcept(BEE_IDLE_TEXTS, s, BEE_IDLE_TEXTS[0])
}

export function randomHoverText(s = null) {
  return pickRandomExcept(BEE_HOVER_TEXTS, s, BEE_HOVER_TEXTS[0])
}

export function randomConversation(s = null) {
  const e = s ? BEE_CONVERSATIONS.filter(t => t.id !== s) : BEE_CONVERSATIONS;
  return e.length ? e[Math.floor(Math.random() * e.length)] : BEE_CONVERSATIONS[0] ?? {
    id: "fallback",
    lines: ["Bzzzzz."]
  }
}
