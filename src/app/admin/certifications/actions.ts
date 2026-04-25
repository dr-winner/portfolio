"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

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
    link: String(formData.get("link") ?? "").trim() || null,
    order: Number(formData.get("order") ?? 0) || 0,
  };
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/certifications");
}

export async function createCertification(formData: FormData) {
  await requireSession();
  const f = extract(formData);
  await prisma.certification.create({
    data: { ...f, skills: JSON.stringify(f.skills), modules: JSON.stringify(f.modules) },
  });
  revalidate();
  redirect("/admin/certifications");
}

export async function updateCertification(id: string, formData: FormData) {
  await requireSession();
  const f = extract(formData);
  await prisma.certification.update({
    where: { id },
    data: { ...f, skills: JSON.stringify(f.skills), modules: JSON.stringify(f.modules) },
  });
  revalidate();
  redirect("/admin/certifications");
}

export async function deleteCertification(id: string) {
  await requireSession();
  await prisma.certification.delete({ where: { id } });
  revalidate();
}
