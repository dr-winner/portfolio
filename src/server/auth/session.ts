import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { absoluteExpiry, readSessionCookie, signSession, verifySession } from "@/lib/session-token";

const IDLE_MS = 1000 * 60 * 60 * 2;
const ABSOLUTE_SEC = 60 * 60 * 12;

export type AdminPrincipal = {
  sid: string;
  actor: string;
};

function cookieName(secure: boolean) {
  return secure ? "__Host-rw.session" : "rw_session";
}

async function requestIsSecure() {
  const proto = (await headers()).get("x-forwarded-proto") ?? "";
  return proto === "https";
}

export async function openSession(actor: string) {
  const sid = randomBytes(32).toString("hex");
  const now = new Date();
  const h = await headers();
  await prisma.adminSession.create({
    data: {
      id: sid,
      actor,
      expiresAt: new Date(absoluteExpiry(now.getTime())),
      idleAt: new Date(now.getTime() + IDLE_MS),
      country: (h.get("x-vercel-ip-country") ?? "").slice(0, 4),
      uaHash: createHash("sha256").update(h.get("user-agent") ?? "").digest("hex").slice(0, 16),
    },
  });
  const secure = await requestIsSecure();
  const token = await signSession({ sid, exp: now.getTime() + ABSOLUTE_SEC * 1000 });
  const jar = await cookies();
  jar.set(cookieName(secure), token, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: ABSOLUTE_SEC,
  });
  return sid;
}

export async function readPrincipal(): Promise<AdminPrincipal | null> {
  const jar = await cookies();
  const claims = await verifySession(readSessionCookie((name) => jar.get(name)?.value));
  if (!claims) return null;
  const row = await prisma.adminSession.findUnique({ where: { id: claims.sid } });
  const now = Date.now();
  if (!row || row.expiresAt.getTime() < now || row.idleAt.getTime() < now) return null;
  await prisma.adminSession.update({
    where: { id: row.id },
    data: { idleAt: new Date(now + IDLE_MS), lastSeen: new Date(now) },
  });
  return { sid: row.id, actor: row.actor };
}

export async function requireAdmin(): Promise<AdminPrincipal> {
  const principal = await readPrincipal();
  if (!principal) notFound();
  return principal;
}

export async function destroyCurrentSession() {
  const jar = await cookies();
  const claims = await verifySession(readSessionCookie((name) => jar.get(name)?.value));
  if (claims) {
    await prisma.adminSession.deleteMany({ where: { id: claims.sid } });
  }
  for (const name of ["__Host-rw.session", "rw_session"] as const) {
    jar.delete(name);
  }
}

export async function destroyAllSessions(actor: string) {
  await prisma.adminSession.deleteMany({ where: { actor } });
  await destroyCurrentSession();
}
