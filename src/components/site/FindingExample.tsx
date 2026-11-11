"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const LINE = "Recommendation: parameterized queries on the username lookup";

export function FindingExample() {
  const [on, setOn] = useState(true);
  const [cvss, setCvss] = useState(7.5);
  const [text, setText] = useState(LINE);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const node = ref.current;
    if (!node) return undefined;
    let played = false;
    function play() {
      if (played) return;
      played = true;
      setOn(false);
      setCvss(0);
      setText("");
      window.setTimeout(() => setOn(true), 80);
      const start = performance.now();
      function frame(now: number) {
        const t = Math.min(1, (now - start) / 400);
        setCvss(Math.round(7.5 * (1 - Math.pow(1 - t, 3)) * 10) / 10);
        if (t < 1) requestAnimationFrame(frame);
        else setCvss(7.5);
      }
      requestAnimationFrame(frame);
      let count = 0;
      const timer = window.setInterval(() => {
        count += 1;
        setText(LINE.slice(0, count));
        if (count >= LINE.length) window.clearInterval(timer);
      }, 10);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="mt-5 rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] px-4 py-3">
      <div className="flex flex-wrap items-center gap-3 font-mono text-[12px]">
        <span className={`sev sev-high ${on ? "badge-pop" : "opacity-0"}`}>High</span>
        <span className="text-[20px] text-[var(--fg-strong)]">{cvss.toFixed(1)}</span>
        <span className="text-[var(--fg)]">SQL injection login bypass</span>
      </div>
      <p className="mt-2 min-h-[1.4em] font-mono text-[12px] text-[var(--fg-subtle)]">{text}</p>
    </div>
  );
}
