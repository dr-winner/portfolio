/**
 * structured-data.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * JSON-LD schema generators for schema.org types.
 * All schemas are strictly typed and reference each other via @id anchors.
 * Import in page.tsx / layout.tsx and inject with:
 *   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema()) }} />
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { profile } from "@/content/profile";

const BASE_URL = "https://richardwinner.dev";

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
      addressLocality: profile.location,
      addressCountry: "GH",
      addressRegion: "Greater Accra",
    },
    sameAs: [
      profile.socials.github,
      profile.socials.linkedin,
      profile.socials.x,
      profile.socials.medium,
      profile.socials.tiktok,
    ],
    knowsAbout: [
      "SOC Analysis",
      "Security Operations",
      "Threat Hunting",
      "Detection Engineering",
      "MITRE ATT&CK Framework",
      "Agentic AI Systems",
      "Large Language Models",
      "Retrieval Augmented Generation",
      "LLM Security",
      "Cloud Security",
      "Amazon Web Services",
      "Microsoft Azure",
      "Google Cloud Platform",
      "TypeScript",
      "Python",
      "Next.js",
      "React",
      "FastAPI",
      "LangChain",
      "Splunk",
      "Elastic SIEM",
      "Incident Response",
      "Smart Contracts",
      "Blockchain Security",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "SOC Analyst & AI Engineer",
      description:
        "Specialist in security operations, detection engineering, and agentic AI systems.",
      skills: "Threat hunting, detection engineering, agentic AI, cloud security hardening",
      occupationLocation: {
        "@type": "Country",
        name: "Ghana",
      },
    },
    seeks: {
      "@type": "Demand",
      name: "SOC Analyst, Security Engineer, or AI Engineering roles",
      description:
        "Open to SOC, detection-engineering, and AI-agent roles, and select contract work.",
    },
    alumniOf: [],
    award: [],
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
    inLanguage: "en-US",
    author: { "@id": `${BASE_URL}/#person` },
    publisher: { "@id": `${BASE_URL}/#person` },
    copyrightHolder: { "@id": `${BASE_URL}/#person` },
    copyrightYear: new Date().getFullYear(),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
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
    inLanguage: "en-US",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#person` },
    mainEntity: { "@id": `${BASE_URL}/#person` },
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
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

/* ─── Combined page schema (inject all at once) ──────────────────────────── */
export function buildPageSchemas(
  projects?: Array<{ title: string; slug: string; summary: string; link?: string | null }>
) {
  const schemas = [personSchema(), webSiteSchema(), profilePageSchema()];
  if (projects?.length) schemas.push(projectsListSchema(projects));
  return schemas;
}
