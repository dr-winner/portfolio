const alts: Record<string, string> = {
  "llm-agent-security-lab": "Ticket 409 moves through four trust boundaries and stops at the tool policy gate.",
  "healthcare-portal-pentest-lab": "Training lab chain from recon through SQL injection to a CVSS report with remediation recommendations.",
  "aws-threat-detection-as-code": "CloudTrail, GuardDuty, EventBridge rules, Lambda and alerts. cloudtrail-tampering is marked.",
  ghostpass: "Payment and API request lanes stay unlinked. Timing correlation, replay and metadata leaks are named.",
  "osint-network-recon": "Scope narrows through DNS lookups, WAF detection, OSINT tools and Nmap.",
  "offline-password-recovery": "Lab sample PDFs go through John the Ripper to recovered, with an MCP workflow beside the path.",
};

const awsRules = [
  "root-account-activity",
  "console-login-no-mfa",
  "cloudtrail-tampering",
  "iam-persistence",
  "security-group-exposure",
  "guardduty-findings",
];

function Label({ children, className = "" }: { children: string; className?: string }) {
  return <span className={`pv-label ${className}`}>{children}</span>;
}

export function ProjectVisual({ slug }: { slug: string }) {
  const alt = alts[slug];
  if (!alt) return null;
  return (
    <div className={`pv pv-${slug}`} role="img" aria-label={alt}>
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
  const nodes = ["RAG Retriever", "Prompt Context Assembly", "Tool Policy Gate", "Output Sanitizer"];
  return (
    <>
      <svg viewBox="0 0 640 400" aria-hidden>
        <path className="pv-path llm-path" d="M70 80 H150 V150 H250 V150 H470 V270 H250" fill="none" />
        <rect x="150" y="120" width="150" height="64" rx="12" className="pv-node" />
        <rect x="390" y="120" width="180" height="64" rx="12" className="pv-node" />
        <rect x="390" y="250" width="180" height="64" rx="12" className="pv-node pv-hot" />
        <rect x="150" y="250" width="150" height="64" rx="12" className="pv-node" />
        <rect x="36" y="52" width="120" height="36" rx="8" className="pv-chip" />
      </svg>
      <Label className="left-[8%] top-[12%]">ticket #409</Label>
      <Label className="left-[23%] top-[38%]">{nodes[0]}</Label>
      <Label className="left-[62%] top-[38%] max-w-[28%]">{nodes[1]}</Label>
      <Label className="left-[62%] top-[70%] max-w-[28%]">{nodes[2]}</Label>
      <Label className="left-[23%] top-[70%]">{nodes[3]}</Label>
      <span aria-hidden className="pv-packet llm-packet" />
      <span className="pv-pill llm-pill">BLOCKED</span>
    </>
  );
}

function Healthcare() {
  const steps = ["Recon", "Username enumeration", "SQL injection login bypass", "Document access", "Offline cracking"];
  return (
    <>
      <svg viewBox="0 0 640 400" aria-hidden>
        <path className="pv-path hc-path" d="M48 58 H560" fill="none" />
        {steps.map((_, index) => (
          <circle key={index} cx={56 + index * 120} cy={58} r="8" className={`pv-dot hc-dot hc-dot-${index}`} />
        ))}
        <rect x="300" y="250" width="300" height="88" rx="12" className="pv-node hc-card" />
      </svg>
      <span className="pv-tag">Training lab</span>
      <span className="hc-steps">
        {steps.map((step) => (
          <span key={step} className="hc-step">
            {step}
          </span>
        ))}
      </span>
      <p className="hc-final">CVSS v3.1 report with remediation recommendations</p>
    </>
  );
}

function Aws() {
  const nodes = ["CloudTrail", "GuardDuty", "EventBridge rules", "Lambda", "Alerts"];
  return (
    <>
      <svg viewBox="0 0 640 400" aria-hidden>
        <path className="pv-path aws-path" d="M40 90 H600" fill="none" />
        {nodes.map((_, index) => (
          <rect key={nodes[index]} x={28 + index * 122} y={62} width="108" height="56" rx="12" className={`pv-node aws-node aws-node-${index}`} />
        ))}
      </svg>
      <span aria-hidden className="pv-packet aws-packet" />
      <span className="aws-names">
        {nodes.map((node) => (
          <span key={node}>{node}</span>
        ))}
      </span>
      <span className="aws-rules">
        {awsRules.map((rule) => (
          <span key={rule} className={rule === "cloudtrail-tampering" ? "is-alert" : ""}>
            {rule}
          </span>
        ))}
      </span>
    </>
  );
}

function Ghost() {
  return (
    <>
      <svg viewBox="0 0 640 400" aria-hidden>
        <rect x="36" y="70" width="220" height="200" rx="16" className="pv-node" />
        <rect x="384" y="70" width="220" height="200" rx="16" className="pv-node" />
        <path className="pv-path ghost-dash" d="M256 170 H400" fill="none" strokeDasharray="8 8" />
        <path className="ghost-cut" d="M328 150 V190" />
      </svg>
      <Label className="left-[18%] top-[42%]">Payment</Label>
      <Label className="left-[76%] top-[42%]">API requests</Label>
      <span className="ghost-threats">
        {["Timing correlation", "Replay", "Metadata leaks"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </span>
    </>
  );
}

function Osint() {
  const steps = ["DNS lookups", "WAF detection", "OSINT tools", "Nmap"];
  return (
    <>
      <svg viewBox="0 0 640 400" aria-hidden>
        <path className="pv-path os-frame" d="M40 40 H600 V360 H40 Z" fill="none" />
        <path className="pv-path os-frame os-frame-2" d="M90 80 H550 V320 H90 Z" fill="none" />
        <path className="pv-path os-fill" d="M40 200 H560" fill="none" />
      </svg>
      <span className="os-steps">
        {steps.map((step) => (
          <span key={step}>{step}</span>
        ))}
      </span>
    </>
  );
}

function Passwords() {
  return (
    <>
      <svg viewBox="0 0 640 400" aria-hidden>
        <path className="pv-path pw-path" d="M70 180 H470" fill="none" />
        <path className="pv-path pw-branch" d="M270 180 V300 H430" fill="none" />
        <rect x="40" y="140" width="150" height="72" rx="12" className="pv-node" />
        <rect x="230" y="140" width="160" height="72" rx="12" className="pv-node" />
        <rect x="450" y="140" width="140" height="72" rx="12" className="pv-node pv-hot pw-last" />
        <rect x="300" y="268" width="160" height="56" rx="12" className="pv-chip" />
      </svg>
      <Label className="left-[14%] top-[46%]">Lab sample PDFs</Label>
      <Label className="left-[40%] top-[46%]">John the Ripper</Label>
      <Label className="left-[72%] top-[46%]">Recovered</Label>
      <Label className="left-[48%] top-[78%]">MCP workflow</Label>
    </>
  );
}
