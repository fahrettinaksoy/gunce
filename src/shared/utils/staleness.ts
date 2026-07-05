export function isOlderThan(timestamp: number | null, thresholdMs: number): boolean {
  if (!timestamp) return false;
  return Date.now() - timestamp > thresholdMs;
}
