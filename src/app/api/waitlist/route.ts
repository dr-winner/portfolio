import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertSameOriginOrMissing } from "@/lib/allow-same-site";
import { checkRateLimitDurable, clientIpFromHeaders } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";


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
    const { email, name, website } = await req.json();

    // Honeypot fields are hidden from people but commonly filled by bots.
    // Return a generic success response so automated clients cannot tune around it.
    if (typeof website === "string" && website.trim()) {
      return NextResponse.json({ ok: true });
    }

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
