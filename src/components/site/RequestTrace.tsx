export function RequestTrace() {
  return (
    <div className="trace-card" aria-hidden>
      <div className="trace-scan" />
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Trace · login</p>
        <p className="trace-pill">403 blocked</p>
      </div>
      <p className="font-mono text-[12px] text-[var(--signal)]">POST /v1/login HTTP/1.1</p>
      <p className="mt-1 font-mono text-[12px] text-[var(--fg-subtle)]">host: app.internal</p>
      <pre className="trace-body">{`{"username":"admin' --","password":"••••"}`}</pre>
      <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3 font-mono text-[12px]">
        <span className="uppercase tracking-[0.12em] text-[var(--fg-muted)]">rule auth.sqli</span>
        <span className="text-[var(--danger)]">query tamper</span>
      </div>
      <pre className="trace-body trace-out">{`HTTP/1.1 403 Forbidden
{"ok":false,"blocked":"query-tamper"}`}</pre>
    </div>
  );
}
