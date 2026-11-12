export function Badge({ children }: { children: string }) {
  const lab = children.toLowerCase() === "training lab" || children.toLowerCase() === "lab";
  const ai = children.toLowerCase().includes("llm") || children.toLowerCase().includes("ai");
  const color = lab
    ? { border: "border-[var(--amber)]/50 text-[var(--amber)]", dot: "bg-[var(--amber)]" }
    : ai
      ? { border: "border-[var(--ai)]/40 text-[var(--ai)]", dot: "bg-[var(--ai)]" }
      : { border: "border-[var(--line-strong)] text-[var(--fg-muted)]", dot: "bg-[var(--fg-subtle)]" };

  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 font-mono text-[10.5px] uppercase tracking-[0.12em] transition-colors duration-[var(--dur-1)] ${color.border}`}
    >
      <span aria-hidden className={`h-1 w-1 rounded-full ${color.dot}`} />
      {children}
    </span>
  );
}
