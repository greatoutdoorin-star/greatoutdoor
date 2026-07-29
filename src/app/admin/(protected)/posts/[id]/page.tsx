import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth-server";
import ImageField from "@/components/admin/ImageField";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

async function savePost(id: string, formData: FormData) {
  "use server";

  const db = await createAuthClient();

  const publishedRaw = String(formData.get("published_at") ?? "").trim();

  const { error } = await db
    .from("posts")
    .update({
      title: String(formData.get("title") ?? "").trim(),
      slug: String(formData.get("slug") ?? "").trim(),
      excerpt: String(formData.get("excerpt") ?? "").trim() || null,
      cover: String(formData.get("cover") ?? "").trim() || null,
      body: String(formData.get("body") ?? "").trim(),
      // datetime-local gives "YYYY-MM-DDTHH:mm"; Postgres accepts that.
      published_at: publishedRaw ? new Date(publishedRaw).toISOString() : null,
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect("/admin/posts");
}

async function removePost(id: string) {
  "use server";

  const db = await createAuthClient();
  const { error } = await db.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect("/admin/posts");
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const db = await createAuthClient();

  const { data: post } = await db
    .from("posts")
    .select("id,slug,title,excerpt,cover,body,published_at,is_active")
    .eq("id", id)
    .single();

  if (!post) notFound();

  const save = savePost.bind(null, post.id);
  const remove = removePost.bind(null, post.id);

  // datetime-local needs "YYYY-MM-DDTHH:mm" with no timezone suffix.
  const publishedValue = post.published_at
    ? new Date(post.published_at).toISOString().slice(0, 16)
    : "";

  const field =
    "w-full border border-hairline bg-canvas px-4 py-3 font-body outline-none transition-colors focus:border-ink";
  const label = "block font-display font-semibold mb-2";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/posts"
          className="font-body underline underline-offset-4 hover:text-accent"
          style={{ fontSize: "var(--text-body-sm)" }}
        >
          ← Blog posts
        </Link>
        {post.is_active && (
          <Link
            href={`/blogs/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body underline underline-offset-4 hover:text-accent"
            style={{ fontSize: "var(--text-body-sm)" }}
          >
            View on site →
          </Link>
        )}
      </div>

      <h1 className="mt-4 mb-8" style={{ fontSize: "var(--text-h0)" }}>
        {post.title}
      </h1>

      <form action={save} className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div>
            <label className={label} htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={post.title}
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
              defaultValue={post.slug}
              pattern="[a-z0-9\-]+"
              title="Lowercase letters, numbers and hyphens only"
              className={field}
            />
          </div>

          <div>
            <label className={label} htmlFor="excerpt">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              defaultValue={post.excerpt ?? ""}
              className={`${field} resize-y`}
            />
            <p
              className="mt-2 font-body text-ink-muted"
              style={{ fontSize: "var(--text-body-sm)" }}
            >
              Shown on the blog listing card.
            </p>
          </div>

          <div>
            <label className={label} htmlFor="body">
              Body
            </label>
            <textarea
              id="body"
              name="body"
              rows={24}
              defaultValue={post.body ?? ""}
              className={`${field} resize-y font-mono`}
              style={{ fontSize: "var(--text-body-sm)" }}
            />
            <p
              className="mt-2 font-body text-ink-muted"
              style={{ fontSize: "var(--text-body-sm)" }}
            >
              Basic HTML: &lt;p&gt; &lt;h2&gt; &lt;h3&gt; &lt;ul&gt; &lt;li&gt;
              &lt;strong&gt; &lt;em&gt;
            </p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="border border-hairline p-5">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={post.is_active}
                className="h-4 w-4"
              />
              <span className="font-display font-semibold">Published</span>
            </label>
            <p
              className="mt-2 font-body text-ink-muted"
              style={{ fontSize: "var(--text-body-sm)" }}
            >
              Unpublished posts are hidden from the site.
            </p>
          </div>

          <div>
            <label className={label} htmlFor="published_at">
              Publish date
            </label>
            <input
              id="published_at"
              name="published_at"
              type="datetime-local"
              defaultValue={publishedValue}
              className={field}
            />
          </div>

          <div>
            <span className={label}>Cover image</span>
            <ImageField
              name="cover"
              defaultValue={post.cover ?? ""}
              folder="blog"
              label="Upload cover image"
              placeholder="/blog/my-cover.webp"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-ink px-8 py-4 font-display font-semibold text-white transition-colors hover:bg-accent"
          >
            Save post
          </button>
        </aside>
      </form>

      <form action={remove} className="mt-10 max-w-md border-t border-hairline pt-6">
        <button
          type="submit"
          className="border border-red-300 px-6 py-3 font-display font-semibold text-red-700 transition-colors hover:bg-red-50"
        >
          Delete post
        </button>
      </form>
    </div>
  );
}
