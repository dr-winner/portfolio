import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${profile.name}'s portfolio handles analytics, waitlist details, and browser storage.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main id="main" className="min-h-screen py-20 sm:py-28">
      <article className="container max-w-3xl">
        <Link
          href="/"
          className="link-hover font-mono text-sm text-ocean-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-300 dark:text-ocean-300"
        >
          ← Back to portfolio
        </Link>

        <header className="mt-10 border-b border-slate-200 pb-8 dark:border-white/10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ocean-700 dark:text-ocean-300">
            Privacy notice
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-tight text-slate-950 sm:text-5xl dark:text-white">
            Clear, minimal data handling.
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Last updated August 11, 2026
          </p>
        </header>

        <div className="mt-10 space-y-10 text-[16px] leading-7 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="font-display text-2xl text-slate-950 dark:text-white">What is collected</h2>
            <p className="mt-3">
              If you join the cloud-security cohort waitlist, the site stores the email address you
              submit and, if provided, your name. First-party telemetry may record page paths,
              coarse device/browser information, referral information, and interaction event names.
              Visitor IP addresses are not stored directly by the application; they are converted
              into short-lived, salted visitor buckets for abuse prevention and aggregate analysis.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-slate-950 dark:text-white">Why it is used</h2>
            <p className="mt-3">
              Waitlist details are used only to communicate material cohort launch or early-access
              information. Telemetry is used to understand whether the portfolio works correctly and
              which public sections are useful. Submitted information is not sold.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-slate-950 dark:text-white">Browser storage</h2>
            <p className="mt-3">
              Theme preference and animation state may be stored in your browser. If you use the site
              console, its visible conversation history is stored locally in your browser for up to
              24 hours so the session can continue. You can clear this at any time through your
              browser&apos;s site-data controls.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-slate-950 dark:text-white">Service providers</h2>
            <p className="mt-3">
              The site is hosted on Vercel and may use Vercel Analytics in production. Project images
              uploaded by the site administrator may be stored in Vercel Blob. Database records are
              hosted by the configured managed PostgreSQL provider. These providers process data
              under their own security and privacy terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-slate-950 dark:text-white">Your choices</h2>
            <p className="mt-3">
              You may request access to or deletion of waitlist information by emailing{" "}
              <a className="link-hover text-ocean-700 dark:text-ocean-300" href={`mailto:${profile.email}`}>
                {profile.emailObfuscated}
              </a>
              . Include the email address used for signup so the record can be located. You can also
              decline the waitlist and use the rest of the portfolio without submitting personal
              information.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
