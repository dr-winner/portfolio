/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

/*
 * CSP notes:
 * - 'unsafe-inline' in script-src is required by Next.js's inline bootstrap
 *   on statically prerendered pages (no nonce support there).
 * - 'unsafe-inline' in style-src is required by Framer Motion / GSAP.
 * - The blob host serves admin-uploaded project screenshots.
 * - Prod-only: dev needs 'unsafe-eval' for react-refresh.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
  "font-src 'self'",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  // upgrade-insecure-requests intentionally omitted: HSTS + Vercel's
  // https-only serving already cover it, and it breaks production builds
  // tested over http://localhost.
].join("; ");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
  // HSTS only on the real deployment: sending it from `next start` on
  // http://localhost makes the browser force-upgrade to https://localhost
  // and everything breaks with SSL errors.
  ...(process.env.VERCEL
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
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
        ],
      },
    ];
  },
  images: {
    localPatterns: [
      { pathname: "/uploads/**" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
