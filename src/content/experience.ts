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
    period: "Aug 2025 - Present",
    title: "Frontend Engineering Lead (Application Security)",
    org: "Synchora Health",
    description:
      "Lead frontend architecture and application security in a two-person team building an offline-first clinical PWA used by nurses without internet connectivity. Enforce role-based access control (RBAC) across clinical dashboards, validate EHR API integrations, and secure offline client-side PHI persistence.",
    tags: ["Application Security", "RBAC", "React.js", "Next.js", "TypeScript"],
    current: true,
  },
  {
    period: "Sep 2026 - Oct 2026",
    title: "Cybersecurity Intern (Ethical Hacking & SOC)",
    org: "TechBiz Security",
    description:
      "Completed an intensive 6-week hands-on lab curriculum executing 30+ offensive and defensive scenarios on TryHackMe covering web exploitation, Linux/Windows privilege escalation, network reconnaissance, and SIEM alert triage.",
    tags: ["Penetration Testing", "Web Exploitation", "Privilege Escalation", "SIEM", "TryHackMe"],
  },
  {
    period: "Aug 2026 - Sep 2026",
    title: "Penetration Testing Intern",
    org: "NetworkWalks",
    description:
      "Executed black-box web penetration testing (chaining recon, username enumeration, and SQLi auth bypass), offline RC4 PDF hash cracking via pdf2john and John the Ripper, ExifTool metadata forensics, and multi-tool OSINT/Nmap enumeration. Delivered CVSS v3.1 reports with PHP PDO and Python AES-256 remediation code.",
    tags: ["Penetration Testing", "SQL Injection", "Cryptanalysis", "OSINT", "Nmap"],
  },
  {
    period: "Jul 2025 - Oct 2026",
    title: "Full-Stack Web Developer & Security Consultant",
    org: "Freelance",
    description:
      "Built, shipped, and hardened full-stack web applications, custom admin backends, inventory systems, and checkout integrations for small businesses. Handled client cloud setup, server patching, access controls, and automated backups.",
    tags: ["Web Security", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
  },
  {
    period: "Feb 2025 - Oct 2025",
    title: "Regional Technical Ambassador",
    org: "ICP HUB Ghana",
    description:
      "Led technical workshops and developer training sessions across 8 Ghanaian universities on decentralized application architecture, smart contract security fundamentals, and backend integration.",
    tags: ["Smart Contract Security", "Web3", "Technical Training", "Backend Architecture"],
  },
  {
    period: "Aug 2024 - Jan 2025",
    title: "LLM Operations & Security Researcher",
    org: "DataMaker",
    description:
      "Evaluated large language model outputs for logical reasoning failures and behavioral anomalies. Cleaned, audited, and labeled training datasets to prevent corrupted data from entering model pipelines.",
    tags: ["LLM Security", "Anomaly Detection", "Data Integrity", "Python"],
  },
];
