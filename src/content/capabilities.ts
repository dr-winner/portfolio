import type { LucideIcon } from "lucide-react";
import { Code2, Swords } from "lucide-react";

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
  "My focus is authorized ethical hacking and penetration testing across web applications, APIs, and networks. I work within an agreed scope, validate issues safely, and turn evidence into clear, actionable reports.",
  "Red-team practice and application security build on my software engineering background, helping me explain impact and recommend practical remediation.",
];

export const capabilities: Capability[] = [
  {
    id: "offensive",
    label: "01 / Web, API & Network Penetration Testing",
    title: "Systematically test and dissect the attack surface.",
    description:
      "Execute scoped offensive assessments across web applications, APIs, and network perimeters to uncover critical vulnerabilities before adversaries exploit them.",
    bullets: [
      "Discover and exploit logic flaws, authentication bypasses, and injection vectors (OWASP Top 10)",
      "Conduct passive OSINT and active subnet service enumeration with Nmap and reconnaissance tooling",
      "Recover weak credentials and audit document cryptography through offline hash cracking",
      "Deliver structured CVSS v3.1 reports with step-by-step reproduction steps for engineering teams",
    ],
    icon: Swords,
    accent: "threat",
    level: "core",
    proficiency: 88,
  },
  {
    id: "remediation",
    label: "02 / Application Security & Defensive Remediation",
    title: "Engineer durable fixes and security guardrails.",
    description:
      "Leverage production software engineering experience to translate vulnerability findings into concrete, parameterized code fixes and automated defensive controls.",
    bullets: [
      "Write production-grade code patches in PHP, Python, and TypeScript to resolve root-cause vulnerabilities",
      "Harden authentication workflows with parameterized prepared statements and modern session security",
      "Implement modern document cryptography and automated metadata sanitization pipelines",
      "Build detection-as-code rules mapped to MITRE ATT&CK to catch suspicious cloud and system events",
    ],
    icon: Code2,
    accent: "ok",
    level: "core",
    proficiency: 85,
  },
];
