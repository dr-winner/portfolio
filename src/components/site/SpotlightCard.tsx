"use client";

import { useRef, type ReactNode } from "react";

/**
 * Cursor spotlight for cards. The light follows the pointer inside the card
 * and is disabled entirely on touch, where there is no hover to answer.
 */
export function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  function move(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const node = ref.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    node.style.setProperty("--mx", `${event.clientX - box.left}px`);
    node.style.setProperty("--my", `${event.clientY - box.top}px`);
  }

  return (
    <div ref={ref} onPointerMove={move} className={`spotlight ${className}`}>
      <span aria-hidden className="spotlight-layer" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
