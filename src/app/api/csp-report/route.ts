import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimitDurable, clientIpFromHeaders } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limit = await checkRateLimitDurable(`csp:${clientIpFromHeaders(req.headers)}`, 30, 60_000);
  if (!limit.ok) return new NextResponse(null, { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } });

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const reports = Array.isArray(payload) ? payload : [payload];
  for (const item of reports.slice(0, 5)) {
    const body = (item as { body?: Record<string, string> }).body ?? (item as Record<string, string>);
    const directive = String(body["effective-directive"] ?? body["violated-directive"] ?? "").slice(0, 80);
    if (!directive) continue;
    let blockedHost = "";
    try {
      blockedHost = new URL(String(body["blocked-uri"] ?? "")).host.slice(0, 120);
    } catch {
      blockedHost = "";
    }
    let documentPath = "";
    try {
      documentPath = new URL(String(body["document-uri"] ?? "")).pathname.slice(0, 160);
    } catch {
      documentPath = "";
    }
    await prisma.cspReport.create({ data: { directive, blockedHost, documentPath } }).catch(() => undefined);
  }

  await prisma.cspReport.deleteMany({ where: { at: { lt: new Date(Date.now() - 30 * 86_400_000) } } }).catch(() => undefined);
  return new NextResponse(null, { status: 204 });
}
