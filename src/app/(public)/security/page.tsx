import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { CaseToc } from "@/components/site/CaseToc";
import { CopyButton } from "@/components/site/CopyButton";
import { SectionLabel } from "@/components/site/SectionLabel";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "How this site is secured",
  description: "The full response security headers of this site, what each one protects against, and how to report a security issue.",
  alternates: { canonical: "/security" },
};

/* Mirrors what the server actually sends (section 5.6): the live CSP with
   the per-request nonce standing in as a rotating value, plus the static
   protection headers and the HSTS line the public host emits. */
function headersSnippet(): string {
  return `content-security-policy:
  default-src 'self';
  script-src 'self' 'nonce-rotates-per-request' 'strict-dynamic';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self' https://vitals.vercel-insights.com;
  media-src 'self';
  object-src 'none';
  base-uri 'none';
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'none';
  worker-src 'self' blob:;
  manifest-src 'self'
strict-transport-security: max-age=63072000; includeSubDomains; preload
x-content-type-options: nosniff
x-frame-options: DENY
referrer-policy: strict-origin-when-cross-origin
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin`;
}

const protections: { label: string; text: string }[] = [
  {
    label: "Content Security Policy",
    text: "Every HTML response carries a fresh nonce for this request only, with strict-dynamic as the base. Inline styles are the only wildcard, and unknown scripts are refused before they download.",
  },
  {
    label: "Transport security",
    text: "The public host is HTTPS only. HSTS with a two-year max age, subdomains included and preload eligible, so downgrade attempts fail instead of resolving.",
  },
  {
    label: "Framing and isolation",
    text: "DENY framing stops clickjacking, COOP confines the site in its own browsing context, and CORP refuses cross-site reads of its resources.",
  },
  {
    label: "Content sniffing and referrers",
    text: "nosniff stops MIME confusion, and strict-origin-when-cross-origin keeps outbound referrers at origin level, stripping paths and queries.",
  },
  {
    label: "Small attack surface",
    text: "No public admin, no database, no upload endpoint, no runtime secret shipped to the browser. Content ships as typed source files reviewed in Git.",
  },
];

export default function SecurityPage() {
  return (
    <div className="shell pb-[clamp(72px,9vw,128px)] pt-[clamp(40px,7vh,76px)]">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <header className="min-w-0">
          <Reveal y={8}>
            <SectionLabel title="Security" />
          </Reveal>
          <SplitHeadline
            as="h1"
            lines={["How this site", "is secured."]}
            delay={60}
            className="mt-7 text-[clamp(40px,7vw,78px)] font-medium leading-[0.96] tracking-[-0.045em]"
          />
        </header>
        <Reveal delay={200} y={10}>
          <p className="max-w-[52ch] text-pretty text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)] lg:justify-self-end">
            This is a personal site, but I hold it to the standard I would expect from a product team. Here is exactly
            what it sends and what that buys.
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 min-[1100px]:grid-cols-[220px_minmax(0,1fr)] min-[1100px]:gap-16">
        <aside className="min-w-0 self-start min-[1100px]:sticky min-[1100px]:top-28">
          <div className="hidden min-[1100px]:block">
            <CaseToc
              sections={[
                { id: "headers", heading: "Response headers" },
                { id: "protections", heading: "What they buy" },
                { id: "report", heading: "Report an issue" },
              ]}
            />
          </div>
        </aside>

        <div className="min-w-0">
          <section id="headers" className="scroll-mt-32">
            <div className="flex items-center gap-3">
              <span aria-hidden className="font-mono text-[10.5px] tracking-[0.14em] text-[var(--signal)]">01</span>
              <span aria-hidden className="h-px flex-1 bg-[var(--line)]" />
            </div>
            <h2 className="mt-3 text-[length:var(--step-2)] font-medium leading-[var(--leading-snug)] tracking-[-0.02em]">
              The real response headers
            </h2>
            <p className="mt-3 max-w-[62ch] text-pretty text-[13.5px] leading-[var(--leading-body)] text-[var(--fg-muted)]">
              Copied from the live server response. The nonce is regenerated for every request, so what you see below
              stands in for the rotating value.
            </p>
            <div className="shiki-host shiki-plain mt-6">
              <div className="absolute right-2.5 top-2.5 z-10">
                <CopyButton value={headersSnippet()} />
              </div>
              <pre className="font-mono text-[11.5px] leading-[1.7]">
                <code className="overflow-wrap-anywhere">{headersSnippet()}</code>
              </pre>
            </div>
          </section>

          <section id="protections" className="mt-16 scroll-mt-32">
            <div className="flex items-center gap-3">
              <span aria-hidden className="font-mono text-[10.5px] tracking-[0.14em] text-[var(--signal)]">02</span>
              <span aria-hidden className="h-px flex-1 bg-[var(--line)]" />
            </div>
            <h2 className="mt-3 text-[length:var(--step-2)] font-medium leading-[var(--leading-snug)] tracking-[-0.02em]">
              What each header buys
            </h2>
            <dl className="mt-6 grid gap-3">
              {protections.map((item) => (
                <div key={item.label} className="panel-quiet grid gap-1.5 p-5 sm:grid-cols-[210px_minmax(0,1fr)] sm:gap-6">
                  <dt className="text-[13.5px] font-medium text-[var(--fg)]">{item.label}</dt>
                  <dd className="text-pretty text-[13px] leading-[var(--leading-body)] text-[var(--fg-muted)]">{item.text}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="report" className="mt-16 scroll-mt-32">
            <div className="flex items-center gap-3">
              <span aria-hidden className="font-mono text-[10.5px] tracking-[0.14em] text-[var(--signal)]">03</span>
              <span aria-hidden className="h-px flex-1 bg-[var(--line)]" />
            </div>
            <h2 className="mt-3 text-[length:var(--step-2)] font-medium leading-[var(--leading-snug)] tracking-[-0.02em]">
              Report an issue
            </h2>
            <div className="panel mt-6 border-[var(--amber)]/40 p-6">
              <p className="text-pretty text-[13.5px] leading-[var(--leading-body)]">
                If you find a security issue on this site, email{" "}
                <a
                  href={`mailto:${site.email}`}
                  className="link-sweep is-active text-[var(--fg)] underline decoration-[var(--amber)] decoration-2 underline-offset-4 no-underline"
                >
                  {site.email}
                </a>{" "}
                with the details. Please don&apos;t run scanners against it, try to take it down, or access data that
                isn&apos;t yours. I&apos;ll reply, and I&apos;m happy to credit you here if you&apos;d like.
              </p>
              <p className="mt-4">
                <Link
                  href="/.well-known/security.txt"
                  className="link-sweep font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--signal)] no-underline"
                >
                  security.txt
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
