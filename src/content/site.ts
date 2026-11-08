export const site = {
  name: "Richard Winner Duvor",
  handle: "dr-winner",
  headline: "Application Security",
  headlineSub: "Web, API & AI/LLM App Security",
  shortTitle: "Richard · AppSec",
  location: "Accra, Ghana",
  availability:
    "Open to application security and product security roles in Ghana, across Africa and with remote teams.",
  availabilityShort: "Open to AppSec and product security roles.",
  email: "duvorrichardwinner@gmail.com",
  emailSubject: "AppSec role",
  url: "https://duvorrichardwinner.me",
  links: {
    github: "https://github.com/dr-winner",
    linkedin: "https://www.linkedin.com/in/richard-winner-duvor/",
    x: "https://x.com/dr_winner6",
  },
  flags: {
    SHOW_TESTIMONIALS: false,
    SHOW_MEDIUM: false,
    SHOW_TIKTOK: false,
    SHOW_SOURCE_LINK: false,
  },
} as const;

export const mailto = `mailto:${site.email}?subject=${encodeURIComponent(site.emailSubject)}`;

export const cvHref = "/cv.pdf";
export const cvDownloadName = "Richard-Winner-Duvor-AppSec-CV.pdf";
