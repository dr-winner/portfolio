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

/**
 * Durable variant: shared across serverless instances via a Postgres bucket
 * row (single atomic upsert). The in-memory check runs first as a cheap
 * short-circuit; if the DB is unreachable the in-memory verdict stands, so
 * this never takes an endpoint down. Node runtime only (Prisma).
 */
export async function checkRateLimitDurable(
  key: string,
  max: number,
  windowMs: number
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  const local = checkRateLimit(key, max, windowMs);
  if (!local.ok) return local;

  try {
    const { prisma } = await import("@/lib/prisma");
    const resetAt = new Date(Date.now() + windowMs);
    const rows = await prisma.$queryRaw<{ count: number; resetAt: Date }[]>`
      INSERT INTO "RateLimitBucket" ("key", "count", "resetAt")
      VALUES (${key}, 1, ${resetAt})
      ON CONFLICT ("key") DO UPDATE SET
        "count"   = CASE WHEN "RateLimitBucket"."resetAt" < now() THEN 1 ELSE "RateLimitBucket"."count" + 1 END,
        "resetAt" = CASE WHEN "RateLimitBucket"."resetAt" < now() THEN ${resetAt} ELSE "RateLimitBucket"."resetAt" END
      RETURNING "count", "resetAt"
    `;
    const row = rows[0];
    if (row && row.count > max) {
      return {
        ok: false,
        retryAfterSec: Math.max(1, Math.ceil((row.resetAt.getTime() - Date.now()) / 1000)),
      };
    }
  } catch {
    // DB down or provider without the table — in-memory verdict already passed.
  }
  return { ok: true };
}
