"use server";

import { adminHref } from "@/lib/admin-href";

import { createHash, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkRateLimitDurable, clientIpFromHeaders } from "@/lib/rate-limit";
import { audit } from "@/server/audit";
import { openSession } from "@/server/auth/session";

export type LoginState = { error?: string };

/** Shown when ADMIN_PASSWORD is missing: no env var names or commands. */
const SIGNIN_UNAVAILABLE = "Sign-in is not available.";

/**
 * Constant-time string comparison. Hashing both sides first means
 * timingSafeEqual always gets equal-length buffers, so neither content
 * nor length leaks through timing.
 */
function safeEqual(a: string, b: string): boolean {
  const da = createHash("sha256").update(a).digest();
  const db = createHash("sha256").update(b).digest();
  return timingSafeEqual(da, db);
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const ip = clientIpFromHeaders(await headers());
  const rl = await checkRateLimitDurable(`login:${ip}`, 5, 15 * 60_000);
  if (!rl.ok) {
    return { error: "Too many attempts. Try again later." };
  }
  if (process.env.LEGACY_PASSWORD_LOGIN === "false") {
    return { error: SIGNIN_UNAVAILABLE };
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const expectedUser = (process.env.ADMIN_USERNAME || "admin").trim();
  const expectedPassword = (process.env.ADMIN_PASSWORD ?? "").trim();

  if (expectedPassword.length < 24) {
    return { error: SIGNIN_UNAVAILABLE };
  }

  const userOk = safeEqual(username, expectedUser);
  const passOk = safeEqual(password, expectedPassword);
  if (!userOk || !passOk) {
    await audit({ actor: "unknown", action: "sign-in-failed" });
    return { error: "Invalid credentials." };
  }

  const sid = await openSession(expectedUser);
  await audit({ actor: expectedUser, action: "sign-in", sessionId: sid });
  redirect(adminHref(""));
}
