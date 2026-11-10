/* Link helpers for the two frame views, brief 7.1. Canonical URLs never
   include ?view=classic, but internal links inside the classic view keep
   the param so a visitor browsing in classic stays in classic. */

export function classicHref(path: string): string {
  if (path.startsWith("#") || path.startsWith("http") || path.startsWith("mailto:")) return path;
  return path.includes("?") ? `${path}&view=classic` : `${path}?view=classic`;
}
