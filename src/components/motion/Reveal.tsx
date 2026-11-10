"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealTag = "div" | "section" | "article" | "li" | "ul" | "ol" | "h1" | "h2" | "h3" | "p" | "span" | "header" | "footer";

type RevealProps = {
  children: ReactNode;
  /** Stage delay in ms, combine with sibling reveals for a cascade. */
  delay?: number;
  /** Travel distance in px on the way in (viewport enters only). */
  y?: number;
  /** "mask" blooms by wipe; default rises in. */
  variant?: "rise" | "mask";
  as?: RevealTag;
  className?: string;
  id?: string;
  style?: CSSProperties;
  "aria-label"?: string;
};

/**
 * Staged entrance with a hard rule: content is visible without scrolling.
 * Server output is plain, fully visible markup. One shared Intersection
 * Observer checks each node once during hydration: elements that begin
 * inside the initial viewport play their entrance (rise or mask, cascaded
 * with delay); elements that begin below the fold are left untouched, so
 * nothing ever sits hidden waiting for a scroll and a full-page screenshot
 * without scrolling shows every section. Scripting off or reduced motion:
 * no arming at all, the page is simply static.
 */

let sharedObserver: IntersectionObserver | null = null;

function io(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.classList.add("is-in");
        sharedObserver?.unobserve(entry.target);
      }
    });
  }
  return sharedObserver;
}

export function Reveal({ children, delay = 0, y = 12, variant, as: Tag = "div", className, id, style, ...aria }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("reveal-armed");
    node.style.setProperty("--reveal-delay", `${delay}ms`);
    node.style.setProperty("--reveal-y", `${y}px`);
    io().observe(node);
    return () => sharedObserver?.unobserve(node);
  }, [delay, y]);

  return (
    <Tag ref={ref as never} data-reveal={variant ? variant : true} className={className} id={id} style={style} {...aria}>
      {children}
    </Tag>
  );
}
