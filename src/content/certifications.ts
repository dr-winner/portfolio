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
    name: "CompTIA Security+",
    issuer: "CompTIA",
    examCode: "SY0-701",
    status: "pursuing",
    targetDate: "Q3 2026",
    progress: 55,
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
    name: "CompTIA CySA+",
    issuer: "CompTIA",
    examCode: "CS0-003",
    status: "pursuing",
    targetDate: "Q4 2026",
    progress: 30,
    description:
      "Blue-team focused: detection engineering, threat intelligence, and the analyst workflow I live in.",
    skills: ["Threat & Vulnerability Mgmt", "Incident Response", "Reporting", "Threat Intel", "Detection Engineering"],
    modules: [
      "Security Operations",
      "Vulnerability Management",
      "Incident Response & Management",
      "Reporting & Communication",
    ],
    link: "https://www.comptia.org/certifications/cybersecurity-analyst",
  },
  {
    name: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    examCode: "CLF-C02",
    status: "pursuing",
    targetDate: "Q3 2026",
    progress: 65,
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
    progress: 70,
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
