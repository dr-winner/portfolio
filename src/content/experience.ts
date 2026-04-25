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
    org: "Security Operations",
    description:
      "Triaging alerts across SIEM + EDR, running ATT&CK-driven threat hunts, tuning detections, and contributing to IR playbooks and post-incident reviews.",
    tags: ["SIEM", "EDR", "MITRE ATT&CK", "Incident Response"],
    current: true,
  },
  {
    period: "2024 — 2025",
    title: "AI / Agentic Systems Engineer",
    org: "Independent & Open-Source",
    description:
      "Designed LLM agents with tool-use and RAG over private corpora. Shipped production AI features (sentiment, market intelligence, IP verification) across Web3 and consumer apps.",
    tags: ["LLM Agents", "RAG", "LangGraph", "Python", "TypeScript"],
  },
  {
    period: "2022 — 2024",
    title: "Full-Stack & Smart Contract Engineer",
    org: "Startups & Hackathons",
    description:
      "Shipped multiple production dApps and SaaS products on Next.js, Node, Python, and Solidity — winning hackathons and learning how real attackers think.",
    tags: ["Next.js", "Node", "Solidity", "Python", "Postgres"],
  },
  {
    period: "2020 — 2022",
    title: "Software Engineer — Early Career",
    org: "Learning the craft",
    description:
      "Built the engineering foundation: clean code, systems thinking, testing, and shipping. This is where the attacker-empathy began.",
    tags: ["TypeScript", "React", "Git", "Linux"],
  },
];
