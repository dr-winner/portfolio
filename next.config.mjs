/** @type {import('next').NextConfig} */
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

const nextConfig = {
  poweredByHeader: false,
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

export default nextConfig;
