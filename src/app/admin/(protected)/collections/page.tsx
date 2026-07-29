import { revalidatePath } from "next/cache";
import { createAuthClient } from "@/lib/supabase/auth-server";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
  is_active: boolean;
};

async function saveCollections(formData: FormData) {
  "use server";

  const db = await createAuthClient();
  const ids = formData.getAll("id").map(String);

  for (const id of ids) {
    const { error } = await db
      .from("collections")
      .update({
        name: String(formData.get(`name-${id}`) ?? "").trim(),
        sort_order: Number(formData.get(`sort-${id}`) ?? 0) || 0,
        is_active: formData.get(`active-${id}`) === "on",
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  // Collections drive the sidebar nav on every page.
  revalidatePath("/", "layout");
}

export default async function AdminCollectionsPage() {
  const db = await createAuthClient();

  const { data } = await db
    .from("collections")
    .select("id,slug,name,sort_order,is_active")
    .order("sort_order");

  const collections = (data ?? []) as Row[];

  // Product counts tell you which collections would disappear from the nav.
  const counts: Record<string, number> = {};
  for (const c of collections) {
    const { count } = await db
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("collection_id", c.id)
      .eq("is_active", true);
    counts[c.id] = count ?? 0;
  }

  const field =
    "w-full border border-hairline bg-canvas px-4 py-3 font-body outline-none transition-colors focus:border-ink";

  return (
    <div>
      <h1 style={{ fontSize: "var(--text-h0)" }}>Collections</h1>
      <p className="mt-3 font-body text-ink-muted">
        Order here controls the sidebar nav. A collection with no active
        products is hidden from the site automatically.
      </p>

      <form action={saveCollections} className="mt-10 max-w-3xl">
        <div className="border-t border-hairline">
          {collections.map((c) => (
            <div
              key={c.id}
              className="grid items-end gap-4 border-b border-hairline py-5 sm:grid-cols-[1fr_100px_120px]"
            >
              <input type="hidden" name="id" value={c.id} />

              <div>
                <label
                  className="mb-2 block font-display font-semibold"
                  htmlFor={`name-${c.id}`}
                >
                  {c.slug}
                </label>
                <input
                  id={`name-${c.id}`}
                  name={`name-${c.id}`}
                  defaultValue={c.name}
                  className={field}
                />
                <p
                  className="mt-2 font-body text-ink-muted"
                  style={{ fontSize: "var(--text-body-sm)" }}
                >
                  {counts[c.id]} active product
                  {counts[c.id] === 1 ? "" : "s"}
                </p>
              </div>

              <div>
                <label
                  className="mb-2 block font-body text-ink-muted"
                  style={{ fontSize: "var(--text-body-sm)" }}
                  htmlFor={`sort-${c.id}`}
                >
                  Order
                </label>
                <input
                  id={`sort-${c.id}`}
                  name={`sort-${c.id}`}
                  type="number"
                  defaultValue={c.sort_order}
                  className={field}
                />
              </div>

              <label className="flex items-center gap-2 pb-3">
                <input
                  type="checkbox"
                  name={`active-${c.id}`}
                  defaultChecked={c.is_active}
                  className="h-4 w-4"
                />
                <span className="font-body">Active</span>
              </label>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-8 bg-ink px-8 py-4 font-display font-semibold text-white transition-colors hover:bg-accent"
        >
          Save collections
        </button>
      </form>
    </div>
  );
}
