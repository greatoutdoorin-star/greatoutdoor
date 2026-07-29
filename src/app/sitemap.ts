import type { MetadataRoute } from "next";
import { getAllProducts, getCollections, getPosts } from "@/lib/catalog";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://greatoutdoor.in";

/** Static routes, with the home page weighted highest. */
const STATIC_PATHS: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/collections/all", priority: 0.9 },
  { path: "/blogs", priority: 0.6 },
  { path: "/pages/about", priority: 0.7 },
  { path: "/pages/b2b-leads", priority: 0.8 },
  { path: "/pages/materials", priority: 0.7 },
  { path: "/pages/why-go-in", priority: 0.7 },
  { path: "/pages/faqs", priority: 0.6 },
  { path: "/pages/contact", priority: 0.6 },
  { path: "/pages/shipping", priority: 0.3 },
  { path: "/pages/returns", priority: 0.3 },
  { path: "/pages/privacy-policy", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, posts] = await Promise.all([
    getAllProducts(),
    getCollections(),
    getPosts(),
  ]);

  const now = new Date();

  return [
    ...STATIC_PATHS.map((s) => ({
      url: `${BASE}${s.path}`,
      lastModified: now,
      priority: s.priority,
    })),
    ...collections.map((c) => ({
      url: `${BASE}/collections/${c.slug}`,
      lastModified: now,
      priority: 0.9,
    })),
    ...products.map((p) => ({
      url: `${BASE}/products/${p.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${BASE}/blogs/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
      priority: 0.5,
    })),
  ];
}
