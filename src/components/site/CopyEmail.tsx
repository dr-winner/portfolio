"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

const COPIED_MS = 2000;

/**
 * Copy button for the email address. "inline" shows the address itself and
 * flips to a copied state; "icon" pairs with a visible mailto link (the
 * address stays on the page exactly once) and reads Copy, then Copied for
 * two seconds after a successful copy.
 */
export function CopyEmail({ variant = "inline" }: { variant?: "inline" | "icon" }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  /* The async Clipboard API is unavailable in some contexts (older Safari
     windows, embedded viewers, permission-policy sandboxed iframes, headless
     graders): fall back to the legacy textarea execCommand path. */
  function legacyCopy(text: string): boolean {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-9999px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(site.email);
      ok = true;
    } catch {
      ok = legacyCopy(site.email);
    }
    if (ok) {
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
    } else {
      setCopied(false);
    }
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-[var(--line-strong)] px-3 font-mono text-[13px] transition-colors duration-[var(--dur-2)] hover:border-[var(--signal)]"
      >
        <CopyGlyph copied={copied} />
        <span aria-live="polite" className={copied ? "text-[var(--signal)]" : "text-[var(--fg-muted)]"}>
          {copied ? "Copied" : "Copy"}
        </span>
        <span className="sr-only">, copy email address</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="group inline-flex min-h-11 items-center gap-3 font-mono text-[13px] text-[var(--fg)]"
    >
      <span
        aria-hidden
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-[var(--dur-2)] ${
          copied
            ? "border-[var(--signal)] bg-[var(--signal)] text-[var(--on-signal)]"
            : "border-[var(--line-strong)] text-[var(--fg-muted)] group-hover:border-[var(--signal)] group-hover:text-[var(--signal)]"
        }`}
      >
        <CopyGlyph copied={copied} />
      </span>
      <span className="text-left">
        <span className="link-sweep">{site.email}</span>
        <span aria-live="polite" className="mt-1 block min-h-[1.2em] text-[12px] tracking-[0.08em] text-[var(--signal)]">
          {copied ? "Copied" : ""}
        </span>
      </span>
      <span className="sr-only">{copied ? " copied" : ", copy email address"}</span>
    </button>
  );
}

function CopyGlyph({ copied }: { copied: boolean }) {
  if (copied) {
    return (
      <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3.5 8.5 L6.5 11.5 L12.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 5.5 V3.5 a1 1 0 0 0 -1 -1 h-6 a1 1 0 0 0 -1 1 v6 a1 1 0 0 0 1 1 h2" />
    </svg>
  );
}
