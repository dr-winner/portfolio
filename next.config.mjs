/** @type {import('next').NextConfig} */
import bundleAnalyzer from "@next/bundle-analyzer";

// Brief 7.6: report bundle number changes every phase. Opt in via ANALYZE=1 so
// regular builds stay byte identical, writes one JSON report with gzip sizes.
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "1",
  analyzerMode: "json",
  openAnalyzer: false,
});

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  ...(process.env.VERCEL
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

/* Serve the full <head> on every response. Next otherwise streams page
   metadata after </head>, and measured on this site the streamed title,
   description and canonical land as DOM nodes outside <head> (28 body-level
   metas, none inserted into head), while crawlers without JS and Lighthouse
   only read <head>. A catch-all disables the stream for every user agent;
   page metadata here resolves synchronously, so the blocking render is
   free and matches brief section 8: title, meta description, canonical and
   OG tags in the initial <head>, never streamed late. */
const htmlLimitedBots = /.*/;

const nextConfig = {
  poweredByHeader: false,
  htmlLimitedBots,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.duvorrichardwinner.me" }],
        destination: "https://duvorrichardwinner.me/:path*",
        permanent: true,
      },
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/projects/:slug", destination: "/work/:slug", permanent: true },
      { source: "/work/healthcare-pentest-case-study", destination: "/work/healthcare-portal-pentest-lab", permanent: true },
      { source: "/work/aws-threat-detection-lab", destination: "/work/aws-threat-detection-as-code", permanent: true },
      { source: "/work/osint-and-network-recon-assessment", destination: "/work/osint-network-recon", permanent: true },
      { source: "/work/cryptanalysis-and-hash-recovery-assessment", destination: "/work/offline-password-recovery", permanent: true },
      { source: "/resume.pdf", destination: "/cv.pdf", permanent: true },
      { source: "/security.txt", destination: "/.well-known/security.txt", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/cv.pdf",
        headers: [
          { key: "Content-Type", value: "application/pdf" },
          { key: "Content-Disposition", value: 'inline; filename="Richard-Winner-Duvor-AppSec-CV.pdf"' },
          { key: "Cache-Control", value: "public, max-age=3600" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
        ],
      },
      {
        source: "/opengraph-image",
        headers: [{ key: "Cross-Origin-Resource-Policy", value: "cross-origin" }],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
