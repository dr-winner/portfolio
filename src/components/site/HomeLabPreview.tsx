import Link from "next/link";

const LIVE_LAB = "https://llm-agent-security-lab.vercel.app";

/**
 * A compact snapshot of the LLM lab on the home page. The lab itself is a
 * standalone project now, so this stays static: it shows scenario 01 in
 * hardened mode and links out to the live engine. No retrieved text is
 * printed, and nothing claims a refund executed.
 */
const TRACE = [
  {
    stage: "01 Retrieval",
    status: "passed",
    detail: "Pre-retrieval ACL filter kept the search inside the caller's tenant.",
  },
  {
    stage: "02 Prompt",
    status: "passed",
    detail: "The untrusted ticket was wrapped as data and the override directive was neutralised.",
  },
  {
    stage: "03 Tool gate",
    status: "blocked",
    detail: "A customer session is not allowed to call the refund tool, with or without a token.",
  },
  {
    stage: "04 Output",
    status: "passed",
    detail: "No executable markup or external beacon reached the renderer.",
  },
] as const;

export function HomeLabPreview() {
  return (
    <div className="home-lab panel edge-glow">
      <div className="home-lab-head">
        <div className="min-w-0">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--signal)]">See it work</p>
          <h3 className="mt-2 max-w-[24ch] text-[length:var(--step-2)] font-medium leading-[var(--leading-snug)] tracking-[-0.02em]">
            One ticket, one gate at a time.
          </h3>
          <p className="mt-2 max-w-[54ch] text-[13px] leading-[var(--leading-body)] text-[var(--fg-muted)]">
            Ticket 409 asks the assistant for a $450 refund the caller was never allowed to issue. The hardened pipeline
            stops it at the tool gate. The lab now runs as a standalone project, so you can switch the pipeline and watch
            every stage decide.
          </p>
        </div>
        <a href={LIVE_LAB} target="_blank" rel="noreferrer" className="home-lab-link">
          Open the live lab
          <span aria-hidden className="arrow-shift">↗</span>
        </a>
      </div>

      <div className="home-lab-meta">
        <span>Scenario 01</span>
        <span aria-hidden>·</span>
        <span>Hardened pipeline</span>
        <span className="home-lab-meta-note">Saved snapshot</span>
      </div>

      <div className="home-lab-body">
        <div className="home-lab-outcome">
          <span aria-hidden className="home-lab-outcome-mark">✓</span>
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em]">Attack blocked</p>
            <p className="mt-1 text-[12.5px] leading-snug text-[var(--fg)]">
              The boundary held and the unauthorized action never executed.
            </p>
          </div>
          <span className="home-lab-outcome-tag">BLOCKED</span>
        </div>

        <ol className="home-lab-trace" aria-label="Execution trace snapshot">
          {TRACE.map((step) => (
            <li key={step.stage} className="home-lab-step" data-status={step.status}>
              <span aria-hidden className="home-lab-step-dot" />
              <div className="min-w-0">
                <p className="home-lab-step-name">{step.stage}</p>
                <p className="home-lab-step-detail">{step.detail}</p>
              </div>
              <span className="home-lab-step-state">{step.status}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="home-lab-note">
        Synthetic tenants only. Hardened mode never prints a retrieved secret and never reports a refund as processed.{" "}
        <Link href="/work/llm-agent-security-lab" className="text-[var(--fg-muted)] underline decoration-[var(--line-strong)] underline-offset-2 hover:text-[var(--signal)]">
          Read the case study
        </Link>
        .
      </p>
    </div>
  );
}
