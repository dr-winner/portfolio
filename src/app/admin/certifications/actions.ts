"use server";

import { adminHref } from "@/lib/admin-href";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/server/auth/session";

function httpsLink(value: string): string | null {
  if (!value) return null;
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error("Links must use https.");
  return url.toString();
}

function splitList(v: FormDataEntryValue | null): string[] {
  if (!v) return [];
  return String(v).split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}

function extract(formData: FormData) {
  const progressRaw = formData.get("progress");
  const progress =
    progressRaw === null || progressRaw === "" ? null : Math.max(0, Math.min(100, Number(progressRaw)));

  return {
    name: String(formData.get("name") ?? "").trim(),
    issuer: String(formData.get("issuer") ?? "").trim(),
    status: String(formData.get("status") ?? "pursuing").trim(),
    examCode: String(formData.get("examCode") ?? "").trim() || null,
    year: String(formData.get("year") ?? "").trim() || null,
    targetDate: String(formData.get("targetDate") ?? "").trim() || null,
    progress,
    description: String(formData.get("description") ?? "").trim(),
    skills: splitList(formData.get("skills")),
    modules: splitList(formData.get("modules")),
    link: httpsLink(String(formData.get("link") ?? "").trim()),
    order: Number(formData.get("order") ?? 0) || 0,
  };
}

function revalidate() {
  revalidatePath("/");
  revalidatePath(adminHref("/certifications"));
}

export async function createCertification(formData: FormData) {
  await requireAdmin();
  const f = extract(formData);
  await prisma.certification.create({
    data: { ...f, skills: JSON.stringify(f.skills), modules: JSON.stringify(f.modules) },
  });
  revalidate();
  redirect(adminHref("/certifications"));
}

export async function updateCertification(id: string, formData: FormData) {
  await requireAdmin();
  const f = extract(formData);
  await prisma.certification.update({
    where: { id },
    data: { ...f, skills: JSON.stringify(f.skills), modules: JSON.stringify(f.modules) },
  });
  revalidate();
  redirect(adminHref("/certifications"));
}

export async function deleteCertification(id: string) {
  await requireAdmin();
  await prisma.certification.delete({ where: { id } });
  revalidate();
}
