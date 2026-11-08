export type Writeup = {
  slug: string;
  title: string;
  draft: boolean;
};

/** Drafts stay unpublished until Richard writes them. One published post turns the section on. */
export const writeups: Writeup[] = [
  { slug: "how-this-site-is-secured", title: "How this site is secured", draft: true },
  { slug: "idor-access-control-portswigger", title: "IDOR and access control", draft: true },
  { slug: "username-enumeration-timing", title: "Username enumeration and timing", draft: true },
  { slug: "sqli-login-bypass-explained", title: "SQL injection login bypass", draft: true },
  { slug: "ssrf-cloud-metadata", title: "SSRF and cloud metadata", draft: true },
  { slug: "llm-excessive-agency-portswigger", title: "Excessive agency in LLM tools", draft: true },
  {
    slug: "the-frontend-is-not-an-authorization-layer",
    title: "The frontend is not an authorization layer",
    draft: true,
  },
];

export function hasPublishedWriteups() {
  return writeups.some((item) => !item.draft);
}
