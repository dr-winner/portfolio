"use client";

import { useState } from "react";
import { site } from "@/content/site";

export function CopyEmail() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="font-mono text-[length:var(--step--1)] text-[var(--fg-muted)] underline-offset-4 hover:text-[var(--fg)]"
    >
      {copied ? "Copied" : site.email}
      <span className="sr-only">{copied ? " copied" : ", copy email address"}</span>
    </button>
  );
}
