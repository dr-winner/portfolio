/**
 * Edge-safe session cookie. The signature proves the cookie was issued here.
 * Revocation is checked in the database by requireAdmin(), not in middleware.
 */

export const COOKIE_NAMES = ["__Host-rw.session", "rw_session"] as const;

const ABSOLUTE_MS = 1000 * 60 * 60 * 12;

export type SessionClaims = {
  sid: string;
  exp: number;
};

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("Session signing is not configured.");
  return value;
}

function b64urlFromBytes(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlFromString(value: string): string {
  return b64urlFromBytes(new TextEncoder().encode(value));
}

function b64urlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", new TextEncoder().encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}

function timingSafeEq(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) return false;
  let diff = 0;
  for (let i = 0; i < a.byteLength; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function signSession(claims: SessionClaims): Promise<string> {
  const key = await hmacKey();
  const payload = b64urlFromString(JSON.stringify(claims));
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
  return `${payload}.${b64urlFromBytes(sig)}`;
}

export async function verifySession(token: string | undefined | null): Promise<SessionClaims | null> {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  try {
    const key = await hmacKey();
    const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
    if (!timingSafeEq(b64urlToBytes(sig), expected)) return null;
    const json = JSON.parse(new TextDecoder().decode(b64urlToBytes(payload))) as SessionClaims;
    if (typeof json.sid !== "string" || typeof json.exp !== "number" || json.exp < Date.now()) return null;
    return json;
  } catch {
    return null;
  }
}

export function absoluteExpiry(now = Date.now()) {
  return now + ABSOLUTE_MS;
}

export function readSessionCookie(get: (name: string) => string | undefined): string | undefined {
  for (const name of COOKIE_NAMES) {
    const value = get(name);
    if (value) return value;
  }
  return undefined;
}
