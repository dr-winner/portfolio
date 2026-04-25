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
      "On-chain IP verification for musicians — provenance, licensing, and AI-assisted originality checks.",
    tags: ["AI", "Web3", "Full-Stack"],
    results: [
      "Protect, verify, license, and monetize sound IP on-chain",
      "AI-powered originality verification for creators",
      "Threat-modelled the upload pipeline against AI-model abuse",
      "Powered by Story Protocol, Yakoa, and Tomo",
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
      "A deep-learning analyzer for AI tokens — comparing robustness, accuracy, and decisiveness signals.",
    tags: ["AI", "Full-Stack"],
    results: [
      "Data-driven insights for AI-token investment decisions",
      "LSTM model benchmarked against baseline signals",
      "End-to-end pipeline from ingestion to dashboard",
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
      "AI agent that watches multi-protocol portfolios and surfaces sentiment-weighted market moves in real time.",
    tags: ["AI", "Full-Stack", "Web3"],
    results: [
      "Tracks multiple investments across protocols",
      "Agent-driven sentiment + trend analysis on top assets",
      "Pushes actionable alerts to help users react quickly",
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
      "A home lab that simulates attacker TTPs against Wazuh + ELK to build and tune custom detections mapped to MITRE ATT&CK.",
    tags: ["Security"],
    results: [
      "End-to-end ingestion: Sysmon, Zeek, cloud logs",
      "Custom detections mapped to MITRE ATT&CK techniques",
      "Atomic Red Team simulations with auto-generated reports",
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
      "An LLM copilot that enriches and triages SOC alerts — pulling IOCs, threat-intel, and prior cases before an analyst even opens the ticket.",
    tags: ["AI", "Security"],
    results: [
      "LLM agent with tool-use over VT, OTX, and internal case history",
      "Auto-summarizes alerts with ATT&CK mapping",
      "Guardrails against prompt-injection via ingested logs",
    ],
    techStack: ["Python", "LangGraph", "RAG", "VirusTotal", "OTX", "ATT&CK"],
    status: "upcoming",
  },
];
