import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false, // or true if you want to disable optimization
  },
};

export default nextConfig;
