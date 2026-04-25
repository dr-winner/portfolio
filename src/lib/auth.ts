/**
 * Edge-compatible auth helpers (Web Crypto API only — no node:crypto).
 * Used from both middleware (Edge runtime) and server actions (Node runtime).
 */
import { cookies } from "next/headers";

export const COOKIE_NAME = "rw_admin";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("Session signing is not configured.");
  }
  return s;
}

function b64urlFromBytes(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlFromString(s: string): string {
  return b64urlFromBytes(new TextEncoder().encode(s));
}

function b64urlToBytes(s: string): Uint8Array {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function timingSafeEq(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) return false;
  let diff = 0;
  for (let i = 0; i < a.byteLength; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export type Session = {
  sub: string;
  exp: number;
};

export async function signSession(session: Session): Promise<string> {
  const key = await hmacKey(getSecret());
  const payload = b64urlFromString(JSON.stringify(session));
  const sig = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
  );
  return `${payload}.${b64urlFromBytes(sig)}`;
}

export async function verifySession(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const key = await hmacKey(getSecret());
  const expected = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
  );
  const given = b64urlToBytes(sig);
  if (!timingSafeEq(given, expected)) return null;

  try {
    const json = JSON.parse(new TextDecoder().decode(b64urlToBytes(payload))) as Session;
    if (typeof json.exp !== "number" || json.exp < Date.now()) return null;
    return json;
  } catch {
    return null;
  }
}

export async function setSessionCookie(username: string) {
  const session: Session = { sub: username, exp: Date.now() + SESSION_DURATION_MS };
  const value = await signSession(session);
  const jar = await cookies();
  jar.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getCurrentSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  return verifySession(token);
}

export async function requireSession(): Promise<Session> {
  const s = await getCurrentSession();
  if (!s) throw new Error("Unauthorized");
  return s;
}
