/**
 * motion.config.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for every animation value in the portfolio.
 * Covers: easings, durations, staggers, GSAP defaults, Framer Motion variants,
 * Lenis config, horizontal-scroll geometry, cursor tuning, and a universal
 * reduced-motion guard. Import what you need — nothing is imported globally.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Variants, Transition, TargetAndTransition } from "framer-motion";

/* ─── Reduced-motion helpers ──────────────────────────────────────────────── */

/** Runtime guard — safe on server (returns false). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Clamp every numeric value in a record to 0.001 when user prefers less motion. */
export function reduceIfNeeded<T extends Record<string, number>>(config: T): T {
  if (!prefersReducedMotion()) return config;
  return Object.fromEntries(
    Object.entries(config).map(([k]) => [k, 0.001]),
  ) as T;
}

/* ─── Cubic-bezier easings (Framer Motion array format) ───────────────────── */
export const EASE = {
  /** Fast deceleration — used for every entrance animation */
  expoOut:  [0.16, 1,    0.3,  1   ] as [number, number, number, number],
  /** Aggressive acceleration — exits, fold-away */
  expoIn:   [0.7,  0,    0.84, 0   ] as [number, number, number, number],
  /** Silky in-out — Lenis complement, page-level feel */
  smooth:   [0.25, 0.1,  0.25, 1   ] as [number, number, number, number],
  /** Snappy settle — CTAs, micro-interactions */
  snappy:   [0.4,  0,    0.2,  1   ] as [number, number, number, number],
  /** Carousel slide — current card out / new card in */
  slide:    [0.65, 0,    0.35, 1   ] as [number, number, number, number],
  /** Hover lift — spring physics string for GSAP */
  springJS: "elastic.out(1, 0.4)"   as string,
} as const;

/* ─── GSAP easing strings (use where gsap.to / gsap.from / gsap.fromTo) ───── */
export const GSAP_EASE = {
  expoOut:  "expo.out",
  expoIn:   "expo.in",
  smooth:   "power2.inOut",
  snappy:   "power3.out",
  spring:   "elastic.out(1, 0.4)",
  linear:   "none",
} as const;

/* ─── Durations — seconds ─────────────────────────────────────────────────── */
export const DUR = {
  /** Hover states, ripple flash */
  micro:  0.12,
  /** Tooltip, badge fade */
  xs:     0.18,
  /** Quick UI: tab swap, chip highlight */
  fast:   0.25,
  /** Standard component transition */
  base:   0.45,
  /** Hero entrance lines */
  hero:   0.60,
  /** Section reveal, modal */
  page:   0.80,
  /** Lenis lerp duration, scrub-text wipe */
  slow:   1.20,
} as const;

/* ─── Stagger values — seconds ────────────────────────────────────────────── */
export const STAGGER = {
  /** Character-level: hero H1 word spans */
  char:   0.04,
  /** Word-level: section headings */
  word:   0.06,
  /** Generic list items */
  item:   0.08,
  /** Grid cards (Capabilities, stack chips) */
  card:   0.10,
  /** Slower reveal: featured rows */
  slow:   0.15,
} as const;

/* ─── Lenis smooth-scroll config ──────────────────────────────────────────── */
export const LENIS_CONFIG = {
  lerp:            0.1,
  duration:        1.2,
  smoothWheel:     true,
  touchMultiplier: 2,
  infinite:        false,
  autoRaf:         false,   // driven manually via GSAP ticker
} as const;

/* ─── GSAP ScrollTrigger defaults ─────────────────────────────────────────── */
export const ST = {
  /** Section reveal start — card enters viewport */
  start:          "top 82%",
  end:            "bottom 18%",
  toggleActions:  "play none none reverse" as const,
  /** Pinned horizontal-scroll scrub factor */
  pinScrub:       1.5,
  /** Timeline separator line draw */
  lineScrub:      0.4,
  /** Hero orb parallax */
  parallaxScrub:  1.0,
  /** Batch stagger — Capabilities / Stack cards */
  batchInterval:  0.12,
  /** Batch trigger offset */
  batchStart:     "top 88%",
} as const;

/* ─── Horizontal scroll geometry ──────────────────────────────────────────── */
export const H_SCROLL = {
  scrub:          1.5,
  /** px — each project card width on desktop */
  cardWidth:      500,
  /** px — gap between cards */
  cardGap:        40,
  /** px — leading / trailing edge padding */
  edgePad:        80,
} as const;

/* ─── Custom cursor ────────────────────────────────────────────────────────── */
export const CURSOR = {
  lerp:              0.15,
  scaleDefault:      1,
  scaleInteractive:  1.6,
  scaleClick:        0.75,
  /** px — dot diameter */
  size:              10,
} as const;

/* ─── MagneticButton ──────────────────────────────────────────────────────── */
export const MAGNETIC = {
  /** Max translate in px the element can drift toward the cursor */
  strength: 0.35,
  /** Spring stiffness for settle-back */
  stiffness: 180,
  damping:   14,
} as const;

/* ─── Testimonials carousel ────────────────────────────────────────────────── */
export const TESTIMONIAL = {
  /** Auto-advance interval in ms */
  interval:     6000,
  /** Slide in/out duration in seconds */
  slideDur:     0.50,
} as const;

/* ─── Framer Motion variants ──────────────────────────────────────────────── */

/** Standard fade-up entrance for most content blocks */
export const varFadeInUp = (reduced = false): Variants => ({
  hidden:  { opacity: 0, y: reduced ? 0 : 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reduced ? 0.001 : DUR.base,
      ease: EASE.expoOut,
    } satisfies Transition,
  },
});

/** Pure opacity fade for backgrounds and overlays */
export const varFadeIn = (reduced = false): Variants => ({
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: reduced ? 0.001 : DUR.fast },
  },
});

/** Stagger parent — wrap a list or grid in this */
export const varStagger = (
  stagger: number = STAGGER.item,
  reduced = false,
): Variants => ({
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: reduced ? 0 : stagger,
      delayChildren:   0,
    },
  },
});

/** Overflow-hidden word reveal — inner span slides up from 100% to 0% */
export const varWordReveal = (reduced = false): Variants => ({
  hidden:  { y: reduced ? 0 : "105%" },
  visible: {
    y: "0%",
    transition: { duration: reduced ? 0.001 : DUR.hero, ease: EASE.expoOut },
  },
});

/** Carousel: slides in from right, exits left */
export const varCarouselEnter = (reduced = false): TargetAndTransition => ({
  opacity: 1,
  x: 0,
  transition: { duration: reduced ? 0.001 : TESTIMONIAL.slideDur, ease: EASE.slide },
});
export const varCarouselExit = (dir: "left" | "right", reduced = false): TargetAndTransition => ({
  opacity: 0,
  x: reduced ? 0 : (dir === "left" ? -64 : 64),
  transition: { duration: reduced ? 0.001 : TESTIMONIAL.slideDur, ease: EASE.slide },
});
export const varCarouselInitial = (dir: "left" | "right", reduced = false): TargetAndTransition => ({
  opacity: 0,
  x: reduced ? 0 : (dir === "left" ? -64 : 64),
});

/** Card hover lift — used in Capabilities and Projects */
export const varCardHover: Variants = {
  rest:  { y: 0, scale: 1 },
  hover: {
    y:    -4,
    scale: 1.01,
    transition: { type: "spring", stiffness: 400, damping: 28 },
  },
};

/** Scrub-text clip reveal — left-to-right mask wipe (GSAP drives clipPath) */
export const SCRUB_CLIP_INITIAL  = "inset(0 100% 0 0)";
export const SCRUB_CLIP_VISIBLE  = "inset(0 0% 0 0)";

/* ─── Hero-ready event name (matches TypedLines expectation) ──────────────── */
export const HERO_READY_EVENT = "hero:reveal-complete" as const;
