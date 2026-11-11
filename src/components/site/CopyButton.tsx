"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Small copy affordance for build-time-highlighted code blocks (section 5.3).
 * Shows its state inline; nothing animates under reduced motion.
 */
export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-11 items-center rounded-[6px] border border-[var(--line)] px-3 font-mono text-[12px] text-[var(--fg-subtle)] transition-colors duration-[var(--dur-1)] hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
