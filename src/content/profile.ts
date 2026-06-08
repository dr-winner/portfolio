export const profile = {
  name: "Richard Winner Duvor",
  handle: "dr_winner",
  initials: "RW",
  role: "SOC Analyst & Cloud Security Engineer",
  tagline:
    "Detection engineering and cloud security — from alert triage to identity hardening across AWS, Azure, and GCP.",
  /** Optional — not shown in public UI */
  location: "Accra, Ghana",
  timezone: "GMT+0",
  email: "drwinner03@gmail.com",
  /** Shown in contact; full address is revealed only in mailto */
  emailObfuscated: "drwinner ···@gmail.com",
  resumeUrl: "#",
  availability: {
    status: "available",
    label: "Open to SOC / cloud-security & detection-engineering roles",
  },
  bio: [
    "I work in the space between the SOC and the cloud control plane. By day that means triaging alerts, hunting threats, and writing detections that survive contact with real traffic. By week it means hardening the identity layer, tightening cloud posture, and making sure the logs that matter are actually reaching the SIEM.",
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
