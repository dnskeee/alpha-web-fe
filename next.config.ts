import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.beprime.pro' },
    ],
  },
};

export default nextConfig;
