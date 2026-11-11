import Link from "next/link";

/* Terminal window content for Phase 1, fix 2 of the phase 1 review: a
   scoped placeholder that states the real Phase 2 scope and links the
   case study that defines it. No fake prompt, no fake output. */

export function TerminalContent() {
  return (
    <div className="wos-placeholder">
      <p className="wos-window-note">Scope for Phase 2, not built yet.</p>
      <h3 className="wos-listhead">What Terminal becomes</h3>
      <ul className="wos-aboutlist">
        <li>A command surface for the site with real commands: open, doc, help</li>
        <li>Output rendered as text nodes, never markup, by design</li>
        <li>Keyboard first, with history and the OS shortcuts left untouched</li>
      </ul>
      <p className="wos-window-actions">
        <Link href="/work/llm-agent-security-lab?view=classic" className="wos-btn wos-btn-ghost" data-wos-open="doc:llm-agent-security-lab">
          Read the Agent Lab case study
        </Link>
      </p>
    </div>
  );
}
