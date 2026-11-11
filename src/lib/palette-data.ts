/** Display rows for the command palette. A test locks these to the lab
 * scenarios so the palette cannot drift from the engine. */

export const paletteFindings = [
  {
    index: "01",
    cvss: "8.1",
    severity: "High",
    title: "Indirect Prompt Injection → Unauthorized Refund Tool Call",
    href: "/work/llm-agent-security-lab",
  },
  {
    index: "02",
    cvss: "7.5",
    severity: "High",
    title: "Cross-Tenant Vector Retrieval → Confidential Memo Disclosure",
    href: "/work/llm-agent-security-lab",
  },
  {
    index: "03",
    cvss: "7.5",
    severity: "High",
    title: "Model-Supplied Tenant Parameter → Cross-Tenant Invoice Read (BOLA)",
    href: "/work/llm-agent-security-lab",
  },
  {
    index: "04",
    cvss: "8.6",
    severity: "High",
    title: "Unconstrained Webhook Tool → Context Exfiltration to Attacker Host",
    href: "/work/llm-agent-security-lab",
  },
  {
    index: "05",
    cvss: "7.3",
    severity: "High",
    title: "Poisoned Chunk Output → DOM XSS & Markdown Tracking Beacon",
    href: "/work/llm-agent-security-lab",
  },
] as const;

export const sqliFinding = {
  title: "SQL injection login bypass",
  cvss: "7.5",
  severity: "High",
  href: "/work/healthcare-portal-pentest-lab",
} as const;
