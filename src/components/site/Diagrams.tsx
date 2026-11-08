export function Diagram({ slug }: { slug: string }) {
  if (slug === "healthcare-portal-pentest-lab") {
    return (
      <div className="diagram">
        <p className="diagram-kicker">Attack chain</p>
        <ol className="mt-3 space-y-2">
          {["Recon", "Username enumeration", "SQL injection login bypass", "Document access", "Offline cracking", "Metadata review"].map((step, index) => (
            <li key={step} className="flex items-center gap-3 font-mono text-[12px] text-[var(--fg)]">
              <span className="text-[var(--signal)]">{String(index + 1).padStart(2, "0")}</span>
              <span className="h-px flex-1 bg-[var(--line-strong)]" />
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (slug === "aws-threat-detection-as-code") {
    const steps = ["CloudTrail", "GuardDuty", "EventBridge", "Lambda", "SNS"];
    return (
      <div className="diagram">
        <p className="diagram-kicker">Detection path</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {steps.map((step, index) => (
            <span key={step} className="flex items-center gap-2">
              <span className="rounded-[6px] border border-[var(--line-strong)] px-2 py-1 font-mono text-[12px]">{step}</span>
              {index < steps.length - 1 ? <span className="text-[var(--signal)]">→</span> : null}
            </span>
          ))}
        </div>
        <p className="mt-4 font-mono text-[12px] text-[var(--fg-muted)]">6 rules · Checkov in CI</p>
      </div>
    );
  }

  if (slug === "ghostpass") {
    return (
      <div className="diagram">
        <p className="diagram-kicker">Unlinkable use</p>
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 font-mono text-[12px]">
          <span className="rounded-[6px] border border-[var(--line-strong)] px-3 py-3">Payment</span>
          <span className="text-[var(--amber)]">no link</span>
          <span className="rounded-[6px] border border-[var(--signal)] px-3 py-3 text-[var(--signal)]">Token</span>
        </div>
        <p className="mt-4 text-[12px] text-[var(--fg-muted)]">Blind signature. Spent hash. No request log.</p>
      </div>
    );
  }

  if (slug === "offline-password-recovery") {
    return (
      <div className="diagram">
        <p className="diagram-kicker">Lab sample</p>
        <p className="mt-3 font-mono text-[12px] text-[var(--fg-muted)]">$pdf$ 128 bit</p>
        <p className="mt-2 font-mono text-[18px] tracking-[0.2em] text-[var(--fg)]">1qaz2wsx</p>
        <p className="mt-3 text-[12px] text-[var(--fg-muted)]">Keyboard walk. Same secret on the second sample.</p>
      </div>
    );
  }

  return (
    <div className="diagram">
      <p className="diagram-kicker">In scope</p>
      <div className="mt-4 flex flex-wrap gap-2 font-mono text-[12px]">
        {["DNS", "WAF", "OSINT", "Nmap"].map((tool) => (
          <span key={tool} className="rounded-full border border-[var(--line-strong)] px-2 py-1">
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}
