export type Cert = {
  name: string;
  issuer: string;
  status: "earned" | "pursuing" | "in-progress";
  year?: string;
  description: string;
  examCode?: string;
  targetDate?: string;
  progress?: number;
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
    year: "2026",
    description: "Earned in 2026.",
    link: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
  },
  {
    name: "Google Cybersecurity Professional Certificate",
    issuer: "Google",
    status: "earned",
    year: "2026",
    description: "Earned in 2026.",
    link: "https://www.coursera.org/professional-certificates/google-cybersecurity",
  },
  {
    name: "Cisco Ethical Hacker",
    issuer: "Cisco Networking Academy",
    status: "in-progress",
    description: "In progress. This is the name of the course.",
    link: "https://www.netacad.com/courses/ethical-hacker",
  },
  {
    name: "PortSwigger Web Security Academy",
    issuer: "PortSwigger",
    status: "in-progress",
    description: "In progress. Training, not a credential.",
    link: "https://portswigger.net/web-security",
  },
];
