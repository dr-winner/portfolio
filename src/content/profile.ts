export const profile = {
  name: "Richard Winner Duvor",
  handle: "dr-winner",
  initials: "RW",
  headline: "Application Security",
  headlineSub: "Web, API & AI/LLM App Security",
  /** Field, not a job title. */
  role: "Application Security",
  tagline:
    "I test web applications, APIs and AI/LLM features for security flaws, then write CVSS-scored findings that engineering teams can act on.",
  location: "Accra, Ghana",
  timezone: "GMT+0",
  email: "duvorrichardwinner@gmail.com",
  emailSubject: "AppSec role",
  availability: {
    status: "available",
    label:
      "Open to application security and product security roles in Ghana, across Africa and with remote teams.",
    short: "Open to AppSec and product security roles.",
  },
  bio: [
    "I'm Richard Winner Duvor. I work on application security in Accra, Ghana, with a focus on web apps, APIs and AI/LLM features.",
    "During my cybersecurity internship at NetworkWalks, I ran a full web application pentest in a training lab, from recon to a SQL injection login bypass, and wrote a CVSS v3.1 report with remediation recommendations. At TechBiz Security I trained on the ethical hacking and SOC tracks. On my own, I built an LLM and tool-using agent security lab in TypeScript covering five OWASP LLM Top 10 attack paths, and an AWS threat detection lab with six detections written in Terraform, mapped to MITRE ATT&CK and scanned by Checkov in CI.",
    "I hold the AWS Certified Cloud Practitioner and the Google Cybersecurity Professional Certificate, and I'm working through Cisco Ethical Hacker and the PortSwigger Web Security Academy. I'm open to application security and product security roles in Ghana, across Africa and with remote teams.",
  ],
  education: {
    degree: "BSc Information Technology Management",
    school: "University of Professional Studies, Accra (UPSA)",
    period: "2022 to 2025",
  },
  showTestimonials: false,
  showMedium: false,
  showTiktok: false,
  socials: {
    github: "https://github.com/dr-winner",
    linkedin: "https://www.linkedin.com/in/richard-winner-duvor/",
    x: "https://x.com/dr_winner6",
    medium: "https://medium.com/@drwinner",
    tiktok: "https://www.tiktok.com/@.drwinner",
  },
} as const;
