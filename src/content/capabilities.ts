import type { LucideIcon } from "lucide-react";
import { Cloud, Code2, ShieldAlert, Swords } from "lucide-react";

export type CapabilityLevel = "core" | "working" | "exploring";

export type Capability = {
  id: string;
  label: string;
  title: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
  accent: "ocean" | "signal" | "ok" | "threat";
  /** Proficiency level drives the progress bar on the capability card. */
  level: CapabilityLevel;
  /** 0-100 percentage for the progress bar width. */
  proficiency: number;
};

/** Two-paragraph narrative above the capabilities grid. */
export const capabilityPreamble: [string, string] = [
  "SOC work: see something wrong, make it show up next time, shorten the gap between alert and fix. I care about detections that don't spam the team and case notes the next shift can use.",
  "Cloud security: start from identity and blast radius, get logs flowing, tighten posture before audits, monitor the control plane like you monitor endpoints.",
];

export const capabilities: Capability[] = [
  {
    id: "soc",
    label: "01 / Detect & Respond",
    title: "Triage, hunt, close.",
    description:
      "I triage alerts, correlate events, and chase leads until it makes sense. Attackers get documented. Bad hygiene gets fixed in the detection.",
    bullets: [
      "Own cases from alert to close",
      "ATT&CK-mapped hunts with real hypotheses",
      "Write detection rules and postmortems people actually read",
    ],
    icon: ShieldAlert,
    accent: "signal",
    level: "core",
    proficiency: 92,
  },
  {
    id: "cloud",
    label: "02 / Cloud Security",
    title: "Lock down the cloud.",
    description:
      "Start from identity and blast radius. Get logs flowing. Tighten posture. Monitor the control plane.",
    bullets: [
      "Least privilege across AWS, Azure, GCP",
      "CloudTrail, Entra, GCP Audit into one pipeline",
      "Fix misconfigs, harden containers",
    ],
    icon: Cloud,
    accent: "ocean",
    level: "core",
    proficiency: 88,
  },
  {
    id: "offensive",
    label: "03 / Offensive Awareness",
    title: "Think like an attacker.",
    description:
      "Know how attacks work to build better detections. Initial access, lateral movement, exfil — the real stuff, not theory.",
    bullets: [
      "Pentest basics: recon, exploit, post-exploit",
      "Purple team: test detections before attackers do",
      "Track CVEs and exploits to keep rules current",
    ],
    icon: Swords,
    accent: "threat",
    level: "working",
    proficiency: 78,
  },
  {
    id: "automation",
    label: "04 / Security Automation",
    title: "Automate the boring parts.",
    description:
      "Python, APIs, AI agents. Close the gap between alert volume and analyst time. Build tools that handle repetitive work.",
    bullets: [
      "SOAR playbooks and Python scripts that save time",
      "LLM-assisted enrichment, IOC lookup, log summaries",
      "Detection-as-code with version control and CI testing",
    ],
    icon: Code2,
    accent: "ok",
    level: "working",
    proficiency: 82,
  },
];
