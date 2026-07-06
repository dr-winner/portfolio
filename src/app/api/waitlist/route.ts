import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertSameOriginOrMissing } from "@/lib/allow-same-site";
import { checkRateLimitDurable, clientIpFromHeaders } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await prisma.waitlistEntry.count();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

export async function POST(req: NextRequest) {
  if (!assertSameOriginOrMissing(req)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const ip = clientIpFromHeaders(req.headers);
  const rl = await checkRateLimitDurable(`wl:${ip}`, 5, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  try {
    const { email, name } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(trimmed)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    await prisma.waitlistEntry.create({
      data: {
        email: trimmed.slice(0, 254),
        name: typeof name === "string" ? name.trim().slice(0, 100) || null : null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "You're already on the waitlist!" }, { status: 409 });
    }
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
