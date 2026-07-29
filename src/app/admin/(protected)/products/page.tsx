import Image from "next/image";
import Link from "next/link";
import { createAuthClient } from "@/lib/supabase/auth-server";
import { formatPrice } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  slug: string;
  name: string;
  price: string | number;
  images: unknown;
  is_active: boolean;
  collections: { name: string } | null;
};

export default async function AdminProductsPage() {
  const db = await createAuthClient();
  const { data, error } = await db
    .from("products")
    .select("id,slug,name,price,images,is_active,sort_order,collections(name)")
    .order("sort_order");

  if (error) {
    return (
      <div>
        <h1 style={{ fontSize: "var(--text-h0)" }}>Products</h1>
        <p role="alert" className="mt-6 font-body text-red-600">
          Could not load products: {error.message}
        </p>
      </div>
    );
  }

  const products = (data ?? []) as unknown as Row[];

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 style={{ fontSize: "var(--text-h0)" }}>Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-ink px-6 py-3 font-display font-semibold text-white transition-colors hover:bg-accent"
        >
          Add product
        </Link>
      </div>

      <p className="mt-3 font-body text-ink-muted">
        {products.length} products · {products.filter((p) => p.is_active).length}{" "}
        active
      </p>

      <div className="mt-8 border-t border-hairline">
        {products.map((p) => {
          const images = Array.isArray(p.images) ? (p.images as string[]) : [];
          return (
            <Link
              key={p.id}
              href={`/admin/products/${p.id}`}
              className="flex items-center gap-4 border-b border-hairline py-4 transition-colors hover:bg-surface"
            >
              <div className="relative h-16 w-16 shrink-0 bg-surface">
                {images[0] && (
                  <Image
                    src={images[0]}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-display font-semibold">{p.name}</p>
                <p
                  className="mt-1 font-body text-ink-muted"
                  style={{ fontSize: "var(--text-body-sm)" }}
                >
                  {p.collections?.name ?? "—"} · {images.length} image
                  {images.length === 1 ? "" : "s"}
                </p>
              </div>

              <p className="hidden font-body sm:block">
                {formatPrice(Number(p.price))}
              </p>

              <span
                className={`shrink-0 px-3 py-1 font-body ${
                  p.is_active
                    ? "bg-ink/5 text-ink"
                    : "bg-red-50 text-red-700"
                }`}
                style={{ fontSize: "var(--text-body-sm)" }}
              >
                {p.is_active ? "Active" : "Hidden"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
