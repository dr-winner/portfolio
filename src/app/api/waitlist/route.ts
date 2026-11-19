import { NextRequest, NextResponse } from "next/server";
import { addWaitlistEntry, getWaitlistCount } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateSubmission(body: unknown): { error?: string; data?: { email: string; name?: string; role?: string; focus?: "appsec" | "ai_security" | "both"; note?: string } } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request payload." };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.email !== "string" || !EMAIL_REGEX.test(b.email.trim())) {
    return { error: "Please provide a valid email address." };
  }

  const email = b.email.trim();
  const name = typeof b.name === "string" && b.name.trim() ? b.name.trim().slice(0, 100) : undefined;
  const role = typeof b.role === "string" && b.role.trim() ? b.role.trim().slice(0, 100) : undefined;
  const focus = b.focus === "appsec" || b.focus === "ai_security" || b.focus === "both" ? b.focus : "both";
  const note = typeof b.note === "string" && b.note.trim() ? b.note.trim().slice(0, 500) : undefined;

  return { data: { email, name, role, focus, note } };
}

export async function GET() {
  try {
    const count = await getWaitlistCount();
    return NextResponse.json({ count });
  } catch (err) {
    console.error("Waitlist GET error:", err);
    return NextResponse.json({ count: 24 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = validateSubmission(body);

    if (validated.error || !validated.data) {
      return NextResponse.json({ error: validated.error ?? "Invalid form input." }, { status: 400 });
    }

    const result = await addWaitlistEntry(validated.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Waitlist POST error:", err);
    return NextResponse.json({ error: "Unable to process application. Please reach out directly." }, { status: 500 });
  }
}
