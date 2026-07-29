import type { NextConfig } from "next";

/**
 * Supabase Storage host, derived from the project URL so it cannot drift if the
 * project ever changes. Admin-uploaded images are served from here; the images
 * migrated from Shopify still live in public/ and need no remote pattern.
 */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
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
