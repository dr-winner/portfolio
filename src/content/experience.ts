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
    period: "Feb 2025 - Present",
    title: "Frontend Engineering Lead (Application Security)",
    org: "Synchora Health",
    description:
      "Lead frontend architecture and AppSec in a two-person team building an offline-first clinical PWA for nurses. Enforce role-based access control (RBAC), input validation, and secure offline client-side PHI persistence and API sync.",
    tags: ["AppSec", "Healthcare Systems", "React", "TypeScript", "Offline-First", "RBAC"],
    current: true,
  },
  {
    period: "Sep 2026 - Oct 2026",
    title: "Cybersecurity Intern (Ethical Hacking & SOC)",
    org: "TechBiz Security",
    description:
      "Completed an intensive 6-week hands-on program executing 30+ offensive and defensive TryHackMe labs covering web exploitation, privilege escalation, network enumeration, and SIEM alert triage.",
    tags: ["Ethical Hacking", "SOC", "Web Exploitation", "TryHackMe", "SIEM"],
  },
  {
    period: "Aug 2026 - Sep 2026",
    title: "Penetration Testing Intern",
    org: "NetworkWalks",
    description:
      "Executed black-box web penetration testing (chaining recon, username enumeration, and SQLi auth bypass), offline RC4 PDF hash cracking via pdf2john and John the Ripper, ExifTool metadata forensics, and multi-tool OSINT/Nmap enumeration, delivering CVSS v3.1 reports with PHP PDO and Python AES-256 remediation code.",
    tags: ["Penetration Testing", "Web Security", "OSINT", "Cryptanalysis", "Remediation"],
  },
  {
    period: "Jul 2025 - Present",
    title: "Full-Stack Web Developer & Security Consultant",
    org: "Freelance",
    description:
      "Architect, deploy, and harden full-stack web applications, custom admin backends, inventory systems, and checkout integrations using Next.js, TypeScript, Node.js, and PostgreSQL.",
    tags: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "AppSec"],
  },
  {
    period: "Aug 2024 - Jan 2025",
    title: "LLM Operations & Security Researcher",
    org: "DataMaker",
    description:
      "Evaluated LLM outputs for logical reasoning failures and anomalies, and sanitized training datasets.",
    tags: ["LLM Operations", "AI Safety", "Data Sanitization", "Python"],
  },
];
