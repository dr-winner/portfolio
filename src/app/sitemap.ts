import type { MetadataRoute } from "next";

const BASE = "https://richardwinner.dev";

/**
 * Next.js sitemap.xml generator.
 * Includes the home page (priority 1.0, weekly) and every major section
 * as a hash-linked URL (priority 0.7, monthly).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Sections that live on the single-page layout as anchor targets.
  const sections = [
    "projects",
    "capabilities",
    "experience",
    "certifications",
    "about",
    "contact",
  ] as const;

  const sectionEntries: MetadataRoute.Sitemap = sections.map((id) => ({
    url: `${BASE}/#${id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...sectionEntries,
  ];
}
