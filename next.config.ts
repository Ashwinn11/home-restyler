import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        // Supabase storage for gallery images
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/**",
      },
      {
        // Supabase project direct URLs
        protocol: "https",
        hostname: "**.supabase.in",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
