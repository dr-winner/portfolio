"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export function ProofStrip({ items }: { items: { value: string; label: string }[] }) {
  const [display, setDisplay] = useState(items.map((item) => item.value));
  const [drawn, setDrawn] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return undefined;
    let played = false;
    const targets = items.map((item) => Number(item.value));
    function play() {
      if (played) return;
      played = true;
      setDrawn(true);
      const start = performance.now();
      function frame(now: number) {
        const t = Math.min(1, (now - start) / 600);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(targets.map((value) => String(Math.round(value * eased))));
        if (t < 1) requestAnimationFrame(frame);
        else setDisplay(targets.map(String));
      }
      requestAnimationFrame(frame);
    }
    if (typeof IntersectionObserver === "undefined") {
      play();
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [items]);

  return (
    <section ref={ref} className="relative z-0 border-y border-[var(--line)] lg:pt-8">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 px-[clamp(24px,4vw,40px)] md:grid-cols-3">
        {items.map((item, index) => (
          <div key={item.label} className="relative flex items-baseline gap-4 py-6 md:px-6">
            {index > 0 ? <span aria-hidden className={`proof-rule ${drawn ? "is-in" : ""}`} /> : null}
            <span className="font-semibold leading-none tracking-[-0.04em] text-[var(--fg-strong)] [font-size:clamp(48px,8vw,64px)]">
              {display[index]}
            </span>
            <span className="max-w-[24ch] text-[14px] leading-snug text-[var(--fg-muted)]">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
