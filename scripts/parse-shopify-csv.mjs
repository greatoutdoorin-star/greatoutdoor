/**
 * Parses a Shopify product CSV export into the shape this site's database uses.
 *
 *   node scripts/parse-shopify-csv.mjs products_export_1.csv
 *
 * Writes scripts/parsed-products.json. This step is deliberately separate from
 * the database import so the output can be inspected before anything is written.
 *
 * Shopify's CSV puts each product's first variant/image on a row carrying the
 * full product data, then emits continuation rows that repeat only the Handle
 * plus one additional image or variant. Rows are grouped by Handle to reassemble.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Minimal RFC-4180 CSV parser: handles quoted fields, escaped quotes, embedded newlines. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\r") {
      // ignore; \n handles the break
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

/**
 * The export is UTF-8 read as Latin-1 somewhere upstream, so bullets and smart
 * quotes arrive as mojibake. Repair the sequences that actually occur.
 */
function fixEncoding(s) {
  if (!s) return "";
  return s
    .replace(/â¢/g, "•")
    .replace(/â/g, "'")
    .replace(/â/g, '"')
    .replace(/â/g, '"')
    .replace(/â/g, "—")
    .replace(/â/g, "–")
    .replace(/Ã©/g, "é")
    .replace(/Â/g, "")
    .replace(/�/g, "");
}

/** Strip Shopify's inline <style> blocks and tags, keeping paragraph breaks. */
function htmlToText(html) {
  if (!html) return "";
  return fixEncoding(html)
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/** Turn the bulleted specifications metafield into discrete lines. */
function parseSpecs(raw) {
  if (!raw) return [];
  return fixEncoding(raw)
    .split(/\n|•/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 1);
}

/**
 * Derive a collection slug.
 *
 * This export leaves the `Type` column empty; the type keyword actually sits in
 * `Tags`. Shopify's `Product Category` taxonomy is the more reliable signal, so
 * it is checked first and Tags is the fallback.
 */
function collectionFor({ category, tags }) {
  const c = (category || "").toLowerCase();
  if (c.includes("outdoor sofas")) return "sofas";
  if (c.includes("outdoor tables")) return "tables";
  if (c.includes("bar stools")) return "chairs";
  if (c.includes("outdoor chairs")) return "chairs";
  if (c.includes("porch swings")) return "additions";
  if (c.includes("outdoor seating")) return "chairs";

  const t = (tags || "").toLowerCase();
  if (t.includes("sofa")) return "sofas";
  if (t.includes("table")) return "tables";
  if (t.includes("chair")) return "chairs";
  if (t.includes("swing") || t.includes("lounger")) return "additions";

  return "additions";
}

function main() {
  const input = process.argv[2];
  if (!input) {
    console.error("usage: node scripts/parse-shopify-csv.mjs <export.csv>");
    process.exit(1);
  }

  const rows = parseCsv(readFileSync(resolve(input), "utf8"));
  const header = rows[0].map((h) => h.trim());
  const col = (name) => header.indexOf(name);

  const IDX = {
    handle: col("Handle"),
    title: col("Title"),
    body: col("Body (HTML)"),
    type: col("Type"),
    category: col("Product Category"),
    tags: col("Tags"),
    published: col("Published"),
    optionName: col("Option1 Name"),
    optionValue: col("Option1 Value"),
    price: col("Variant Price"),
    imageSrc: col("Image Src"),
    imagePos: col("Image Position"),
    status: col("Status"),
    material: col("Material (product.metafields.custom.material)"),
    specs: col(
      "Product Specifications (product.metafields.custom.product_specifications)",
    ),
  };

  const byHandle = new Map();

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const handle = (r[IDX.handle] || "").trim();
    if (!handle) continue;

    if (!byHandle.has(handle)) {
      byHandle.set(handle, {
        slug: handle,
        name: "",
        description: "",
        type: "",
        category: "",
        tags: "",
        status: "",
        price: 0,
        material: "",
        specs: [],
        images: [],
        variants: [],
      });
    }
    const p = byHandle.get(handle);

    // Rows carrying a Title hold the product-level fields.
    const title = (r[IDX.title] || "").trim();
    if (title && !p.name) {
      p.name = fixEncoding(title);
      p.description = htmlToText(r[IDX.body]);
      p.type = (r[IDX.type] || "").trim();
      p.category = (r[IDX.category] || "").trim();
      p.tags = (r[IDX.tags] || "").trim();
      p.status = (r[IDX.status] || "").trim();
      p.material = fixEncoding((r[IDX.material] || "").trim());
      p.specs = parseSpecs(r[IDX.specs]);
      const price = parseFloat(r[IDX.price] || "0");
      if (!Number.isNaN(price)) p.price = price;
    }

    // Variant labels become spec text rather than a selector — this site has no cart.
    const optValue = (r[IDX.optionValue] || "").trim();
    if (optValue && optValue !== "Default Title" && !p.variants.includes(optValue)) {
      p.variants.push(optValue);
      if (!p.optionName) p.optionName = (r[IDX.optionName] || "").trim();
    }

    const img = (r[IDX.imageSrc] || "").trim();
    if (img) {
      const pos = parseInt(r[IDX.imagePos] || "0", 10) || p.images.length + 1;
      if (!p.images.some((x) => x.src === img)) p.images.push({ src: img, pos });
    }
  }

  const all = [...byHandle.values()];
  for (const p of all) p.images.sort((a, b) => a.pos - b.pos);

  // Everything is imported. Products that are draft in Shopify, or carry no
  // price, come in as inactive so they are hidden from the site but editable
  // in the admin — publishing one is then a checkbox, not a re-import.
  const isPublished = (p) => p.status === "active" && p.price > 0;

  // A product with no images cannot render a card, so it is still excluded.
  const usable = all.filter((p) => p.name && p.images.length > 0);
  const dropped = all.filter((p) => !(p.name && p.images.length > 0));

  const out = usable.map((p) => ({
    slug: p.slug,
    name: p.name,
    description: p.description,
    price: p.price,
    collection: collectionFor({ category: p.category, tags: p.tags }),
    material: p.material,
    specs: p.specs,
    variantLabel: p.optionName || null,
    variants: p.variants,
    images: p.images.map((i) => i.src),
    isActive: isPublished(p),
  }));

  const active = out.filter((p) => p.isActive);
  const skipped = dropped;

  // Published only — drafts are hidden from the site, so counting them here
  // would misreport what a visitor actually sees in each collection.
  const counts = active.reduce((acc, p) => {
    acc[p.collection] = (acc[p.collection] || 0) + 1;
    return acc;
  }, {});

  writeFileSync(
    resolve(__dirname, "parsed-products.json"),
    JSON.stringify(out, null, 2),
  );

  console.log(`parsed ${all.length} products`);
  console.log(`  imported : ${out.length}`);
  console.log(`    published : ${active.length}`);
  console.log(`    draft     : ${out.length - active.length} (hidden, editable in admin)`);
  console.log(`  skipped  : ${skipped.length} (no name or no images)`);
  console.log("");
  console.log("published by collection:");
  for (const [k, v] of Object.entries(counts).sort()) {
    console.log(`  ${k.padEnd(12)} ${v}`);
  }
  console.log("");
  console.log(`images referenced: ${out.reduce((n, p) => n + p.images.length, 0)}`);
  console.log("-> scripts/parsed-products.json");

  const drafts = out.filter((p) => !p.isActive);
  if (drafts.length) {
    console.log("\nimported as draft:");
    for (const p of drafts) console.log(`  ${p.slug}`);
  }

  if (skipped.length) {
    console.log("\nskipped entirely:");
    for (const p of skipped) console.log(`  ${p.slug || "(no slug)"}`);
  }
}

main();
