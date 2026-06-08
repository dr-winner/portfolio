"use client";

import { Fragment, useEffect, useRef } from "react";

interface HeroAnimationProps {
  children: React.ReactNode;
}

/**
 * Wraps hero heading content and triggers GSAP char-stagger on mount.
 * Targets every .hero-char inside the wrapper div.
 */
export function HeroAnimation({ children }: HeroAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    let ctx: { revert: () => void } | undefined;

    (async () => {
      const { gsap } = await import("gsap");

      const chars = el.querySelectorAll<HTMLElement>(".hero-char");
      if (!chars.length) return;

      gsap.set(chars, { y: 24, opacity: 0 });

      ctx = gsap.context(() => {
        gsap.to(chars, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "expo.out",
          stagger: 0.04,
          delay: 0.15,
        });
      });
    })();

    return () => ctx?.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}

/**
 * Splits text into per-character spans for GSAP stagger.
 *
 * Each WORD is wrapped in an `inline-block whitespace-nowrap` span so the
 * browser breaks only between words, never mid-character. Each CHAR inside
 * a word uses `inline-block` so GSAP y-transforms work.
 *
 * Pass `charClassName` when each char needs its own gradient context
 * (e.g. text-gradient-cyber — background-clip:text requires direct text
 * content on the element that carries the class).
 */
export function CharSplit({
  text,
  className,
  charClassName,
}: {
  text: string;
  className?: string;
  charClassName?: string;
}) {
  const words = text.split(" ");

  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          {/* word wrapper — inline-block + nowrap keeps word intact at line breaks */}
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((ch, ci) => (
              <span
                key={ci}
                className={`hero-char inline-block${charClassName ? ` ${charClassName}` : ""}`}
                aria-hidden
              >
                {ch}
              </span>
            ))}
          </span>
          {/* inter-word space — animatable like any other char */}
          {wi < words.length - 1 && (
            <span className="hero-char inline-block" aria-hidden>
              &nbsp;
            </span>
          )}
        </Fragment>
      ))}
    </span>
  );
}
