import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import { AgenticBackground } from "@/components/AgenticBackground";
import { Analytics } from "@vercel/analytics/next";
import { ClientChrome } from "@/components/ClientChrome";
import { Providers } from "@/components/Providers";
import { ScrollProgress } from "@/components/ScrollProgress";
import { profile } from "@/content/profile";

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

const url = "https://www.duvorrichardwinner.me";
const canonicalUrl = `${url}/`;

export const metadata: Metadata = {
  metadataBase: new URL(url),
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
    profile.name,
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    type: "website",
    url: canonicalUrl,
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    creator: `@${profile.handle}`,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: canonicalUrl,
  jobTitle: profile.role,
  sameAs: [
    profile.socials.github,
    profile.socials.linkedin,
    profile.socials.x,
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eaf0f9" },
    { media: "(prefers-color-scheme: dark)", color: "#05070d" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={clsx(sans.variable, display.variable, mono.variable, "dark")}
    >
      <body className="font-sans antialiased overflow-x-hidden touch-pan-y [overscroll-behavior-x:none]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
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
