import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages: edge runtime
  // Per D1 locale usiamo Node runtime in dev, edge in prod
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.kempingi.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // ISR revalidation globale: 24h
  // Le singole route possono sovrascrivere con export const revalidate
  experimental: {
    ppr: false,
  },
};

export default nextConfig;
