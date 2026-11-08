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
    company: "Training lab",
    year: "2026",
    title: "Healthcare Portal Pentest (NetworkWalks Training Lab)",
    summary:
      "In a NetworkWalks training lab, I went from recon to a SQL injection login bypass on a simulated hospital portal, then wrote the CVSS v3.1 report with remediation recommendations.",
    tags: ["Pentest", "Web Security"],
    results: [
      "Training lab. No real hospital, patient or client.",
      "Username enumeration, then a SQL injection login bypass.",
      "Offline password cracking with John the Ripper, and metadata review with ExifTool.",
      "CVSS v3.1 scores, OWASP Top 10 mapping, and remediation recommendations. No code fixes in the report.",
    ],
    techStack: ["Burp Suite", "John the Ripper", "ExifTool", "CVSS v3.1", "OWASP Top 10", "PTES"],
    repo: "https://github.com/dr-winner/healthcare-pentest-case-study",
    status: "live",
  },
  {
    slug: "aws-threat-detection-lab",
    company: "Own project",
    year: "2026",
    title: "AWS Threat Detection as Code",
    summary:
      "Six detections for risky AWS activity, like someone using the root account or switching off CloudTrail. I deploy them with Terraform, and Checkov scans them in CI.",
    tags: ["Security"],
    results: [
      "Six EventBridge detections: root account activity, console login without MFA, CloudTrail tampering, IAM persistence, security group exposure, and GuardDuty findings.",
      "Each detection is mapped to MITRE ATT&CK.",
      "CI runs terraform fmt, terraform validate and a Checkov scan.",
    ],
    techStack: ["AWS", "Terraform", "CloudTrail", "GuardDuty", "EventBridge", "Lambda", "Checkov", "MITRE ATT&CK"],
    repo: "https://github.com/dr-winner/aws-threat-detection-lab",
    status: "live",
  },
  {
    slug: "ghostpass",
    company: "Own project",
    year: "2026",
    title: "Ghostpass",
    summary:
      "A way to pay for an API and use it without your requests being linked back to your payment. I threat-modeled it against timing correlation, replay and metadata leaks.",
    tags: ["Security"],
    results: [
      "Threat model covers timing correlation, replay and metadata leaks.",
      "The model covers the protocol design, not a production deployment.",
    ],
    techStack: ["Threat modeling", "API security"],
    repo: "https://github.com/dr-winner/Ghostpass",
    status: "live",
  },
  {
    slug: "osint-and-network-recon-assessment",
    company: "Lab",
    year: "2026",
    title: "External OSINT and Network Recon Assessment",
    summary:
      "I mapped an authorized target's public footprint and open services using DNS lookups, WAF detection, OSINT tools and Nmap.",
    tags: ["Recon"],
    results: [
      "Authorized scope during the NetworkWalks internship.",
      "DNS lookups, WAF detection, OSINT tools and Nmap.",
    ],
    techStack: ["Nmap", "DNS", "OSINT", "WAF detection"],
    repo: "https://github.com/dr-winner/osint-and-network-recon-assessment",
    status: "live",
  },
  {
    slug: "cryptanalysis-and-hash-recovery-assessment",
    company: "Lab",
    year: "2026",
    title: "Offline Password Recovery Assessment",
    summary:
      "I recovered passwords from lab sample PDFs with John the Ripper and tried an AI-assisted workflow over MCP.",
    tags: ["Security"],
    results: [
      "Lab sample PDFs only.",
      "John the Ripper for offline recovery.",
      "An AI-assisted workflow over MCP.",
    ],
    techStack: ["John the Ripper", "MCP"],
    repo: "https://github.com/dr-winner/cryptanalysis-and-hash-recovery-assessment",
    status: "live",
  },
  {
    slug: "proof9",
    company: "Team project",
    year: "2025",
    title: "Proof9",
    summary:
      "A team build for verifying and licensing audio IP on Story Protocol, with a threat-modeled media upload pipeline.",
    tags: ["Web3"],
    results: ["Team project. Screenshot only."],
    techStack: ["Story Protocol"],
    imageFile: "proof9.png",
    status: "live",
  },
  {
    slug: "aix-market-analyzer",
    company: "Archive",
    year: "2024",
    title: "AIX Market Analyzer",
    summary: "An LSTM signal engine for AI tokens, benchmarked against baseline models.",
    tags: ["AI"],
    results: ["Earlier build from before I moved into security."],
    techStack: ["Python", "LSTM"],
    link: "https://aix-market-analyzer.vercel.app/",
    imageFile: "AIXMarketAnalyzer.png",
    status: "live",
  },
  {
    slug: "motifi-ai",
    company: "Archive",
    year: "2025",
    title: "Motifi.AI",
    summary: "An agentic market intelligence app.",
    tags: ["AI"],
    results: ["Earlier build from before I moved into security."],
    techStack: ["Next.js", "TypeScript"],
    link: "https://motifi-ai.vercel.app/",
    imageFile: "motiFiAi.png",
    status: "live",
  },
];
