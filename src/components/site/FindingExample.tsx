const LINE = "Recommendation: parameterized queries on the username lookup";

export function FindingExample() {
  return (
    <div className="mt-5 rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] px-4 py-3">
      <div className="flex flex-wrap items-center gap-3 font-mono text-[12px]">
        <span className="sev sev-high">High</span>
        <span className="text-[20px] text-[var(--fg-strong)]">7.5</span>
        <span className="text-[var(--fg)]">SQL injection login bypass</span>
      </div>
      <p className="mt-2 font-mono text-[12px] text-[var(--fg-subtle)]">{LINE}</p>
    </div>
  );
}
