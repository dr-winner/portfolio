"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Tag = "h1" | "h2" | "h3" | "p";

type SplitHeadlineProps = {
  lines: string[];
  as?: Tag;
  className?: string;
  lineClassNames?: string[];
  delay?: number;
  /** Hero headlines arm immediately instead of waiting for the observer. */
  priority?: boolean;
  /** Near-cursor lift and weight shift. Fine pointers only. */
  cursor?: boolean;
  /** Paint the final full stop in the signal colour. */
  accentLastChar?: boolean;
};

/**
 * Headline split into words and characters behind a mask. The server output
 * is complete text. The parent carries the accessible name through
 * aria-label and every split span is aria-hidden, so a screen reader reads
 * one clean sentence. Motion is armed only after hydration, so with
 * scripting off or reduced motion the headline is simply there.
 */
export function SplitHeadline({
  lines,
  as: Tag = "h2",
  className = "",
  lineClassNames = [],
  delay = 0,
  priority = false,
  cursor = false,
  accentLastChar = false,
}: SplitHeadlineProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("split-armed");
    let timer = 0;
    let observer: IntersectionObserver | null = null;

    if (priority) {
      timer = window.setTimeout(() => node.classList.add("is-in"), 20);
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              node.classList.add("is-in");
              observer?.disconnect();
            }
          }
        },
        { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
      );
      observer.observe(node);
    }

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [priority]);

  useEffect(() => {
    if (!cursor) return;
    const node = ref.current;
    if (!node) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const glyphs = Array.from(node.querySelectorAll<HTMLElement>(".split-glyph"));
    if (glyphs.length === 0) return;

    let raf = 0;
    let mx = 0;
    let my = 0;
    let active = false;

    function apply() {
      raf = 0;
      for (const glyph of glyphs) {
        if (!active) {
          glyph.style.setProperty("--lift", "0");
          continue;
        }
        const box = glyph.getBoundingClientRect();
        const dx = mx - (box.left + box.width / 2);
        const dy = my - (box.top + box.height / 2);
        const distance = Math.hypot(dx, dy);
        const lift = Math.max(0, 1 - distance / 108);
        glyph.style.setProperty("--lift", lift.toFixed(3));
      }
    }

    function queue() {
      if (!raf) raf = window.requestAnimationFrame(apply);
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      mx = event.clientX;
      my = event.clientY;
      active = true;
      queue();
    }

    function reset() {
      active = false;
      queue();
    }

    node.addEventListener("pointermove", onMove, { passive: true });
    node.addEventListener("pointerleave", reset);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", reset);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [cursor]);

  let index = 0;
  const plain = lines.join(" ");

  return (
    <Tag
      ref={ref as never}
      className={`split-headline ${className}`}
      aria-label={plain}
      style={{ "--split-delay": `${delay}ms` } as CSSProperties}
    >
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");
        return (
          <span key={`${line}-${lineIndex}`} className={`split-line ${lineClassNames[lineIndex] ?? ""}`} aria-hidden>
            {words.map((word, wordIndex) => {
              const chars = Array.from(word);
              return (
                <span key={`${word}-${wordIndex}`} className="split-word">
                  {chars.map((char, charIndex) => {
                    const current = index;
                    index += 1;
                    const accent = accentLastChar && char === "." && lineIndex === lines.length - 1;
                    return (
                      <span
                        key={`${char}-${charIndex}`}
                        className="split-char"
                        style={{ "--i": current } as CSSProperties}
                      >
                        <span className={`split-glyph${accent ? " split-glyph-accent" : ""}`}>{char}</span>
                      </span>
                    );
                  })}
                  {wordIndex < words.length - 1 ? <span className="split-space"> </span> : null}
                </span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
