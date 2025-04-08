import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  allowedDevOrigins: [
    "http://localhost:3000",
    "https://8b57-182-184-251-20.ngrok-free.app",
  ],
};

export default nextConfig;
