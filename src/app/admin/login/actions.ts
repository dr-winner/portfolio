"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { setSessionCookie } from "@/lib/auth";
import { checkRateLimitDurable, clientIpFromHeaders } from "@/lib/rate-limit";

export type LoginState = { error?: string };

/** Shown when ADMIN_PASSWORD is missing — no env var names or commands. */
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
  const rl = await checkRateLimitDurable(`login:${ip}`, 5, 60_000);
  if (!rl.ok) {
    return { error: "Too many attempts. Try again in a minute." };
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin");

  const expectedUser = (process.env.ADMIN_USERNAME || "admin").trim();
  const expectedPassword = (process.env.ADMIN_PASSWORD ?? "").trim();

  // Refuse to run with a missing or weak configured password.
  if (expectedPassword.length < 12) {
    return { error: SIGNIN_UNAVAILABLE };
  }

  const userOk = safeEqual(username, expectedUser);
  const passOk = safeEqual(password, expectedPassword);
  if (!userOk || !passOk) {
    return { error: "Invalid credentials." };
  }

  await setSessionCookie(expectedUser);
  redirect(from.startsWith("/admin") ? from : "/admin");
}
