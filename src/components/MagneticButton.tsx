"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { MAGNETIC } from "@/config/motion.config";

interface Props {
  children: ReactNode;
  className?: string;
  /** Fraction of cursor offset to apply — 0.35 is default */
  strength?: number;
}

/**
 * Wraps any element and makes it drift slightly toward the cursor on hover.
 * Uses a spring so it settles back smoothly when the mouse leaves.
 * No-ops under prefers-reduced-motion.
 */
export function MagneticButton({
  children,
  className,
  strength = MAGNETIC.strength,
}: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, {
    stiffness: MAGNETIC.stiffness,
    damping: MAGNETIC.damping,
    mass: 1,
  });
  const y = useSpring(rawY, {
    stiffness: MAGNETIC.stiffness,
    damping: MAGNETIC.damping,
    mass: 1,
  });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set((e.clientX - cx) * strength);
    rawY.set((e.clientY - cy) * strength);
  }

  function onLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: "inline-flex" }}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
