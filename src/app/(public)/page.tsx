import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CaseLink } from "@/components/site/CaseLink";
import { CopyEmail } from "@/components/site/CopyEmail";
import { Diagram } from "@/components/site/Diagrams";
import { HeroStage } from "@/components/site/HeroStage";
import { Magnetic } from "@/components/site/Magnetic";
import { certifications } from "@/content/certifications";
import { cvHref, mailto, site } from "@/content/site";
import { work } from "@/content/work";
import { headers } from "next/headers";
import { personSchema, profilePageSchema, webSiteSchema } from "@/lib/structured-data";

const proof = [
  {
    index: "01",
    text: "A full web app pentest in a NetworkWalks training lab: SQL injection login bypass and a CVSS v3.1 report with remediation recommendations.",
    href: "/work/healthcare-portal-pentest-lab",
  },
  {
    index: "02",
    text: "Six AWS threat detections written in Terraform, mapped to MITRE ATT&CK and checked by Checkov in CI.",
    href: "/work/aws-threat-detection-as-code",
  },
  {
    index: "03",
    text: "Cybersecurity intern at TechBiz Security on the ethical hacking and SOC tracks.",
    href: "/about#experience",
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

      <HeroStage />

      <section className="band">
        <h2 className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Evidence</h2>
        <ol className="mt-6 grid gap-4 lg:grid-cols-3">
          {proof.map((item) => (
            <li key={item.index}>
              <Link href={item.href} className="proof-link block h-full border-t border-[var(--line-strong)] py-4 no-underline">
                <span className="font-mono text-[12px] text-[var(--signal)]">{item.index}</span>
                <span className="mt-2 block text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg)]">{item.text}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="band band-ink">
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">What I do</p>
        <h2 className="mt-3 max-w-[18ch] text-balance text-[length:var(--step-4)] leading-[var(--leading-tight)] tracking-[-0.02em]">
          I look for what breaks, and I explain how to fix it.
        </h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {practices.map((item) => (
            <article key={item.index} className="border-t border-[var(--line)] pt-4">
              <p className="font-mono text-[12px] text-[var(--fg-subtle)]">{item.index}</p>
              <h3 className="mt-3 text-[length:var(--step-2)]">{item.title}</h3>
              <p className="mt-3 text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="band">
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Selected work</p>
        <h2 className="mt-3 text-[length:var(--step-4)] leading-[var(--leading-tight)]">Case studies</h2>
        <ul className="mt-8 grid gap-4 xl:grid-cols-3">
          {featured.map((item) => (
            <li key={item.slug}>
              <CaseLink href={`/work/${item.slug}`} className="case-card spotlight flex h-full flex-col no-underline">
                <div className="case-card-media" style={{ viewTransitionName: `case-${item.slug}` }}>
                  <Diagram slug={item.slug} />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap gap-2">
                    {item.badges.map((badge) => (
                      <Badge key={badge}>{badge}</Badge>
                    ))}
                  </div>
                  <h3 className="mt-4 text-[length:var(--step-2)] text-[var(--fg)]">{item.title}</h3>
                  <p className="mt-3 text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">{item.card}</p>
                  <span className="mt-6 text-[var(--signal)]">Read case study</span>
                </div>
              </CaseLink>
            </li>
          ))}
        </ul>
        <Link href="/work" className="mt-6 inline-block text-[var(--signal)]">
          All work
        </Link>
      </section>

      <section className="band band-ink">
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Credentials</p>
        <p className="mt-4 text-[length:var(--step-0)]">
          <span className="text-[var(--fg-muted)]">Earned. </span>
          {earned.map((item) => item.name).join(" · ")}
        </p>
        <p className="mt-2 text-[length:var(--step-0)]">
          <span className="text-[var(--fg-muted)]">In progress. </span>
          {progress.map((item) => item.name).join(" · ")}
        </p>
        <Link href="/about" className="mt-4 inline-block text-[var(--signal)]">
          Full background
        </Link>
      </section>

      <section className="band-close">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-[clamp(20px,5vw,64px)] py-[clamp(96px,14vh,160px)]">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--signal)]">Contact</p>
          <h2 className="max-w-[14ch] text-balance text-[length:var(--step-5)] leading-[var(--leading-tight)]">
            Hiring for application security? Let&apos;s talk.
          </h2>
          <p className="max-w-[68ch] text-[length:var(--step-1)] leading-[var(--leading-body)]">{site.availability}</p>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <Button href={mailto}>Email me</Button>
            </Magnetic>
            <Magnetic>
              <Button href={cvHref} variant="secondary">
                Download CV
              </Button>
            </Magnetic>
          </div>
          <CopyEmail />
        </div>
      </section>
    </>
  );
}
