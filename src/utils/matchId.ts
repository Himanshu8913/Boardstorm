/** Creates a match id with a safe fallback when crypto.randomUUID is unavailable. */
export function createMatchId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `match-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
