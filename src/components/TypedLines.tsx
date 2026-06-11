"use client";

import { useEffect, useRef, useState } from "react";

type Line = { text: string; className?: string };

const HERO_READY_EVENT = "hero:reveal-complete";

export function TypedLines({
  lines,
  speed = 30,
  startDelay = 0,
  className,
  waitForHero = true,
  idleLoopMs = 6000,
}: {
  lines: Line[];
  speed?: number;
  startDelay?: number;
  className?: string;
  waitForHero?: boolean;
  idleLoopMs?: number;
}) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Gate the start of typing on the hero reveal completing
  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLineIdx(lines.length);
      setCharIdx(0);
      setStarted(true);
      return;
    }

    if (!waitForHero) {
      const t = window.setTimeout(() => setStarted(true), startDelay);
      return () => window.clearTimeout(t);
    }

    let armed = true;
    function onReady() {
      if (!armed) return;
      armed = false;
      window.setTimeout(() => setStarted(true), startDelay);
    }

    window.addEventListener(HERO_READY_EVENT, onReady, { once: true });

    // Fallback: if the event never fires (e.g. component not under hero), start after 1.6s
    const fallback = window.setTimeout(() => {
      if (armed) {
        armed = false;
        setStarted(true);
      }
    }, 1600);

    return () => {
      armed = false;
      window.removeEventListener(HERO_READY_EVENT, onReady);
      window.clearTimeout(fallback);
    };
  }, [lines.length, startDelay, waitForHero]);

  // Drive typing
  useEffect(() => {
    if (!started) return;
    if (lineIdx >= lines.length) return;
    const current = lines[lineIdx].text;

    if (charIdx < current.length) {
      timerRef.current = window.setTimeout(
        () => setCharIdx(charIdx + 1),
        speed
      );
      return () => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
      };
    }

    const pause = window.setTimeout(() => {
      setLineIdx(lineIdx + 1);
      setCharIdx(0);
    }, 120);
    return () => window.clearTimeout(pause);
  }, [started, lineIdx, charIdx, lines, speed]);

  // Idle loop: after fully done, wait idleLoopMs then retype the last line once
  useEffect(() => {
    if (!started) return;
    if (lineIdx < lines.length) return;
    if (loopCount >= 1) return;
    if (idleLoopMs <= 0) return;

    const t = window.setTimeout(() => {
      setLoopCount((c) => c + 1);
      setLineIdx(lines.length - 1);
      setCharIdx(0);
    }, idleLoopMs);

    return () => window.clearTimeout(t);
  }, [started, lineIdx, lines.length, loopCount, idleLoopMs]);

  return (
    <div className={className}>
      {lines.map((line, i) => {
        const isActive = i === lineIdx;
        const isDone = i < lineIdx;
        const shown = isDone
          ? line.text
          : isActive
            ? line.text.slice(0, charIdx)
            : "";
        if (!isActive && !isDone) return null;
        return (
          <div key={i} className={line.className}>
            {shown}
            {isActive && (
              <span className="ml-0.5 inline-block w-[0.55ch] animate-cursor-blink text-ocean-600 dark:text-ocean-300">
                ▮
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
