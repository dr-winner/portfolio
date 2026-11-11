export function StatementLine({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <h2 aria-label={text} className="statement mt-6 max-w-[18ch] font-semibold text-[var(--fg-strong)]">
      {words.map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden className="statement-word" style={{ ["--i" as string]: String(index) }}>
          {word}{" "}
        </span>
      ))}
    </h2>
  );
}
