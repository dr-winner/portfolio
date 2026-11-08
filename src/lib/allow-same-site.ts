import type { NextRequest } from "next/server";

/**
 * Reject cross-origin browser POSTs to public APIs. Allows missing Origin (curl, server-side).
 */
export function assertSameOriginOrMissing(req: NextRequest): boolean {
  const host = req.headers.get("host");
  const origin = req.headers.get("origin");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function sameOriginForRequestLike(req: Request): boolean {
  const host = req.headers.get("host");
  const origin = req.headers.get("origin");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
