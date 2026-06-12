export type Cert = {
  name: string;
  issuer: string;
  status: "earned" | "pursuing" | "in-progress";
  year?: string;
  description: string;
  examCode?: string;
  targetDate?: string;
  progress?: number; // 0–100
  skills?: string[];
  modules?: string[];
  link?: string;
};

export const certifications: Cert[] = [
  {
    name: "Google Professional Cybersecurity",
    issuer: "Google",
    status: "earned",
    progress: 100,
    description:
      "End-to-end cybersecurity foundations covering threat detection, SIEM, incident response, and Python automation for security tasks.",
    skills: ["SIEM", "Incident Response", "Threat Detection", "Linux", "Python", "SQL"],
    modules: [
      "Foundations of Cybersecurity",
      "Networks & Network Security",
      "Linux & SQL",
      "Assets, Threats & Vulnerabilities",
      "Detection & Response",
      "Automate Cybersecurity Tasks with Python",
    ],
    link: "https://grow.google/certificates/cybersecurity/",
  },
  {
    name: "CompTIA Security+",
    issuer: "CompTIA",
    examCode: "SY0-701",
    status: "pursuing",
    targetDate: "Q3 2026",
    progress: 30,
    description:
      "The vendor-neutral baseline for security: I'm using it to lock in the fundamentals I touch every day in the SOC.",
    skills: ["Threats & Vulnerabilities", "Security Architecture", "Operations", "Governance & Risk", "IR"],
    modules: [
      "General Security Concepts",
      "Threats, Vulnerabilities & Mitigations",
      "Security Architecture",
      "Security Operations",
      "Security Program Management",
    ],
    link: "https://www.comptia.org/certifications/security",
  },
  {
    name: "Cisco Ethical Hacker",
    issuer: "Cisco",
    status: "pursuing",
    targetDate: "Q4 2026",
    progress: 60,
    description:
      "Offensive security fundamentals from a vendor with deep network roots — recon, exploitation, and post-exploitation mapped to real-world attack surfaces.",
    skills: ["Reconnaissance", "Exploitation", "Post-Exploitation", "Network Attacks", "Web App Testing"],
    modules: [
      "Introduction to Ethical Hacking",
      "Reconnaissance & Footprinting",
      "Scanning & Enumeration",
      "Exploitation Techniques",
      "Post-Exploitation & Reporting",
    ],
    link: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html",
  },
  {
    name: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    examCode: "CLF-C02",
    status: "earned",
    progress: 100,
    description:
      "Anchoring AWS fundamentals so my cloud-security work stops at the right primitives: IAM, KMS, CloudTrail, GuardDuty.",
    skills: ["IAM", "KMS", "CloudTrail", "GuardDuty", "Shared Responsibility", "Billing"],
    modules: [
      "Cloud Concepts",
      "Security & Compliance",
      "Technology & Services",
      "Billing, Pricing & Support",
    ],
    link: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
  },
  {
    name: "TryHackMe & HackTheBox Paths",
    issuer: "TryHackMe / HTB Academy",
    status: "in-progress",
    progress: 55,
    description:
      "Hands-on labs across blue, red, and cloud security tracks — where the theory becomes muscle memory.",
    skills: ["Blue-team", "SOC L1", "Web exploitation", "AD attacks", "Cloud labs", "Forensics"],
    modules: [
      "SOC Level 1",
      "Cyber Defense",
      "Junior Penetration Tester",
      "AD enumeration & lateral movement",
    ],
    link: "https://tryhackme.com/p/dr_winner",
  },
];
