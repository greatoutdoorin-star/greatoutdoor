import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth-server";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  slug: string;
  title: string;
  published_at: string | null;
  is_active: boolean;
};

async function addPost() {
  "use server";

  const db = await createAuthClient();
  const stamp = Date.now();

  const { data, error } = await db
    .from("posts")
    .insert({
      slug: `untitled-${stamp}`,
      title: "Untitled post",
      is_active: false,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  redirect(`/admin/posts/${data.id}`);
}

export default async function AdminPostsPage() {
  const db = await createAuthClient();
  const { data } = await db
    .from("posts")
    .select("id,slug,title,published_at,is_active")
    .order("published_at", { ascending: false, nullsFirst: true });

  const posts = (data ?? []) as Row[];

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 style={{ fontSize: "var(--text-h0)" }}>Blog posts</h1>
        <form action={addPost}>
          <button
            type="submit"
            className="bg-ink px-6 py-3 font-display font-semibold text-white transition-colors hover:bg-accent"
          >
            New post
          </button>
        </form>
      </div>

      <p className="mt-3 font-body text-ink-muted">
        {posts.length} post{posts.length === 1 ? "" : "s"} ·{" "}
        {posts.filter((p) => p.is_active).length} published
      </p>

      <div className="mt-8 max-w-3xl border-t border-hairline">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/admin/posts/${p.id}`}
            className="flex items-center gap-4 border-b border-hairline py-4 transition-colors hover:bg-surface"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-display font-semibold">{p.title}</p>
              <p
                className="mt-1 truncate font-body text-ink-muted"
                style={{ fontSize: "var(--text-body-sm)" }}
              >
                /blogs/{p.slug}
              </p>
            </div>

            <span
              className={`shrink-0 px-3 py-1 font-body ${
                p.is_active ? "bg-ink/5 text-ink" : "bg-red-50 text-red-700"
              }`}
              style={{ fontSize: "var(--text-body-sm)" }}
            >
              {p.is_active ? "Published" : "Draft"}
            </span>
          </Link>
        ))}

        {posts.length === 0 && (
          <p className="py-8 font-body text-ink-muted">
            No posts yet. Click “New post” to write one.
          </p>
        )}
      </div>
    </div>
  );
}
