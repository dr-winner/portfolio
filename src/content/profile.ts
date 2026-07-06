export const profile = {
  name: "Richard Winner Duvor",
  handle: "dr_winner",
  initials: "RW",
  role: "Cyber & Cloud Security Engineer",
  tagline:
    "Threat detection, cloud hardening, pentesting, forensics, compliance.",
  /** Optional — not shown in public UI */
  location: "Accra, Ghana",
  timezone: "GMT+0",
  email: "drwinner03@gmail.com",
  /** Shown in contact; full address is revealed only in mailto */
  emailObfuscated: "drwinner ···@gmail.com",
  /** Served from our own domain; source copy lives on Google Drive */
  resumeUrl: "/resume.pdf",
  availability: {
    status: "available",
    label: "Open to SOC · cloud security · pentesting & GRC roles",
  },
  bio: [
    "I triage alerts, hunt threats, harden cloud setups, run pentests, and investigate incidents. I know how attacks work and how to catch them in logs.",
    "Started building full-stack apps and smart contracts. Now I defend them. I automate the boring parts and focus on what actually matters.",
    "Currently going deep on cloud engineering and cloud security — I build it, then I harden it. You protect best what you know how to build.",
  ],
  socials: {
    github: "https://github.com/dr-winner",
    linkedin: "https://www.linkedin.com/in/richard-winner-duvor/",
    x: "https://x.com/dr_winner6",
    medium: "https://medium.com/@duvorr60",
    instagram: "https://www.instagram.com/winner.richard",
    /** Pro Coder (public handle) */
    tiktok: "https://www.tiktok.com/@procoder_",
  },
} as const;
