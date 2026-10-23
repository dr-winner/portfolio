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
    title: "Mediroza Hospital Penetration Test & Security Audit",
    summary:
      "Black-box web application and cryptographic penetration test against a hospital portal. Chained six stages from robots.txt recon and SQL injection authentication bypass to offline PDF password cracking and payroll exfiltration.",
    tags: ["Pentest", "Web Security"],
    results: [
      "Bypassed portal login via SQL injection string truncation (admin ' --) to gain administrative access",
      "Extracted and cracked 128-bit RC4 PDF pathology report hashes offline using pdf2john and John the Ripper",
      "Used ExifTool metadata forensics to uncover internal admin username j.malik and an exposed /old/ backup path",
      "Wrote PHP PDO prepared-statement patches and Python (pikepdf) AES-256 encryption and metadata-scrubbing tools",
    ],
    techStack: ["SQL Injection", "Burp Suite", "John the Ripper", "ExifTool", "QPDF", "PHP PDO", "Python"],
    repo: "https://github.com/dr-winner/healthcare-pentest-case-study",
    status: "live",
  },
  {
    slug: "aws-threat-detection-lab",
    company: "Cloud Security",
    year: "2026",
    title: "AWS Threat Detection as Code",
    summary:
      "Zero-idle-cost AWS detection pipeline built in Terraform. Ingests CloudTrail and GuardDuty telemetry, matches high-risk events via EventBridge rules mapped to MITRE ATT&CK, and triggers least-privilege Lambda alerts.",
    tags: ["Security"],
    results: [
      "Six MITRE ATT&CK detections deployed as modular Terraform infrastructure",
      "Detects root account activity, console logins without MFA, CloudTrail tampering, and IAM persistence",
      "Automated CI pipeline running terraform validate, Checkov IaC security scans, and ruff linting",
      "Engineered to run at near-zero monthly AWS cost with single-command deploy and teardown",
    ],
    techStack: ["AWS", "Terraform", "CloudTrail", "GuardDuty", "EventBridge", "Lambda", "Checkov", "MITRE ATT&CK"],
    repo: "https://github.com/dr-winner/aws-threat-detection-lab",
    status: "live",
  },
  {
    slug: "ghostpass",
    company: "ZECATHON",
    year: "2026",
    title: "Ghostpass: Unlinkable Zero-Knowledge Subscription Protocol",
    summary:
      "Privacy-preserving subscription protocol paid in shielded Zcash (ZEC). Issues RFC 9474 RSA blind-signed bearer tokens so users can authenticate API calls without linking requests to their payment identity.",
    tags: ["Security", "Web3", "Full-Stack"],
    results: [
      "Built zwatch, a viewing-key transaction watcher and payment matching engine for shielded ZEC deposits",
      "Implemented RSABSSA-SHA384-PSS-Randomized (RFC 9474) blind signature verification and token spend tracking",
      "Threat-modeled the protocol against timing correlation, double-spend replay, and metadata leakage",
      "Delivered end-to-end merchant wallet architecture and protected API demo endpoints",
    ],
    techStack: ["Cryptography", "RFC 9474 Blind Signatures", "Zcash", "TypeScript", "Node.js", "Next.js", "API Security"],
    repo: "https://github.com/dr-winner/Ghostpass",
    status: "live",
  },
  {
    slug: "osint-and-network-recon-assessment",
    company: "Assessment",
    year: "2026",
    title: "External OSINT & Subnet Reconnaissance Assessment",
    summary:
      "External attack-surface footprinting and internal subnet enumeration assessment combining passive OSINT, Google Dorking, DNS analysis, WAF detection, and active Nmap port scanning.",
    tags: ["Pentest", "Recon"],
    results: [
      "Fingerprinted web stack, DNS records (SOA, MX, SPF, BIND version), and ModSecurity WAF using Kali tools",
      "Mapped organizational emails, subdomains, and exposed IoT endpoints via Maltego, theHarvester, and GHDB",
      "Enumerated live LAN hosts and exposed SMB/NetBIOS/UPnP services (ports 53, 80, 135, 139, 445, 5000) via Zenmap",
    ],
    techStack: ["Nmap", "WHOIS", "DNSRecon", "WhatWeb", "Wafw00f", "Maltego", "theHarvester", "GHDB"],
    repo: "https://github.com/dr-winner/osint-and-network-recon-assessment",
    status: "live",
  },
  {
    slug: "cryptanalysis-and-hash-recovery-assessment",
    company: "Assessment",
    year: "2026",
    title: "Offline Cryptanalysis & Hash Recovery Assessment",
    summary:
      "Credential recovery and password entropy audit combining offline hash extraction, dictionary and keyboard-walk attacks in John the Ripper, and AI-assisted entropy analysis via HexStrike MCP.",
    tags: ["Pentest", "Security"],
    results: [
      "Extracted cryptographic document hashes and recovered plaintexts offline using John the Ripper",
      "Identified spatial keyboard-walk patterns (1qaz2wsx) and credential reuse across protected files",
      "Integrated HexStrike AI via Model Context Protocol (MCP) to automate password policy and entropy auditing",
    ],
    techStack: ["John the Ripper", "Cryptanalysis", "Password Auditing", "HexStrike MCP", "Kali Linux"],
    repo: "https://github.com/dr-winner/cryptanalysis-and-hash-recovery-assessment",
    status: "live",
  },
  {
    slug: "proof9",
    company: "Proof9",
    year: "2025",
    title: "Proof9: On-Chain IP Verification & Secure Upload Pipeline",
    summary:
      "Production platform for verifying and licensing audio IP on Story Protocol, engineered with a threat-modeled media upload pipeline and originality verification checks.",
    tags: ["Full-Stack", "Web3", "Security"],
    results: [
      "Built full-stack verification and licensing workflows in Next.js, TypeScript, and Solidity",
      "Threat-modeled file upload and verification endpoints against payload abuse and spoofing",
      "Integrated Yakoa originality checks and Tomo authentication",
    ],
    techStack: ["Next.js", "TypeScript", "Solidity", "Story Protocol", "Upload Security"],
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
