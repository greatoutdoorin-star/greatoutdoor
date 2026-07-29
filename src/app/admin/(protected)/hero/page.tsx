import { revalidatePath } from "next/cache";
import { createAuthClient } from "@/lib/supabase/auth-server";
import ImageField from "@/components/admin/ImageField";
import StatefulForm from "@/components/admin/StatefulForm";
import { SaveButton, type SaveState } from "@/components/admin/SaveButton";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  image: string;
  headline: string | null;
  subtext: string | null;
  link: string | null;
  sort_order: number;
  is_active: boolean;
};

async function saveSlides(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  "use server";

  const db = await createAuthClient();
  const ids = formData.getAll("id").map(String);

  for (const id of ids) {
    const { error } = await db
      .from("hero_slides")
      .update({
        image: String(formData.get(`image-${id}`) ?? "").trim(),
        headline: String(formData.get(`headline-${id}`) ?? "").trim() || null,
        subtext: String(formData.get(`subtext-${id}`) ?? "").trim() || null,
        link: String(formData.get(`link-${id}`) ?? "").trim() || null,
        sort_order: Number(formData.get(`sort-${id}`) ?? 0) || 0,
        is_active: formData.get(`active-${id}`) === "on",
      })
      .eq("id", id);

    if (error) return { ok: false, message: `Could not save: ${error.message}` };
  }

  revalidatePath("/", "layout");

  return {
    ok: true,
    message: `Saved ${ids.length} slide${ids.length === 1 ? "" : "s"}. The home page is updated.`,
  };
}

async function addSlide() {
  "use server";

  const db = await createAuthClient();
  const { count } = await db
    .from("hero_slides")
    .select("*", { count: "exact", head: true });

  const { error } = await db.from("hero_slides").insert({
    image: "/hero-1.webp",
    sort_order: (count ?? 0) + 1,
    is_active: false,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/hero");
}

async function deleteSlide(formData: FormData) {
  "use server";

  const db = await createAuthClient();
  const id = String(formData.get("delete_id") ?? "");
  const { error } = await db.from("hero_slides").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}

export default async function AdminHeroPage() {
  const db = await createAuthClient();
  const { data } = await db
    .from("hero_slides")
    .select("id,image,headline,subtext,link,sort_order,is_active")
    .order("sort_order");

  const slides = (data ?? []) as Row[];

  const field =
    "w-full border border-hairline bg-canvas px-4 py-3 font-body outline-none transition-colors focus:border-ink";

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 style={{ fontSize: "var(--text-h0)" }}>Hero slides</h1>
        <form action={addSlide}>
          <button
            type="submit"
            className="bg-ink px-6 py-3 font-display font-semibold text-white transition-colors hover:bg-accent"
          >
            Add slide
          </button>
        </form>
      </div>

      <p className="mt-3 font-body text-ink-muted">
        The carousel at the top of the home page. Drag an image onto a slide to
        upload it, or paste a path if the file already lives in{" "}
        <code>public/</code>. Headline and subtext are optional.
      </p>

      <StatefulForm action={saveSlides} className="mt-10 max-w-4xl space-y-6">
        {slides.map((s) => (
          <div key={s.id} className="border border-hairline p-5">
            <input type="hidden" name="id" value={s.id} />

            <div className="grid gap-5 sm:grid-cols-[240px_1fr]">
              <ImageField
                name={`image-${s.id}`}
                defaultValue={s.image}
                folder="hero"
                label="Upload slide image"
                placeholder="/hero-1.webp"
              />

              <div className="space-y-4">
                <input
                  name={`headline-${s.id}`}
                  defaultValue={s.headline ?? ""}
                  placeholder="Headline (optional)"
                  aria-label="Headline"
                  className={field}
                />
                <input
                  name={`subtext-${s.id}`}
                  defaultValue={s.subtext ?? ""}
                  placeholder="Subtext (optional)"
                  aria-label="Subtext"
                  className={field}
                />
                <div className="grid gap-4 sm:grid-cols-[1fr_100px_auto]">
                  <input
                    name={`link-${s.id}`}
                    defaultValue={s.link ?? ""}
                    placeholder="/collections/chairs (optional)"
                    aria-label="Link"
                    className={field}
                  />
                  <input
                    name={`sort-${s.id}`}
                    type="number"
                    defaultValue={s.sort_order}
                    aria-label="Sort order"
                    className={field}
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name={`active-${s.id}`}
                      defaultChecked={s.is_active}
                      className="h-4 w-4"
                    />
                    <span className="font-body">Active</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}

        <SaveButton pendingLabel="Saving slides…">Save slides</SaveButton>
      </StatefulForm>

      {slides.length > 0 && (
        <form action={deleteSlide} className="mt-10 max-w-md border-t border-hairline pt-6">
          <label
            className="mb-2 block font-display font-semibold"
            htmlFor="delete_id"
          >
            Remove a slide
          </label>
          <div className="flex gap-3">
            <select id="delete_id" name="delete_id" className={field}>
              {slides.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.sort_order}. {s.image}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="shrink-0 border border-red-300 px-5 font-display font-semibold text-red-700 transition-colors hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
