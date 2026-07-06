"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({
  children,
  className,
  strength = 0.4,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 22 });
  const springY = useSpring(y, { stiffness: 220, damping: 22 });

  // Engage only on devices with true hover + no reduced-motion preference
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    const hoverMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setEngaged(hoverMq.matches && !reducedMq.matches);
    apply();
    hoverMq.addEventListener("change", apply);
    reducedMq.addEventListener("change", apply);
    return () => {
      hoverMq.removeEventListener("change", apply);
      reducedMq.removeEventListener("change", apply);
    };
  }, []);

  function onMove(e: React.MouseEvent) {
    if (!engaged) return;
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

  return (
    <motion.div
      ref={ref}
      style={engaged ? { x: springX, y: springY } : undefined}
      className={className}
      onMouseMove={engaged ? onMove : undefined}
      onMouseLeave={engaged ? onLeave : undefined}
      data-magnetic={engaged ? "" : undefined}
    >
      {children}
    </motion.div>
  );
}
