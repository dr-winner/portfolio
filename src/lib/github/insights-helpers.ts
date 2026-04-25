/** Consecutive days with ≥1 contribution ending today (UTC). */
export function currentStreakUtc(
  byDate: Map<string, number>,
  today = new Date()
): number {
  let run = 0;
  for (let i = 0; i < 500; i += 1) {
    const t = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i)
    );
    const k = t.toISOString().slice(0, 10);
    if ((byDate.get(k) ?? 0) > 0) run += 1;
    else break;
  }
  return run;
}

/**
 * Longest run of consecutive UTC days in [from, to] with ≥1 contribution.
 * Days missing in `byDate` count as 0.
 */
export function longestStreakInRange(
  byDate: Map<string, number>,
  from: Date,
  to: Date
): number {
  let best = 0;
  let run = 0;
  for (const d = new Date(from.getTime()); d <= to; d.setUTCDate(d.getUTCDate() + 1)) {
    const k = d.toISOString().slice(0, 10);
    if ((byDate.get(k) ?? 0) > 0) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
  }
  return best;
}

export function levelForCount(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count < 1 || max < 1) return 0;
  const t = count / max;
  if (t <= 0.25) return 1;
  if (t <= 0.5) return 2;
  if (t <= 0.75) return 3;
  return 4;
}
