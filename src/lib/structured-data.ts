/**
 * structured-data.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JSON-LD schema generators for schema.org types.
 * All schemas are strictly typed and reference each other via @id anchors.
 * Import in page.tsx / layout.tsx and inject with:
 *   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema()) }} />
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { SITE_URL } from "@/config/site";
import { profile } from "@/content/profile";

const BASE_URL = SITE_URL;

/* ─── Person ──────────────────────────────────────────────────────────────── */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#person`,
    name: profile.name,
    givenName: "Richard",
    additionalName: "Winner",
    familyName: "Duvor",
    jobTitle: profile.role,
    description: profile.tagline,
    url: BASE_URL,
    image: {
      "@type": "ImageObject",
      "@id": `${BASE_URL}/#avatar`,
      url: `${BASE_URL}/web-app-manifest-512x512.png`,
      width: 512,
      height: 512,
      caption: profile.name,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Accra",
      addressCountry: "GH",
      addressRegion: "Greater Accra",
    },
    sameAs: [
      profile.socials.github,
      profile.socials.linkedin,
      profile.socials.x,
      profile.socials.medium,
      profile.socials.instagram,
      profile.socials.tiktok,
    ],
    knowsAbout: [
      "Ethical Hacking",
      "Penetration Testing",
      "Red Teaming",
      "Web Application Security",
      "API Security Testing",
      "Network Penetration Testing",
      "Application Security",
      "OWASP Top 10",
      "Python Security Tooling",
      "Vulnerability Assessment",
      "Python",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: profile.role,
      description:
        "Focused on authorized ethical hacking and penetration testing across web applications and networks, with red-team practice and application security.",
      skills:
        "Ethical hacking, penetration testing, web application security, API security, network testing, red teaming, Python security tooling",
      occupationLocation: {
        "@type": "Country",
        name: "Ghana",
      },
    },
    seeks: {
      "@type": "Demand",
      name: "Ethical Hacking, Penetration Testing, Red Team, or Application Security roles",
      description:
        "Open to ethical hacking, penetration testing, red-team, and application security roles, plus select authorized assessments with clearly defined scope.",
    },
  };
}

/* ─── WebSite ─────────────────────────────────────────────────────────────── */
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    inLanguage: "en-GH",
    author: { "@id": `${BASE_URL}/#person` },
    publisher: { "@id": `${BASE_URL}/#person` },
    copyrightHolder: { "@id": `${BASE_URL}/#person` },
    copyrightYear: new Date().getFullYear(),
  };
}

/* ─── ProfilePage ─────────────────────────────────────────────────────────── */
export function profilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${BASE_URL}/#profilepage`,
    url: BASE_URL,
    name: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    inLanguage: "en-GH",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#person` },
    mainEntity: { "@id": `${BASE_URL}/#person` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      "@id": `${BASE_URL}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
      ],
    },
  };
}

/* ─── ItemList (projects overview for rich results) ──────────────────────── */
export function projectsListSchema(
  projects: Array<{ title: string; slug: string; summary: string; link?: string | null }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${BASE_URL}/#projects`,
    name: "Selected Projects",
    description: "A curated list of projects by Richard Winner Duvor",
    url: `${BASE_URL}/#projects`,
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      description: p.summary,
      url: p.link ?? BASE_URL,
    })),
  };
}
