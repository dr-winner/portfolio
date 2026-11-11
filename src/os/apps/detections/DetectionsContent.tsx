import Link from "next/link";

/* Detections window content for Phase 1, fix 2 of the phase 1 review: a
   scoped placeholder for the detections workspace. The six AWS detections
   mapped to MITRE ATT&CK live in the real case study. */

export function DetectionsContent() {
  return (
    <div className="wos-placeholder">
      <p className="wos-window-note">Scope for Phase 2, not built yet.</p>
      <h3 className="wos-listhead">What Detections becomes</h3>
      <ul className="wos-aboutlist">
        <li>The AWS detection rules from the threat detection case study, one card each</li>
        <li>Every rule mapped to its MITRE ATT&CK technique</li>
        <li>Event flows rendered as text nodes, never markup</li>
      </ul>
      <p className="wos-window-actions">
        <Link href="/work/aws-threat-detection-as-code?view=classic" className="wos-btn wos-btn-ghost" data-wos-open="doc:aws-threat-detection-as-code">
          Read the AWS threat detection case study
        </Link>
      </p>
    </div>
  );
}
