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
    period: "Feb 2025 to present",
    title: "Frontend Engineer",
    org: "Synchora Health",
    description: "Frontend development for Synchora Health's products.",
    tags: [],
    current: true,
  },
  {
    period: "Sep 2026 to present",
    title: "Cybersecurity Intern (Ethical Hacking and SOC tracks)",
    org: "TechBiz Security",
    description: "Offensive testing labs and SOC alert triage.",
    tags: ["Web exploitation", "Privilege escalation", "SIEM"],
    current: true,
  },
  {
    period: "Aug 2026 to Sep 2026",
    title: "Cybersecurity Intern",
    org: "NetworkWalks",
    description:
      "Full web application pentest in a training lab, from recon to report. Chained recon, username enumeration and a SQL injection login bypass on a simulated hospital portal. Training lab, no real client. Scored each finding with CVSS v3.1 and mapped it to the OWASP Top 10, following PTES. Wrote remediation recommendations for each finding in the report. Ran an external OSINT and network recon assessment inside an authorized scope.",
    tags: ["Web app testing", "SQL injection", "CVSS", "OWASP Top 10", "PTES"],
  },
  {
    period: "Jul 2025 to present",
    title: "Freelance IT Consultant & Web Developer",
    org: "Self-employed",
    description: "IT consulting and web projects for small businesses.",
    tags: [],
    current: true,
  },
  {
    period: "Oct 2025 to Oct 2026",
    title: "Frontend Designer",
    org: "Gigsama",
    description: "Designed interfaces in Figma and built them in Next.js and React.",
    tags: [],
  },
  {
    period: "Aug 2024 to Jan 2025",
    title: "Research Intern, LLM Operations",
    org: "DataMaker",
    description: "Evaluated large language model outputs for quality and failure cases.",
    tags: ["LLM evaluation"],
  },
  {
    period: "Feb 2024 to Dec 2024",
    title: "Regional Ambassador",
    org: "ICP Ghana",
    description: "Community and developer outreach for ICP in Ghana.",
    tags: ["Community"],
  },
];
