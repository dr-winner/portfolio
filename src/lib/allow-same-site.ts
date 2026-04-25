import type { NextRequest } from "next/server";

/**
 * Reject cross-origin browser POSTs to public APIs. Allows missing Origin (curl, server-side).
 */
export function assertSameOriginOrMissing(req: NextRequest): boolean {
  if (process.env.NODE_ENV === "development") {
    // Local dev: various ports / tunnel tools
    return true;
  }
  const host = req.headers.get("host");
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function sameOriginForRequestLike(req: Request): boolean {
  if (process.env.NODE_ENV === "development") return true;
  const host = req.headers.get("host");
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
