import type { LucideIcon } from "lucide-react";
import { FileSearch, Shield, Sparkles } from "lucide-react";

export type CapabilityLevel = "core" | "working" | "exploring";

export type Capability = {
  id: string;
  label: string;
  title: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
  accent: "ocean" | "signal" | "ok" | "threat";
  level: CapabilityLevel;
  proficiency: number;
};

export const capabilityPreamble: [string, string] = ["", ""];

export const capabilities: Capability[] = [
  {
    id: "web-api",
    label: "01",
    title: "Web and API testing",
    description:
      "I test web applications and APIs for broken access control, authentication flaws and injection, following the OWASP Top 10 and the OWASP API Security Top 10.",
    bullets: [],
    icon: Shield,
    accent: "threat",
    level: "core",
    proficiency: 0,
  },
  {
    id: "findings",
    label: "02",
    title: "Findings teams can act on",
    description:
      "Every finding comes with the steps to reproduce it, a CVSS v3.1 score and a clear recommendation, like moving to parameterized queries or enforcing role checks on the server.",
    bullets: [],
    icon: FileSearch,
    accent: "ok",
    level: "core",
    proficiency: 0,
  },
  {
    id: "llm",
    label: "03",
    title: "AI and LLM app security",
    description:
      "My focus area is the security of LLM features: prompt injection, unsafe output handling and tools with more access than they need. I use the OWASP Top 10 for LLM Applications as the frame.",
    bullets: [],
    icon: Sparkles,
    accent: "ocean",
    level: "core",
    proficiency: 0,
  },
];
