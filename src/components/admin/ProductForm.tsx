"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ImageUploader from "./ImageUploader";

export type ProductFormValues = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  material: string;
  specs: string[];
  variantLabel: string;
  variants: string[];
  images: string[];
  collectionId: string | null;
  isActive: boolean;
  sortOrder: number;
};

type Props = {
  values: ProductFormValues;
  collections: { id: string; name: string }[];
  action: (formData: FormData) => void;
  onDelete?: () => void;
};

const field =
  "w-full border border-hairline bg-canvas px-4 py-3 font-body outline-none transition-colors focus:border-ink";
const label = "block font-display font-semibold mb-2";

export default function ProductForm({
  values,
  collections,
  action,
  onDelete,
}: Props) {
  // Images are edited as one-per-line text; a live preview keeps the order
  // visible, which matters because the first image is the card thumbnail.
  const [images, setImages] = useState(values.images.join("\n"));
  const imageList = images
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <form action={action}>
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div>
            <label className={label} htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={values.name}
              className={field}
            />
          </div>

          <div>
            <label className={label} htmlFor="slug">
              URL slug
            </label>
            <input
              id="slug"
              name="slug"
              required
              defaultValue={values.slug}
              pattern="[a-z0-9\-]+"
              title="Lowercase letters, numbers and hyphens only"
              className={field}
            />
            <p
              className="mt-2 font-body text-ink-muted"
              style={{ fontSize: "var(--text-body-sm)" }}
            >
              Changing this breaks existing links to the product.
            </p>
          </div>

          <div>
            <label className={label} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={7}
              defaultValue={values.description}
              className={`${field} resize-y`}
            />
          </div>

          <div>
            <label className={label} htmlFor="specs">
              Specifications — one per line
            </label>
            <textarea
              id="specs"
              name="specs"
              rows={7}
              defaultValue={values.specs.join("\n")}
              className={`${field} resize-y font-mono`}
              style={{ fontSize: "var(--text-body-sm)" }}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="variant_label">
                Option label
              </label>
              <input
                id="variant_label"
                name="variant_label"
                defaultValue={values.variantLabel}
                placeholder="e.g. Choice of Cane"
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="material">
                Material
              </label>
              <input
                id="material"
                name="material"
                defaultValue={values.material}
                placeholder="Cane / Rope"
                className={field}
              />
            </div>
          </div>

          <div>
            <label className={label} htmlFor="variants">
              Options — one per line
            </label>
            <textarea
              id="variants"
              name="variants"
              rows={4}
              defaultValue={values.variants.join("\n")}
              className={`${field} resize-y font-mono`}
              style={{ fontSize: "var(--text-body-sm)" }}
            />
          </div>

          <div>
            <label className={label} htmlFor="images">
              Images — one path per line, first is the thumbnail
            </label>
            <textarea
              id="images"
              name="images"
              rows={8}
              value={images}
              onChange={(e) => setImages(e.target.value)}
              className={`${field} resize-y font-mono`}
              style={{ fontSize: "var(--text-body-sm)" }}
            />

            <ImageUploader
              folder="products"
              multiple
              label="Upload product images"
              onUploaded={(urls) =>
                setImages((prev) =>
                  [...prev.split("\n"), ...urls]
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .join("\n"),
                )
              }
            />

            {imageList.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {imageList.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className="group relative h-20 w-20 border border-hairline bg-surface"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-contain"
                    />
                    {i === 0 && (
                      <span className="absolute left-0 top-0 bg-ink px-1 text-[10px] text-white">
                        1st
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label={`Remove image ${i + 1}`}
                      onClick={() =>
                        setImages(
                          imageList.filter((_, n) => n !== i).join("\n"),
                        )
                      }
                      className="absolute right-0 top-0 hidden h-5 w-5 items-center justify-center bg-red-700 text-[11px] leading-none text-white group-hover:flex"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="border border-hairline p-5">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={values.isActive}
                className="h-4 w-4"
              />
              <span className="font-display font-semibold">
                Visible on the site
              </span>
            </label>
            <p
              className="mt-2 font-body text-ink-muted"
              style={{ fontSize: "var(--text-body-sm)" }}
            >
              Uncheck to hide without deleting.
            </p>
          </div>

          <div>
            <label className={label} htmlFor="price">
              Price (₹)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={values.price}
              className={field}
            />
          </div>

          <div>
            <label className={label} htmlFor="collection_id">
              Collection
            </label>
            <select
              id="collection_id"
              name="collection_id"
              defaultValue={values.collectionId ?? ""}
              className={field}
            >
              <option value="">— none —</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={label} htmlFor="sort_order">
              Sort order
            </label>
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={values.sortOrder}
              className={field}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-ink px-8 py-4 font-display font-semibold text-white transition-colors hover:bg-accent"
          >
            Save changes
          </button>

          <Link
            href="/admin/products"
            className="block text-center font-body underline underline-offset-4 hover:text-accent"
          >
            Cancel
          </Link>

          {onDelete && (
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    "Delete this product permanently? This cannot be undone.",
                  )
                ) {
                  onDelete();
                }
              }}
              className="w-full border border-red-300 px-8 py-3 font-display font-semibold text-red-700 transition-colors hover:bg-red-50"
            >
              Delete product
            </button>
          )}
        </aside>
      </div>
    </form>
  );
}
