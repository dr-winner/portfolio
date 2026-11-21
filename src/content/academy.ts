export type AcademyModule = {
  id: string;
  n: string;
  title: string;
  domain: string;
  summary: string;
  skills: string[];
  topics: string[];
  labProject: {
    title: string;
    description: string;
    deliverable: string;
    standard: string;
  };
};

export type AcademyFaq = {
  q: string;
  a: string;
};

export const academyCohort = {
  title: "Application Security & AI/LLM Defense Cohort",
  badge: "Applications Open · Cohort 1",
  headline: "From Threat Model to Exploit Proof to Deterministic Fix.",
  subheadline:
    "An intensive, hands-on engineering mentorship for developers, SOC analysts, and security engineers. Move beyond automated scanners—learn to dissect modern web/API trust boundaries, exploit AI agent tool-chains, and author deterministic code mitigations that hold in production.",
  schedule: "8 Weeks · Part-Time (6–8 hrs/week) · Live Lab Teardowns & 1-on-1 Code Reviews",
  cohortSize: "Limited to 15 engineers per cohort for dedicated mentorship",
  stats: [
    { value: "4", label: "Production-grade lab projects with CI test suites" },
    { value: "15", label: "Max seats per cohort for deep 1-on-1 feedback" },
    { value: "100%", label: "Hands-on code and live lab environments" },
    { value: "CVSS v3.1", label: "Industry standard scoring on every finding" },
  ],
  prerequisites: [
    "Working familiarity with at least one programming language (JavaScript/TypeScript, Python, or Go)",
    "Foundational understanding of HTTP requests, JSON APIs, and basic web mechanics",
    "Curiosity to look under the hood of applications and understand why software breaks",
  ],
  modules: [
    {
      id: "module-1",
      n: "01",
      title: "Web & API Attack Surfaces",
      domain: "Web & API Security",
      summary:
        "Understand how applications establish trust and where boundaries fail. Dissect access control mechanisms, session lifecycles, and high-impact injection flaws in modern REST APIs.",
      skills: ["OWASP Top 10", "BOLA / IDOR", "SQL Injection", "SSRF", "Session Security"],
      topics: [
        "Broken Object Level Authorization (BOLA/IDOR) & multi-tenant isolation bypasses",
        "Deep SQL injection: tautologies, union selects, blind timing, and why ORMs still fail",
        "Server-Side Request Forgery (SSRF) targeting cloud metadata endpoints (AWS IMDSv2, GCP)",
        "Cryptographic token verification, JWT tampering, and broken state validation",
      ],
      labProject: {
        title: "Healthcare API Penetration Test & Report",
        description:
          "Target an isolated healthcare training portal API. Enumerate authorization bypasses, exploit a SQL injection login flaw, and extract verifiable proof.",
        deliverable: "Repeatable HTTP request proof + CVSS v3.1 vulnerability report with remediation code.",
        standard: "OWASP API Security Top 10",
      },
    },
    {
      id: "module-2",
      n: "02",
      title: "AI & LLM Agent Security",
      domain: "AI / LLM AppSec",
      summary:
        "Generative AI agents introduce non-deterministic execution paths into deterministic systems. Learn how to weaponize and secure retrieval pipelines, agent tool calls, and model memory.",
      skills: ["OWASP LLM Top 10", "Prompt Injection", "Tool Hijacking", "RAG ACLs", "Zod Policy Gates"],
      topics: [
        "Direct and indirect prompt injection through untrusted customer tickets and external documents",
        "Excessive agency & tool hijacking: forcing autonomous agents to execute unauthorized database and financial mutations",
        "Cross-tenant RAG retrieval leaks: exploiting vector embedding databases lacking tenant ACLs",
        "Unsafe output handling: stored XSS and remote command execution triggered by AI agent responses",
        "System prompt extraction, jailbreak taxonomy, and guardrail bypass techniques",
      ],
      labProject: {
        title: "Autonomous Agent Pentest & Hardened Policy Engine",
        description:
          "Attack a customer support RAG agent, induce an unauthorized refund tool invocation ($450), and leak private documents. Then engineer deterministic policy gates with TypeScript and Zod.",
        deliverable: "5 attack proofs + passing automated CI test suite validating deterministic controls.",
        standard: "OWASP LLM Top 10 (2025)",
      },
    },
    {
      id: "module-3",
      n: "03",
      title: "Threat Modeling & Security as Code",
      domain: "Defensive Engineering",
      summary:
        "Offensive skills are only valuable if you know how to build defenses that last. Learn to map trust boundaries with STRIDE and enforce security invariants in automated CI/CD pipelines.",
      skills: ["STRIDE Modeling", "Detection-as-Code", "Semgrep Rules", "IaC Scanning", "Terraform"],
      topics: [
        "STRIDE threat modeling on cloud-native microservices and LLM orchestrators",
        "Writing custom Semgrep static analysis rules to catch insecure patterns before code merges",
        "Detection-as-code: authoring AWS EventBridge, CloudTrail, and GuardDuty rules in Terraform",
        "Scanning Infrastructure as Code (IaC) with Checkov to catch identity and network misconfigurations",
      ],
      labProject: {
        title: "Private Protocol Threat Model & Custom Static Analysis Rules",
        description:
          "Create an end-to-end threat model for a distributed API protocol. Author 3 custom Semgrep rules to detect tainted data flow into model tool parameters.",
        deliverable: "STRIDE architectural diagram + production Semgrep rule pack with unit tests.",
        standard: "MITRE ATT&CK & NIST SP 800-53",
      },
    },
    {
      id: "module-4",
      n: "04",
      title: "Proof, Disclosure & The Senior AppSec Portfolio",
      domain: "Career & Portfolio Proof",
      summary:
        "Package your technical findings into artifacts that convince engineering teams to remediate and hiring managers to make offers. Learn the executive communication of AppSec.",
      skills: ["CVSS v3.1 Scoring", "Executive Reporting", "Fix Remediation", "AppSec Interview Prep"],
      topics: [
        "Calculating CVSS v3.1 scores with precise vector strings and environmental modifiers",
        "Structuring vulnerability disclosures that balance technical depth with clear business risk",
        "Defending findings and collaborating with product engineers without creating friction",
        "AppSec and Product Security interview teardowns: system design, code review, and scenario defense",
      ],
      labProject: {
        title: "The Capstone AppSec Portfolio Audit",
        description:
          "Consolidate your 4 lab deliverables into a public, reproducible GitHub proof portfolio. Complete a simulated 1-on-1 technical interview defense with Richard.",
        deliverable: "Verified GitHub portfolio repository + personalized AppSec career roadmap.",
        standard: "First-Party Engineering Proof",
      },
    },
  ] as AcademyModule[],
  faqs: [
    {
      q: "How is this different from generic cybersecurity bootcamps or certificate courses?",
      a: "Generic bootcamps teach high-level network theory and multiple-choice definitions. This cohort is built from the engineering side out: we read source code, intercept raw HTTP requests, reverse-engineer LLM tool schemas, and write production fixes with automated tests. You leave with code you wrote, not a slide completion badge.",
    },
    {
      q: "What is the time commitment?",
      a: "Expect 6 to 8 hours per week across 8 weeks. This includes one 90-minute live lab teardown, private lab development, and asynchronous code review in our private Discord.",
    },
    {
      q: "Do I need deep cybersecurity experience to join?",
      a: "No, but you do need programming literacy. If you are a frontend, backend, or full-stack software engineer, or a SOC analyst who knows how to read code, this program is designed to bridge you directly into AppSec and AI Security.",
    },
    {
      q: "Why focus on AI/LLM Security alongside classic Application Security?",
      a: "Every modern company is integrating LLMs and autonomous agents into their web apps, databases, and internal tooling. Classic AppSec engineers don't understand non-deterministic model vulnerabilities, and AI engineers don't understand trust boundaries or authorization. Engineers who master both are in the highest demand in the market.",
    },
    {
      q: "What does the 1-on-1 mentorship component include?",
      a: "Each engineer receives direct feedback on their lab PRs, code-level architecture advice, and a dedicated 1-on-1 capstone review session simulating a senior AppSec technical interview.",
    },
  ] as AcademyFaq[],
};
