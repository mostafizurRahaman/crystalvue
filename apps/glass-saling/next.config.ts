import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async headers() {
    const oneYear = 31536000; // 1 year in seconds
    const expiresDate = new Date(Date.now() + oneYear * 1000).toUTCString();

    return [
      {
        // Apply cache headers to Next.js image optimization endpoint
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${oneYear}, immutable`,
          },
          {
            key: "Expires",
            value: expiresDate,
          },
        ],
      },
      {
        // Apply cache headers to static image files in public folder
        source: "/:path*\\.(jpg|jpeg|png|gif|webp|svg|ico|avif|bmp|tiff)",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${oneYear}, immutable`,
          },
          {
            key: "Expires",
            value: expiresDate,
          },
        ],
      },
      {
        // Apply cache headers to Cloudinary images (if served through our domain)
        source: "/api/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${oneYear}, immutable`,
          },
          {
            key: "Expires",
            value: expiresDate,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
