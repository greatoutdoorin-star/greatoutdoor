import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { getCollections, getPosts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Guides and notes on outdoor furniture, materials and caring for your pieces.",
};

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogsPage() {
  const [collections, posts] = await Promise.all([
    getCollections(),
    getPosts(),
  ]);

  return (
    <SiteShell collections={collections}>
      <section className="px-6 pb-10 pt-16 lg:px-14 lg:pt-20">
        <h1 style={{ fontSize: "var(--text-h0)" }}>Blogs</h1>
      </section>

      {posts.length === 0 ? (
        <section className="px-6 pb-20 lg:px-14">
          <p className="font-body text-ink-muted">
            There are no articles yet — check back soon.
          </p>
        </section>
      ) : (
        <section className="grid gap-x-8 gap-y-14 px-6 pb-20 lg:grid-cols-3 lg:px-14">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link href={`/blogs/${post.slug}`} className="group block">
                {post.cover && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={post.cover}
                      alt={post.title}
                      fill
                      sizes="(max-width: 1023px) 100vw, 30vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}

                <h2
                  className="mt-6 group-hover:text-accent"
                  style={{ fontSize: "var(--text-h2)" }}
                >
                  {post.title}
                </h2>
              </Link>

              {post.publishedAt && (
                <p
                  className="mt-2 font-body text-ink-muted"
                  style={{ fontSize: "var(--text-body-sm)" }}
                >
                  {formatDate(post.publishedAt)}
                </p>
              )}

              {post.excerpt && (
                <p className="mt-3 font-body leading-relaxed text-ink-muted">
                  {post.excerpt}
                </p>
              )}

              <Link
                href={`/blogs/${post.slug}`}
                className="mt-4 inline-block font-display font-semibold underline underline-offset-4 hover:text-accent"
              >
                Read more
              </Link>
            </article>
          ))}
        </section>
      )}
    </SiteShell>
  );
}
