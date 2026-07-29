import { cache } from "react";
import { createPublicClient } from "./supabase/server";

export type Product = {
  slug: string;
  name: string;
  description: string;
  price: number;
  collection: string;
  material: string;
  specs: string[];
  variantLabel: string | null;
  variants: string[];
  images: string[];
};

export type Collection = {
  slug: string;
  name: string;
  count: number;
};

export type HeroSlide = {
  image: string;
  headline: string | null;
  subtext: string | null;
  link: string | null;
};

/** Shape of a `products` row joined to its collection slug. */
type ProductRow = {
  slug: string;
  name: string;
  description: string | null;
  price: string | number;
  material: string | null;
  specs: unknown;
  variant_label: string | null;
  variants: unknown;
  images: unknown;
  sort_order: number;
  collections: { slug: string } | null;
};

const asStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

function toProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    // numeric(10,2) arrives as a string over PostgREST.
    price: Number(row.price),
    collection: row.collections?.slug ?? "additions",
    material: row.material ?? "",
    specs: asStringArray(row.specs),
    variantLabel: row.variant_label,
    variants: asStringArray(row.variants),
    images: asStringArray(row.images),
  };
}

/**
 * All active products, ordered.
 *
 * `cache()` dedupes this across a single render pass, so a page that needs both
 * the nav collections and a product list makes one request rather than several.
 */
export const getAllProducts = cache(async (): Promise<Product[]> => {
  const db = createPublicClient();
  const { data, error } = await db
    .from("products")
    .select(
      "slug,name,description,price,material,specs,variant_label,variants,images,sort_order,collections(slug)",
    )
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw new Error(`getAllProducts: ${error.message}`);
  return (data as unknown as ProductRow[]).map(toProduct);
});

export const getCollections = cache(async (): Promise<Collection[]> => {
  const db = createPublicClient();
  const { data, error } = await db
    .from("collections")
    .select("slug,name,sort_order")
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw new Error(`getCollections: ${error.message}`);

  const products = await getAllProducts();
  return (data as { slug: string; name: string }[])
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      count: products.filter((p) => p.collection === c.slug).length,
    }))
    .filter((c) => c.count > 0);
});

export async function getProductsByCollection(slug: string): Promise<Product[]> {
  const products = await getAllProducts();
  if (slug === "all") return products;
  return products.filter((p) => p.collection === slug);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug);
}

export async function getCollection(
  slug: string,
): Promise<Collection | undefined> {
  if (slug === "all") {
    const products = await getAllProducts();
    return { slug: "all", name: "All", count: products.length };
  }
  const collections = await getCollections();
  return collections.find((c) => c.slug === slug);
}

/** Related products: same collection first, then anything else, excluding self. */
export async function getRelatedProducts(
  product: Product,
  limit = 8,
): Promise<Product[]> {
  const products = await getAllProducts();
  const same = products.filter(
    (p) => p.collection === product.collection && p.slug !== product.slug,
  );
  const others = products.filter(
    (p) => p.collection !== product.collection && p.slug !== product.slug,
  );
  return [...same, ...others].slice(0, limit);
}

export const getHeroSlides = cache(async (): Promise<HeroSlide[]> => {
  const db = createPublicClient();
  const { data, error } = await db
    .from("hero_slides")
    .select("image,headline,subtext,link,sort_order")
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw new Error(`getHeroSlides: ${error.message}`);
  return data as HeroSlide[];
});

/** Site settings as a plain key/value map (WhatsApp number, templates, marquee). */
export const getSettings = cache(async (): Promise<Record<string, string>> => {
  const db = createPublicClient();
  const { data, error } = await db.from("settings").select("key,value");

  if (error) throw new Error(`getSettings: ${error.message}`);
  return Object.fromEntries(
    (data as { key: string; value: string | null }[]).map((r) => [
      r.key,
      r.value ?? "",
    ]),
  );
});
