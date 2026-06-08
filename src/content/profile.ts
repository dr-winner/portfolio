export const profile = {
  name: "Richard Winner Duvor",
  handle: "dr_winner",
  initials: "RW",
  role: "Cybersecurity Professional",
  tagline:
    "Threat detection, cloud hardening, offensive testing, digital forensics, and compliance — the full security lifecycle.",
  /** Optional — not shown in public UI */
  location: "Accra, Ghana",
  timezone: "GMT+0",
  email: "drwinner03@gmail.com",
  /** Shown in contact; full address is revealed only in mailto */
  emailObfuscated: "drwinner ···@gmail.com",
  resumeUrl: "#",
  availability: {
    status: "available",
    label: "Open to SOC · cloud security · pentesting & GRC roles",
  },
  bio: [
    "I work across the full security lifecycle — from triaging alerts and hunting threats in the SOC, to hardening cloud environments, running penetration tests, and handling incident investigations. I understand both how attacks are built and how to make them show up in the data.",
    "I started as a full-stack engineer shipping production apps and smart contracts, which shapes how I defend them today: with attacker empathy, an understanding of what developers actually ship, and a preference for automation over toil.",
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
