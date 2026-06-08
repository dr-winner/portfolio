export const mc = {
  // ─── Durations (seconds) ───────────────────────────────────────────────────
  dur: {
    instant: 0.01,
    fast: 0.2,
    base: 0.4,
    mid: 0.6,
    slow: 1.0,
    crawl: 1.2,
  },

  // ─── GSAP ease strings ─────────────────────────────────────────────────────
  ease: {
    expoOut: "expo.out",
    expoIn: "expo.in",
    power2Out: "power2.out",
    power3Out: "power3.out",
    power4Out: "power4.out",
    linear: "none",
    sineInOut: "sine.inOut",
  },

  // ─── Framer Motion cubic-bezier arrays ────────────────────────────────────
  fmEase: {
    expoOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
    power2Out: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    sineInOut: [0.37, 0, 0.63, 1] as [number, number, number, number],
    linear: [0, 0, 1, 1] as [number, number, number, number],
  },

  // ─── Stagger values (seconds) ─────────────────────────────────────────────
  stagger: {
    char: 0.04,
    word: 0.03,
    card: 0.06,
    chip: 0.04,
    line: 0.08,
  },

  // ─── ScrollTrigger scrub values ───────────────────────────────────────────
  scrub: {
    fast: 0.5,
    base: 1,
    slow: 1.5,
  },

  // ─── Lenis options ────────────────────────────────────────────────────────
  lenis: {
    lerp: 0.1,
    duration: 1.2,
    smoothWheel: true,
  },

  // ─── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    charY: 24,
    charDuration: 0.6,
    charStagger: 0.04,
    parallaxOrbY: -80,
  },

  // ─── Cards ────────────────────────────────────────────────────────────────
  card: {
    hoverY: -4,
    enterY: 20,
    enterScale: 0.96,
    tiltMax: 6,
  },

  // ─── Custom cursor ────────────────────────────────────────────────────────
  cursor: {
    lerp: 0.15,
    scaleHover: 1.6,
  },
} as const;

// Returns zeroed config when user prefers reduced motion
export function getReducedMc() {
  return {
    dur: Object.fromEntries(Object.keys(mc.dur).map((k) => [k, 0.01])),
    stagger: Object.fromEntries(Object.keys(mc.stagger).map((k) => [k, 0])),
  };
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
