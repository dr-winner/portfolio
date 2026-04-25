export function uaFromHeaders(h: Headers): string {
  return h.get("user-agent") || "";
}

export function deviceClass(ua: string): { device: "mobile" | "tablet" | "desktop" | "unknown"; browser: string } {
  const u = ua.toLowerCase();
  if (!u.length) return { device: "unknown", browser: "" };
  const browser =
    u.includes("edg/")
      ? "edge"
      : u.includes("chrome") && !u.includes("chromium")
        ? "chrome"
        : u.includes("firefox")
          ? "firefox"
          : u.includes("safari") && !u.includes("chrome")
            ? "safari"
            : u.includes("opr/") || u.includes("opera")
              ? "opera"
              : "other";
  if (u.includes("mobile") && !u.includes("ipad")) {
    if (u.includes("tablet") || (u.includes("android") && !u.includes("mobile")))
      return { device: "tablet", browser };
    return { device: "mobile", browser };
  }
  if (u.includes("ipad") || (u.includes("android") && !u.includes("mobile"))) {
    return { device: "tablet", browser };
  }
  if (u.includes("tablet")) return { device: "tablet", browser };
  return { device: "desktop", browser };
}
