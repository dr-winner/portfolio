export const skills = [
  {
    title: "Application and API security",
    items:
      "OWASP Top 10, OWASP API Security Top 10, access control and IDOR, authentication and sessions, SQL injection, XSS, SSRF, threat modeling, secure code review",
  },
  {
    title: "AI and LLM application security",
    items:
      "OWASP Top 10 for LLM Applications, prompt injection (direct and indirect), excessive agency, output handling, LLM evaluation",
  },
  {
    title: "Cloud and detection",
    items: "AWS IAM, CloudTrail, GuardDuty, EventBridge, Lambda, Terraform, Checkov, MITRE ATT&CK",
  },
  {
    title: "Secure SDLC",
    items: "Security checks in CI, IaC scanning, dependency hygiene, security headers and CSP",
  },
  {
    title: "Testing tools",
    items: "Burp Suite, Nmap, John the Ripper, ExifTool, Kali Linux",
  },
  {
    title: "Languages",
    items: "Python, TypeScript, SQL, PHP",
  },
] as const;
