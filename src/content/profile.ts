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
  resumeUrl: "https://drive.google.com/file/d/1T-06kyZ_RSD-lu8JzHal_gZBZxOiq2fW/view?usp=sharing",
  availability: {
    status: "available",
    label: "Open to SOC · cloud security · pentesting & GRC roles",
  },
  bio: [
    "I triage alerts, hunt threats, harden cloud setups, run pentests, and investigate incidents. I know how attacks work and how to catch them in logs.",
    "Started building full-stack apps and smart contracts. Now I defend them. I automate the boring parts and focus on what actually matters.",
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
