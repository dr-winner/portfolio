"use client";

import { useEffect, useState } from "react";

type Line = { text: string; className?: string };

export function TypedLines({
  lines,
  speed = 18,
  startDelay = 200,
  className,
}: {
  lines: Line[];
  speed?: number;
  startDelay?: number;
  className?: string;
}) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLineIdx(lines.length);
      setCharIdx(0);
      return;
    }

    if (lineIdx >= lines.length) return;
    const current = lines[lineIdx].text;

    if (charIdx === 0 && lineIdx === 0) {
      const t = window.setTimeout(() => setCharIdx(1), startDelay);
      return () => window.clearTimeout(t);
    }

    if (charIdx < current.length) {
      const t = window.setTimeout(() => setCharIdx(charIdx + 1), speed);
      return () => window.clearTimeout(t);
    }

    const pause = window.setTimeout(() => {
      setLineIdx(lineIdx + 1);
      setCharIdx(0);
    }, 120);
    return () => window.clearTimeout(pause);
  }, [lineIdx, charIdx, lines, speed, startDelay]);

  return (
    <div className={className}>
      {lines.map((line, i) => {
        const isActive = i === lineIdx;
        const isDone = i < lineIdx;
        const shown = isDone ? line.text : isActive ? line.text.slice(0, charIdx) : "";
        if (!isActive && !isDone) return null;
        return (
          <div key={i} className={line.className}>
            {shown}
            {isActive && <span className="ml-0.5 inline-block w-[0.55ch] animate-cursor-blink text-cyber-300">▮</span>}
          </div>
        );
      })}
    </div>
  );
}
