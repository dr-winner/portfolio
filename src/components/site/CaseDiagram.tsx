/**
 * Small custom SVG diagrams for the case-study cards. Abstract, stroke-based,
 * quiet: hairline structure with the teal accent marking where security lives.
 * Threat territory only: no animation, reduced to one line of explanation.
 */

const stroke = "var(--line-strong)";
const faint = "var(--line)";
const accent = "var(--signal)";
const label = "var(--fg-subtle)";
const muted = "var(--fg-muted)";

function Arrow({ x, y }: { x: number; y: number }) {
  return <path d={`M${x},${y} l5,-3.5 v7 z`} fill={stroke} />;
}

function Node({ x, y, w = 56, h = 30, children }: { x: number; y: number; w?: number; h?: number; children: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="var(--surface)" stroke={stroke} />
      <text
        x={x + w / 2}
        y={y + h / 2 + 3}
        textAnchor="middle"
        fontSize="8.5"
        fontFamily="var(--font-geist-mono), monospace"
        letterSpacing="0.5"
        fill={muted}
      >
        {children}
      </text>
    </g>
  );
}

function BoundaryX({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 3.5},${y - 3.5} l7,7 M${x - 3.5},${y + 3.5} l7,-7`} stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

function LlmAgent() {
  // user -> retriever -> model -> tool executor, four dashed trust boundaries
  return (
    <>
      <g stroke={faint} strokeDasharray="3 3">
        <path d="M72,26 v104" />
        <path d="M148,26 v104" />
        <path d="M224,26 v104" />
        <path d="M300,26 v104" />
      </g>
      <BoundaryX x={72} y={70} />
      <BoundaryX x={148} y={70} />
      <BoundaryX x={224} y={70} />
      <BoundaryX x={300} y={70} />
      <g stroke={stroke}>
        <path d="M28,88 h32" />
        <Arrow x={62} y={88} />
        <path d="M104,88 h32" />
        <Arrow x={138} y={88} />
        <path d="M180,88 h32" />
        <Arrow x={214} y={88} />
        <path d="M256,88 h32" />
        <Arrow x={290} y={88} />
      </g>
      <Node x={10} y={74}>USER</Node>
      <Node x={86} y={74}>RAG</Node>
      <Node x={162} y={74}>MODEL</Node>
      <Node x={238} y={74}>TOOLS</Node>
      <Node x={304} y={74} w={10} h={30}> </Node>
      <text x={52} y={124} textAnchor="middle" fontSize="8" fontFamily="var(--font-geist-mono), monospace" fill={label}>LLM01</text>
      <text x={128} y={124} textAnchor="middle" fontSize="8" fontFamily="var(--font-geist-mono), monospace" fill={label}>LLM02</text>
      <text x={204} y={124} textAnchor="middle" fontSize="8" fontFamily="var(--font-geist-mono), monospace" fill={label}>LLM06</text>
      <text x={280} y={124} textAnchor="middle" fontSize="8" fontFamily="var(--font-geist-mono), monospace" fill={label}>LLM05</text>
    </>
  );
}

function PentestChain() {
  return (
    <>
      <g stroke={stroke}>
        <path d="M42,96 h16" />
        <Arrow x={60} y={96} />
        <path d="M116,60 h16" />
        <Arrow x={134} y={60} />
        <path d="M198,96 h16" />
        <Arrow x={216} y={96} />
        <path d="M272,60 h16" />
        <Arrow x={290} y={60} />
      </g>
      <g stroke={faint} strokeDasharray="3 3">
        <path d="M18,112 h60 q6,0 6,-6 v-14" fill="none" />
      </g>
      <Node x={8} y={82}>RECON</Node>
      <Node x={74} y={46}>ENUM</Node>
      <Node x={148} y={82} w={64}>SQL LOGIN</Node>
      <Node x={220} y={46}>DOCS</Node>
      <Node x={288} y={82} w={30}>REP</Node>
      <g stroke={faint} strokeDasharray="3 3">
        <path d="M74,60 h60 M148,96 h64" />
      </g>
      <circle cx="170" cy="60" r="3" fill="var(--danger)" opacity="0.9" />
      <text x="182" y="63" fontSize="8" fontFamily="var(--font-geist-mono), monospace" fill="var(--danger)">+auth</text>
    </>
  );
}

function CloudFlow() {
  // CloudTrail -> rules -> alerting, six detections marked as teal ticks
  return (
    <>
      <g stroke={stroke}>
        <path d="M86,74 h30" />
        <Arrow x={118} y={74} />
        <path d="M210,74 h30" />
        <Arrow x={242} y={74} />
      </g>
      <Node x={14} y={60} w={68} h={30}>CLOUDTRAIL</Node>
      <Node x={124} y={52} w={82} h={44}>RULES</Node>
      <Node x={250} y={60} w={64} h={30}>ALERTS</Node>
      <g stroke={accent} strokeWidth="1.6" strokeLinecap="round">
        <path d="M148,70 l3,3 5,-6" />
        <path d="M180,70 l3,3 5,-6" />
        <path d="M148,82 l3,3 5,-6" />
        <path d="M180,82 l3,3 5,-6" />
      </g>
      <text x="60" y="112" fontSize="8" fontFamily="var(--font-geist-mono), monospace" fill={label}>6 FINDINGS</text>
      <text x="136" y="112" fontSize="8" fontFamily="var(--font-geist-mono), monospace" fill={label}>CHECKOV PASSED</text>
      <text x="248" y="112" fontSize="8" fontFamily="var(--font-geist-mono), monospace" fill={label}>ATT&amp;CK</text>
    </>
  );
}

function GhostPass() {
  return (
    <>
      <g stroke={stroke}>
        <path d="M66,66 h26" />
        <Arrow x={94} y={66} />
        <path d="M156,66 h26" />
        <Arrow x={184} y={66} />
        <path d="M246,66 h26" />
        <Arrow x={274} y={66} />
      </g>
      <Node x={10} y={52} w={56} h={30}>PAY</Node>
      <Node x={100} y={52} w={56} h={30}>TOKEN</Node>
      <Node x={190} y={52} w={56} h={30}>HOLDER</Node>
      <Node x={278} y={52} w={38} h={30}>API</Node>
      <g stroke={faint} strokeDasharray="3 3">
        <path d="M128,96 v-6" />
        <path d="M218,96 v-6" />
      </g>
      <text x="96" y="108" fontSize="8" fontFamily="var(--font-geist-mono), monospace" fill="var(--warning, var(--amber))">TIMING</text>
      <text x="196" y="108" fontSize="8" fontFamily="var(--font-geist-mono), monospace" fill="var(--warning, var(--amber))">REPLAY</text>
      <text x="262" y="108" fontSize="8" fontFamily="var(--font-geist-mono), monospace" fill="var(--warning, var(--amber))">METADATA</text>
    </>
  );
}

const diagrams = {
  "llm-agent-security-lab": LlmAgent,
  "healthcare-portal-pentest-lab": PentestChain,
  "aws-threat-detection-as-code": CloudFlow,
  ghostpass: GhostPass,
} as const;

export type CaseDiagramVariant = keyof typeof diagrams;

export function CaseDiagram({ variant, className }: { variant: CaseDiagramVariant; className?: string }) {
  const Diagram = diagrams[variant];
  if (!Diagram) return null;
  return (
    <svg viewBox="0 0 344 132" fill="none" aria-hidden className={className}>
      <Diagram />
    </svg>
  );
}
