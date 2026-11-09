import type { Metadata } from "next";
import Link from "next/link";
import { RequestedPath } from "@/components/site/RequestedPath";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { BackgroundFx } from "@/components/site/BackgroundFx";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen text-[var(--fg)]">
      <BackgroundFx />
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-6 px-[clamp(20px,5vw,64px)] py-[var(--space-2xl)]">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--danger)]">[ HTTP 404 · ROUTE NOT FOUND ]</p>
        <h1 className="text-[length:var(--step-6)] leading-[var(--leading-tight)]">
          404
          <span aria-hidden className="fx-caret font-mono text-[0.5em] font-normal tracking-normal text-[var(--danger)]" />
        </h1>
        <p className="text-[length:var(--step-2)]">This page is out of scope.</p>
        <p className="max-w-[68ch] font-mono text-[var(--fg-muted)]">
          GET <RequestedPath /> returned 404. No IDOR here, I checked.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/"
            className="btn-sweep inline-flex h-11 items-center rounded-[6px] bg-[var(--signal)] px-5 font-medium text-[var(--on-signal)] no-underline"
          >
            Back to home
          </Link>
          {[
            ["/work", "Work"],
            ["/about", "About"],
            ["/contact", "Contact"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="inline-flex h-11 items-center rounded-[6px] border border-[var(--line-strong)] px-5 font-medium text-[var(--fg)] no-underline transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
            >
              {label}
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
