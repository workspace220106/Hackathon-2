const COMPACT_NAVBAR_MAX_WIDTH = 500;

export function isCompactNavbar() {
  return window.matchMedia(`(max-width: ${COMPACT_NAVBAR_MAX_WIDTH}px)`).matches
}
