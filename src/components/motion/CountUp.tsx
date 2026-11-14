"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type CountUpProps = {
  to: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
};

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function CountUp({ to, duration = 650, className = "", prefix = "", suffix = "" }: CountUpProps) {
  const [value, setValue] = useState<number>(0);
  const nodeRef = useRef<HTMLSpanElement | null>(null);
  const started = useRef<boolean>(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(to);
      return;
    }

    const node = nodeRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setValue(to);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();

          function step(now: number) {
            const elapsed = now - start;
            const progress = Math.min(1, elapsed / duration);
            const current = Math.round(to * easeOutCubic(progress));
            setValue(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setValue(to);
            }
          }

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={nodeRef} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
