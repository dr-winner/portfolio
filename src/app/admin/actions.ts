"use server";

import { redirect } from "next/navigation";
import { destroyCurrentSession } from "@/server/auth/session";
import { adminHref } from "@/lib/admin-href";

export async function logoutAction() {
  await destroyCurrentSession();
  redirect(adminHref("/login"));
}
