/**
 * Small custom SVG diagrams for the case-study cards. Abstract, stroke-based,
 * quiet: hairline node boxes with the teal accent marking where security
 * lives. Threat territory only: no animation, one line of explanation per
 * card. Thumbnails carry no text labels: the shared viewBox scales any
 * label below the 11px floor, so the geometry alone (boxes, arrows,
 * boundaries, ticks) hints at the topology, and meaning lives in the card
 * title and tags. Arrow shafts leave the source node by 3 units and land
 * 2 units short of the target edge, so no stray ticks ever overlap.
 */

const stroke = "var(--line-strong)";
const faint = "var(--line)";
const accent = "var(--signal)";

function N({ x, y, w = 56, h = 30, hl = false }: { x: number; y: number; w?: number; h?: number; hl?: boolean }) {
  return <rect x={x} y={y} width={w} height={h} rx="6" fill="var(--surface)" stroke={hl ? accent : stroke} />;
}

function Arrow({ x2, y, x1 }: { x2: number; y: number; x1: number }) {
  return (
    <g>
      <path d={`M${x1},${y} H${x2 - 7}`} stroke={stroke} fill="none" />
      <path d={`M${x2 - 2},${y} l-5,-3.5 v7 z`} fill={stroke} stroke="none" />
    </g>
  );
}

/* Vertical dash marking a trust boundary, with the teal cross tick where an
   attack path crosses it. */
function Boundary({ x, y1 = 14, y2 = 90, cy = (14 + 90) / 2 }: { x: number; y1?: number; y2?: number; cy?: number }) {
  return (
    <>
      <path d={`M${x},${y1} V${y2}`} stroke={faint} strokeDasharray="3 4" fill="none" />
      <path d={`M${x - 4},${cy} h8`} stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
    </>
  );
}

function Tick({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x},${y} l2.5,3 4.5,-6`}
      stroke={accent}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

/* Pinned threat on the ghostpass thumb: dashed amber hook pointing at the
   box it threatens, without any label text. */
function Hazard({ x, up = true }: { x: number; up?: boolean }) {
  const startY = up ? 10 : 94;
  const endY = up ? 24 : 80;
  return (
    <path d={`M${x},${startY} V${endY}`} stroke="var(--amber)" strokeDasharray="2.5 3.5" strokeLinecap="round" fill="none" />
  );
}

function LlmAgent() {
  // user -> retriever -> model -> tools, dashed boundaries between the gaps
  const boxes = [
    { x: 10, w: 64 },
    { x: 97, w: 64 },
    { x: 184, w: 64 },
    { x: 271, w: 64 },
  ];
  const xs = boxes.map((b) => b.x + b.w);
  return (
    <>
      {[85.5, 172.5, 259.5].map((x) => (
        <Boundary key={x} x={x} />
      ))}
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={xs[i] + 3} x2={boxes[i + 1].x} y={52} />
      ))}
      {boxes.map((b, i) => (
        <N key={b.x} x={b.x} y={37} w={b.w} hl={i > 0} />
      ))}
    </>
  );
}

function PentestChain() {
  // recon -> enum -> sqli -> docs -> report, the breach step marked in teal
  const boxes = [
    { x: 12, w: 44 },
    { x: 80, w: 44 },
    { x: 148, w: 52 },
    { x: 224, w: 48 },
    { x: 296, w: 36 },
  ];
  const xs = boxes.map((b) => b.x + b.w);
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <Arrow key={i} x1={xs[i] + 3} x2={boxes[i + 1].x} y={52} />
      ))}
      {boxes.map((b, i) => (
        <N key={b.x} x={b.x} y={37} w={b.w} hl={i === 2} />
      ))}
      <circle cx={174} cy={52} r="3" fill="var(--danger)" />
    </>
  );
}

function CloudFlow() {
  // cloudtrail -> rules (the six checked detections) -> alerts
  return (
    <>
      <Arrow x1={99} x2={120} y={52} />
      <Arrow x1={227} x2={248} y={52} />
      <N x={12} y={37} w={84} />
      <N x={120} y={29} w={104} h={46} hl />
      <N x={248} y={37} w={76} />
      {[132, 152, 172, 132, 152, 172].map((x, i) => (
        <Tick key={i} x={x} y={i < 3 ? 43 : 59} />
      ))}
    </>
  );
}

function GhostPass() {
  // payment -> token -> unlinkable request -> api, three pinned threats
  const boxes = [
    { x: 12, w: 68 },
    { x: 99, w: 72 },
    { x: 189, w: 88 },
    { x: 296, w: 36 },
  ];
  const xs = boxes.map((b) => b.x + b.w);
  return (
    <>
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={xs[i] + 3} x2={boxes[i + 1].x} y={52} />
      ))}
      {boxes.map((b, i) => (
        <N key={b.x} x={b.x} y={37} w={b.w} hl={i === 2} />
      ))}
      <Hazard x={46} up />
      <Hazard x={135} up={false} />
      <Hazard x={314} up />
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
    <svg viewBox="0 0 344 104" fill="none" aria-hidden className={className}>
      <Diagram />
    </svg>
  );
}
