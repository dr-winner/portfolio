"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { adminHref } from "@/lib/admin-href";
import { requireAdmin } from "@/server/auth/session";
import { audit } from "@/server/audit";
import { parseProject } from "@/server/schemas/project";
import { saveUpload } from "@/lib/upload";

function splitList(v: FormDataEntryValue | null): string[] {
  if (!v) return [];
  return String(v)
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function extractProjectFields(formData: FormData) {
  return parseProject({
    slug: String(formData.get("slug") ?? ""),
    company: String(formData.get("company") ?? ""),
    year: String(formData.get("year") ?? ""),
    title: String(formData.get("title") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    tags: splitList(formData.get("tags")),
    results: splitList(formData.get("results")),
    techStack: splitList(formData.get("techStack")),
    link: String(formData.get("link") ?? "").trim() || "",
    repo: String(formData.get("repo") ?? "").trim() || "",
    status: String(formData.get("status") ?? "live").trim(),
    order: Number(formData.get("order") ?? 0) || 0,
  });
}

function revalidate() {
  revalidatePath("/");
  revalidatePath(adminHref("/projects"));
}

export async function createProject(formData: FormData) {
  const principal = await requireAdmin();
  const f = extractProjectFields(formData);
  const image = formData.get("image");
  let imagePath: string | null = null;
  if (image instanceof File && image.size > 0) imagePath = await saveUpload(image);

  await prisma.project.create({
    data: {
      slug: f.slug,
      company: f.company,
      year: f.year,
      title: f.title,
      summary: f.summary,
      tags: JSON.stringify(f.tags),
      results: JSON.stringify(f.results),
      techStack: JSON.stringify(f.techStack),
      link: f.link,
      repo: f.repo,
      imagePath,
      status: f.status,
      order: f.order,
    },
  });
  await audit({ actor: principal.actor, action: "create", entity: "project", summary: f.slug, sessionId: principal.sid });
  revalidate();
  redirect(adminHref("/projects"));
}

export async function updateProject(id: string, formData: FormData) {
  const principal = await requireAdmin();
  const f = extractProjectFields(formData);

  const image = formData.get("image");
  let imagePath: string | undefined;
  if (image instanceof File && image.size > 0) imagePath = (await saveUpload(image)) ?? undefined;

  await prisma.project.update({
    where: { id },
    data: {
      slug: f.slug,
      company: f.company,
      year: f.year,
      title: f.title,
      summary: f.summary,
      tags: JSON.stringify(f.tags),
      results: JSON.stringify(f.results),
      techStack: JSON.stringify(f.techStack),
      link: f.link,
      repo: f.repo,
      status: f.status,
      order: f.order,
      ...(imagePath ? { imagePath } : {}),
    },
  });
  await audit({ actor: principal.actor, action: "update", entity: "project", entityId: id, sessionId: principal.sid });
  revalidate();
  redirect(adminHref("/projects"));
}

export async function deleteProject(id: string) {
  const principal = await requireAdmin();
  await prisma.project.delete({ where: { id } });
  await audit({ actor: principal.actor, action: "delete", entity: "project", entityId: id, sessionId: principal.sid });
  revalidate();
}
