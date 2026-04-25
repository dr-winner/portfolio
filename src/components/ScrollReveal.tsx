"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import clsx from "clsx";

type Direction = "up" | "down" | "left" | "right" | "none";

/**
 * ScrollReveal: ties opacity + translate to an element's own scroll progress
 * across the viewport. Element fades and slides in as it enters from the
 * bottom, sits visible while crossing, then fades out as it leaves the top.
 */
export function ScrollReveal({
  children,
  className,
  from = "up",
  amount = 60,
  fadeOut = true,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  from?: Direction;
  amount?: number;
  fadeOut?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Wider "visible" band: less jarring show/hide on long pages
  const opacityStops = fadeOut ? [0, 0.12, 0.88, 1] : [0, 0.12, 1, 1];
  const opacityValues = fadeOut ? [0, 1, 1, 0] : [0, 1, 1, 1];
  const opacity = useTransform(scrollYProgress, opacityStops, opacityValues);

  const translateAxis = from === "left" || from === "right" ? "x" : "y";
  const sign = from === "down" || from === "right" ? 1 : -1;
  const start = from === "none" ? 0 : sign * -amount;
  const end = from === "none" || !fadeOut ? 0 : sign * amount;

  const translate = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [start, 0, 0, end]
  );

  const style: { opacity: MotionValue<number>; x?: MotionValue<number>; y?: MotionValue<number> } = {
    opacity,
  };
  if (translateAxis === "x") style.x = translate;
  else style.y = translate;

  return (
    <motion.div
      ref={ref}
      style={{ ...style, transitionDelay: `${delay}ms` }}
      className={clsx(className)}
    >
      {children}
    </motion.div>
  );
}
