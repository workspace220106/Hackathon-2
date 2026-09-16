export const HERO_TRANSITIONS = {
  INITIAL_LOAD: {
    duration: 2.5,
    ease: "expo.inOut",
    from: .65
  },
  PAGE_TRANSITION: {
    duration: 2,
    ease: "expo.out",
    from: 0
  }
};

export function nonZero(s) {
  return s <= 0 ? .001 : s
}
