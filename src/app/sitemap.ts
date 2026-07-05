import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

const BASE = SITE_URL;

/**
 * Next.js sitemap.xml generator.
 * Single-page site: only the root URL is a real, crawlable document.
 * (Hash-fragment section links are ignored by search engines, so they
 * are intentionally not listed.)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
