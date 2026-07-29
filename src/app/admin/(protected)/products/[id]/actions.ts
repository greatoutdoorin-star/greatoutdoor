"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth-server";

/**
 * Product mutations.
 *
 * These run as the signed-in user, so the `admin write` RLS policies apply —
 * an unauthenticated caller is rejected by the database, not just by the UI.
 */

/** Split a textarea into trimmed, non-empty lines. */
function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function updateProduct(id: string, formData: FormData) {
  const db = await createAuthClient();

  const price = Number(formData.get("price"));
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be a positive number");
  }

  const { error } = await db
    .from("products")
    .update({
      name: String(formData.get("name") ?? "").trim(),
      slug: String(formData.get("slug") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      price,
      material: String(formData.get("material") ?? "").trim() || null,
      specs: lines(formData.get("specs")),
      variant_label:
        String(formData.get("variant_label") ?? "").trim() || null,
      variants: lines(formData.get("variants")),
      images: lines(formData.get("images")),
      collection_id: String(formData.get("collection_id") ?? "") || null,
      is_active: formData.get("is_active") === "on",
      sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Public pages are statically generated, so they need explicit revalidation.
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function createProduct(formData: FormData) {
  const db = await createAuthClient();

  const price = Number(formData.get("price"));
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be a positive number");
  }

  const { error } = await db.from("products").insert({
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price,
    material: String(formData.get("material") ?? "").trim() || null,
    specs: lines(formData.get("specs")),
    variant_label: String(formData.get("variant_label") ?? "").trim() || null,
    variants: lines(formData.get("variants")),
    images: lines(formData.get("images")),
    collection_id: String(formData.get("collection_id") ?? "") || null,
    is_active: formData.get("is_active") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const db = await createAuthClient();
  const { error } = await db.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect("/admin/products");
}
