"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  GSAP_EASE,
  SCRUB_CLIP_INITIAL,
  SCRUB_CLIP_VISIBLE,
  prefersReducedMotion,
} from "@/config/motion.config";

interface Props {
  children: ReactNode;
  className?: string;
  /** ScrollTrigger start position, e.g. "top 85%" */
  start?: string;
  /** Scrub factor — true for 1:1, number for lag */
  scrub?: number | boolean;
}

/**
 * Wraps text in a clip-path reveal that wipes left-to-right as it enters
 * the viewport. Uses GSAP ScrollTrigger with scrub for a smooth scrub effect.
 * Falls back to instant reveal under prefers-reduced-motion.
 */
export function ScrubText({
  children,
  className,
  start = "top 85%",
  scrub = 1,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.style.clipPath = SCRUB_CLIP_VISIBLE;
      return;
    }

    let ctx: { revert: () => void } | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { clipPath: SCRUB_CLIP_INITIAL },
          {
            clipPath: SCRUB_CLIP_VISIBLE,
            ease: GSAP_EASE.smooth,
            scrollTrigger: {
              trigger: el,
              start,
              end: "bottom 60%",
              scrub,
            },
          },
        );
      });
    })();

    return () => ctx?.revert();
  }, [start, scrub]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        clipPath: prefersReducedMotion()
          ? SCRUB_CLIP_VISIBLE
          : SCRUB_CLIP_INITIAL,
      }}
    >
      {children}
    </div>
  );
}
