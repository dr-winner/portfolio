import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

function hash(value: string) {
  const salt = process.env.ANALYTICS_SALT || process.env.SESSION_SECRET || "";
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256").update(`${salt}:${day}:${value}`).digest("hex").slice(0, 24);
}

export async function audit(entry: {
  actor: string;
  action: string;
  entity?: string;
  entityId?: string;
  summary?: string;
  sessionId?: string;
}) {
  try {
    const h = await headers();
    const ip = h.get("x-real-ip") || h.get("x-vercel-forwarded-for") || "";
    await prisma.auditLog.create({
      data: {
        actor: entry.actor,
        action: entry.action,
        entity: entry.entity ?? "",
        entityId: entry.entityId ?? "",
        summary: (entry.summary ?? "").slice(0, 240),
        ipHash: ip ? hash(ip) : "",
        uaHash: hash(h.get("user-agent") ?? ""),
        sessionId: entry.sessionId ?? "",
      },
    });
  } catch {
    // A failed audit row must not block the change itself.
  }
}
