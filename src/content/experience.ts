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
    period: "August - September 2026 · 2 months",
    title: "Penetration Testing Intern",
    org: "NetworkWalks",
    description:
      "Executed black-box web application exploitation including SQL injection and authentication bypass, performed multi-tool OSINT and local subnet enumeration, extracted and cracked legacy PDF and archive hashes offline, and delivered CVSS v3.1 audit reports accompanied by standalone PHP PDO and Python remediation code.",
    tags: ["Penetration Testing", "Web Security", "OSINT", "Cryptanalysis", "Remediation"],
  },
  {
    period: "2024 - 2025",
    title: "AI / Agentic Systems Engineer",
    org: "Proof9 · AIX · motiFi.ai",
    description:
      "Designed LLM agents with tool-use and RAG over private corpora. Shipped production AI features including IP verification on Story Protocol, LSTM market signals on SingularityNET, and multi-protocol portfolio intelligence.",
    tags: ["LLM Agents", "RAG", "LangGraph", "Python", "TypeScript"],
  },
  {
    period: "2022 - 2024",
    title: "Full-Stack & Smart Contract Engineer",
    org: "ChainCheque · PeerRamp · AdanfoCash · Tanic",
    description:
      "Built and audited smart contracts across EVM chains, shipped SaaS and restaurant web apps, and delivered frontend systems for fintech and Web3 clients across Ghana and the wider ecosystem.",
    tags: ["Next.js", "Node", "Solidity", "Python", "Postgres"],
  },
  {
    period: "2020 - 2022",
    title: "Software Engineer",
    org: "Freelance / Open Source",
    description:
      "Built the engineering foundation across full-stack web, systems thinking, and Linux. Started reading CVEs recreationally, developing an attacker-informed security perspective.",
    tags: ["TypeScript", "React", "Git", "Linux"],
  },
];
