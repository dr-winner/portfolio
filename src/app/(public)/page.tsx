import Link from "next/link";
import { headers } from "next/headers";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { CopyEmail } from "@/components/site/CopyEmail";
import { SectionLabel } from "@/components/site/SectionLabel";
import { StatusDot } from "@/components/site/StatusDot";
import { Ticker } from "@/components/site/Ticker";
import { ThreatMap } from "@/components/site/ThreatMap";
import { certifications } from "@/content/certifications";
import { cvHref, mailto, site } from "@/content/site";
import { skills } from "@/content/skills";
import { work } from "@/content/work";
import { personSchema, profilePageSchema, webSiteSchema } from "@/lib/structured-data";

const proof = [
  {
    index: "01",
    tag: "AI / LLM",
    accent: "var(--ai)",
    text: "An AI/LLM agent security lab testing indirect prompt injection, cross-tenant RAG leaks, and excessive agency across five OWASP LLM Top 10 attack paths, verified in CI.",
    href: "/work/llm-agent-security-lab",
  },
  {
    index: "02",
    tag: "WEB / API",
    accent: "var(--signal)",
    text: "A full web app pentest in a NetworkWalks training lab: SQL injection login bypass and a CVSS v3.1 report with remediation recommendations.",
    href: "/work/healthcare-portal-pentest-lab",
  },
  {
    index: "03",
    tag: "CLOUD",
    accent: "var(--info)",
    text: "Six AWS threat detections written in Terraform, mapped to MITRE ATT&CK and checked by Checkov in CI.",
    href: "/work/aws-threat-detection-as-code",
  },
];

const practices = [
  {
    index: "01",
    title: "Web and API testing",
    text: "I test web applications and APIs for broken access control, authentication flaws and injection, following the OWASP Top 10 and the OWASP API Security Top 10.",
  },
  {
    index: "02",
    title: "Findings teams can act on",
    text: "Every finding comes with the steps to reproduce it, a CVSS v3.1 score and a clear recommendation, like moving to parameterized queries or enforcing role checks on the server.",
  },
  {
    index: "03",
    title: "AI and LLM app security",
    text: "My focus area is the security of LLM features: prompt injection, unsafe output handling and tools with more access than they need. I use the OWASP Top 10 for LLM Applications as the frame.",
  },
];

const tickerItems = [
  "OWASP TOP 10",
  "LLM PROMPT INJECTION",
  "MITRE ATT&CK",
  "BURP SUITE",
  "TERRAFORM",
  "CHECKOV",
  "CLOUDTRAIL",
  "NMAP",
  "KALI LINUX",
  "TYPESCRIPT · REACT · NEXT.JS",
  "CVSS v3.1",
  "DETECTION AS CODE",
];


export default async function HomePage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const featured = work.filter((item) => item.kind === "case-study");
  const earned = certifications.filter((item) => item.status === "earned");
  const progress = certifications.filter((item) => item.status !== "earned");

  return (
    <>
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema()) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema()) }} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-[clamp(20px,5vw,64px)] pb-10 pt-28">
        <ThreatMap className="z-0" />
        {/* Corner registration ticks */}
        <span aria-hidden className="absolute left-[clamp(8px,1.5vw,20px)] top-[clamp(70px,8vh,96px)] h-4 w-4 border-l border-t border-[var(--line-strong)]" />
        <span aria-hidden className="absolute right-[clamp(8px,1.5vw,20px)] top-[clamp(70px,8vh,96px)] h-4 w-4 border-r border-t border-[var(--line-strong)]" />
        <span aria-hidden className="absolute bottom-[clamp(8px,1.5vh,20px)] left-[clamp(8px,1.5vw,20px)] h-4 w-4 border-b border-l border-[var(--line-strong)]" />
        <span aria-hidden className="absolute bottom-[clamp(8px,1.5vh,20px)] right-[clamp(8px,1.5vw,20px)] h-4 w-4 border-b border-r border-[var(--line-strong)]" />
        {/* Boot scanline — sweeps the console once on arrival */}
        <span
          aria-hidden
          className="fx-boot-sweep absolute inset-x-0 top-0 z-[5] h-[76px]"
          style={{
            background:
              "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--signal) 10%, transparent) 46%, transparent)",
            filter: "blur(1px)",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-[1280px] flex-1">
          <Reveal delay={0} y={10}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--fg-muted)]">
                [ 5.5560° N · 0.1969° W — Accra, GH · {new Date().getFullYear()} ]
              </p>
              <StatusDot label={site.availabilityShort} />
            </div>
          </Reveal>

          <Reveal delay={90} y={0} variant="mask">
            <h1 className="mt-8 text-balance text-[length:var(--step-6)] font-medium leading-[var(--leading-tight)] tracking-[-0.035em]">
              Application
              <br />
              <span className="inline-flex items-baseline">
                Security
                <span aria-hidden className="fx-caret ml-3 font-mono font-normal tracking-normal text-[0.55em] text-[var(--signal)]" />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200} y={16}>
            <p className="mt-5 text-[length:var(--step-3)] leading-[var(--leading-snug)] text-[var(--fg-muted)]">
              Web, API &amp; <span className="text-[var(--ai)]">AI/LLM</span> App Security
            </p>
          </Reveal>

          <Reveal delay={300} y={16}>
            <p className="mt-6 max-w-[60ch] text-pretty text-[length:var(--step-1)] leading-[var(--leading-body)]">
              I test web applications and APIs for security flaws and write CVSS-scored findings that engineering teams can act on. I build frontends for a living, so I read an app from the{" "}
              <em className="font-serif text-[1.08em] not-italic" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic" }}>
                inside
              </em>{" "}
              before I test it from the outside.
            </p>
          </Reveal>

          <Reveal delay={400} y={14}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/work">View my work</Button>
              <Button href={cvHref} variant="secondary" download>
                Download CV
              </Button>
            </div>
          </Reveal>

          <Reveal delay={480} y={12}>
            <p className="mt-7 font-mono text-[13px] text-[var(--fg-muted)]">
              <span aria-hidden className="fx-type" style={{ [("--type-w" as string)]: "57ch", [("--type-delay" as string)]: "0.85s" }}>
                &gt; finds what breaks · explains the fix · ships guardrails
              </span>
            </p>
          </Reveal>
        </div>

        {/* Hero foot: stat rail + scroll cue */}
        <div className="relative z-10 mx-auto mt-14 w-full max-w-[1280px]">
          <Reveal delay={520} y={12}>
            <ol className="grid grid-cols-1 gap-px border-t border-[var(--line)] sm:grid-cols-3">
              {[
                { value: 5, suffix: "+", decimals: 0, pad: true, label: "OWASP LLM attack paths tested" },
                { value: 6, suffix: "", decimals: 0, pad: true, label: "AWS detections mapped to ATT&CK" },
                { value: 3.1, suffix: "", decimals: 1, pad: false, label: "CVSS scoring on every finding" },
              ].map((stat) => (
                <li key={stat.label} className="flex items-baseline gap-3 border-t border-[var(--line)] py-4 sm:border-t-0">
                  <span className="font-mono text-[length:var(--step-2)] leading-none text-[var(--signal)] tabular-nums">
                    <CountUp to={stat.value} decimals={stat.decimals} pad={stat.pad} />
                    {stat.suffix ? <span aria-hidden>{stat.suffix}</span> : null}
                  </span>
                  <span className="max-w-[24ch] text-[length:var(--step--1)] leading-snug text-[var(--fg-muted)]">{stat.label}</span>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={640} y={0}>
            <div className="mt-8 flex items-center justify-center">
              <span aria-hidden className="fx-cue font-mono text-[12px] text-[var(--fg-subtle)]">
                ↓
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 01 · Evidence log ────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] pb-[var(--space-2xl)] pt-[var(--space-2xl)]">
        <Reveal>
          <SectionLabel index="01" title="Evidence" />
        </Reveal>
        <ol className="mt-8 flex flex-col">
          {proof.map((item, i) => (
            <Reveal key={item.href} as="li" delay={i * 90}>
              <Link
                href={item.href}
                className="group relative grid gap-2 border-t border-[var(--line)] py-5 no-underline transition-colors duration-[var(--dur-2)] hover:bg-[color-mix(in_srgb,var(--signal)_4%,transparent)] md:grid-cols-[72px_120px_1fr] md:items-baseline md:gap-6"
              >
                <span aria-hidden className="absolute inset-y-0 left-0 w-0 border-l-2 border-[var(--signal)] transition-all duration-[var(--dur-2)] group-hover:w-3" />
                <span className="pl-4 font-mono text-[12px] text-[var(--fg-subtle)] transition-colors group-hover:text-[var(--signal)]">
                  &gt; {item.index}
                </span>
                <span className="pl-4 font-mono text-[12px] uppercase tracking-[0.14em] md:pl-0" style={{ color: item.accent }}>{item.tag}</span>
                <span className="relative pl-4 text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg)] transition-transform duration-[var(--dur-2)] group-hover:translate-x-1 md:pl-0">
                  {item.text}
                  <span aria-hidden className="arrow-shift ml-2 inline-block font-mono text-[var(--signal)] opacity-0 transition-opacity group-hover:opacity-100">
                    ↗
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
          <li aria-hidden className="border-t border-[var(--line)]" />
        </ol>
      </section>

      {/* ── 02 · Practice ────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] pb-[var(--space-2xl)]">
        <Reveal>
          <SectionLabel index="02" title="Practice" tone="muted" />
        </Reveal>
        <Reveal delay={80} y={0} variant="mask">
          <h2 className="mt-6 max-w-[18ch] text-balance text-[length:var(--step-4)] leading-[var(--leading-tight)] tracking-[-0.02em]">
            I look for what breaks, and I explain how to fix it.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {practices.map((item, i) => (
            <Reveal key={item.index} as="article" delay={120 + i * 100} className="group relative">
              <div className="fx-corner relative flex h-full flex-col rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-6 console-card">
                <span aria-hidden className="fx-ghost-index absolute right-4 top-3.5 font-mono text-[length:var(--step-3)] font-bold leading-none">
                  {item.index}
                </span>
                <h3 className="relative mt-5 max-w-[80%] text-[length:var(--step-2)] leading-[var(--leading-snug)]">{item.title}</h3>
                <p className="relative mt-4 text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">{item.text}</p>
                <span aria-hidden className="fx-rule mt-6 h-px w-full bg-[var(--line)]" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 03 · Selected work ───────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] pb-[var(--space-2xl)]">
        <Reveal>
          <SectionLabel index="03" title="Selected Work" />
        </Reveal>
        <Reveal delay={80} y={0} variant="mask">
          <h2 className="mt-6 text-[length:var(--step-4)] leading-[var(--leading-tight)]">Case studies</h2>
        </Reveal>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {featured.map((item, i) => (
            <Reveal key={item.slug} as="li" delay={120 + i * 100} className="group">
              <Link href={`/work/${item.slug}`} className="console-card fx-corner relative block h-full rounded-[12px] border border-[var(--line)] bg-[var(--surface)] no-underline">
                <div
                  aria-hidden
                  className="relative h-28 overflow-hidden rounded-t-[12px] border-b border-[var(--line)] fx-gridline"
                  style={{
                    ["--grid-size" as string]: "22px",
                    background: "linear-gradient(160deg, var(--glow-signal), transparent 55%, var(--glow-ai))",
                  }}
                >
                  <span className="fx-ghost-index absolute right-4 top-2 font-mono text-[length:var(--step-6)] font-bold leading-none opacity-70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Badge>{item.kind === "case-study" ? "Case Study" : item.kind}</Badge>
                  <span className="absolute bottom-2 left-4 font-mono text-[11px] tracking-[0.14em] text-[var(--fg-subtle)]">
                    /{item.slug}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {item.badges.map((badge) => (
                      <Badge key={badge}>{badge}</Badge>
                    ))}
                  </div>
                  <h3 className="mt-4 text-[length:var(--step-2)] leading-[var(--leading-snug)] text-[var(--fg)]">{item.title}</h3>
                  <p className="mt-3 text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">{item.card}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--signal)]">
                    Read case study
                    <span aria-hidden className="arrow-shift">
                      ↗
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={340} y={10}>
          <Link href="/work" className="link-sweep mt-8 inline-block font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--signal)] no-underline">
            All work →
          </Link>
        </Reveal>
      </section>

      {/* ── 04 · Credentials ─────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] pb-[var(--space-2xl)]">
        <Reveal>
          <SectionLabel index="04" title="Credentials" tone="muted" />
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <Reveal delay={100} className="group">
            <div className="fx-corner console-card h-full rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-6">
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--signal)]">[ EARNED ]</p>
              <ul className="mt-4 flex flex-col gap-3">
                {earned.map((item) => (
                  <li key={item.name} className="flex items-baseline justify-between gap-4">
                    <span>
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noreferrer" className="link-sweep text-[var(--fg)] no-underline hover:text-[var(--signal)]">
                          {item.name}
                        </a>
                      ) : (
                        <span className="text-[var(--fg)]">{item.name}</span>
                      )}
                      <span className="block text-[length:var(--step--1)] text-[var(--fg-muted)]">{item.issuer}</span>
                    </span>
                    <span className="font-mono text-[12px] text-[var(--fg-subtle)]">{item.year ?? "—"}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={200} className="group">
            <div className="fx-corner console-card h-full rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-6">
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--ai)]">[ IN PROGRESS ]</p>
              <ul className="mt-4 flex flex-col gap-3">
                {progress.map((item) => (
                  <li key={item.name} className="flex items-baseline justify-between gap-4">
                    <span>
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noreferrer" className="link-sweep text-[var(--fg)] no-underline hover:text-[var(--ai)]">
                          {item.name}
                        </a>
                      ) : (
                        <span className="text-[var(--fg)]">{item.name}</span>
                      )}
                      <span className="block text-[length:var(--step--1)] text-[var(--fg-muted)]">{item.issuer}</span>
                    </span>
                    {typeof item.progress === "number" ? (
                      <span className="font-mono text-[12px] text-[var(--fg-subtle)]">{item.progress}%</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
        <Reveal delay={300} y={12}>
          <div className="mt-8">
            <Ticker items={[...tickerItems, ...skills.map((s) => s.title.toUpperCase())]} duration={60} />
          </div>
        </Reveal>
        <Reveal delay={380} y={10}>
          <Link href="/about" className="link-sweep mt-6 inline-block font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--signal)] no-underline">
            Full background →
          </Link>
        </Reveal>
      </section>

      {/* ── 05 · Contact ─────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)]">
        <Reveal>
          <div className="fx-corner relative overflow-hidden rounded-[20px] border border-[var(--line-strong)] bg-[var(--surface)]">
            <div aria-hidden className="absolute inset-0 fx-dots opacity-50" />
            <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-90" style={{ background: "radial-gradient(closest-side, var(--glow-signal), transparent 75%)" }} />
            <div aria-hidden className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full opacity-90" style={{ background: "radial-gradient(closest-side, var(--glow-ai), transparent 80%)" }} />
            <div className="relative flex flex-col gap-6 p-[clamp(28px,6vw,72px)]">
              <SectionLabel index="05" title="Contact" tone="ai" />
              <Reveal delay={80} y={0} variant="mask">
                <h2 className="max-w-[16ch] text-balance text-[length:var(--step-5)] leading-[var(--leading-tight)]">
                  Hiring for application security? Let&apos;s talk.
                </h2>
              </Reveal>
              <Reveal delay={160} y={14}>
                <p className="max-w-[68ch] text-[length:var(--step-1)] leading-[var(--leading-body)] text-[var(--fg-muted)]">{site.availability}</p>
              </Reveal>
              <Reveal delay={240} y={12}>
                <div className="flex flex-wrap gap-3">
                  <Button href={mailto}>Email me</Button>
                  <Button href={cvHref} variant="secondary" download>
                    Download CV
                  </Button>
                </div>
              </Reveal>
              <Reveal delay={320} y={10}>
                <CopyEmail />
              </Reveal>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
