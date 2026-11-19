import type { NextConfig } from "next";
import path from "node:path";

/**
 * Only allow remote image hosts that the app actually uses:
 *  - Unsplash: bundled placeholder/fallback imagery
 *  - ImgBB CDN: vendor menu images uploaded through our server proxy
 *  - Google user content: profile pictures from Google OAuth
 *
 * Wildcard hosts are intentionally avoided — an open image proxy can be
 * abused to fetch arbitrary URLs through the app's optimizer.
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.imgbb.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
