import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.kempingi.com" },
    ],
  },
};

export default nextConfig;
