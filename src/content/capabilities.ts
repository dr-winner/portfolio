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
  accent: "cyber" | "signal" | "ok" | "threat";
  /** Proficiency level drives the progress bar on the capability card. */
  level: CapabilityLevel;
  /** 0-100 percentage for the progress bar width. */
  proficiency: number;
};

/** Two-paragraph narrative above the capabilities grid. */
export const capabilityPreamble: [string, string] = [
  "SOC work for me is a loop: see something wrong, make it show up in the data next time, and shorten the line between alert and answer. I care about the unglamorous stuff — detections that do not false-positive the team to death, and case notes the next shift can actually use.",
  "Cloud security is the other half. I start from identity and blast radius, then work outward: getting the right logs into the right pipeline, tightening posture before the auditor asks, and making sure the control plane is as monitored as the endpoints.",
];

export const capabilities: Capability[] = [
  {
    id: "soc",
    label: "01 / Detect & Respond",
    title: "In the queue with you, not above it.",
    description:
      "I triage, correlate, and chase until the story makes sense. When the root cause is an attacker, you get a written trail. When it is bad hygiene, the detection and the playbook get a bump anyway.",
    bullets: [
      "Case ownership: from first alert to clean handoff or close",
      "ATT&CK-mapped hunts with a testable hypothesis, not a keyword safari",
      "Detection rules, tuning notes, and postmortems people will actually read",
    ],
    icon: ShieldAlert,
    accent: "signal",
    level: "core",
    proficiency: 92,
  },
  {
    id: "cloud",
    label: "02 / Cloud Security",
    title: "Clouds are just someone else's computers.",
    description:
      "I start from identity and blast radius, then work outward — getting logs into a place an analyst can stand on, tightening posture before the auditor asks, and making sure the control plane is as monitored as the endpoints.",
    bullets: [
      "Least privilege you can still operate under across AWS, Azure, and GCP",
      "Log pipelines: CloudTrail, Entra, GCP Audit — into the same hunt brain",
      "Posture management, misconfiguration triage, and container hardening",
    ],
    icon: Cloud,
    accent: "cyber",
    level: "core",
    proficiency: 88,
  },
  {
    id: "offensive",
    label: "03 / Offensive Awareness",
    title: "Better detections start with attacker empathy.",
    description:
      "I approach defense from an attacker's perspective. Knowing how initial access, lateral movement, and exfil actually work in the wild is what separates a rule that fires from one that catches something real.",
    bullets: [
      "Penetration testing fundamentals: recon, exploitation, post-exploitation",
      "Purple-team thinking: test the detection before the attacker does",
      "CVE research and exploit analysis to keep detection logic current",
    ],
    icon: Swords,
    accent: "threat",
    level: "working",
    proficiency: 78,
  },
  {
    id: "automation",
    label: "04 / Security Automation",
    title: "Automation is the analyst's force multiplier.",
    description:
      "Python, APIs, and AI agents — used to close the gap between alert volume and analyst bandwidth. I build the tooling that handles the repetitive work so the analyst can focus on the case that actually needs them.",
    bullets: [
      "SOAR playbooks and Python scripts that cut triage time, not corner cases",
      "LLM-assisted case enrichment, IOC lookup, and log summarisation",
      "Detection-as-code: version-controlled rules with CI-gated testing",
    ],
    icon: Code2,
    accent: "ok",
    level: "working",
    proficiency: 82,
  },
];
