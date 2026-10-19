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
    label: "01 / Ethical Hacking & Pentesting",
    title: "Test the attack surface.",
    description:
      "I’m building depth through authorized hands-on web, API, and network testing, then turning findings into clear, useful reports.",
    bullets: [
      "Reconnaissance and enumeration within agreed scope",
      "Safely validate weaknesses and capture reproducible evidence",
      "Prioritize findings by impact and recommend practical remediation",
      "Use red-team practice to understand attack paths and defensive visibility",
    ],
    icon: Swords,
    accent: "threat",
    level: "working",
    proficiency: 78,
  },
  {
    id: "automation",
    label: "02 / Security Tooling",
    title: "Make testing repeatable.",
    description:
      "Use Python and APIs to reduce repetitive work, organize evidence, and make security checks easier to repeat.",
    bullets: [
      "Write small Python helpers for scoped testing tasks",
      "Organize findings and supporting evidence clearly",
      "Use version control to keep tools and reports reproducible",
    ],
    icon: Code2,
    accent: "ok",
    level: "working",
    proficiency: 82,
  },
];
