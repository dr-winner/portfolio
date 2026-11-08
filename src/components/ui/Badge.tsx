export function Badge({ children }: { children: string }) {
  const lab = children.toLowerCase() === "training lab" || children.toLowerCase() === "lab";
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full border px-2 font-mono text-[12px] uppercase tracking-[0.12em] ${
        lab
          ? "border-[var(--amber)] text-[var(--amber)]"
          : "border-[var(--line-strong)] text-[var(--fg-muted)]"
      }`}
    >
      {children}
    </span>
  );
}
