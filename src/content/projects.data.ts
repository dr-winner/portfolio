// Plain data only - safe to import from Node scripts (no image imports here).

export type ProjectTag =
  | "Security"
  | "Pentest"
  | "Web Security"
  | "Recon"
  | "AI"
  | "Full-Stack"
  | "Web3";

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
    slug: "healthcare-pentest-case-study",
    company: "Case Study",
    year: "2026",
    title: "Healthcare Penetration Test and Security Audit (2026)",
    summary:
      "Full-scope penetration test and security audit simulating hospital infrastructure, demonstrating a chained six-phase exploitation path from initial recon to complete administrative takeover and payroll data exfiltration.",
    tags: ["Pentest", "Web Security"],
    results: [
      "Bypassed authentication barrier using SQL injection string truncation (admin ' --) to gain unauthenticated portal takeover",
      "Recovered sensitive patient pathology records by executing offline dictionary attacks against weak 128-bit RC4 PDF encryption via pdf2john",
      "Extracted embedded administrative identity from document metadata using ExifTool to locate and exfiltrate unindexed employee payroll data",
      "Authored defense-in-depth remediation code including parameterized PHP PDO authentication patches and automated Python AES-256 PDF encryption and metadata scrubbing scripts",
    ],
    techStack: ["SQL Injection", "Cryptanalysis", "pdf2john", "ExifTool", "PHP PDO", "Python", "POPIA", "GDPR"],
    repo: "https://github.com/dr-winner/healthcare-pentest-case-study",
    status: "live",
  },
  {
    slug: "osint-and-network-recon-assessment",
    company: "Report",
    year: "2026",
    title: "External OSINT and Network Reconnaissance Assessment",
    summary:
      "Multi-vector reconnaissance engagement demonstrating how threat actors map organizational attack surfaces from public OSINT through active subnet discovery.",
    tags: ["Pentest", "Recon"],
    results: [
      "Gathered external domain intelligence using WHOIS, DNSRecon, Wafw00f, and Google Hacking (GHDB) dorks",
      "Mapped organizational infrastructure and contacts non-intrusively via theHarvester and Maltego Graph entity relationship transforms",
      "Executed active subnet discovery and port enumeration with Nmap and Zenmap to profile live hosts and exposed legacy services",
    ],
    techStack: ["Nmap", "Zenmap", "WHOIS", "DNSRecon", "theHarvester", "Maltego", "Wafw00f", "WhatWeb"],
    repo: "https://github.com/dr-winner/osint-and-network-recon-assessment",
    status: "live",
  },
  {
    slug: "cryptanalysis-and-hash-recovery-assessment",
    company: "Lab",
    year: "2026",
    title: "Cryptanalysis and Automated Hash Recovery Assessment",
    summary:
      "Applied cryptanalysis assessment evaluating document hash recovery, dictionary attacks, and AI-assisted credential entropy auditing.",
    tags: ["Pentest", "AI"],
    results: [
      "Extracted 128-bit document hashes and executed offline dictionary recovery using John the Ripper to recover credentials within seconds",
      "Audited spatial keyboard-walk vulnerabilities (1qaz2wsx) to show how simple pattern-based passwords bypass naive complexity rules",
      "Integrated HexStrike AI with Claude Desktop via Model Context Protocol (MCP) to automate password entropy scoring and analyze credential reuse across documents",
    ],
    techStack: ["John the Ripper", "Hash Recovery", "HexStrike AI", "Claude Desktop MCP", "Cryptanalysis"],
    repo: "https://github.com/dr-winner/cryptanalysis-and-hash-recovery-assessment",
    status: "live",
  },
  {
    slug: "aws-threat-detection-lab",
    company: "Lab",
    year: "2026",
    title: "AWS Threat Detection Lab",
    summary:
      "Detection-as-code on AWS: CloudTrail and GuardDuty telemetry, EventBridge detections mapped to MITRE ATT&CK, and least-privilege Lambda alerting.",
    tags: ["Security"],
    results: [
      "Six ATT&CK-mapped detections deployed as Terraform infrastructure",
      "Automated alerts for root usage, non-MFA logins, CloudTrail tampering, and IAM persistence",
      "Single apply and destroy workflow with zero idle operational cost",
      "CI validation pipeline with formatting, validation, Checkov IaC scanning, and Ruff linting",
    ],
    techStack: ["Terraform", "CloudTrail", "GuardDuty", "EventBridge", "Lambda", "MITRE ATT&CK"],
    repo: "https://github.com/dr-winner/aws-threat-detection-lab",
    status: "live",
  },
  {
    slug: "ghostpass",
    company: "ZECATHON",
    year: "2026",
    title: "Ghostpass: Zero-Knowledge Unlinkable Subscription Protocol",
    summary:
      "Cryptographic privacy protocol enabling unlinkable digital subscriptions through shielded Zcash payments and RSA blind signatures (RFC 9474), separating user identities from recurring access rights.",
    tags: ["Security", "Web3", "Full-Stack"],
    results: [
      "Architected zwatch viewing-key watcher and payment matching engine to verify shielded transactions without exposing customer wallets",
      "Implemented RFC 9474 RSABSSA blind signature workflows to issue unlinkable bearer access tokens for unauthenticated subscription sessions",
      "Conducted privacy threat modeling to protect subscriber access against timing correlation, transaction graph linkage, and replay attacks",
      "Built full-stack verification demos with session-based newsletter access and per-request API token enforcement",
    ],
    techStack: ["Zcash (ZEC)", "RSA Blind Signatures", "RFC 9474", "TypeScript", "Node.js", "Express", "Applied Cryptography"],
    repo: "https://github.com/dr-winner/Ghostpass",
    status: "live",
  },
  {
    slug: "proof9",
    company: "Proof9",
    year: "2025",
    title: "Sound Rights Platform",
    summary:
      "On-chain IP verification for musicians covering provenance, licensing, and AI originality checks.",
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
      "Deep-learning analyzer for AI tokens comparing stability, accuracy, and decisiveness.",
    tags: ["AI", "Full-Stack"],
    results: [
      "Investment signals for AI tokens",
      "LSTM model benchmarked against baseline models",
      "Full pipeline from data ingestion to live dashboard",
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
      "AI agent monitoring multi-protocol portfolios and surfacing sentiment-weighted moves in real time.",
    tags: ["AI", "Full-Stack", "Web3"],
    results: [
      "Tracks investments across protocols",
      "Sentiment and trend analysis on digital assets",
      "Actionable alerts for rapid threat and opportunity response",
    ],
    techStack: ["Next.js", "TypeScript", "LLM Agents", "RAG"],
    link: "https://motifi-ai.vercel.app/",
    imageFile: "motiFiAi.png",
    status: "live",
  },
];
