"use client";

import { BackgroundFx } from "@/components/site/BackgroundFx";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="relative flex min-h-[70vh] flex-col justify-center bg-[var(--bg)] px-[clamp(20px,5vw,64px)] text-[var(--fg)]">
      <BackgroundFx />
      <main className="mx-auto w-full max-w-[1280px] py-[var(--space-xl)]">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--danger)]">[ RUNTIME FAULT · TRACE CAPTURED ]</p>
        <h1 className="mt-4 text-balance text-[length:var(--step-3)] leading-[var(--leading-tight)]">
          This page failed to load.
          <span aria-hidden className="fx-caret ml-2 font-mono text-[0.5em] font-normal tracking-normal text-[var(--danger)]" />
        </h1>
        <p className="mt-3 max-w-[68ch] font-mono text-[13px] text-[var(--fg-muted)]">
          Reference {error.digest ?? "unknown"} — the failure is logged on my side, nothing is leaked to the console.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="btn-sweep inline-flex h-11 items-center rounded-[6px] bg-[var(--signal)] px-5 font-medium text-[var(--on-signal)]"
          >
            Retry
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-[6px] border border-[var(--line-strong)] px-5 font-medium text-[var(--fg)] no-underline transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
          >
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
