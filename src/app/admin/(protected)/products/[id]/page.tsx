import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { createAuthClient } from "@/lib/supabase/auth-server";
import { createProduct, deleteProduct, updateProduct } from "./actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const asStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const db = await createAuthClient();

  const { data: collections } = await db
    .from("collections")
    .select("id,name")
    .order("sort_order");

  const isNew = id === "new";

  if (isNew) {
    return (
      <div>
        <Link
          href="/admin/products"
          className="font-body underline underline-offset-4 hover:text-accent"
          style={{ fontSize: "var(--text-body-sm)" }}
        >
          ← Products
        </Link>
        <h1 className="mt-4 mb-8" style={{ fontSize: "var(--text-h0)" }}>
          New product
        </h1>

        <ProductForm
          collections={collections ?? []}
          action={createProduct}
          values={{
            name: "",
            slug: "",
            description: "",
            price: 0,
            material: "",
            specs: [],
            variantLabel: "",
            variants: [],
            images: [],
            collectionId: null,
            isActive: true,
            sortOrder: 0,
          }}
        />
      </div>
    );
  }

  const { data: product } = await db
    .from("products")
    .select(
      "id,slug,name,description,price,material,specs,variant_label,variants,images,collection_id,is_active,sort_order",
    )
    .eq("id", id)
    .single();

  if (!product) notFound();

  // Bind the product id so the client component can call these without
  // knowing about server-action wiring.
  const update = updateProduct.bind(null, product.id);
  const remove = deleteProduct.bind(null, product.id);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/products"
          className="font-body underline underline-offset-4 hover:text-accent"
          style={{ fontSize: "var(--text-body-sm)" }}
        >
          ← Products
        </Link>
        <Link
          href={`/products/${product.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body underline underline-offset-4 hover:text-accent"
          style={{ fontSize: "var(--text-body-sm)" }}
        >
          View on site →
        </Link>
      </div>

      <h1 className="mt-4 mb-8" style={{ fontSize: "var(--text-h0)" }}>
        {product.name}
      </h1>

      <ProductForm
        collections={collections ?? []}
        action={update}
        onDelete={remove}
        values={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          price: Number(product.price),
          material: product.material ?? "",
          specs: asStringArray(product.specs),
          variantLabel: product.variant_label ?? "",
          variants: asStringArray(product.variants),
          images: asStringArray(product.images),
          collectionId: product.collection_id,
          isActive: product.is_active,
          sortOrder: product.sort_order,
        }}
      />
    </div>
  );
}
