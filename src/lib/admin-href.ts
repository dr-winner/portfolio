const PATH_RE = /^[a-f0-9]{24}$/;

export function adminPathSegment(): string | null {
  const value = process.env.ADMIN_PATH?.trim() ?? "";
  return PATH_RE.test(value) ? value : null;
}

/** Public URL for an admin page. The internal App Router path stays `/admin`. */
export function adminHref(suffix = ""): string {
  const segment = adminPathSegment();
  if (!segment) return `/admin${suffix}`;
  return `/${segment}${suffix}`;
}
