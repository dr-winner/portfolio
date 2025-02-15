import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // turbo: false, // Disables Turbopack and forces Webpack
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"], // Enables SVG as a React component
    });
    return config;
  },
};

export default nextConfig;
