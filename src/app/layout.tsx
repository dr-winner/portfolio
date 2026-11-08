import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { cookies } from "next/headers";
import clsx from "clsx";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/config/site";
import { profile } from "@/content/profile";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
  display: "swap",
  adjustFontFallback: true,
  preload: false,
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

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={clsx(GeistSans.variable, GeistMono.variable, serif.variable, themeClass)}
      style={{ ["--font-sans" as string]: "var(--font-geist-sans)", ["--font-mono" as string]: "var(--font-geist-mono)", ["--font-display" as string]: "var(--font-geist-sans)" }}
    >
      <body className="font-sans antialiased overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
