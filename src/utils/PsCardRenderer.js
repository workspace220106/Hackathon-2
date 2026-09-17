import {
  TextureLoader,
  SRGBColorSpace,
  LinearFilter,
} from 'three';

const loader = new TextureLoader();

// Mapping of 4 Domains x 5 PS Slides strictly:
export const PS_CARD_TEXTURES = [
  // Domain 0: GENERAL AI / GENAI INNOVATION · PS 3 (Trustworthy Verification)
  [
    '/assets/medias/home/ps-cards/11_Trustworthy_Verification_Hook.webp',
    '/assets/medias/home/ps-cards/12_Trustworthy_Verification_Problem_Example.webp',
    '/assets/medias/home/ps-cards/13_Trustworthy_Verification_Workflow.webp',
    '/assets/medias/home/ps-cards/14_Trustworthy_Verification_Focus.webp',
    '/assets/medias/home/ps-cards/15_Trustworthy_Verification_Rubric.webp',
  ],
  // Domain 1: FINTECH / BFSI AI · PS 1 (Super App)
  [
    '/assets/medias/home/ps-cards/06_Super_App_Hook.webp',
    '/assets/medias/home/ps-cards/07_Super_App_Problem_Example_Judging.webp',
    '/assets/medias/home/ps-cards/08_Super_App_MVP_Focus.webp',
    '/assets/medias/home/ps-cards/09_Super_App_Workflow.webp',
    '/assets/medias/home/ps-cards/10_Super_App_Focus_Judging.webp',
  ],
  // Domain 2: BLOCKCHAIN × AI · PS-01A (Pay-and-Learn)
  [
    '/assets/medias/home/ps-cards/16_Pay_and_Learn_Hook.webp',
    '/assets/medias/home/ps-cards/17_Pay_and_Learn_Problem_Format.webp',
    '/assets/medias/home/ps-cards/18_Pay_and_Learn_Workflow.webp',
    '/assets/medias/home/ps-cards/19_Pay_and_Learn_Focus_Format.webp',
    '/assets/medias/home/ps-cards/20_Pay_and_Learn_Judging.webp',
  ],
  // Domain 3: CYBERSECURITY & AI · PS 1 (The Verified Fix)
  [
    '/assets/medias/home/ps-cards/01_The_Verified_Fix_Hook.webp',
    '/assets/medias/home/ps-cards/02_The_Verified_Fix_Problem_Example.webp',
    '/assets/medias/home/ps-cards/03_The_Verified_Fix_Workflow_Hard.webp',
    '/assets/medias/home/ps-cards/04_The_Verified_Fix_Pitch_Baselines.webp',
    '/assets/medias/home/ps-cards/05_The_Verified_Fix_Round1_Deck.webp',
  ],
];

const textureCache = new Map();

export function getPsCardTexture(domainIndex, blockIndex) {
  const key = `${domainIndex}_${blockIndex}`;
  if (textureCache.has(key)) return textureCache.get(key);

  const domainCards = PS_CARD_TEXTURES[domainIndex] || PS_CARD_TEXTURES[0];
  const url = domainCards[blockIndex % domainCards.length] || domainCards[0];

  const texture = loader.load(url, () => {
    texture.needsUpdate = true;
  });
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = false;

  textureCache.set(key, texture);
  return texture;
}
