import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

const BASE = SITE_URL;

/**
 * Next.js robots.txt generator.
 * Allows crawling of public pages while disallowing admin and API routes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
