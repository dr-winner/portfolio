/**
 * Server-only content layer.
 *
 * Each reader tries the database first; if the DB is unreachable or empty,
 * it falls back to the seed data in `src/content/*` so the site keeps working
 * even before the user sets up Prisma.
 */
import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { projects as seedProjects, type Project, type ProjectTag } from "@/content/projects";
import {
  stackCategories as seedStack,
  type StackCategory,
  type StackItem,
} from "@/content/stack";
import { experience as seedExperience, type TimelineEntry } from "@/content/experience";
import { certifications as seedCerts, type Cert } from "@/content/certifications";
import { testimonials as seedTestimonials, type Testimonial } from "@/content/testimonials";

function parseJsonArray<T = string>(s: string | null | undefined, fallback: T[] = []): T[] {
  if (!s) return fallback;
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? (v as T[]) : fallback;
  } catch {
    return fallback;
  }
}

async function safeDb<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[content] DB unavailable, falling back to seed data.", err);
    }
    return fallback;
  }
}

export async function getProjects(): Promise<Project[]> {
  const rows = await safeDb(
    () => prisma.project.findMany({ orderBy: { order: "asc" } }),
    [] as Awaited<ReturnType<typeof prisma.project.findMany>>
  );
  if (!rows.length) return seedProjects;

  return rows.map((r): Project => {
    const fromSeed = seedProjects.find((p) => p.slug === r.slug);
    // Prefer uploaded screenshot over seed static import; trim avoids empty string falling back to seed
    const customPath = r.imagePath?.trim() || null;
    return {
      slug: r.slug,
      company: r.company,
      year: r.year,
      title: r.title,
      summary: r.summary,
      tags: parseJsonArray<ProjectTag>(r.tags),
      results: parseJsonArray<string>(r.results),
      techStack: parseJsonArray<string>(r.techStack),
      link: r.link ?? undefined,
      repo: r.repo ?? undefined,
      // Custom upload always wins; else bundled seed image by matching slug
      image: customPath ? undefined : fromSeed?.image,
      imageUrl: customPath ?? undefined,
      status: (r.status as Project["status"]) ?? "live",
    };
  });
}

type StackCategoryWithItems = Prisma.StackCategoryGetPayload<{ include: { items: true } }>;

export async function getStackCategories(): Promise<StackCategory[]> {
  const rows = await safeDb<StackCategoryWithItems[]>(
    () =>
      prisma.stackCategory.findMany({
        orderBy: { order: "asc" },
        include: { items: { orderBy: { order: "asc" } } },
      }),
    []
  );
  if (!rows.length) return seedStack;

  return rows.map(
    (r): StackCategory => ({
      id: r.key,
      label: r.label,
      description: r.description,
      accent: r.accent as StackCategory["accent"],
      iconKey: r.iconKey,
      items: r.items.map(
        (it): StackItem => ({
          name: it.name,
          iconKey: it.iconKey,
          level: it.level as StackItem["level"],
        })
      ),
    })
  );
}

export async function getExperience(): Promise<TimelineEntry[]> {
  const rows = await safeDb(
    () => prisma.experience.findMany({ orderBy: { order: "asc" } }),
    [] as Awaited<ReturnType<typeof prisma.experience.findMany>>
  );
  if (!rows.length) return seedExperience;

  return rows.map(
    (r): TimelineEntry => ({
      period: r.period,
      title: r.title,
      org: r.org,
      description: r.description,
      tags: parseJsonArray<string>(r.tags),
      current: r.current,
    })
  );
}

export async function getCertifications(): Promise<Cert[]> {
  const rows = await safeDb(
    () => prisma.certification.findMany({ orderBy: { order: "asc" } }),
    [] as Awaited<ReturnType<typeof prisma.certification.findMany>>
  );
  if (!rows.length) return seedCerts;

  return rows.map(
    (r): Cert => ({
      name: r.name,
      issuer: r.issuer,
      status: r.status as Cert["status"],
      examCode: r.examCode ?? undefined,
      year: r.year ?? undefined,
      targetDate: r.targetDate ?? undefined,
      progress: r.progress ?? undefined,
      description: r.description,
      skills: parseJsonArray<string>(r.skills),
      modules: parseJsonArray<string>(r.modules),
      link: r.link ?? undefined,
    })
  );
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await safeDb(
    () =>
      prisma.testimonial.findMany({
        where: { hidden: false },
        orderBy: { order: "asc" },
      }),
    [] as Awaited<ReturnType<typeof prisma.testimonial.findMany>>
  );
  if (!rows.length) return seedTestimonials;

  return rows.map(
    (r): Testimonial => ({
      name: r.name,
      position: r.position,
      text: r.text,
      initials: r.initials,
      accent: r.accent as Testimonial["accent"],
    })
  );
}
