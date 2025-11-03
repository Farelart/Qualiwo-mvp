import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ng.jumia.is",
      },
      {
      protocol: "https",
      hostname: "m.media-amazon.com",
    },
    ],
  },
};

export default nextConfig;
