import Link from "next/link";
import { createAuthClient } from "@/lib/supabase/auth-server";

export const dynamic = "force-dynamic";

async function counts() {
  const db = await createAuthClient();

  const [products, collections, slides, posts] = await Promise.all([
    db.from("products").select("*", { count: "exact", head: true }),
    db.from("collections").select("*", { count: "exact", head: true }),
    db.from("hero_slides").select("*", { count: "exact", head: true }),
    db.from("posts").select("*", { count: "exact", head: true }),
  ]);

  return {
    products: products.count ?? 0,
    collections: collections.count ?? 0,
    slides: slides.count ?? 0,
    posts: posts.count ?? 0,
  };
}

const CARDS = [
  { key: "products", label: "Products", href: "/admin/products" },
  { key: "collections", label: "Collections", href: "/admin/collections" },
  { key: "slides", label: "Hero slides", href: "/admin/hero" },
  { key: "posts", label: "Blog posts", href: "/admin/posts" },
] as const;

export default async function AdminDashboard() {
  const stats = await counts();

  return (
    <div>
      <h1 style={{ fontSize: "var(--text-h0)" }}>Dashboard</h1>
      <p className="mt-3 font-body text-ink-muted">
        Changes here appear on the site immediately — no redeploy needed.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className="border border-hairline p-6 transition-colors hover:border-ink"
          >
            <p
              className="font-display font-semibold text-ink-muted"
              style={{ fontSize: "var(--text-body-sm)" }}
            >
              {c.label}
            </p>
            <p className="mt-2 font-display" style={{ fontSize: "var(--text-h0)" }}>
              {stats[c.key]}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
