export const LARGE_DESKTOP_MIN = 1600;

export const LARGE_DESKTOP_QUERY = `(max-width: ${LARGE_DESKTOP_MIN}px)`;

export function isLargeDesktop() {
  return !window.matchMedia(LARGE_DESKTOP_QUERY).matches
}
