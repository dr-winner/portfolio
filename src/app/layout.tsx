import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import { AgenticBackground } from "@/components/AgenticBackground";
import { Analytics } from "@vercel/analytics/next";
import { ClientChrome } from "@/components/ClientChrome";
import { Providers } from "@/components/Providers";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SITE_URL } from "@/config/site";
import { profile } from "@/content/profile";
import {
  personSchema,
  profilePageSchema,
  webSiteSchema,
} from "@/lib/structured-data";

/* ─── Fonts ───────────────────────────────────────────────────────────────── */

/* Enterprise / readable UI: common in security products */
const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
});

/* Tech-forward headlines; pairs with ink/cyan theme */
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
});

/* Monospace: logs, kbd, terminal */
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
});

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
    images: [ogImage],
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
    { media: "(prefers-color-scheme: light)", color: "#eaf0f9" },
    { media: "(prefers-color-scheme: dark)", color: "#04060c" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/* ─── Root layout ─────────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={clsx(sans.variable, display.variable, mono.variable, "dark")}
    >
      <head>
        {/* Resource hints: fonts are self-hosted via next/font, no preconnect needed */}
        <link rel="dns-prefetch" href="https://github.com" />

        {/* Structured data: three separate JSON-LD blocks for clarity */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(profilePageSchema()),
          }}
        />
      </head>

      <body className="font-sans antialiased overflow-x-hidden touch-pan-y [overscroll-behavior-x:none]">
        {/* Native scrolling, no custom cursor. Deliberate: the Lenis +
            cursor combo made the site feel sluggish (removed in e06ac11,
            accidentally reintroduced by a stale design pass). */}
        <Providers>
          <ClientChrome>
            <AgenticBackground />
            <ScrollProgress />
            {children}
          </ClientChrome>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
