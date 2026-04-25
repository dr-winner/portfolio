/**
 * Seed the database from the static content files in src/content/*.
 * Safe to re-run: it skips entries that already exist (matched by unique key).
 */
import { PrismaClient } from "@prisma/client";
import { projectsData as projects } from "../src/content/projects.data";
import { stackCategories } from "../src/content/stack";
import { experience } from "../src/content/experience";
import { certifications } from "../src/content/certifications";
import { testimonials } from "../src/content/testimonials";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding projects…");
  for (const [i, p] of projects.entries()) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        company: p.company,
        year: p.year,
        title: p.title,
        summary: p.summary,
        tags: JSON.stringify(p.tags),
        results: JSON.stringify(p.results),
        techStack: JSON.stringify(p.techStack),
        link: p.link ?? null,
        repo: p.repo ?? null,
        // Seed-time screenshots are bundled static imports; admin-uploaded
        // ones get stored under /uploads and their path persisted here.
        imagePath: null,
        status: p.status,
        order: i,
      },
    });
  }

  console.log("Seeding stack…");
  for (const [i, cat] of stackCategories.entries()) {
    const created = await prisma.stackCategory.upsert({
      where: { key: cat.id },
      update: {},
      create: {
        key: cat.id,
        label: cat.label,
        description: cat.description,
        accent: cat.accent,
        iconKey: cat.iconKey,
        order: i,
      },
    });
    // Replace items so re-seeding stays consistent
    await prisma.stackItem.deleteMany({ where: { categoryId: created.id } });
    for (const [j, item] of cat.items.entries()) {
      await prisma.stackItem.create({
        data: {
          name: item.name,
          iconKey: item.iconKey,
          level: item.level ?? "working",
          order: j,
          categoryId: created.id,
        },
      });
    }
  }

  console.log("Seeding experience…");
  await prisma.experience.deleteMany();
  for (const [i, e] of experience.entries()) {
    await prisma.experience.create({
      data: {
        period: e.period,
        title: e.title,
        org: e.org,
        description: e.description,
        tags: JSON.stringify(e.tags),
        current: e.current ?? false,
        order: i,
      },
    });
  }

  console.log("Seeding certifications…");
  await prisma.certification.deleteMany();
  for (const [i, c] of certifications.entries()) {
    await prisma.certification.create({
      data: {
        name: c.name,
        issuer: c.issuer,
        status: c.status,
        examCode: c.examCode ?? null,
        year: c.year ?? null,
        targetDate: c.targetDate ?? null,
        progress: c.progress ?? null,
        description: c.description,
        skills: JSON.stringify(c.skills ?? []),
        modules: JSON.stringify(c.modules ?? []),
        link: c.link ?? null,
        order: i,
      },
    });
  }

  console.log("Seeding testimonials…");
  await prisma.testimonial.deleteMany();
  for (const [i, t] of testimonials.entries()) {
    await prisma.testimonial.create({
      data: {
        name: t.name,
        position: t.position,
        text: t.text,
        initials: t.initials,
        accent: t.accent ?? "cyber",
        order: i,
        hidden: false,
      },
    });
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
