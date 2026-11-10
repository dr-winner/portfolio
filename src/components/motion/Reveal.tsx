"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealTag = "div" | "section" | "article" | "li" | "ul" | "ol" | "h1" | "h2" | "h3" | "p" | "span" | "header" | "footer";

type RevealProps = {
  children: ReactNode;
  /** Stage delay in ms, combine with sibling reveals for a cascade. */
  delay?: number;
  /** Travel distance in px on the way in. */
  y?: number;
  /** "mask" blooms by wipe; default "rise" fades up. */
  variant?: "rise" | "mask";
  as?: RevealTag;
  className?: string;
  id?: string;
  style?: CSSProperties;
  "aria-label"?: string;
};

/**
 * Scroll-staged entrance. Renders server-side as plain, fully visible markup,
 * JS then arms the hidden state only for elements outside the viewport, so
 * users without scripting (or with reduced-motion) never see missing content.
 */
export function Reveal({ children, delay = 0, y = 18, variant, as: Tag = "div", className, id, style, ...aria }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    root.classList.add("reveal-armed");

    const style = node.style;
    style.setProperty("--reveal-delay", `${delay}ms`);
    style.setProperty("--reveal-y", `${y}px`);

    const rect = node.getBoundingClientRect();
    const inFirstFrame = rect.top < window.innerHeight * 0.94 && rect.bottom > -40;

    let observer: IntersectionObserver | null = null;
    if (inFirstFrame) {
      // Above the fold: enter immediately (runs the load-in cascade).
      node.classList.add("is-in");
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              observer?.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      observer.observe(node);
    }

    return () => observer?.disconnect();
  }, [delay, y]);

  return (
    <Tag ref={ref as never} data-reveal={variant ? variant : true} className={className} id={id} style={style} {...aria}>
      {children}
    </Tag>
  );
}
