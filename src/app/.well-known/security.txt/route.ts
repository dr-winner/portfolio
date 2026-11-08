import { site } from "@/content/site";

export function GET() {
  const body = [
    `Contact: mailto:${site.email}`,
    "Expires: 2027-11-08T00:00:00.000Z",
    "Preferred-Languages: en",
    `Canonical: ${site.url}/.well-known/security.txt`,
    `Policy: ${site.url}/security#report`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
