import Link from "next/link";

/* Proxy window content for Phase 1, fix 2 of the phase 1 review: a
   scoped placeholder for the inspecting proxy designed in the Agent Lab
   case study. No fake request panel, no fake traffic. */

export function ProxyContent() {
  return (
    <div className="wos-placeholder">
      <p className="wos-window-note">Scope for Phase 2, not built yet.</p>
      <h3 className="wos-listhead">What the Proxy becomes</h3>
      <ul className="wos-aboutlist">
        <li>A local inspecting proxy view for the LLM agent lab demos</li>
        <li>Request and response traces rendered as text nodes, never markup</li>
        <li>Prompt injection scenarios from the case study, replayed safely</li>
      </ul>
      <p className="wos-window-actions">
        <Link href="/work/llm-agent-security-lab?view=classic" className="wos-btn wos-btn-ghost" data-wos-open="doc:llm-agent-security-lab">
          Read the Agent Lab case study
        </Link>
      </p>
    </div>
  );
}
