"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { saveUpload } from "@/lib/upload";

function splitList(v: FormDataEntryValue | null): string[] {
  if (!v) return [];
  return String(v)
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function extractProjectFields(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    year: String(formData.get("year") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    tags: splitList(formData.get("tags")),
    results: splitList(formData.get("results")),
    techStack: splitList(formData.get("techStack")),
    link: String(formData.get("link") ?? "").trim() || null,
    repo: String(formData.get("repo") ?? "").trim() || null,
    status: String(formData.get("status") ?? "live").trim(),
    order: Number(formData.get("order") ?? 0) || 0,
  };
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function createProject(formData: FormData) {
  await requireSession();
  const f = extractProjectFields(formData);
  if (!f.slug || !f.title) throw new Error("Slug and title are required.");

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
  revalidate();
  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  await requireSession();
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
  revalidate();
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireSession();
  await prisma.project.delete({ where: { id } });
  revalidate();
}
