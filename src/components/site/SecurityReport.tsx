"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCspViolations, subscribeCsp } from "@/lib/motion";

export function SecurityReport({ variant = "chip" }: { variant?: "chip" | "panel" }) {
  const [open, setOpen] = useState(variant === "panel");
  const [secure, setSecure] = useState<boolean | null>(null);
  const [framed, setFramed] = useState<boolean | null>(null);
  const [violations, setViolations] = useState(0);

  useEffect(() => {
    setSecure(window.isSecureContext);
    try {
      setFramed(window.top !== window);
    } catch {
      setFramed(true);
    }
    setViolations(getCspViolations());
    return subscribeCsp(() => setViolations(getCspViolations()));
  }, []);

  const body = (
    <div className="security-pop">
      <p>Secure context: {secure === null ? "checking" : secure ? "yes" : "no"}</p>
      <p>CSP violations this visit: {violations}</p>
      <p>Framed by another site: {framed === null ? "checking" : framed ? "yes" : "no"}</p>
      <p className="mt-2 flex gap-3">
        <Link href="/security" className="text-[var(--signal)] no-underline">
          Security
        </Link>
        <Link href="/.well-known/security.txt" className="text-[var(--signal)] no-underline">
          security.txt
        </Link>
      </p>
    </div>
  );

  if (variant === "panel") {
    return (
      <aside className="mt-6 max-w-[64ch] rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-5">
        <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Checked in your browser</p>
        <div className="mt-3 font-mono text-[13px] leading-[1.6] text-[var(--fg)]">{body}</div>
      </aside>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--line-strong)] px-3 font-mono text-[12px] text-[var(--fg)]"
      >
        <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--signal)]" />
        Checked in your browser
      </button>
      {open ? <div className="security-pop-wrap badge-pop">{body}</div> : null}
    </div>
  );
}
