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
    description:
      "Application security: web, API and AI/LLM app security. Based in Accra, Ghana.",
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
    email: `mailto:${profile.email}`,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: profile.education.school,
    },
    sameAs: [profile.socials.github, profile.socials.linkedin, profile.socials.x],
    knowsAbout: [
      "Application security",
      "API security",
      "LLM application security",
      "Prompt injection",
      "Web application testing",
      "Threat modeling",
      "Detection as code",
      "AWS security",
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "AWS Certified Cloud Practitioner",
        credentialCategory: "certification",
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Google Cybersecurity Professional Certificate",
        credentialCategory: "certificate",
      },
    ],
    seeks: {
      "@type": "Demand",
      name: "Application security and product security roles",
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
    name: `${profile.name} | ${profile.headline}`,
    description:
      "Application security in Accra, Ghana. Web, API and AI/LLM app security, a training-lab pentest and AWS detection as code.",
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
    name: `${profile.name} | ${profile.headline}`,
    description:
      "Application security in Accra, Ghana. Web, API and AI/LLM app security, a training-lab pentest and AWS detection as code.",
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
