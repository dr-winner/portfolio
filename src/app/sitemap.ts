import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { publishedWork } from "@/content/work";
import { hasPublishedWriteups } from "@/content/writeups";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/work", "/about", "/contact", "/security", ...publishedWork.map((item) => `/work/${item.slug}`)];
  if (hasPublishedWriteups()) routes.push("/writeups");
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
