import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { cookies, headers } from "next/headers";
import clsx from "clsx";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/Providers";
import { SITE_URL } from "@/config/site";
import { profile } from "@/content/profile";

const themeBoot = `(function(){try{var c=document.cookie.match(/(?:^|; )theme=(dark|light)/);var stored=null;try{stored=localStorage.getItem("theme")}catch(e){}var t=c?c[1]:(stored==="dark"||stored==="light"?stored:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"));if(c){try{localStorage.setItem("theme",c[1])}catch(e){}}var d=document.documentElement;d.classList.remove("light","dark");d.classList.add(t);d.style.colorScheme=t;}catch(e){}})();`;

/* ─── Site constants ──────────────────────────────────────────────────────── */

const url = SITE_URL;
const ogImage = `${url}/opengraph-image`;
const xHandle = new URL(profile.socials.x).pathname.split("/").filter(Boolean)[0];

/* ─── Metadata ────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  metadataBase: new URL(url),
  generator: "Next.js",

  title: {
    default: `${profile.name} | ${profile.headline}`,
    template: `%s | ${profile.name}`,
  },
  description:
    "Application security in Accra, Ghana. Web, API and AI/LLM app security, a training-lab pentest and AWS detection as code. Case studies and CV.",

  authors: [{ name: profile.name }],
  creator: profile.name,
  category: "technology",

  alternates: {
    canonical: url,
  },

  openGraph: {
    type: "website",
    url,
    title: `${profile.name} | ${profile.headline}`,
    description:
      "Application security in Accra, Ghana. Web, API and AI/LLM app security, a training-lab pentest and AWS detection as code. Case studies and CV.",
    siteName: profile.name,
    locale: "en_GH",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${profile.name} | ${profile.headline}`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${profile.name} | ${profile.headline}`,
    description:
      "Application security in Accra, Ghana. Web, API and AI/LLM app security, a training-lab pentest and AWS detection as code. Case studies and CV.",
    creator: `@${xHandle}`,
  },

  robots: { index: true, follow: true },

  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },

  other: {
    classification: "Portfolio / Personal",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": profile.name,
  },
};

/* ─── Viewport ────────────────────────────────────────────────────────────── */

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F5F1" },
    { media: "(prefers-color-scheme: dark)", color: "#07090C" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/* ─── Root layout ─────────────────────────────────────────────────────────── */

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const theme = (await cookies()).get("theme")?.value;
  const themeClass = theme === "light" || theme === "dark" ? theme : undefined;
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={clsx(GeistSans.variable, GeistMono.variable, themeClass)}
      style={{ ["--font-sans" as string]: "var(--font-geist-sans)", ["--font-mono" as string]: "var(--font-geist-mono)", ["--font-display" as string]: "var(--font-geist-sans)" }}
    >
      <body className="font-sans antialiased overflow-x-hidden">
        {nonce ? <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeBoot }} /> : null}
        <Providers nonce={nonce}>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
