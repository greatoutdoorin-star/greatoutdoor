import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hero art is 2100px wide; nothing here needs a 3840px variant.
    // Trimming the ladder cuts dev-time re-encoding work per request.
    deviceSizes: [640, 828, 1080, 1200, 1920, 2100],
    imageSizes: [96, 128, 256, 384],
    formats: ["image/webp"],
    // Sources are already WebP, so cache the derived sizes for a long time.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
