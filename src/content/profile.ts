export const profile = {
  name: "Richard Winner Duvor",
  handle: "dr_winner",
  initials: "RW",
  role: "Ethical Hacker | Penetration Tester",
  tagline:
    "Focused on authorized web and network penetration testing, red-team practice, and application security.",
  /** Optional - not shown in public UI */
  location: "Accra, Ghana",
  timezone: "GMT+0",
  email: "duvorrichardwinner@gmail.com",
  /** Shown in contact; full address is revealed only in mailto */
  emailObfuscated: "duvorrichard···@gmail.com",
  availability: {
    status: "available",
    label: "Open to ethical hacking · penetration testing · red team · AppSec roles",
  },
  bio: [
    "My focus is authorized ethical hacking and penetration testing across web applications, APIs, and networks, with red-team practice and application security at the center.",
    "I bring a builder's perspective from full-stack applications and smart contracts. That helps me understand how software behaves and communicate findings as practical fixes.",
    "I value clear scope, careful validation, reproducible evidence, and reports that help teams improve security.",
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
