/**
 * Quiet status indicator. A static dot on purpose: availability is a fact,
 * not an alarm, so nothing pulses at the visitor.
 */
export function StatusDot({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className="inline-block h-[6px] w-[6px] rounded-full bg-[var(--signal)] shadow-[0_0_10px_var(--glow-signal)]" />
      {label ? (
        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">{label}</span>
      ) : null}
    </span>
  );
}
