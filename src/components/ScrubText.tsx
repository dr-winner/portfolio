"use client";

import { useRef, useEffect } from "react";

interface ScrubTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reveals its children left-to-right as the element scrolls into view.
 * A dimmed ghost underlay ensures text is readable even before reveal.
 * Falls back to instant reveal under prefers-reduced-motion.
 */
export function ScrubText({ children, className }: ScrubTextProps) {
  const revealRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.clipPath = "inset(0 0% 0 0)";
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
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "top 28%",
              scrub: 0.6,
            },
          }
        );
      });
    })();

    return () => ctx?.revert();
  }, []);

  return (
    <span className={`relative inline ${className ?? ""}`}>
      {/* ghost underlay */}
      <span className="opacity-[0.18]" aria-hidden>
        {children}
      </span>
      {/* clip-revealed overlay */}
      <span
        ref={revealRef}
        className="absolute inset-0"
        style={{ clipPath: "inset(0 100% 0 0)" }}
        aria-hidden
      >
        {children}
      </span>
      {/* screen-reader text */}
      <span className="sr-only">{children}</span>
    </span>
  );
}
