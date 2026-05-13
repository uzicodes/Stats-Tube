import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com', // YouTube Avatar domain
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com', // Alternative Avatar domain
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com', // YouTube Video Thumbnail domain
      }
    ],
  },
};

export default nextConfig;