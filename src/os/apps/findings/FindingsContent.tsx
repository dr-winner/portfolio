import Link from "next/link";

/* Findings window content for Phase 1, fix 2 of the phase 1 review: a
   scoped placeholder for the CVSS findings list. The sample report it
   points to is the real healthcare portal pentest case study, which says
   remediation recommendations, never claims fixes. */

export function FindingsContent() {
  return (
    <div className="wos-placeholder">
      <p className="wos-window-note">Scope for Phase 2, not built yet.</p>
      <h3 className="wos-listhead">What Findings becomes</h3>
      <ul className="wos-aboutlist">
        <li>The CVSS v3.1 findings list behind the pentest case studies</li>
        <li>One row per finding with severity, evidence and remediation recommendations</li>
        <li>Read only here, reports live as documents</li>
      </ul>
      <p className="wos-window-actions">
        <Link href="/work/healthcare-portal-pentest-lab?view=classic" className="wos-btn wos-btn-ghost" data-wos-open="doc:healthcare-portal-pentest-lab">
          Read the healthcare portal pentest
        </Link>
      </p>
    </div>
  );
}
