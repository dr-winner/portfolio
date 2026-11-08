import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { CommandHotkey } from "@/components/site/CommandHotkey";
import { DecryptTitle } from "@/components/site/DecryptTitle";
import { Magnetic } from "@/components/site/Magnetic";
import { OpenCommand } from "@/components/site/OpenCommand";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

function requestedPath(value: string | null) {
  const path = value && value.startsWith("/") ? value : "/";
  return path.replace(/[^\x20-\x7E]/g, "").slice(0, 80);
}

export default async function NotFound() {
  const path = requestedPath((await headers()).get("x-pathname"));

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <SiteHeader />
      <CommandHotkey />
      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-[clamp(20px,5vw,64px)] py-[var(--space-2xl)]">
        <DecryptTitle text="404" className="text-[length:var(--step-6)] leading-[var(--leading-tight)]" />
        <p className="text-[length:var(--step-2)]">This page is out of scope.</p>
        <p className="font-mono text-[var(--fg-muted)]">GET {path} returned 404. No IDOR here, I checked.</p>
        <div className="flex flex-wrap gap-3">
          <Magnetic>
            <Link href="/" className="inline-flex h-11 items-center rounded-[6px] bg-[var(--signal)] px-5 text-[var(--on-signal)] no-underline">
              Back to home
            </Link>
          </Magnetic>
          <OpenCommand className="inline-flex h-11 items-center rounded-[6px] border border-[var(--line-strong)] px-5">
            Open the command menu
          </OpenCommand>
        </div>
        <ul className="flex gap-5">
          <li>
            <Link href="/work">Work</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
