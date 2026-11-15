const LIVE_LAB = "https://llm-agent-security-lab.vercel.app";
const SOURCE = "https://github.com/dr-winner/llm-agent-security-lab";

const GATES = [
  { stage: "01", name: "RAG retriever", status: "passed" },
  { stage: "02", name: "Prompt assembly", status: "passed" },
  { stage: "03", name: "Tool policy gate", status: "blocked" },
  { stage: "04", name: "Output sanitizer", status: "passed" },
] as const;

/**
 * The lab moved to its own repository, so the case study points at it
 * instead of shipping a second copy of the engine. This card keeps the
 * shape of the old inspector without pretending to run anything.
 */
export function LiveLabCard() {
  return (
    <section
      aria-labelledby="live-lab-heading"
      className="panel edge-glow relative mt-12 overflow-hidden"
    >
      <div className="flex flex-col gap-4 border-b border-[var(--line)] px-[clamp(18px,3vw,28px)] py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-[9px] border border-[var(--line-strong)] bg-[var(--surface-2)]"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="none"
              stroke="var(--signal)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 1.8 13.4 4v3.8c0 3-2.2 5.2-5.4 6.4-3.2-1.2-5.4-3.4-5.4-6.4V4L8 1.8Z" />
              <path d="m5.9 8 1.5 1.6 3-3.2" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
              Lab verifier
            </p>
            <p className="mt-0.5 flex items-center gap-2 text-[12.5px] text-[var(--fg-muted)]">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
              Standalone project, deterministic engine
            </p>
          </div>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-[var(--line-strong)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--fg-subtle)]">
          No live model call
        </span>
      </div>

      <div className="px-[clamp(18px,3vw,28px)] pb-[clamp(20px,3vw,32px)] pt-6">
        <h2
          id="live-lab-heading"
          className="max-w-[26ch] text-[length:var(--step-3)] font-medium leading-[var(--leading-heading)] tracking-[-0.025em]"
        >
          Run the lab against the real engine.
        </h2>
        <p className="mt-3 max-w-[62ch] text-[13.5px] leading-[var(--leading-body)] text-[var(--fg-muted)]">
          The engine, its regression suite and the interactive inspector now live in their own repository and deploy on
          their own. Switch a pipeline between the vulnerable baseline and the hardened build, then read the exact code
          that made the decision.
        </p>

        <ol className="mt-6 grid gap-2 md:grid-cols-2" aria-label="The four gates, scenario 01 in hardened mode">
          {GATES.map((gate) => {
            const blocked = gate.status === "blocked";
            return (
              <li
                key={gate.stage}
                className={`flex items-center gap-3 rounded-[11px] border px-3.5 py-3 ${
                  blocked
                    ? "border-[var(--signal)]/45 bg-[var(--signal-soft)]"
                    : "border-[var(--line)] bg-[color-mix(in_srgb,var(--surface-2)_46%,transparent)]"
                }`}
              >
                <span
                  aria-hidden
                  className={`h-2 w-2 shrink-0 rounded-full ${blocked ? "bg-[var(--signal)]" : "bg-[var(--line-strong)]"}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] tracking-[0.08em] text-[var(--fg-subtle)]">
                    {gate.stage}
                  </span>
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-[var(--fg)]">{gate.name}</span>
                </span>
                <span
                  className={`shrink-0 font-mono text-[9.5px] uppercase tracking-[0.1em] ${
                    blocked ? "text-[var(--signal)]" : "text-[var(--fg-subtle)]"
                  }`}
                >
                  {gate.status}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={LIVE_LAB}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-[var(--signal)] px-4 text-[13px] font-semibold text-[var(--on-signal)] no-underline transition-opacity hover:opacity-90"
          >
            Open the live lab
            <span aria-hidden>↗</span>
          </a>
          <a
            href={SOURCE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[var(--line-strong)] px-4 text-[13px] text-[var(--fg)] no-underline transition-colors hover:border-[var(--signal)]"
          >
            View the source
            <span aria-hidden>↗</span>
          </a>
        </div>

        <p className="mt-6 border-t border-[var(--line)] pt-4 text-[11px] leading-relaxed text-[var(--fg-subtle)]">
          Synthetic tenants, invoices and tickets only. The hardened pipeline never prints a retrieved secret and never
          reports a refund as processed.
        </p>
      </div>
    </section>
  );
}
