"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { setSessionCookie } from "@/lib/auth";

export type LoginState = { error?: string };

/** Shown when password hash env is missing or invalid — no env var names or commands. */
const SIGNIN_UNAVAILABLE = "Sign-in is not available.";

function isLikelyBcryptHash(s: string): boolean {
  if (!s || s.length < 55) return false;
  if (!/^\$2[aby]\$/.test(s)) return false;
  const parts = s.split("$");
  return parts.length >= 4;
}

function loadAdminPasswordHash(): { hash: string } | { error: string } {
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64?.trim();
  if (b64) {
    let decoded: string | null = null;
    for (const enc of ["base64url", "base64"] as const) {
      const t = Buffer.from(b64, enc).toString("utf8");
      if (isLikelyBcryptHash(t)) {
        decoded = t;
        break;
      }
    }
    if (!decoded) {
      return { error: SIGNIN_UNAVAILABLE };
    }
    return { hash: decoded };
  }

  const raw = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (!raw) {
    return { error: SIGNIN_UNAVAILABLE };
  }
  // Strip a single layer of surrounding quotes if present
  const unquoted = raw.replace(/^["']|["']$/g, "").trim();
  if (!isLikelyBcryptHash(unquoted)) {
    return { error: SIGNIN_UNAVAILABLE };
  }
  return { hash: unquoted };
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin");

  const expectedUser = (process.env.ADMIN_USERNAME || "admin").trim();

  const loaded = loadAdminPasswordHash();
  if ("error" in loaded) {
    return { error: loaded.error };
  }
  const { hash } = loaded;

  if (username !== expectedUser) {
    return { error: "Invalid credentials." };
  }

  const ok = await bcrypt.compare(password, hash);
  if (!ok) return { error: "Invalid credentials." };

  await setSessionCookie(username);
  redirect(from.startsWith("/admin") ? from : "/admin");
}
