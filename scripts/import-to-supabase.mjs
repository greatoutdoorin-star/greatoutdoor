/**
 * Imports parsed-products.json into Supabase.
 *
 *   node scripts/import-to-supabase.mjs
 *
 * Uses the service_role key, which bypasses RLS — server-side only, never in
 * the browser. Safe to re-run: rows are upserted on their unique slug, so a
 * second run updates rather than duplicates.
 *
 * Run supabase/schema.sql in the SQL Editor first.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

/** Minimal .env.local reader — avoids pulling in dotenv for one script. */
function loadEnv() {
  const text = readFileSync(resolve(ROOT, ".env.local"), "utf8");
  const env = {};
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const db = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** Display names and nav order for the collections the catalogue uses. */
const COLLECTIONS = [
  { slug: "chairs", name: "Chairs", sort_order: 1 },
  { slug: "tables", name: "Tables", sort_order: 2 },
  { slug: "sofas", name: "Sofas", sort_order: 3 },
  { slug: "additions", name: "Additions", sort_order: 4 },
];

const HERO_SLIDES = [
  { image: "/hero-1.webp", sort_order: 1 },
  { image: "/hero-2.webp", sort_order: 2 },
  { image: "/hero-3.webp", sort_order: 3 },
  { image: "/hero-4.webp", sort_order: 4 },
];

const SETTINGS = [
  { key: "whatsapp_number", value: "917791927939" },
  {
    key: "product_template",
    value: "Hi, I'm interested in {{name}} ({{qty}} pcs) — {{price}}\n{{url}}",
  },
  {
    key: "b2b_template",
    value:
      "Hi, I'd like to enquire about bulk / B2B pricing for Great Outdoor furniture.",
  },
  {
    key: "general_template",
    value: "Hi, I'd like to know more about Great Outdoor furniture.",
  },
  {
    key: "marquee_text",
    value:
      "From Sun to Storm — Our Products Are Backed by a 5-Year Guarantee*",
  },
];

async function main() {
  const products = JSON.parse(
    readFileSync(resolve(__dirname, "parsed-products.json"), "utf8"),
  );

  // --- collections -----------------------------------------------------
  const { data: collections, error: cErr } = await db
    .from("collections")
    .upsert(COLLECTIONS, { onConflict: "slug" })
    .select("id, slug");

  if (cErr) throw new Error(`collections: ${cErr.message}`);
  console.log(`collections : ${collections.length}`);

  const idBySlug = Object.fromEntries(collections.map((c) => [c.slug, c.id]));

  // --- products --------------------------------------------------------
  const rows = products.map((p, i) => ({
    collection_id: idBySlug[p.collection] ?? null,
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    material: p.material || null,
    specs: p.specs,
    variant_label: p.variantLabel,
    variants: p.variants,
    images: p.images,
    // Drafts import hidden; publishing one is then a checkbox in the admin.
    is_active: p.isActive !== false,
    sort_order: i,
  }));

  const { data: inserted, error: pErr } = await db
    .from("products")
    .upsert(rows, { onConflict: "slug" })
    .select("id, slug");

  if (pErr) throw new Error(`products: ${pErr.message}`);
  console.log(`products    : ${inserted.length}`);

  // --- hero slides -----------------------------------------------------
  // `image` carries no unique constraint, so upsert has nothing to match on.
  // Insert only when the table is empty; the admin panel owns it afterwards.
  const { count: heroCount } = await db
    .from("hero_slides")
    .select("*", { count: "exact", head: true });

  if (heroCount === 0) {
    const { error: hErr } = await db.from("hero_slides").insert(HERO_SLIDES);
    if (hErr) throw new Error(`hero_slides: ${hErr.message}`);
    console.log(`hero_slides : ${HERO_SLIDES.length}`);
  } else {
    console.log(`hero_slides : ${heroCount} already present, left alone`);
  }

  // --- settings --------------------------------------------------------
  const { error: sErr } = await db
    .from("settings")
    .upsert(SETTINGS, { onConflict: "key" });
  if (sErr) throw new Error(`settings: ${sErr.message}`);
  console.log(`settings    : ${SETTINGS.length}`);

  // --- verify ----------------------------------------------------------
  const { count } = await db
    .from("products")
    .select("*", { count: "exact", head: true });

  console.log("");
  console.log(`products now in database: ${count}`);

  for (const c of COLLECTIONS) {
    const { count: n } = await db
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("collection_id", idBySlug[c.slug]);
    console.log(`  ${c.name.padEnd(12)} ${n}`);
  }
}

main().catch((e) => {
  console.error("\nIMPORT FAILED:", e.message);
  process.exit(1);
});
