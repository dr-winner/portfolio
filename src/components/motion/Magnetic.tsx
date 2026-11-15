"use client";

import { useRef, type ReactNode } from "react";

/**
 * Small magnetic pull for primary actions. Fine pointers only, and never
 * when motion is reduced. The wrapper keeps the child's own focus behavior.
 */
export function Magnetic({
  children,
  strength = 7,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  function move(event: React.PointerEvent<HTMLSpanElement>) {
    const node = ref.current;
    if (!node || event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = node.getBoundingClientRect();
    const x = (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
    const y = (event.clientY - (box.top + box.height / 2)) / (box.height / 2);
    node.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  }

  function reset() {
    const node = ref.current;
    if (node) node.style.transform = "none";
  }

  return (
    <span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      onBlur={reset}
      className={`magnet inline-flex ${className}`}
    >
      {children}
    </span>
  );
}
