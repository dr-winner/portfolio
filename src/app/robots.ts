import type { MetadataRoute } from "next";

const BASE = "https://richardwinner.dev";

/**
 * Next.js robots.txt generator.
 * Allows all major bots to crawl the public site while disallowing
 * admin and API routes. Includes a crawl-delay as a courtesy.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
        crawlDelay: 10,
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
