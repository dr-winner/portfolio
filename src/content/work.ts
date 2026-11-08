export type WorkKind = "case-study" | "lab" | "archive";
export type WorkFilter = "web" | "cloud" | "threat" | "labs";

export type Finding = {
  id: string;
  title: string;
  cwe: string;
  score: string;
  vector: string;
  severity: "Critical" | "High" | "Medium" | "Low" | "Info";
};

export type WorkSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export type ChainNode = {
  id: string;
  label: string;
  score?: string;
  severity?: Finding["severity"];
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
  quote?: string;
  findings?: Finding[];
  chain?: ChainNode[];
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
    quote: "I scored each finding with CVSS v3.1 and wrote recommendations for fixing each one.",
    chain: [
      { id: "recon", label: "Recon", score: "0.0", severity: "Info" },
      { id: "enumeration", label: "Username enumeration", score: "3.7", severity: "Low" },
      { id: "injection", label: "SQL injection login bypass", score: "9.8", severity: "Critical" },
      { id: "documents", label: "Document access", score: "8.6", severity: "High" },
      { id: "cracking", label: "Offline password cracking", score: "7.5", severity: "High" },
      { id: "metadata", label: "Metadata review", score: "5.3", severity: "Medium" },
    ],
    findings: [
      {
        id: "MED-VULN-01",
        title: "SQL injection authentication bypass on the patient portal",
        cwe: "CWE-89",
        score: "9.8",
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
        severity: "Critical",
      },
      {
        id: "MED-VULN-02",
        title: "Public exposure of an internal file",
        cwe: "CWE-538",
        score: "8.6",
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N",
        severity: "High",
      },
      {
        id: "MED-VULN-03",
        title: "Weak document encryption and a weak password",
        cwe: "CWE-326",
        score: "7.5",
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N",
        severity: "High",
      },
      {
        id: "MED-VULN-04",
        title: "Sensitive metadata left in a document",
        cwe: "CWE-200",
        score: "5.3",
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N",
        severity: "Medium",
      },
      {
        id: "MED-VULN-05",
        title: "Sensitive paths disclosed in robots.txt",
        cwe: "Not listed",
        score: "0.0",
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N",
        severity: "Info",
      },
      {
        id: "MED-VULN-06",
        title: "Username enumeration via different login responses",
        cwe: "CWE-204",
        score: "3.7",
        vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N",
        severity: "Low",
      },
    ],
    sections: [
      {
        id: "summary",
        heading: "Summary",
        paragraphs: [
          "I tested a simulated hospital portal from the outside, the way an attacker would. I found a way to tell real usernames apart, got past the login with SQL injection, and then reached documents I should not have been able to open. I scored each finding with CVSS v3.1 and wrote recommendations for fixing each one.",
          "I followed PTES and the OWASP WSTG, and mapped every finding to the OWASP Top 10.",
        ],
      },
      {
        id: "recon",
        heading: "Recon",
        paragraphs: [
          "I started with recon on the lab portal. A robots.txt file named paths that should not have been advertised.",
        ],
      },
      {
        id: "enumeration",
        heading: "Username enumeration",
        paragraphs: [
          "The login page answered differently for a real username and a made up one, so I could tell which accounts existed.",
        ],
      },
      {
        id: "injection",
        heading: "SQL injection login bypass",
        paragraphs: [
          "I got past the login with SQL injection. The report scores that finding at CVSS 9.8.",
        ],
      },
      {
        id: "documents",
        heading: "Document access",
        paragraphs: [
          "From the portal I reached documents I should not have been able to open, including a file that was left on a public path.",
        ],
      },
      {
        id: "cracking",
        heading: "Offline password cracking",
        paragraphs: [
          "I cracked the passwords on those lab documents offline with John the Ripper. The documents used weak encryption and weak passwords.",
        ],
      },
      {
        id: "metadata",
        heading: "Metadata review",
        paragraphs: [
          "I checked the documents with ExifTool. The metadata still held names and notes that should have been removed.",
        ],
      },
      {
        id: "findings",
        heading: "Findings",
        paragraphs: [
          "Scores below are CVSS v3.1, copied from the lab report. I did not change them.",
        ],
      },
      {
        id: "recommendations",
        heading: "Recommendations",
        paragraphs: [
          "The report gives a remediation recommendation for each finding. These are recommendations in the report. I did not write or ship the code fixes.",
        ],
        list: [
          "MED-VULN-01. Use parameterized queries for the login query, and return one message for a bad username and a bad password.",
          "MED-VULN-02. Do not leave internal files on a public path.",
          "MED-VULN-03. Use modern document encryption, and passphrases that are not common words.",
          "MED-VULN-04. Strip names and comments from documents before they are stored where a tester can read them.",
          "MED-VULN-05. Do not list private paths in robots.txt.",
          "MED-VULN-06. Return the same response for an unknown username and a wrong password.",
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
    quote: "This is a starter set, not full coverage.",
    chain: [
      { id: "root-account-activity", label: "root-account-activity", score: "T1078.004" },
      { id: "console-login-no-mfa", label: "console-login-no-mfa", score: "T1078" },
      { id: "cloudtrail-tampering", label: "cloudtrail-tampering", score: "T1562.008" },
      { id: "iam-persistence", label: "iam-persistence", score: "T1136.003" },
      { id: "security-group-exposure", label: "security-group-exposure", score: "T1562.007" },
      { id: "guardduty-findings", label: "guardduty-findings", score: "varies" },
    ],
    sections: [
      {
        id: "summary",
        heading: "Summary",
        paragraphs: [
          "CloudTrail and GuardDuty feed EventBridge rules that act as the detection logic. Each rule maps to a MITRE ATT&CK technique and sends matches to a Lambda function that raises an alert. Everything is defined in Terraform, and every change runs through terraform validate and a Checkov scan before it ships.",
        ],
      },
      {
        id: "root-account-activity",
        heading: "root-account-activity",
        paragraphs: ["T1078.004. Any use of the root account, which should never happen day to day."],
      },
      {
        id: "console-login-no-mfa",
        heading: "console-login-no-mfa",
        paragraphs: ["T1078. A console sign-in without MFA, which is what a phished password looks like."],
      },
      {
        id: "cloudtrail-tampering",
        heading: "cloudtrail-tampering",
        paragraphs: ["T1562.008. Stopping, deleting or changing the trail. Attackers blind the logs first."],
      },
      {
        id: "iam-persistence",
        heading: "iam-persistence",
        paragraphs: ["T1136.003 and T1098. New IAM users, access keys, login profiles or attached policies: the classic backdoor."],
      },
      {
        id: "security-group-exposure",
        heading: "security-group-exposure",
        paragraphs: ["T1562.007. Ingress opened to 0.0.0.0/0, whether by accident or on purpose."],
      },
      {
        id: "guardduty-findings",
        heading: "guardduty-findings",
        paragraphs: ["GuardDuty's managed findings at or above the configured severity."],
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
    quote: "The merchant can check that a token is valid and unspent, and cannot link it to the payment.",
    sections: [
      {
        id: "summary",
        heading: "Summary",
        paragraphs: [
          "Ghostpass is a way to pay for an API and use it without requests being linked back to the payment. A subscriber pays once and receives a batch of blind-signed access tokens. Each call spends one token. The merchant can check that a token is valid and unspent, and cannot link it to the payment or to the other tokens.",
        ],
      },
      {
        id: "assets",
        heading: "Assets",
        paragraphs: [
          "The things worth protecting are the payment, the access tokens, and the link between who paid and who called the API. There is no account, email, or password in the design.",
        ],
      },
      {
        id: "actors",
        heading: "Actors",
        paragraphs: [
          "The subscriber pays and later spends tokens. The merchant takes the payment and checks tokens. Anyone watching the network can see timing and addresses. The model treats the merchant as honest about the published key, and checks that assumption.",
        ],
      },
      {
        id: "boundaries",
        heading: "Trust boundaries",
        paragraphs: [
          "Payment and redemption sit on opposite sides of the design. The merchant database has no column that ties a payment to a spent token. Once tokens are issued, the payment's transaction ids are deleted. A request carries one unblinded token, and the server records only a hash of that token as spent.",
        ],
      },
      {
        id: "threats",
        heading: "Threats",
        paragraphs: [
          "Timing correlation. With few subscribers, the gap between a payment and the first use can tie the two together.",
          "Replay. A token copied from one request can be sent again.",
          "Metadata leaks. Request logs, a stored link between payment and use, or a different signing key per subscriber would undo the unlinkability.",
        ],
      },
      {
        id: "mitigations",
        heading: "Mitigations",
        paragraphs: [
          "The mitigations live in the repository. Blind signatures mean the signer does not see the token it signs. A random delay before a new pass is first used makes the payment and the first call harder to pair. The server stores a hash of each spent token and rejects a second use. There is no request logging, and spent token hashes are deleted when the redeem window for that period closes.",
          "Key consistency is checked in the browser. Before it asks for signatures, the browser fetches the public key log and refuses a key that is not the one published for that merchant and month. A merchant who handed each subscriber a different key could recognise them later. The log is there to catch that.",
        ],
      },
      {
        id: "limits",
        heading: "Honest limits",
        paragraphs: [
          "A small set of subscribers makes timing correlation easier. Tokens are bearer tokens, so anyone who copies one from the browser can use it. The page itself is served by the merchant, so the check is only as strong as the code the browser actually runs. The model covers the protocol design, not a production deployment.",
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
    quote: "The password met a length rule and still fell, because it was a keyboard walk.",
    stack: ["John the Ripper", "MCP"],
    sections: [
      {
        id: "summary",
        heading: "Summary",
        paragraphs: [
          "I recovered passwords from lab sample PDFs with John the Ripper, and I tried an AI-assisted workflow over MCP to see why the password fell so quickly. The samples were two locked PDFs. No customer data.",
        ],
      },
      {
        id: "method",
        heading: "Method",
        paragraphs: [
          "I extracted the PDF encryption hash from the sample on the client, then recovered it offline with John the Ripper, using Johnny, the GUI. The same hash also matched a short dictionary run. After the password came back, I asked an AI assistant over MCP to look at the pattern, not to attack anything else.",
        ],
      },
      {
        id: "results",
        heading: "What I found",
        paragraphs: [
          "The password was 1qaz2wsx. It is a keyboard walk down the first two columns of a QWERTY keyboard: 1, q, a, z, then 2, w, s, x. It is eight characters with letters and numbers, which is enough to pass a naive length rule, and it is already in wordlists that know keyboard walks.",
          "The samples used legacy 128-bit PDF encryption, so an offline dictionary attack was enough. The same password opened the second sample. One crack exposed both files.",
        ],
      },
      {
        id: "learned",
        heading: "What I learned",
        paragraphs: [
          "A password can meet a length rule and still be a pattern a wordlist already contains. Unique secrets per document stop one recovery from opening the next file. The AI pass over MCP was useful for naming the pattern. The recovery itself was John the Ripper.",
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
