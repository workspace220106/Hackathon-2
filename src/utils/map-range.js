export function mapRange(s, [e, t], [n, i]) {
  return n + (i - n) * ((s - e) / (t - e))
}
