export function ProofStrip({ items }: { items: { value: string; label: string }[] }) {
  return (
    <section className="relative z-[3] border-y border-[var(--line)] bg-[var(--bg)]">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 px-[clamp(24px,4vw,40px)] md:grid-cols-3">
        {items.map((item, index) => (
          <div key={item.label} className="relative flex items-baseline gap-4 py-6 md:px-6">
            {index > 0 ? <span aria-hidden className="proof-rule" /> : null}
            <span className="font-semibold leading-none tracking-[-0.04em] text-[var(--fg-strong)] [font-size:clamp(48px,8vw,64px)]">
              {item.value}
            </span>
            <span className="max-w-[24ch] text-[14px] leading-snug text-[var(--fg-muted)]">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
