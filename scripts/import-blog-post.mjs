/**
 * Imports the existing journal post into the `posts` table.
 *
 *   node scripts/import-blog-post.mjs <cleaned-post.json>
 *
 * The JSON is produced by the extraction step and holds { title, body }.
 * Safe to re-run: upserts on slug.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function loadEnv() {
  const text = readFileSync(resolve(ROOT, ".env.local"), "utf8");
  const env = {};
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq > 0) env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnv();
const db = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const input = process.argv[2];
if (!input) {
  console.error("usage: node scripts/import-blog-post.mjs <post.json>");
  process.exit(1);
}

const { title, body: rawBody } = JSON.parse(readFileSync(input, "utf8"));

// The theme prints a byline above the body; drop it so it does not appear
// twice once the new template renders its own date line.
const body = rawBody
  .replace(/^[^<]*by\s+My Store Admin\s*/i, "")
  .replace(/^\s*<\/(p|div)>\s*/i, "")
  .trim();

/** First paragraph, trimmed to a usable card excerpt. */
function firstParagraph(html) {
  const m = html.match(/<p>([\s\S]*?)<\/p>/i);
  const text = (m?.[1] ?? "").replace(/<[^>]+>/g, "").trim();
  return text.length > 180 ? `${text.slice(0, 177).trimEnd()}…` : text;
}

const row = {
  slug: "the-complete-guide-to-outdoor-furniture",
  title,
  excerpt: firstParagraph(body),
  cover: "/blog/guide-cover.webp",
  body,
  // Matches the publish date shown on the live post.
  published_at: "2024-09-11T00:00:00Z",
  is_active: true,
};

const { error } = await db.from("posts").upsert(row, { onConflict: "slug" });
if (error) {
  console.error("import failed:", error.message);
  process.exit(1);
}

console.log(`imported: ${row.title}`);
console.log(`  slug   : ${row.slug}`);
console.log(`  body   : ${body.length} bytes`);
console.log(`  excerpt: ${row.excerpt.slice(0, 90)}…`);
