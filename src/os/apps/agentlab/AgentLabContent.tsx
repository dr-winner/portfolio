import Link from "next/link";

/* Agent Lab window content for Phase 1, fix 2 of the phase 1 review: a
   scoped placeholder. The five attack paths it will demo are the real
   scenarios from the case study engine, listed without inventing UI. */

export function AgentLabContent() {
  return (
    <div className="wos-placeholder">
      <p className="wos-window-note">Scope for Phase 2, not built yet.</p>
      <h3 className="wos-listhead">What the Agent Lab becomes</h3>
      <ul className="wos-aboutlist">
        <li>An interactive lab for the five OWASP LLM attack paths in the case study</li>
        <li>Scenario runs against a local engine, results rendered as text nodes</li>
        <li>A findings list that maps each run to the case study write up</li>
      </ul>
      <p className="wos-window-actions">
        <Link href="/work/llm-agent-security-lab?view=classic" className="wos-btn wos-btn-ghost" data-wos-open="doc:llm-agent-security-lab">
          Read the Agent Lab case study
        </Link>
      </p>
    </div>
  );
}
