export type TimelineEntry = {
  period: string;
  title: string;
  org: string;
  description: string;
  tags: string[];
  current?: boolean;
};

export const experience: TimelineEntry[] = [
  {
    period: "2025 — Present",
    title: "SOC Analyst / Security Engineer",
    org: "Freelance / Contract",
    description:
      "Triaging alerts across SIEM + EDR, running ATT&CK-driven threat hunts, tuning detections, and contributing to IR playbooks and post-incident reviews.",
    tags: ["SIEM", "EDR", "MITRE ATT&CK", "Incident Response"],
    current: true,
  },
  {
    period: "2024 — 2025",
    title: "AI / Agentic Systems Engineer",
    org: "Proof9 · AIX · motiFi.ai",
    description:
      "Designed LLM agents with tool-use and RAG over private corpora. Shipped production AI features — IP verification on Story Protocol, LSTM market signals on SingularityNET, and multi-protocol portfolio intelligence.",
    tags: ["LLM Agents", "RAG", "LangGraph", "Python", "TypeScript"],
  },
  {
    period: "2022 — 2024",
    title: "Full-Stack & Smart Contract Engineer",
    org: "ChainCheque · PeerRamp · AdanfoCash · Tanic",
    description:
      "Built and audited smart contracts across EVM chains, shipped SaaS and restaurant web apps, and delivered frontend systems for fintech and Web3 clients across Ghana and the wider ecosystem.",
    tags: ["Next.js", "Node", "Solidity", "Python", "Postgres"],
  },
  {
    period: "2020 — 2022",
    title: "Software Engineer",
    org: "Freelance / Open Source",
    description:
      "Built the engineering foundation across full-stack web, systems thinking, and Linux. Started reading CVEs recreationally — this is where the attacker-empathy began.",
    tags: ["TypeScript", "React", "Git", "Linux"],
  },
];
