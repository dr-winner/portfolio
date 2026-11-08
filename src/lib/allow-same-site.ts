import type { NextRequest } from "next/server";

/**
 * Origin allowlist for public POST endpoints.
 * A browser call is accepted only when Origin is present and its host matches
 * the request Host (this deployment, including preview and local), or when
 * the full origin is listed in ALLOWED_ORIGINS. Missing Origin is rejected.
 */
export function originAllowed(headers: Headers): boolean {
  const host = headers.get("host");
  const origin = headers.get("origin");
  if (!origin || !host) return false;
  let parsed: URL;
  try {
    parsed = new URL(origin);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
  if (parsed.host === host) return true;
  const extra = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return extra.includes(origin);
}

export function assertSameOriginOrMissing(req: NextRequest): boolean {
  return originAllowed(req.headers);
}

export function sameOriginForRequestLike(req: Request): boolean {
  return originAllowed(req.headers);
}
