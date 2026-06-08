"use client";

import { Fragment, useEffect, useRef } from "react";

interface HeroAnimationProps {
  children: React.ReactNode;
}

const SESSION_KEY = "hero:played";
const CHAR_BEZIER = "M0,0 C0.22,1 0.36,1 1,1";

export function HeroAnimation({ children }: HeroAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const el = ref.current;
    if (!el) return;

    const root = el.closest("section") ?? document;
    const terminal = root.querySelector<HTMLElement>("[data-hero-terminal]");
    const status = root.querySelector<HTMLElement>("[data-hero-status]");
    const chars = el.querySelectorAll<HTMLElement>(".hero-char");

    // Reduced motion OR already played: show everything instantly, fire ready event for downstream
    const alreadyPlayed =
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(SESSION_KEY) === "true";

    if (reduced || alreadyPlayed) {
      window.dispatchEvent(new CustomEvent("hero:reveal-complete"));
      return;
    }

    if (!chars.length) return;

    let ctx: { revert: () => void } | undefined;

    (async () => {
      const [{ gsap }, customEaseMod] = await Promise.all([
        import("gsap"),
        import("gsap/CustomEase").catch(() => null),
      ]);

      // Try to register a custom cubic-bezier matching [0.22, 1, 0.36, 1]; fall back to power3.out
      let charEase = "power3.out";
      if (customEaseMod) {
        const CustomEase = (customEaseMod as { CustomEase?: unknown; default?: unknown }).CustomEase ??
          (customEaseMod as { default?: unknown }).default;
        if (CustomEase) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          gsap.registerPlugin(CustomEase as any);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (CustomEase as any).create("heroCharEase", CHAR_BEZIER);
          charEase = "heroCharEase";
        }
      }

      gsap.set(chars, { y: 20, opacity: 0 });
      if (status) gsap.set(status, { y: 12, opacity: 0 });
      if (terminal) gsap.set(terminal, { scaleY: 0, transformOrigin: "bottom" });

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            try {
              sessionStorage.setItem(SESSION_KEY, "true");
            } catch {
              /* private mode etc — non-fatal */
            }
            window.dispatchEvent(new CustomEvent("hero:reveal-complete"));
          },
        });

        tl.to(
          chars,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: charEase,
            stagger: 0.04,
          },
          0
        );

        if (terminal) {
          tl.to(
            terminal,
            { scaleY: 1, duration: 0.6, ease: "power3.out" },
            0.2
          );
        }

        if (status) {
          tl.to(
            status,
            { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
            0.6
          );
        }
      });
    })();

    return () => ctx?.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}

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
