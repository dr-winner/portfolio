export const profile = {
  name: "Richard Winner Duvor",
  handle: "dr_winner",
  initials: "RW",
  role: "SOC Analyst & AI Engineer",
  tagline:
    "Building and defending intelligent systems — from detection engineering to agentic AI.",
  /** Optional — not shown in public UI */
  location: "Accra, Ghana",
  timezone: "GMT+0",
  email: "drwinner03@gmail.com",
  /** Shown in contact; full address is revealed only in mailto */
  emailObfuscated: "drwinner ···@gmail.com",
  resumeUrl: "#",
  availability: {
    status: "available",
    label: "Open to SOC / security-engineering & AI roles",
  },
  bio: [
    "I operate where security meets AI. By day I triage alerts, hunt threats, and build detections; by night I design agentic systems that can reason, retrieve, and act.",
    "I started as a full-stack engineer shipping production web apps and smart contracts, which shapes how I defend them today: with attacker empathy, clean code, and automation over toil.",
  ],
  socials: {
    github: "https://github.com/dr-winner",
    linkedin: "https://www.linkedin.com/in/richard-winner-duvor/",
    x: "https://x.com/dr_winner6",
    medium: "https://medium.com/@duvorr60",
    /** Public handle; link opens Discord (add in-app). */
    discord: "https://discord.com/channels/@me",
    discordHandle: "w3brr",
    instagram: "https://www.instagram.com/winner.richard",
    /** Pro Coder (public handle) */
    tiktok: "https://www.tiktok.com/@procoder_",
  },
} as const;
