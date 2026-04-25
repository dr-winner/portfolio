type Bucket = { c: number; reset: number };
const store = new Map<string, Bucket>();
const PRUNE = 5 * 60 * 1000;
let lastPrune = 0;

function prune(now: number) {
  if (now - lastPrune < PRUNE) return;
  lastPrune = now;
  for (const [k, b] of store) {
    if (now > b.reset) store.delete(k);
  }
}

/**
 * In-process sliding window. Best on a single long-lived node; for multi-region use Redis/Upstash.
 * Still caps abuse per instance and pairs with WAF at the edge in production.
 */
export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  prune(now);
  let b = store.get(key);
  if (!b || now > b.reset) {
    b = { c: 0, reset: now + windowMs };
    store.set(key, b);
  }
  b.c += 1;
  if (b.c > max) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((b.reset - now) / 1000)) };
  }
  return { ok: true };
}

export function clientIpFromHeaders(h: Headers): string {
  const xff = h.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return h.get("x-real-ip") || "0";
}
