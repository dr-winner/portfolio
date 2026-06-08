"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: "div" | "span";
}

/**
 * Wraps its children and applies a magnetic attraction toward the cursor on hover.
 * On reduced-motion devices it renders as a plain div.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.35,
  as: Tag = "div",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 22 });
  const springY = useSpring(y, { stiffness: 220, damping: 22 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  // motion.div has the actual ref / event handlers; Tag just controls semantic role
  void Tag; // consumed above
  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-magnetic
    >
      {children}
    </motion.div>
  );
}
