import type { Metadata } from "next";
import Link from "next/link";
import { RequestedPath } from "@/components/site/RequestedPath";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-[clamp(20px,5vw,64px)] py-[var(--space-2xl)]">
        <h1 className="text-[length:var(--step-6)] leading-[var(--leading-tight)]">404</h1>
        <p className="text-[length:var(--step-2)]">This page is out of scope.</p>
        <p className="font-mono text-[var(--fg-muted)]">
          GET <RequestedPath /> returned 404. No IDOR here, I checked.
        </p>
        <div>
          <Link href="/" className="inline-flex h-11 items-center rounded-[6px] bg-[var(--signal)] px-5 text-[var(--on-signal)] no-underline">
            Back to home
          </Link>
        </div>
        <ul className="flex gap-5">
          <li><Link href="/work">Work</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
