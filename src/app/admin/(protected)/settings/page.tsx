import { revalidatePath } from "next/cache";
import { createAuthClient } from "@/lib/supabase/auth-server";
import StatefulForm from "@/components/admin/StatefulForm";
import { SaveButton, type SaveState } from "@/components/admin/SaveButton";

export const dynamic = "force-dynamic";

/** Keys rendered on this page, with the copy that explains each one. */
const FIELDS = [
  {
    key: "whatsapp_number",
    label: "WhatsApp number",
    help: "Digits only, country code first — e.g. 919829012090",
    rows: 1,
  },
  {
    key: "product_template",
    label: "Product enquiry message",
    help: "Tokens: {{name}} {{price}} {{qty}} {{url}}",
    rows: 3,
  },
  {
    key: "b2b_template",
    label: "Bulk / B2B enquiry message",
    help: "Sent from the Bulk | B2B page and the Materials CTAs.",
    rows: 3,
  },
  {
    key: "general_template",
    label: "General enquiry message",
    help: "Sent from the floating WhatsApp button.",
    rows: 3,
  },
  {
    key: "marquee_text",
    label: "Home page ticker",
    help: "The scrolling band beneath the featured products.",
    rows: 2,
  },
  {
    key: "announcement_text",
    label: "Announcement bar",
    help: "Orange promo band at the very top. Leave blank to hide it.",
    rows: 2,
  },
] as const;

async function saveSettings(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  "use server";

  const db = await createAuthClient();

  const rows = FIELDS.map((f) => ({
    key: f.key,
    value: String(formData.get(f.key) ?? "").trim(),
  }));

  // A malformed number silently breaks every enquiry link on the site, so it is
  // worth catching here rather than discovering it from a lost lead.
  const number = rows.find((r) => r.key === "whatsapp_number")?.value ?? "";
  if (!/^\d{10,15}$/.test(number)) {
    return {
      ok: false,
      message:
        "WhatsApp number must be digits only, including the country code — e.g. 919829012090.",
    };
  }

  const { error } = await db.from("settings").upsert(rows, {
    onConflict: "key",
  });

  if (error) return { ok: false, message: `Could not save: ${error.message}` };

  // The WhatsApp number and ticker appear on statically generated pages.
  revalidatePath("/", "layout");

  return { ok: true, message: "Settings saved and live on the site." };
}

export default async function AdminSettingsPage() {
  const db = await createAuthClient();
  const { data } = await db.from("settings").select("key,value");

  const current = Object.fromEntries(
    (data ?? []).map((r) => [r.key, r.value ?? ""]),
  ) as Record<string, string>;

  const field =
    "w-full border border-hairline bg-canvas px-4 py-3 font-body outline-none transition-colors focus:border-ink";

  return (
    <div>
      <h1 style={{ fontSize: "var(--text-h0)" }}>Settings</h1>
      <p className="mt-3 font-body text-ink-muted">
        These take effect on the site straight away.
      </p>

      <StatefulForm action={saveSettings} className="mt-10 max-w-2xl space-y-8">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label
              className="block font-display font-semibold"
              htmlFor={f.key}
            >
              {f.label}
            </label>
            <p
              className="mb-2 font-body text-ink-muted"
              style={{ fontSize: "var(--text-body-sm)" }}
            >
              {f.help}
            </p>
            {f.rows === 1 ? (
              <input
                id={f.key}
                name={f.key}
                defaultValue={current[f.key] ?? ""}
                className={field}
              />
            ) : (
              <textarea
                id={f.key}
                name={f.key}
                rows={f.rows}
                defaultValue={current[f.key] ?? ""}
                className={`${field} resize-y`}
              />
            )}
          </div>
        ))}

        <SaveButton pendingLabel="Saving settings…">Save settings</SaveButton>
      </StatefulForm>
    </div>
  );
}
