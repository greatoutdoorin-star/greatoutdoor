import { revalidatePath } from "next/cache";
import { createAuthClient } from "@/lib/supabase/auth-server";
import StatefulForm from "@/components/admin/StatefulForm";
import { SaveButton, type SaveState } from "@/components/admin/SaveButton";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
  is_active: boolean;
};

/** Lowercase, hyphenated, URL-safe. Used when the slug field is left blank. */
function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function addCollection(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  "use server";

  const db = await createAuthClient();

  const name = String(formData.get("new_name") ?? "").trim();
  if (!name) return { ok: false, message: "Name is required." };

  const slug = slugify(String(formData.get("new_slug") ?? "") || name);
  if (!slug) {
    return {
      ok: false,
      message: "Could not derive a URL slug from that name.",
    };
  }

  const { count } = await db
    .from("collections")
    .select("*", { count: "exact", head: true });

  const { error } = await db.from("collections").insert({
    name,
    slug,
    sort_order: (count ?? 0) + 1,
    is_active: true,
  });

  if (error) {
    // Unique violation on slug — the friendliest failure to explain.
    if (error.code === "23505") {
      return {
        ok: false,
        message: `A collection with the slug "${slug}" already exists.`,
      };
    }
    return { ok: false, message: error.message };
  }

  revalidatePath("/", "layout");

  return { ok: true, message: `Created "${name}" at /collections/${slug}.` };
}

async function deleteCollection(formData: FormData) {
  "use server";

  const db = await createAuthClient();
  const id = String(formData.get("delete_id") ?? "");

  // Products reference collections with ON DELETE SET NULL, so removing a
  // collection orphans its products rather than deleting them.
  const { error } = await db.from("collections").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}

async function saveCollections(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
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

    if (error) return { ok: false, message: `Could not save: ${error.message}` };
  }

  // Collections drive the sidebar nav on every page.
  revalidatePath("/", "layout");

  return {
    ok: true,
    message: `Saved ${ids.length} collection${ids.length === 1 ? "" : "s"}. The sidebar nav is updated.`,
  };
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

      <StatefulForm action={saveCollections} className="mt-10 max-w-3xl">
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

        <SaveButton className="mt-8" pendingLabel="Saving collections…">
          Save collections
        </SaveButton>
      </StatefulForm>

      {/* Add ------------------------------------------------------------ */}
      <StatefulForm
        action={addCollection}
        className="mt-14 max-w-3xl border-t border-hairline pt-8"
      >
        <h2 style={{ fontSize: "var(--text-h2)" }}>Add a collection</h2>
        <p
          className="mt-2 font-body text-ink-muted"
          style={{ fontSize: "var(--text-body-sm)" }}
        >
          It appears in the sidebar once it has at least one active product.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <label
              className="mb-2 block font-body text-ink-muted"
              style={{ fontSize: "var(--text-body-sm)" }}
              htmlFor="new_name"
            >
              Name
            </label>
            <input
              id="new_name"
              name="new_name"
              required
              placeholder="Loungers"
              className={field}
            />
          </div>

          <div>
            <label
              className="mb-2 block font-body text-ink-muted"
              style={{ fontSize: "var(--text-body-sm)" }}
              htmlFor="new_slug"
            >
              URL slug (optional)
            </label>
            <input
              id="new_slug"
              name="new_slug"
              placeholder="loungers"
              pattern="[a-z0-9\-]*"
              title="Lowercase letters, numbers and hyphens only"
              className={field}
            />
          </div>

          <button
            type="submit"
            className="self-end bg-ink px-8 py-3 font-display font-semibold text-white transition-colors hover:bg-accent"
          >
            Add
          </button>
        </div>
      </StatefulForm>

      {/* Remove --------------------------------------------------------- */}
      {collections.length > 0 && (
        <form
          action={deleteCollection}
          className="mt-14 max-w-3xl border-t border-hairline pt-8"
        >
          <h2 style={{ fontSize: "var(--text-h2)" }}>Remove a collection</h2>
          <p
            className="mt-2 font-body text-ink-muted"
            style={{ fontSize: "var(--text-body-sm)" }}
          >
            Products in it are kept, but become uncategorised — reassign them
            from the Products screen afterwards.
          </p>

          <div className="mt-5 flex max-w-md gap-3">
            <select
              name="delete_id"
              aria-label="Collection to remove"
              className={field}
            >
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({counts[c.id]} product
                  {counts[c.id] === 1 ? "" : "s"})
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="shrink-0 border border-red-300 px-6 font-display font-semibold text-red-700 transition-colors hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
