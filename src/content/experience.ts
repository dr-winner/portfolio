export type TimelineEntry = {
  group: "security" | "engineering";
  period: string;
  title: string;
  org: string;
  description: string;
  tags: string[];
  current?: boolean;
};

/* Wording mirrors public/cv.pdf: the SECURITY EXPERIENCE entries first,
   then the ENGINEERING EXPERIENCE entries, with the same descriptions. */
export const experience: TimelineEntry[] = [
  {
    group: "security",
    period: "Sep 2026 to present",
    title: "Cybersecurity Intern, Ethical Hacking and SOC tracks",
    org: "TechBiz Security",
    description:
      "Completes parallel six-week tracks covering web and network penetration testing, exploitation, SIEM and log analysis, alert triage, threat detection and incident response. Produces security assessment reports as part of the program.",
    tags: ["Web exploitation", "Privilege escalation", "SIEM"],
    current: true,
  },
  {
    group: "security",
    period: "Aug 2026 to Sep 2026",
    title: "Cybersecurity Intern",
    org: "NetworkWalks",
    description:
      "Authored a CVSS v3.1 pentest report covering a SQL injection login bypass, mapped findings to the OWASP Top 10 and followed PTES. Completed an authorized OSINT and network recon assessment and recovered passwords from lab sample PDFs with John the Ripper.",
    tags: ["Web app testing", "SQL injection", "CVSS v3.1", "OWASP Top 10", "PTES"],
  },
  {
    group: "security",
    period: "Aug 2024 to Jan 2025",
    title: "Research Intern, LLM Operations",
    org: "DataMaker, Adenta Accra",
    description:
      "Evaluated large language model outputs for quality, logical reasoning and failure cases, and flagged inconsistencies. Labeled and sanitized training datasets.",
    tags: ["LLM evaluation"],
  },
  {
    group: "engineering",
    period: "Feb 2025 to present",
    title: "Frontend Engineer",
    org: "Synchora Health",
    description:
      "Implements role-based access in the UI so staff only see the views and actions for their role. Handles form input and validation across patient and staff workflows.",
    tags: [],
    current: true,
  },
  {
    group: "engineering",
    period: "Oct 2025 to Oct 2026",
    title: "Frontend Designer",
    org: "Gigsama",
    description:
      "Designed interfaces in Figma and built them in Next.js, React and Tailwind CSS. Integrated a third-party CMS and blog management system into an application.",
    tags: [],
  },
  {
    group: "engineering",
    period: "Jul 2025 to present",
    title: "Freelance IT Consultant & Web Developer",
    org: "Self-employed",
    description:
      "Builds and deploys web applications for small businesses, and manages client accounts, backups and access controls. Advises small businesses on cloud readiness, network setup and baseline security, and performs technical security checks and system hardening.",
    tags: [],
    current: true,
  },
  {
    group: "engineering",
    period: "Feb 2024 to Dec 2024",
    title: "Regional Ambassador",
    org: "ICP Ghana (Internet Computer)",
    description:
      "Led technical sessions on application security, smart contract security and backend architecture across eight Ghanaian universities.",
    tags: ["Community"],
  },
];
