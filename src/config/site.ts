/**
 * Canonical production origin — single source of truth for metadata,
 * JSON-LD, sitemap, and robots. Override per-environment (e.g. after a
 * domain move) with NEXT_PUBLIC_SITE_URL; no trailing slash.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://duvorrichardwinner.me";
