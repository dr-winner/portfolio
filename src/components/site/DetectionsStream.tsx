"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { announce, prefersReducedMotion } from "@/lib/motion";

type Row = { id: number; body: string; hot?: boolean };
type Alert = { rule: string; attack: string; text: string } | null;

const BENIGN = [
  '{"event":"ConsoleLogin","MFAUsed":"Yes"}',
  '{"event":"DescribeInstances"}',
  '{"event":"ListBuckets"}',
  '{"event":"GetObject"}',
  '{"event":"AssumeRole"}',
];

const STOP = '{"event":"StopLogging"}';
const KEY = '{"event":"CreateAccessKey"}';

const TAMPER: Alert = { rule: "cloudtrail-tampering", attack: "T1562.008", text: "trail logging stopped" };
const PERSIST: Alert = { rule: "iam-persistence", attack: "T1136.003 and T1098", text: "new access key" };

function buildScript() {
  const script: { body: string; alert: Alert }[] = [];
  BENIGN.forEach((body) => script.push({ body, alert: null }));
  script.push({ body: STOP, alert: TAMPER });
  for (let i = 0; i < 8; i += 1) script.push({ body: BENIGN[i % BENIGN.length], alert: null });
  script.push({ body: KEY, alert: PERSIST });
  return script;
}

const SCRIPT = buildScript();

const STATIC_ROWS: Row[] = [
  ...BENIGN.map((body, index) => ({ id: index, body })),
  { id: 5, body: STOP, hot: true },
  { id: 6, body: BENIGN[0] },
  { id: 7, body: KEY, hot: true },
];

export function DetectionsStream() {
  const reduced = prefersReducedMotion();
  const [rows, setRows] = useState<Row[]>(reduced ? STATIC_ROWS : BENIGN.slice(0, 4).map((body, id) => ({ id, body })));
  const [alert, setAlert] = useState<Alert>(reduced ? TAMPER : null);
  const [paused, setPaused] = useState(false);
  const [dot, setDot] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const inView = useRef(true);
  const cursor = useRef(reduced ? SCRIPT.length : 4);
  const serial = useRef(10);

  useEffect(() => {
    const node = boxRef.current;
    if (!node || reduced) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (reduced) return undefined;
    const timer = window.setInterval(() => {
      if (paused || !inView.current || document.visibilityState !== "visible") return;
      const index = cursor.current % SCRIPT.length;
      const event = SCRIPT[index];
      cursor.current += 1;
      const id = serial.current++;
      setRows((current) => [...current, { id, body: event.body, hot: Boolean(event.alert) }].slice(-8));
      if (event.alert) {
        setDot(true);
        setAlert(event.alert);
        announce(`${event.alert.rule}, ${event.alert.attack}, ${event.alert.text}`);
        window.setTimeout(() => setDot(false), 900);
      }
    }, 900);
    return () => window.clearInterval(timer);
  }, [paused, reduced]);

  return (
    <div ref={boxRef} className="det-panel">
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Synthetic events. Not from a real AWS account.</p>
        <button type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)} className="h-11 shrink-0 rounded-[8px] border border-[var(--line-strong)] px-3 font-mono text-[12px] text-[var(--fg)]">
          {paused ? "Play" : "Pause"}
        </button>
      </div>
      <p className="det-path mt-3">
        <span className={`det-dot-html ${dot ? "is-on" : ""}`} aria-hidden />
        <span>Event path: CloudTrail, GuardDuty, Rules, Lambda, Alerts</span>
      </p>
      <div role="log" aria-live="off" aria-relevant="additions" className="det-log">
        {rows.map((row) => (
          <p key={row.id} className={`log-line ${row.hot ? "is-hot" : ""}`}>
            {row.body}
          </p>
        ))}
      </div>
      <div className="min-h-[72px]">
        {alert ? (
          <p className="badge-pop mt-3 rounded-[10px] border border-[color-mix(in_srgb,var(--danger)_40%,transparent)] bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] px-3 py-2 font-mono text-[13px] text-[var(--fg)]">
            {alert.rule}, {alert.attack}, {alert.text}
          </p>
        ) : null}
      </div>
      <p className="mt-3 font-mono text-[12px] text-[var(--fg-subtle)]">
        This is a starter set, not full coverage.{" "}
        <Link href="/work/aws-threat-detection-as-code" className="text-[var(--signal)] no-underline">
          Read the case study
        </Link>
      </p>
    </div>
  );
}
