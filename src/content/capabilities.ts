import type { LucideIcon } from "lucide-react";
import { Bot, Cloud, Code2, ShieldAlert } from "lucide-react";

export type Capability = {
  id: string;
  label: string;
  title: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
  accent: "cyber" | "signal" | "ok" | "threat";
};

/** Short lines above the grid — two voices, same person. */
export const capabilityPreamble: [string, string] = [
  "Security work for me is a loop: see something wrong, make it show up in the data next time, and shorten the line between alert and answer. I care about the unglamorous stuff — the rules that do not false-positive your team to death, and the case notes the next shift can actually use.",
  "On the AI side, I build systems that are allowed to act — with tools, memory, and boundaries. I spend time on context quality and failure modes because that is what separates a demo from something you can run next to a production SIEM without losing sleep.",
];

export const capabilities: Capability[] = [
  {
    id: "soc",
    label: "01 / Defend",
    title: "In the queue with you, not above it.",
    description:
      "I triage, correlate, and chase until the story makes sense. When the root cause is an attacker, you get a written trail. When it is bad hygiene, the detection and the playbook get a bump anyway.",
    bullets: [
      "Case ownership: from first alert to clean handoff or close",
      "Hunts with a testable hypothesis, not a keyword safari",
      "Rules, tuning notes, and postmortems people will actually read",
    ],
    icon: ShieldAlert,
    accent: "signal",
  },
  {
    id: "ai",
    label: "02 / Reason",
    title: "Agents with a job, not a chat window.",
    description:
      "I wire up retrieval, tools, and policy so a model can do real work in your environment — and I spend as much time on what happens when a log line lies as when it tells the truth.",
    bullets: [
      "End-to-end agent flows: plan → tool use → check → respond",
      "RAG and evals for internal docs and noisy tickets",
      "Threat model: prompt abuse, exfil, and over-trusted output",
    ],
    icon: Bot,
    accent: "cyber",
  },
  {
    id: "cloud",
    label: "03 / Harden",
    title: "Clouds are just someone else's computers.",
    description:
      "I start from identity and blast radius, then get logs and alerts into a place an analyst can stand on. Same habits across AWS, Azure, and GCP; different console quirks.",
    bullets: [
      "Least privilege you can still operate under",
      "Pipelines: CloudTrail, Entra, IAM — into the same hunt brain",
      "CI and containers without secret sprawl in plain sight",
    ],
    icon: Cloud,
    accent: "cyber",
  },
  {
    id: "fullstack",
    label: "04 / Ship",
    title: "I still build what I help defend.",
    description:
      "TypeScript, Python, Solidity, Postgres — production apps and contracts, not weekend tutorials. It changes how I read an alert: I know what *should* be weird in your stack because I've shipped the happy path and the bad deploy.",
    bullets: [
      "Full stack: APIs, UIs, jobs, the boring reliability bits",
      "On-chain and off: same discipline on keys and config",
      "Secure defaults without blocking your team in Jira for a week",
    ],
    icon: Code2,
    accent: "ok",
  },
];
