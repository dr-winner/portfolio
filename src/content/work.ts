export type WorkKind = "case-study" | "lab" | "archive";
export type WorkFilter = "web" | "cloud" | "threat" | "labs";

export type WorkSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

export type WorkItem = {
  slug: string;
  title: string;
  documentTitle: string;
  description: string;
  year: string;
  kind: WorkKind;
  badges: string[];
  card: string;
  tags: string[];
  filters: WorkFilter[];
  repo?: string;
  link?: string;
  context: string;
  role?: string;
  stack?: string[];
  outcome?: string;
  scope?: string;
  sections: WorkSection[];
};

export const work: WorkItem[] = [
  {
    slug: "healthcare-portal-pentest-lab",
    title: "Healthcare Portal Pentest (NetworkWalks Training Lab)",
    documentTitle: "Healthcare Portal Pentest (Training Lab)",
    description:
      "A web app pentest in a NetworkWalks training lab: SQL injection login bypass, offline password cracking and a CVSS v3.1 report.",
    year: "2026",
    kind: "case-study",
    badges: ["Case study", "Training lab", "2026"],
    card: "In a NetworkWalks training lab, I went from recon to a SQL injection login bypass on a simulated hospital portal, then wrote the CVSS v3.1 report with remediation recommendations.",
    tags: ["Web app testing", "SQL injection", "CVSS v3.1", "OWASP Top 10"],
    filters: ["web"],
    repo: "https://github.com/dr-winner/healthcare-pentest-case-study",
    context: "Training lab",
    role: "Tester and report author",
    stack: ["Burp Suite", "John the Ripper", "ExifTool"],
    outcome:
      "Login bypass found and documented. CVSS v3.1 report with remediation recommendations delivered.",
    scope:
      'This was a training lab, not a real engagement. I did it during my cybersecurity internship at NetworkWalks. "Mediroza General Hospital" is a made-up organisation the lab uses. No real hospital, patient or client was involved, and all my testing stayed inside the lab.',
    sections: [
      {
        id: "summary",
        heading: "Summary",
        paragraphs: [
          "I tested a simulated hospital portal from the outside, the way an attacker would. I found a way to tell real usernames apart, got past the login with SQL injection, and then reached documents I should not have been able to open. I scored each finding with CVSS v3.1 and wrote recommendations for fixing each one.",
        ],
      },
      {
        id: "method",
        heading: "Method",
        paragraphs: [
          "I started with recon, moved to username enumeration, then got past the login with SQL injection. From there I pulled documents, cracked their passwords offline with John the Ripper and checked their metadata with ExifTool. I followed PTES and the OWASP WSTG, and mapped every finding to the OWASP Top 10.",
        ],
      },
      {
        id: "recommendations",
        heading: "Recommendations",
        paragraphs: [
          "The report gives a remediation recommendation for each finding. One example is to use parameterized queries for the login query. These are recommendations in the report. I did not write or ship the code fixes.",
        ],
      },
    ],
  },
  {
    slug: "aws-threat-detection-as-code",
    title: "AWS Threat Detection as Code",
    documentTitle: "AWS Threat Detection as Code",
    description:
      "Six AWS threat detections written in Terraform, mapped to MITRE ATT&CK and scanned by Checkov in CI.",
    year: "2026",
    kind: "case-study",
    badges: ["Own project", "Cloud security", "2026"],
    card: "Six detections for risky AWS activity, like someone using the root account or switching off CloudTrail. I deploy them with Terraform, and Checkov scans them in CI.",
    tags: ["AWS", "Terraform", "Detection as code", "MITRE ATT&CK"],
    filters: ["cloud"],
    repo: "https://github.com/dr-winner/aws-threat-detection-lab",
    context: "Own project",
    role: "Author",
    stack: ["Terraform", "CloudTrail", "GuardDuty", "EventBridge", "Lambda", "Checkov"],
    outcome: "Six detections defined in Terraform and scanned in CI.",
    scope: "An own project, built and tested in my own AWS account.",
    sections: [
      {
        id: "summary",
        heading: "Summary",
        paragraphs: [
          "CloudTrail and GuardDuty feed EventBridge rules that act as the detection logic. Each rule maps to a MITRE ATT&CK technique and sends matches to a Lambda function that raises an alert. Everything is defined in Terraform, and every change runs through terraform validate and a Checkov scan before it ships.",
        ],
      },
      {
        id: "detections",
        heading: "Detections",
        paragraphs: [
          "root-account-activity, T1078.004. Any use of the root account, which should never happen day to day.",
          "console-login-no-mfa, T1078. A console sign-in without MFA, which is what a phished password looks like.",
          "cloudtrail-tampering, T1562.008. Stopping, deleting or changing the trail. Attackers blind the logs first.",
          "iam-persistence, T1136.003 and T1098. New IAM users, access keys, login profiles or attached policies: the classic backdoor.",
          "security-group-exposure, T1562.007. Ingress opened to 0.0.0.0/0, whether by accident or on purpose.",
          "guardduty-findings. GuardDuty's managed findings at or above the configured severity.",
        ],
      },
      {
        id: "coverage",
        heading: "Coverage",
        paragraphs: [
          "This is a starter set, not full coverage. The gaps called out in the repository include exfiltration, STS lateral movement, data destruction and region hopping.",
        ],
      },
    ],
  },
  {
    slug: "ghostpass",
    title: "Ghostpass",
    documentTitle: "Ghostpass Threat Model",
    description:
      "Threat modeling a private API subscription protocol against timing correlation, replay and metadata leaks.",
    year: "2026",
    kind: "case-study",
    badges: ["Own project", "Threat modeling", "2026"],
    card: "A way to pay for an API and use it without your requests being linked back to your payment. I threat-modeled it against timing correlation, replay and metadata leaks.",
    tags: ["Threat modeling", "Cryptography", "API security"],
    filters: ["threat"],
    repo: "https://github.com/dr-winner/Ghostpass",
    context: "Own project",
    role: "Author",
    stack: ["Threat modeling"],
    outcome: "A threat model of the protocol design.",
    scope: "An own project. The threat model covers the protocol design, not a production deployment.",
    sections: [
      {
        id: "summary",
        heading: "Summary",
        paragraphs: [
          "Ghostpass is a way to pay for an API and use it without requests being linked back to the payment. The threat model looks at timing correlation, replay and metadata leaks. The mitigations live in the repository.",
        ],
      },
    ],
  },
  {
    slug: "osint-network-recon",
    title: "External OSINT and Network Recon Assessment",
    documentTitle: "External OSINT and Network Recon Assessment",
    description:
      "A NetworkWalks lab note: public footprint and open services mapped inside an authorized scope.",
    year: "2026",
    kind: "lab",
    badges: ["Lab", "NetworkWalks", "2026"],
    card: "I mapped an authorized target's public footprint and open services using DNS lookups, WAF detection, OSINT tools and Nmap.",
    tags: ["OSINT", "Nmap", "DNS"],
    filters: ["labs"],
    repo: "https://github.com/dr-winner/osint-and-network-recon-assessment",
    context: "Training lab",
    scope: "Authorized scope during the NetworkWalks internship. Details of the target stay in the repository.",
    sections: [
      {
        id: "method",
        heading: "Method",
        paragraphs: [
          "I mapped the public footprint and the open services that were in scope, using DNS lookups, WAF detection, OSINT tools and Nmap.",
        ],
      },
      {
        id: "result",
        heading: "What I found",
        paragraphs: [
          "The notes in the repository record the public footprint and the services that were in scope. This page stays at that level.",
        ],
      },
    ],
  },
  {
    slug: "offline-password-recovery",
    title: "Offline Password Recovery Assessment",
    documentTitle: "Offline Password Recovery Assessment",
    description: "Passwords recovered from lab sample PDFs with John the Ripper, plus an AI-assisted workflow over MCP.",
    year: "2026",
    kind: "lab",
    badges: ["Lab", "2026"],
    card: "I recovered passwords from lab sample PDFs with John the Ripper and tried an AI-assisted workflow over MCP.",
    tags: ["John the Ripper", "MCP"],
    filters: ["labs"],
    repo: "https://github.com/dr-winner/cryptanalysis-and-hash-recovery-assessment",
    context: "Training lab",
    scope: "Lab sample PDFs only. No customer data.",
    sections: [
      {
        id: "method",
        heading: "Method",
        paragraphs: [
          "I recovered passwords from lab sample PDFs with John the Ripper and tried an AI-assisted workflow over MCP.",
        ],
      },
    ],
  },
  {
    slug: "proof9",
    title: "Proof9",
    documentTitle: "Proof9",
    description: "A team build for verifying and licensing audio IP on Story Protocol.",
    year: "2025",
    kind: "archive",
    badges: ["Team project"],
    card: "A team build for verifying and licensing audio IP on Story Protocol, with a threat-modeled media upload pipeline.",
    tags: [],
    filters: [],
    context: "Team project",
    sections: [],
  },
  {
    slug: "aix-market-analyzer",
    title: "AIX Market Analyzer",
    documentTitle: "AIX Market Analyzer",
    description: "An LSTM signal engine for AI tokens, benchmarked against baseline models.",
    year: "2024",
    kind: "archive",
    badges: [],
    card: "An LSTM signal engine for AI tokens, benchmarked against baseline models.",
    tags: [],
    filters: [],
    link: "https://aix-market-analyzer.vercel.app/",
    context: "Archive",
    sections: [],
  },
  {
    slug: "motifi-ai",
    title: "Motifi.AI",
    documentTitle: "Motifi.AI",
    description: "An agentic market intelligence app.",
    year: "2025",
    kind: "archive",
    badges: [],
    card: "An agentic market intelligence app.",
    tags: [],
    filters: [],
    link: "https://motifi-ai.vercel.app/",
    context: "Archive",
    sections: [],
  },
];

export const publishedWork = work.filter((item) => item.kind !== "archive");

export function getWork(slug: string) {
  return publishedWork.find((item) => item.slug === slug);
}

export const legacyWorkSlugs: Record<string, string> = {
  "healthcare-pentest-case-study": "healthcare-portal-pentest-lab",
  "aws-threat-detection-lab": "aws-threat-detection-as-code",
  "osint-and-network-recon-assessment": "osint-network-recon",
  "cryptanalysis-and-hash-recovery-assessment": "offline-password-recovery",
};
