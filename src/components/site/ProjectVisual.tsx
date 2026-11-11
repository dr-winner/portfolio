import type { ReactNode } from "react";

const alts: Record<string, string> = {
  "llm-agent-security-lab": "Ticket 409 moves through four trust boundaries and stops at the tool policy gate.",
  "healthcare-portal-pentest-lab": "Training lab chain from recon through SQL injection to a CVSS report with remediation recommendations.",
  "aws-threat-detection-as-code": "CloudTrail, GuardDuty, EventBridge rules, Lambda and alerts. cloudtrail-tampering is marked.",
  ghostpass: "Payment and API request lanes stay unlinked. Timing correlation, replay and metadata leaks are named.",
  "osint-network-recon": "Scope narrows through DNS lookups, WAF detection, OSINT tools and Nmap.",
  "offline-password-recovery": "Lab sample PDFs go through John the Ripper to recovered, with an MCP workflow beside the path.",
};

const awsNodes = ["CloudTrail", "GuardDuty", "EventBridge", "Lambda", "Alerts"];
const awsRules = [
  "root-account-activity",
  "console-login-no-mfa",
  "cloudtrail-tampering",
  "iam-persistence",
  "security-group-exposure",
  "guardduty-findings",
];

function Node({ children, hot = false, className = "" }: { children: ReactNode; hot?: boolean; className?: string }) {
  return <div className={`pv-node ${hot ? "is-hot" : ""} ${className}`}>{children}</div>;
}

export function ProjectVisual({ slug }: { slug: string }) {
  const alt = alts[slug];
  if (!alt) return null;
  return (
    <div className={`pv-board pv-${slug}`} role="img" aria-label={alt}>
      {slug === "llm-agent-security-lab" ? <Llm /> : null}
      {slug === "healthcare-portal-pentest-lab" ? <Healthcare /> : null}
      {slug === "aws-threat-detection-as-code" ? <Aws /> : null}
      {slug === "ghostpass" ? <Ghost /> : null}
      {slug === "osint-network-recon" ? <Osint /> : null}
      {slug === "offline-password-recovery" ? <Passwords /> : null}
    </div>
  );
}

function Llm() {
  return (
    <>
      <Node className="pv-ticket">ticket #409</Node>
      <div className="pv-llm-grid">
        <Node>RAG Retriever</Node>
        <Node>Prompt Context Assembly</Node>
        <Node>Output Sanitizer</Node>
        <Node hot className="pv-gate">
          <span>Tool Policy Gate</span>
          <span className="pv-blocked">BLOCKED</span>
        </Node>
      </div>
    </>
  );
}

function Healthcare() {
  const steps = ["Recon", "Username enumeration", "SQL injection login bypass", "Document access", "Offline cracking"];
  return (
    <>
      <ol className="pv-steps">
        {steps.map((step, index) => (
          <li key={step} className="pv-step">
            <span aria-hidden className="pv-index">{String(index + 1).padStart(2, "0")}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <Node className="pv-report">CVSS v3.1 report with remediation recommendations</Node>
    </>
  );
}

function Aws() {
  return (
    <>
      <div className="pv-aws-flow">
        {awsNodes.map((node, index) => (
          <Node key={node} hot={index === awsNodes.length - 1}>{node}</Node>
        ))}
      </div>
      <div className="pv-rules">
        {awsRules.map((rule) => (
          <span key={rule} className={rule === "cloudtrail-tampering" ? "is-alert" : ""}>{rule}</span>
        ))}
      </div>
    </>
  );
}

function Ghost() {
  return (
    <>
      <Node>Payment</Node>
      <div className="pv-cut" aria-hidden>
        <span />
      </div>
      <Node>API requests</Node>
      <div className="pv-threats">
        {["Timing correlation", "Replay", "Metadata leaks"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </>
  );
}

function Osint() {
  const steps = ["DNS lookups", "WAF detection", "OSINT tools", "Nmap"];
  return (
    <ol className="pv-steps pv-steps-fill">
      {steps.map((step, index) => (
        <li key={step} className="pv-step">
          <span aria-hidden className="pv-index">{String(index + 1).padStart(2, "0")}</span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

function Passwords() {
  return (
    <>
      <div className="pv-pass-main">
        <Node>Lab sample PDFs</Node>
        <Node>John the Ripper</Node>
        <Node hot>Recovered</Node>
      </div>
      <Node className="pv-branch">MCP workflow</Node>
    </>
  );
}
