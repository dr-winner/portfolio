// Plain data only — safe to import from Node scripts (no image imports here).

export type ProjectTag = "Security" | "AI" | "Full-Stack" | "Web3";

export type ProjectData = {
  slug: string;
  company: string;
  year: string;
  title: string;
  summary: string;
  tags: ProjectTag[];
  results: string[];
  techStack: string[];
  link?: string;
  repo?: string;
  /** Filename inside `src/assets/images/` for seed screenshots. */
  imageFile?: string;
  status: "live" | "in-progress" | "upcoming";
};

export const projectsData: ProjectData[] = [
  {
    slug: "proof9",
    company: "Proof9",
    year: "2025",
    title: "Sound Rights Platform",
    summary:
      "On-chain IP verification for musicians. Provenance, licensing, AI originality checks.",
    tags: ["AI", "Web3", "Full-Stack"],
    results: [
      "Verify and license sound IP on-chain",
      "AI checks for originality",
      "Threat-modeled upload pipeline against model abuse",
      "Built on Story Protocol, Yakoa, Tomo",
    ],
    techStack: ["Next.js", "TypeScript", "Story Protocol", "AI", "Solidity"],
    link: "https://proof9.xyz/",
    imageFile: "proof9.png",
    status: "live",
  },
  {
    slug: "aix-market-analyzer",
    company: "AIX Market Analyzer",
    year: "2024",
    title: "LSTM Signal Engine on SingularityNET",
    summary:
      "Deep-learning analyzer for AI tokens. Compares stability, accuracy, decisiveness.",
    tags: ["AI", "Full-Stack"],
    results: [
      "Investment signals for AI tokens",
      "LSTM model vs baseline benchmarks",
      "Full pipeline: data in, dashboard out",
    ],
    techStack: ["Python", "PyTorch", "LSTM", "Next.js", "SingularityNET"],
    link: "https://aix-market-analyzer.vercel.app/",
    imageFile: "AIXMarketAnalyzer.png",
    status: "live",
  },
  {
    slug: "motifi-ai",
    company: "motiFi.ai",
    year: "2025",
    title: "Agentic Market Intelligence",
    summary:
      "AI agent watches multi-protocol portfolios, surfaces sentiment-weighted moves in real time.",
    tags: ["AI", "Full-Stack", "Web3"],
    results: [
      "Tracks investments across protocols",
      "Sentiment + trend analysis on assets",
      "Actionable alerts for quick reactions",
    ],
    techStack: ["Next.js", "TypeScript", "LLM Agents", "RAG"],
    link: "https://motifi-ai.vercel.app/",
    imageFile: "motiFiAi.png",
    status: "live",
  },
  {
    slug: "soc-detection-lab",
    company: "Home Lab",
    year: "2026",
    title: "SOC Detection Lab",
    summary:
      "Home lab simulating attacker TTPs against Wazuh + ELK. Build and tune detections mapped to MITRE ATT&CK.",
    tags: ["Security"],
    results: [
      "Ingest Sysmon, Zeek, cloud logs",
      "Custom detections mapped to ATT&CK",
      "Atomic Red Team sims with auto reports",
    ],
    techStack: ["Wazuh", "ELK", "Sysmon", "Zeek", "Atomic Red Team", "MITRE ATT&CK"],
    status: "in-progress",
  },
  {
    slug: "agentic-triage-copilot",
    company: "Research",
    year: "2026",
    title: "Agentic Triage Copilot",
    summary:
      "LLM copilot enriches and triages SOC alerts. Pulls IOCs, threat intel, prior cases before analyst opens ticket.",
    tags: ["AI", "Security"],
    results: [
      "LLM agent queries VT, OTX, case history",
      "Auto-summarizes alerts with ATT&CK mapping",
      "Guardrails against prompt injection from logs",
    ],
    techStack: ["Python", "LangGraph", "RAG", "VirusTotal", "OTX", "ATT&CK"],
    status: "upcoming",
  },
];
