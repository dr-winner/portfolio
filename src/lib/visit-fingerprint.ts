import { createHash } from "node:crypto";

const dayKey = () => new Date().toISOString().slice(0, 10);

/**
 * One-way daily visitor key from IP (never store raw IP in DB for analytics).
 */
export function visitKeyFromIp(ip: string, salt: string): string {
  if (!salt || salt.length < 16) {
    return createHash("sha256").update(`anon:${ip}:${dayKey()}`).digest("hex").slice(0, 32);
  }
  return createHash("sha256").update(`${salt}:${ip}:${dayKey()}`).digest("hex").slice(0, 32);
}

