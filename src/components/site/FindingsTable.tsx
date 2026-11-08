import type { Finding } from "@/content/work";

const tone: Record<Finding["severity"], string> = {
  Critical: "text-[var(--danger)] border-[var(--danger)]",
  High: "severity-high",
  Medium: "text-[var(--amber)] border-[var(--amber)]",
  Low: "text-[var(--info)] border-[var(--info)]",
  Info: "text-[var(--fg-muted)] border-[var(--line-strong)]",
};

export function FindingsTable({ rows }: { rows: Finding[] }) {
  return (
    <div className="findings-scroll mt-5 overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-[length:var(--step--1)]">
        <caption className="sr-only">Findings with CVSS v3.1 scores</caption>
        <thead>
          <tr className="border-b border-[var(--line-strong)] font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
            <th className="py-2 pr-4 font-normal">ID</th>
            <th className="py-2 pr-4 font-normal">Finding</th>
            <th className="py-2 pr-4 font-normal">CWE</th>
            <th className="py-2 pr-4 font-normal">CVSS</th>
            <th className="py-2 font-normal">Severity</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-[var(--line)] align-top">
              <td className="py-3 pr-4 font-mono tabular-nums">{row.id}</td>
              <td className="py-3 pr-4">
                {row.title}
                <span className="mt-1 block font-mono text-[12px] text-[var(--fg-subtle)]">{row.vector}</span>
              </td>
              <td className="py-3 pr-4 font-mono">{row.cwe}</td>
              <td className="py-3 pr-4 font-mono tabular-nums">{row.score}</td>
              <td className="py-3">
                <span className={`inline-flex rounded-full border px-2 py-0.5 font-mono text-[12px] uppercase tracking-[0.08em] ${tone[row.severity]}`}>
                  {row.severity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
