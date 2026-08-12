import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

const BASE = SITE_URL;

/**
 * Next.js sitemap.xml generator.
 * Lists real, canonical documents only. Hash-fragment section links are
 * intentionally excluded because search engines treat them as one document.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
