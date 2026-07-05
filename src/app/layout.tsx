import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import { AgenticBackground } from "@/components/AgenticBackground";
import { Analytics } from "@vercel/analytics/next";
import { ClientChrome } from "@/components/ClientChrome";
import { CustomCursor } from "@/components/CustomCursor";
import { Providers } from "@/components/Providers";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { profile } from "@/content/profile";
import {
  personSchema,
  profilePageSchema,
  webSiteSchema,
} from "@/lib/structured-data";

/* ─── Fonts ───────────────────────────────────────────────────────────────── */

/* Enterprise / readable UI — common in security products */
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

const url = "https://richardwinner.dev";
const ogImage = `${url}/opengraph-image`;

/* ─── Metadata ────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  metadataBase: new URL(url),
  generator: "Next.js",

  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.tagline,

  keywords: [
    "SOC Analyst",
    "Security Engineer",
    "AI Engineer",
    "Agentic AI",
    "Cybersecurity",
    "Threat Hunting",
    "MITRE ATT&CK",
    "Cloud Security",
    "Full-Stack Developer",
    "Detection Engineering",
    "Security Operations Center",
    "Incident Response",
    "LLM Security",
    "Large Language Models",
    "Retrieval Augmented Generation",
    "RAG",
    "Python Developer",
    "TypeScript Developer",
    "Next.js Developer",
    "AWS Security",
    "Azure Security",
    "Splunk",
    "Elastic SIEM",
    "Blockchain Security",
    "Smart Contracts",
    "Offensive Security",
    "Vulnerability Assessment",
    "Zero Trust Architecture",
    profile.name,
  ],

  authors: [{ name: profile.name }],
  creator: profile.name,
  category: "technology",

  alternates: {
    canonical: url,
  },

  openGraph: {
    type: "website",
    url,
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    siteName: profile.name,
    locale: "en_US",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${profile.name} — ${profile.role}`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    creator: `@${profile.handle}`,
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
        {/* Resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://github.com" />

        {/* Structured data — three separate JSON-LD blocks for clarity */}
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
        <Providers>
          <SmoothScrollProvider>
            <CustomCursor />
            <ClientChrome>
              <AgenticBackground />
              <ScrollProgress />
              {children}
            </ClientChrome>
            <ScrollToTop />
          </SmoothScrollProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
