export type Cert = {
  name: string;
  issuer: string;
  status: "earned" | "pursuing" | "in-progress";
  year?: string;
  description: string;
  examCode?: string;
  targetDate?: string;
  progress?: number; // 0-100
  skills?: string[];
  modules?: string[];
  link?: string;
};

export const certifications: Cert[] = [
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    examCode: "CLF-C02",
    status: "earned",
    progress: 100,
    description:
      "AWS foundational knowledge covering identity, encryption, monitoring, shared responsibility, and core cloud services.",
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
    name: "Google Cybersecurity Professional Certificate",
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
    name: "Cisco Ethical Hacker",
    issuer: "Cisco Networking Academy",
    status: "in-progress",
    targetDate: "Q4 2026",
    progress: 65,
    description:
      "Offensive security fundamentals from a vendor with deep network roots: recon, exploitation, and post-exploitation mapped to real-world attack surfaces.",
    skills: ["Reconnaissance", "Exploitation", "Post-Exploitation", "Network Attacks", "Web App Testing"],
    modules: [
      "Introduction to Ethical Hacking",
      "Reconnaissance & Footprinting",
      "Scanning & Enumeration",
      "Exploitation Techniques",
      "Post-Exploitation & Reporting",
    ],
    link: "https://www.netacad.com/courses/ethical-hacker",
  },
  {
    name: "PortSwigger Web Security Academy",
    issuer: "PortSwigger",
    status: "in-progress",
    progress: 25,
    description:
      "Hands-on web application security labs covering SQL injection, authentication and access control bypasses, XSS, SSRF, API testing, and server-side vulnerabilities using Burp Suite.",
    skills: [
      "SQL Injection",
      "Burp Suite",
      "Authentication Bypass",
      "Access Control",
      "XSS",
      "SSRF",
      "API Security",
    ],
    modules: [
      "SQL Injection",
      "Authentication & Access Control",
      "Cross-Site Scripting (XSS)",
      "Server-Side Request Forgery (SSRF)",
      "API Security Testing",
    ],
    link: "https://portswigger.net/web-security",
  },
];
