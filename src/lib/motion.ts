/** Shared motion presets. Springs are the stiffness, damping, mass triples
 * from the upgrade brief, sampled into CSS linear() in tokens.css. */

export const springs = {
  snappy: { stiffness: 520, damping: 38, mass: 0.8, ms: 288 },
  lift: { stiffness: 380, damping: 30, mass: 0.9, ms: 404 },
  badge: { stiffness: 300, damping: 20, mass: 1, ms: 600 },
  sheet: { stiffness: 380, damping: 36, mass: 1, ms: 356 },
} as const;

export const tweens = {
  micro: 120,
  ui: 180,
  enter: 520,
  draw: 800,
} as const;

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function finePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

export function announce(message: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById("site-live");
  if (!el) return;
  el.textContent = "";
  window.setTimeout(() => {
    el.textContent = message;
  }, 30);
}

let cspViolations = 0;
const cspSubs = new Set<() => void>();
let cspBound = false;

export function getCspViolations() {
  return cspViolations;
}

export function subscribeCsp(fn: () => void) {
  cspSubs.add(fn);
  return () => {
    cspSubs.delete(fn);
  };
}

export function bindCspCounter() {
  if (cspBound || typeof document === "undefined") return;
  cspBound = true;
  document.addEventListener("securitypolicyviolation", () => {
    cspViolations += 1;
    cspSubs.forEach((fn) => fn());
  });
}
