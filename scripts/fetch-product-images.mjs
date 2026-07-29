/**
 * Downloads every product image referenced by parsed-products.json, converts to
 * WebP, and rewrites the JSON to point at local paths.
 *
 *   node scripts/fetch-product-images.mjs
 *
 * Source PNGs from the Shopify CDN run close to 1MB each; WebP at width 1200
 * typically lands under 100KB with no visible loss. Existing files are skipped,
 * so the script is safe to re-run after a partial failure.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/products");
const JSON_PATH = resolve(__dirname, "parsed-products.json");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

async function download(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const products = JSON.parse(readFileSync(JSON_PATH, "utf8"));
  mkdirSync(OUT_DIR, { recursive: true });

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  let bytesIn = 0;
  let bytesOut = 0;

  for (const product of products) {
    const localPaths = [];

    for (let i = 0; i < product.images.length; i++) {
      const src = product.images[i];
      const name = `${product.slug}-${i + 1}.webp`;
      const dest = resolve(OUT_DIR, name);
      const publicPath = `/products/${name}`;

      if (existsSync(dest)) {
        localPaths.push(publicPath);
        skipped++;
        continue;
      }

      try {
        const buf = await download(src);
        bytesIn += buf.length;
        const out = await sharp(buf)
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 82, effort: 4 })
          .toBuffer();
        writeFileSync(dest, out);
        bytesOut += out.length;
        localPaths.push(publicPath);
        downloaded++;
        process.stdout.write(".");
      } catch (err) {
        failed++;
        console.error(`\n  FAILED ${product.slug} #${i + 1}: ${err.message}`);
        // Keep the remote URL so the product still renders an image.
        localPaths.push(src);
      }
    }

    product.images = localPaths;
  }

  writeFileSync(JSON_PATH, JSON.stringify(products, null, 2));

  const mb = (n) => (n / 1024 / 1024).toFixed(1);
  console.log("\n");
  console.log(`downloaded : ${downloaded}`);
  console.log(`skipped    : ${skipped} (already present)`);
  console.log(`failed     : ${failed}`);
  if (bytesIn) {
    console.log(`size       : ${mb(bytesIn)}MB -> ${mb(bytesOut)}MB`);
  }
  console.log(`-> ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
