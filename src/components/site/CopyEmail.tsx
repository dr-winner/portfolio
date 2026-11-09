"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
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
      className="group inline-flex items-center gap-3 font-mono text-[13px] text-[var(--fg)]"
    >
      <span
        aria-hidden
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-[var(--dur-2)] ${
          copied
            ? "border-[var(--signal)] bg-[var(--signal)] text-[var(--on-signal)]"
            : "border-[var(--line-strong)] text-[var(--fg-muted)] group-hover:border-[var(--signal)] group-hover:text-[var(--signal)]"
        }`}
      >
        {copied ? "✓" : "⧉"}
      </span>
      <span className={`link-sweep ${copied ? "is-active" : ""}`}>
        {copied ? "COPIED TO CLIPBOARD" : site.email}
      </span>
      <span className="sr-only">{copied ? " copied" : ", copy email address"}</span>
    </button>
  );
}
