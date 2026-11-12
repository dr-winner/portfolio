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

/* Section 5.7: centred, calm, no scramble or caret effects. The requested
   path comes from the server and is truncated inside RequestedPath. */
export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col text-[var(--fg)]">
      <a href="#content" className="skip-link">Skip to content</a>
      <BackgroundFx />
      <SiteHeader />
      <main id="content" className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center gap-6 px-[clamp(20px,5vw,64px)] py-[var(--space-2xl)] text-center">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">HTTP 404</p>
        <h1 className="text-[length:var(--step-6)] leading-[var(--leading-tight)] tracking-[-0.02em]">404</h1>
        <p className="text-[length:var(--step-2)] leading-[var(--leading-snug)] text-[var(--fg-muted)]">
          This page is out of scope.
        </p>
        <p className="max-w-[70ch] font-mono text-[13px] text-[var(--fg-muted)]">
          GET <RequestedPath /> returned 404.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="btn-sweep inline-flex h-11 items-center rounded-[var(--radius-control)] bg-[var(--signal)] px-5 font-medium text-[var(--on-signal)] no-underline"
          >
            Back home
          </Link>
          <Link
            href="/work"
            className="inline-flex h-11 items-center rounded-[var(--radius-control)] border border-[var(--line-strong)] px-5 font-medium text-[var(--fg)] no-underline transition-colors duration-[var(--dur-1)] hover:border-[var(--signal)] hover:text-[var(--signal)]"
          >
            View case studies
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
