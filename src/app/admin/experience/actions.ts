"use server";

import { adminHref } from "@/lib/admin-href";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/server/auth/session";

function splitList(v: FormDataEntryValue | null): string[] {
  if (!v) return [];
  return String(v).split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}

function extract(formData: FormData) {
  return {
    period: String(formData.get("period") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    org: String(formData.get("org") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    tags: splitList(formData.get("tags")),
    current: formData.get("current") === "on" || formData.get("current") === "true",
    order: Number(formData.get("order") ?? 0) || 0,
  };
}

function revalidate() {
  revalidatePath("/");
  revalidatePath(adminHref("/experience"));
}

export async function createExperience(formData: FormData) {
  await requireAdmin();
  const f = extract(formData);
  await prisma.experience.create({
    data: { ...f, tags: JSON.stringify(f.tags) },
  });
  revalidate();
  redirect(adminHref("/experience"));
}

export async function updateExperience(id: string, formData: FormData) {
  await requireAdmin();
  const f = extract(formData);
  await prisma.experience.update({
    where: { id },
    data: { ...f, tags: JSON.stringify(f.tags) },
  });
  revalidate();
  redirect(adminHref("/experience"));
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  await prisma.experience.delete({ where: { id } });
  revalidate();
}
