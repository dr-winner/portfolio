import type { CSSProperties } from "react";

/**
 * Large per-case-study figures (section 5.3). Each variant ships two layouts:
 * the wide composed diagram for md and up, and a simplified vertical pipeline
 * for small screens (section 6). Strokes marked [data-draw] and node groups
 * marked [data-node] carry a --d stage index; CSS draws them in sequence once
 * the figure enters the viewport. Scripting off or reduced motion: the CSS
 * guard never hides them, so the final diagram is simply visible.
 */

const M = "var(--font-geist-mono), monospace";

function styleVar(d: number): CSSProperties {
  return { ["--d" as string]: d } as CSSProperties;
}

function N({
  d,
  x,
  y,
  w = 104,
  h = 34,
  hl = false,
  children,
}: {
  d: number;
  x: number;
  y: number;
  w?: number;
  h?: number;
  hl?: boolean;
  children: string;
}) {
  return (
    <g data-node style={styleVar(d)}>
      <rect x={x} y={y} width={w} height={h} rx="9" fill="var(--surface)" stroke={hl ? "var(--signal)" : "var(--line-strong)"} />
      <text
        x={x + w / 2}
        y={y + h / 2 + 3.5}
        textAnchor="middle"
        fontSize="9"
        fontFamily={M}
        letterSpacing="0.4"
        fill={hl ? "var(--signal)" : "var(--fg-muted)"}
      >
        {children}
      </text>
    </g>
  );
}

function A({ d, x, y, to }: { d: number; x: number; y: number; to: number }) {
  return (
    <g data-draw data-node style={styleVar(d)}>
      <path pathLength={1} d={`M${x},${y} H${to - 8}`} stroke="var(--line-strong)" fill="none" />
      <path d={`M${to},${y} l-8,-4.2 v8.4 z`} fill="var(--line-strong)" stroke="none" />
    </g>
  );
}

function Mark({ d, x, y, children }: { d: number; x: number; y: number; children: string }) {
  return (
    <g data-node style={styleVar(d)}>
      <rect x={x} y={y} width={22} height={17} rx="4" fill="var(--surface)" stroke="var(--signal)" />
      <text x={x + 11} y={y + 12} textAnchor="middle" fontSize="9" fontFamily={M} fill="var(--signal)">
        {children}
      </text>
    </g>
  );
}

function Threat({ d, x, y, children }: { d: number; x: number; y: number; children: string }) {
  return (
    <g data-node style={styleVar(d)}>
      <text x={x} y={y} textAnchor="middle" fontSize="10" fontFamily={M} letterSpacing="0.5" fill="var(--amber)">
        {children}
      </text>
    </g>
  );
}

function Cap({ children }: { children: string }) {
  return (
    <figcaption className="mt-3 font-mono text-[11px] leading-relaxed text-[var(--fg-subtle)]">
      {children}
    </figcaption>
  );
}

/* ── LLM agent lab: user to DOM, four dashed trust boundaries, five paths ── */

function LlmWide() {
  const ns = ["USER", "RAG RETRIEVER", "PROMPT ASSEMBLY", "MODEL", "TOOL EXECUTOR", "DOM RENDERER"];
  const xs = [16, 146, 276, 406, 536, 666];
  const bounds = [
    { x: 129, ref: "LLM08 · LLM02", marks: ["02"] },
    { x: 259, ref: "LLM01", marks: ["01"] },
    { x: 489, ref: "LLM06 · API1", marks: ["03", "04"] },
    { x: 649, ref: "LLM05", marks: ["05"] },
  ];
  return (
    <svg viewBox="0 0 780 320" role="img" aria-label="Agent pipeline with four trust boundaries and the five attack paths marked where they cross" data-wide>
      {bounds.map((b, i) => (
        <g key={b.x} data-node style={styleVar(3 + i)}>
          <path d={`M${b.x},58 V232`} stroke="var(--line-strong)" strokeDasharray="4 5" fill="none" />
          <text x={b.x} y={50} textAnchor="middle" fontSize="8.5" fontFamily={M} fill="var(--fg-subtle)">
            {b.ref}
          </text>
        </g>
      ))}
      {ns.map((n, i) => (
        <N key={n} d={i} x={xs[i]} y={96} w={96} h={34} hl={i > 0 && i < 5}>
          {n}
        </N>
      ))}
      {[146, 276, 406, 536, 666].map((to, i) => (
        <A key={to} d={6 + i} x={xs[i] + 96 + 3} y={113} to={to} />
      ))}
      {bounds.map((b, i) => (
        <g key={`m${b.x}`} data-node style={styleVar(12 + i)}>
          {b.marks.map((m, j) => (
            <Mark key={m} d={12 + i} x={b.x - 11 - (b.marks.length - 1 - j) * 26} y={248}>
              {m}
            </Mark>
          ))}
        </g>
      ))}
    </svg>
  );
}

/* ── Healthcare pentest: connected attack chain ─────────────────────────── */

function PentestWide() {
  const ns = ["RECON", "USER ENUM", "SQLI BYPASS", "DOC ACCESS", "OFFLINE CRACK", "METADATA"];
  const tools: Record<number, string> = { 2: "Burp Suite", 4: "John the Ripper", 5: "ExifTool" };
  const xs = [16, 140, 266, 390, 515, 640];
  return (
    <svg viewBox="0 0 760 250" role="img" aria-label="Attack chain from recon to username enumeration, SQL injection bypass, document access, offline cracking and metadata review" data-wide>
      {ns.map((n, i) => (
        <N key={n} d={i} x={xs[i]} y={104} w={104} h={34} hl={i === 2}>
          {n}
        </N>
      ))}
      {[140, 264, 390, 515, 640].map((to, i) => (
        <A key={to} d={7 + i} x={xs[i] + 104 + 2} y={121} to={to} />
      ))}
      {Object.entries(tools).map(([k, t], i) => (
        <g key={k} data-node style={styleVar(13 + i)}>
          <text x={xs[Number(k)] + 52} y={172} textAnchor="middle" fontSize="9" fontFamily={M} fill="var(--amber)">
            {t}
          </text>
        </g>
      ))}
      <text data-node style={styleVar(16)} x={380} y={216} textAnchor="middle" fontSize="8.5" fontFamily={M} fill="var(--fg-subtle)">
        PTES · OWASP WSTG METHODOLOGY · CVSS V3.1 REPORT
      </text>
    </svg>
  );
}

/* ── AWS detection as code: sources to alerts, detections against ATT&CK ── */

function CloudWide() {
  const detections = [
    ["root-account-activity", "T1078.004"],
    ["console-login-no-mfa", "T1078"],
    ["cloudtrail-tampering", "T1562.008"],
    ["iam-persistence", "T1136.003 · T1098"],
    ["security-group-exposure", "T1562.007"],
    ["guardduty-findings", "MANAGED"],
  ];
  return (
    <svg viewBox="0 0 760 300" role="img" aria-label="CloudTrail and GuardDuty feed EventBridge rules, Lambda alerting, and six detections mapped to MITRE ATT&CK" data-wide>
      <N d={0} x={16} y={60} w={112} hl>
        CLOUDTRAIL
      </N>
      <N d={1} x={16} y={118} w={112}>
        GUARDDUTY
      </N>
      <A d={2} x={130} y={77} to={168} />
      <A d={3} x={130} y={135} to={168} />
      <N d={4} x={172} y={94} w={128} h={40} hl>
        EVENTBRIDGE RULES
      </N>
      <A d={5} x={304} y={114} to={336} />
      <N d={6} x={340} y={94} w={74} h={40}>
        LAMBDA
      </N>
      <A d={7} x={418} y={114} to={450} />
      <N d={8} x={454} y={94} w={66} h={40} hl>
        ALERTS
      </N>
      {detections.map(([name, id], i) => (
        <g key={name} data-node style={styleVar(9 + i)}>
          <text x={556} y={76 + i * 36} fontSize="10" fontFamily={M} letterSpacing="0.3" fill="var(--fg-muted)">
            {name}
          </text>
          <text x={556} y={88 + i * 36} fontSize="9" fontFamily={M} fill="var(--signal)">
            {id}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ── Ghostpass: payment to API with pinned threats ──────────────────────── */

function GhostWide() {
  const ns = ["PAYMENT", "TOKEN MINT", "UNLINKABLE REQUEST", "API"];
  const xs = [30, 210, 390, 570];
  return (
    <svg viewBox="0 0 760 220" role="img" aria-label="Payment, token mint, unlinkable request and API, with timing, replay and metadata threats pinned where they apply" data-wide>
      {ns.map((n, i) => (
        <N key={n} d={i} x={xs[i]} y={118} w={152} h={36} hl={i === 2}>
          {n}
        </N>
      ))}
      {[210, 390, 570].map((to, i) => (
        <A key={to} d={5 + i} x={xs[i] + 152 + 3} y={136} to={to} />
      ))}
      <Threat d={9} x={222} y={84}>
        TIMING CORRELATION
      </Threat>
      <g data-node style={styleVar(9)}>
        <path d="M222,90 V114" stroke="var(--amber)" strokeDasharray="3 4" fill="none" />
      </g>
      <Threat d={10} x={420} y={196}>
        REPLAY
      </Threat>
      <g data-node style={styleVar(10)}>
        <path d="M420,190 V158" stroke="var(--amber)" strokeDasharray="3 4" fill="none" />
      </g>
      <Threat d={11} x={105} y={84}>
        METADATA
      </Threat>
      <g data-node style={styleVar(11)}>
        <path d="M105,90 V114" stroke="var(--amber)" strokeDasharray="3 4" fill="none" />
      </g>
    </svg>
  );
}

/* ── Training labs: simple four-step pipelines ──────────────────────────── */

function PipelineWide({ steps }: { steps: string[] }) {
  const xs = [30, 197, 364, 531];
  const w = 136;
  return (
    <svg viewBox="0 0 760 120" role="img" aria-label={steps.join(", ")} data-wide className="hidden h-auto w-full md:block">
      {steps.map((s, i) => (
        <N key={s} d={i} x={xs[i]} y={44} w={w} h={36} hl={i === steps.length - 1}>
          {s}
        </N>
      ))}
      {[197, 364, 531].map((to, i) => (
        <A key={to} d={4 + i} x={xs[i] + w + 3} y={62} to={to} />
      ))}
    </svg>
  );
}

/* ── Simplified vertical variant for small screens (section 6) ──────────── */

function Vertical({
  steps,
  notes,
  caption,
}: {
  steps: string[];
  notes?: Record<number, string>;
  caption: string;
}) {
  const n = steps.length;
  const stride = notes ? 78 : 66;
  const top = 24;
  const vbH = top + (n - 1) * stride + (notes ? 56 : 38);
  return (
    <svg viewBox={`0 0 300 ${vbH}`} role="img" aria-label={caption} data-vertical>
      {steps.map((s, i) => {
        const y = top + i * stride;
        return (
          <g key={s}>
            <g data-node style={styleVar(i)}>
              <rect x={30} y={y} width={240} height={30} rx="8" fill="var(--surface)" stroke="var(--line-strong)" />
              <text x={150} y={y + 19} textAnchor="middle" fontSize="10.5" fontFamily={M} letterSpacing="0.4" fill="var(--fg-muted)">
                {s}
              </text>
              {notes?.[i] ? (
                <text x={150} y={y + 44} textAnchor="middle" fontSize="9.5" fontFamily={M} fill="var(--amber)">
                  {notes[i]}
                </text>
              ) : null}
            </g>
            {i < n - 1 ? (
              <g data-draw data-node style={styleVar(n + i)}>
                <path pathLength={1} d={`M150,${y + 38} V${y + stride - 10}`} stroke="var(--line-strong)" fill="none" />
                <path d={`M150,${y + stride - 2} l-4,-8 h8 z`} fill="var(--line-strong)" />
              </g>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

const variants: Record<string, { wide: () => React.ReactElement; steps: string[]; notes?: Record<number, string>; caption: string; figcaption: string }> = {
  "llm-agent-security-lab": {
    wide: LlmWide,
    steps: ["USER", "RAG RETRIEVER", "PROMPT ASSEMBLY", "MODEL", "TOOL EXECUTOR", "DOM RENDERER"],
    notes: { 1: "ATTACK PATH 02", 2: "ATTACK PATH 01", 4: "ATTACK PATHS 03 · 04", 5: "ATTACK PATH 05" },
    caption: "Agent pipeline: user, retriever, prompt assembly, model, tool executor and renderer.",
    figcaption:
      "The five tested attack paths cross the pipeline: 02 at the retriever boundary, 01 riding untrusted data into the prompt, 03 and 04 at the tool gate, 05 at the renderer. Wide layouts draw dashed trust boundaries with teal markers; small screens label the stages directly.",
  },
  "healthcare-portal-pentest-lab": {
    wide: PentestWide,
    steps: ["RECON", "USER ENUM", "SQLI BYPASS", "DOC ACCESS", "OFFLINE CRACK", "METADATA"],
    notes: { 2: "Burp Suite", 4: "John the Ripper", 5: "ExifTool" },
    caption: "Attack chain and the tool used at each stage.",
    figcaption: "The chain as connected nodes: recon, username enumeration, SQL injection login bypass, document access, offline cracking and metadata review.",
  },
  "aws-threat-detection-as-code": {
    wide: CloudWide,
    steps: ["CLOUDTRAIL · GUARDDUTY", "EVENTBRIDGE RULES", "LAMBDA", "ALERTS"],
    caption: "Detection pipeline from log sources to alerts.",
    figcaption: "CloudTrail and GuardDuty feed the EventBridge rules. Each of the six detections maps to its MITRE ATT&CK technique at the right.",
  },
  ghostpass: {
    wide: GhostWide,
    steps: ["PAYMENT", "TOKEN MINT", "UNLINKABLE REQUEST", "API"],
    notes: { 0: "METADATA", 1: "TIMING", 3: "REPLAY" },
    caption: "Protocol flow with threats pinned where they apply.",
    figcaption: "Payment, token mint, unlinkable request and API. Timing correlation, replay and metadata leaks are pinned where they apply.",
  },
  "osint-network-recon": {
    wide: () => PipelineWide({ steps: ["DNS LOOKUPS", "WAF DETECTION", "OSINT TOOLS", "NMAP SCAN"] }),
    steps: ["DNS LOOKUPS", "WAF DETECTION", "OSINT TOOLS", "NMAP SCAN"],
    caption: "Recon pipeline.",
    figcaption: "The four-step recon pipeline used inside the authorized scope.",
  },
  "offline-password-recovery": {
    wide: () => PipelineWide({ steps: ["SAMPLE PDFS", "HASH EXTRACT", "JOHN CRACK", "MCP WORKFLOW"] }),
    steps: ["SAMPLE PDFS", "HASH EXTRACT", "JOHN CRACK", "MCP WORKFLOW"],
    caption: "Password recovery pipeline.",
    figcaption: "Lab sample PDFs to hashes to John the Ripper, plus an AI-assisted workflow over MCP.",
  },
};

export type CaseFigureSlug = keyof typeof variants;

export function CaseFigure({ slug }: { slug: string }) {
  const v = variants[slug];
  if (!v) return null;
  const Wide = v.wide;
  return (
    <figure className="mx-0 min-w-0">
      <Wide />
      <Vertical steps={v.steps} notes={v.notes} caption={v.caption} />
      <Cap>{v.figcaption}</Cap>
    </figure>
  );
}
