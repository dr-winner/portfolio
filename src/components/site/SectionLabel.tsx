type SectionLabelProps = {
  title: string;
};

/**
 * Quiet section header: a single mono word with a hairline that grows on
 * reveal in. No index, no brackets: the label is just the word.
 */
export function SectionLabel({ title }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
        {title}
      </span>
      <span aria-hidden className="fx-rule h-px w-auto flex-1 bg-[var(--line)]" />
    </div>
  );
}
