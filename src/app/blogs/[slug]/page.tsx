import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import { getCollections, getPost, getPosts } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt.slice(0, 155),
    openGraph: {
      title: post.title,
      description: post.excerpt.slice(0, 155),
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, collections] = await Promise.all([
    getPost(slug),
    getCollections(),
  ]);

  if (!post) notFound();

  return (
    <SiteShell collections={collections}>
      <article>
        <section className="px-6 pb-8 pt-16 lg:px-14 lg:pt-20">
          <nav
            className="font-body text-ink-muted"
            style={{ fontSize: "var(--text-body-sm)" }}
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/blogs" className="hover:text-accent">
              Blogs
            </Link>
          </nav>

          <h1 className="mt-6 max-w-4xl" style={{ fontSize: "var(--text-h0)" }}>
            {post.title}
          </h1>

          {post.publishedAt && (
            <p
              className="mt-3 font-body text-ink-muted"
              style={{ fontSize: "var(--text-body-sm)" }}
            >
              {formatDate(post.publishedAt)}
            </p>
          )}
        </section>

        {post.cover && (
          <section className="px-6 pb-10 lg:px-14">
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 80vw"
                className="object-cover"
              />
            </div>
          </section>
        )}

        {/*
          Body is stored as sanitised HTML: the import keeps only structural
          tags (p, h2-h4, ul, ol, li, strong, em, br) and strips every
          attribute, so there is no script or style surface here.
        */}
        <section
          className="policy-body max-w-4xl px-6 pb-20 lg:px-14"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </article>
    </SiteShell>
  );
}
