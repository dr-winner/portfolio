const SID = "p_sid_v1";
const SENT = "p_pv_v1";

function getSid(): string {
  if (typeof window === "undefined") return "";
  try {
    let s = sessionStorage.getItem(SID);
    if (!s) {
      s = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `s_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SID, s);
    }
    return s;
  } catch {
    return "anon";
  }
}

const ALLOW = new Set(
  "pageview contact_mailto contact_button shell_open shell_email social_link social_nav".split(" ")
);

export function track(
  name: string,
  extra?: { path?: string; meta?: Record<string, string | number | boolean> }
): void {
  if (typeof window === "undefined" || !ALLOW.has(name)) return;
  const sessionId = getSid();
  if (!sessionId) return;
  const path = extra?.path ?? window.location.pathname;
  const body = JSON.stringify({
    name,
    path,
    sessionId,
    meta: extra?.meta ?? {},
  });
  void fetch("/api/telemetry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

/**
 * One pageview per tab session; avoids double-counting client navigations in SPA.
 */
export function trackPageviewOncePerSession(pathname: string): void {
  if (typeof window === "undefined") return;
  const key = `${SENT}:${pathname}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    return;
  }
  track("pageview", { path: pathname });
}
