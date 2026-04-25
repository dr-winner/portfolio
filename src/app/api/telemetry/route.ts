import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertSameOriginOrMissing } from "@/lib/allow-same-site";
import { checkRateLimit, clientIpFromHeaders } from "@/lib/rate-limit";
import { deviceClass, uaFromHeaders } from "@/lib/ua-hints";
import { visitKeyFromIp } from "@/lib/visit-fingerprint";

export const dynamic = "force-dynamic";

const NAME_RE = /^[a-z0-9_]{1,48}$/;

function countryFromRequest(req: NextRequest): string {
  return (req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "").slice(0, 4);
}

/**
 * Vercel / Cloudflare may expose city on paid plans — keep field empty if absent.
 */
function refererT(r: string | null): string {
  if (!r) return "";
  try {
    const u = new URL(r);
    return `${u.host}${u.pathname}`.slice(0, 200);
  } catch {
    return r.slice(0, 200);
  }
}

export async function POST(req: NextRequest) {
  if (!assertSameOriginOrMissing(req)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const ip = clientIpFromHeaders(req.headers);
  const rl = checkRateLimit(`tel:${ip}`, 120, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ ok: false }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } });
  }

  let body: { name?: string; path?: string; sessionId?: string; meta?: Record<string, unknown> };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const name = String(body.name ?? "");
  if (!NAME_RE.test(name)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const path = String(body.path ?? "/").replace(/\s+/g, " ").slice(0, 300) || "/";
  const sessionId = String(body.sessionId ?? "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
  if (sessionId.length < 4) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const salt = process.env.ANALYTICS_SALT || process.env.SESSION_SECRET || "dev-only-salt";
  const visitKey = visitKeyFromIp(ip, salt);
  const ua = uaFromHeaders(req.headers);
  const { device, browser } = deviceClass(ua);
  const country = countryFromRequest(req);
  const ref = refererT(req.headers.get("referer"));

  let meta = "{}";
  try {
    meta = JSON.stringify(body.meta && typeof body.meta === "object" ? body.meta : {});
    if (meta.length > 2000) meta = "{}";
  } catch {
    meta = "{}";
  }

  try {
    await prisma.analyticsEvent.create({
      data: {
        name,
        path,
        sessionId,
        visitKey,
        device,
        browser,
        country,
        referer: ref,
        meta,
      },
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
