import { revalidatePath } from "next/cache";
import { createAuthClient } from "@/lib/supabase/auth-server";
import StatefulForm from "@/components/admin/StatefulForm";
import { SaveButton, type SaveState } from "@/components/admin/SaveButton";

export const dynamic = "force-dynamic";

type Lead = {
  id: number;
  source: "contact" | "b2b" | "product";
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  city: string | null;
  message: string | null;
  product: string | null;
  status: "new" | "contacted" | "closed";
  notes: string | null;
  created_at: string;
};

const STATUSES = ["new", "contacted", "closed"] as const;

const SOURCE_LABEL: Record<Lead["source"], string> = {
  b2b: "Bulk / B2B",
  contact: "Contact",
  product: "Product",
};

async function updateLead(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  "use server";

  const db = await createAuthClient();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");

  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    return { ok: false, message: "Unknown status." };
  }

  const { error } = await db
    .from("leads")
    .update({ status, notes: String(formData.get("notes") ?? "").trim() || null })
    .eq("id", id);

  if (error) return { ok: false, message: `Could not save: ${error.message}` };

  revalidatePath("/admin/leads");
  return { ok: true, message: "Lead updated." };
}

async function deleteLead(formData: FormData) {
  "use server";

  const db = await createAuthClient();
  const { error } = await db
    .from("leads")
    .delete()
    .eq("id", Number(formData.get("delete_id")));

  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
}

/** "2 hours ago" reads faster than a timestamp when triaging a list. */
function timeAgo(iso: string): string {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 31) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filter } = await searchParams;
  const db = await createAuthClient();

  let query = db
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (filter && STATUSES.includes(filter as (typeof STATUSES)[number])) {
    query = query.eq("status", filter);
  }

  const { data, error } = await query;
  const leads = (data ?? []) as Lead[];

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
  };

  const field =
    "w-full border border-hairline bg-canvas px-3 py-2 font-body outline-none transition-colors focus:border-ink";

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 style={{ fontSize: "var(--text-h0)" }}>Leads</h1>
        <div className="flex gap-3 font-body" style={{ fontSize: "var(--text-body-sm)" }}>
          <a
            href="/admin/leads"
            className={!filter ? "text-accent" : "text-ink-muted hover:text-accent"}
          >
            All
          </a>
          {STATUSES.map((s) => (
            <a
              key={s}
              href={`/admin/leads?status=${s}`}
              className={
                filter === s ? "text-accent" : "text-ink-muted hover:text-accent"
              }
            >
              {s[0].toUpperCase() + s.slice(1)}
            </a>
          ))}
        </div>
      </div>

      <p className="mt-3 font-body text-ink-muted">
        Every enquiry submitted through the site, newest first. Leads are
        recorded before the WhatsApp hand-off, so they appear here even when the
        visitor never sends the message.
      </p>

      {/*
        A missing table is the expected state until leads.sql has been run, so
        say what to do rather than showing an empty list that looks like "no
        enquiries yet".
      */}
      {error && (
        <div className="mt-8 border border-amber-300 bg-amber-50 px-5 py-4 font-body text-amber-900">
          <p className="font-semibold">Lead storage is not set up yet.</p>
          <p className="mt-2" style={{ fontSize: "var(--text-body-sm)" }}>
            Run <code>supabase/leads.sql</code> in the Supabase SQL editor to
            create the table. Until then enquiries still reach WhatsApp and the
            Google Sheet, but nothing is stored here.
          </p>
          <p className="mt-2 font-mono" style={{ fontSize: "var(--text-body-sm)" }}>
            {error.message}
          </p>
        </div>
      )}

      {!error && leads.length === 0 && (
        <p className="mt-10 font-body text-ink-muted">
          {filter ? `No ${filter} leads.` : "No enquiries yet."}
        </p>
      )}

      {leads.length > 0 && (
        <p
          className="mt-6 font-body text-ink-muted"
          style={{ fontSize: "var(--text-body-sm)" }}
        >
          Showing {counts.all} lead{counts.all === 1 ? "" : "s"}
          {counts.new > 0 && ` — ${counts.new} new`}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {leads.map((lead) => (
          <article
            key={lead.id}
            className={`border p-5 ${
              lead.status === "new"
                ? "border-accent/40 bg-accent/5"
                : "border-hairline"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 style={{ fontSize: "var(--text-body-lg)" }}>
                {lead.name}
                {lead.company && (
                  <span className="font-body text-ink-muted">
                    {" "}
                    · {lead.company}
                  </span>
                )}
              </h2>
              <span
                className="font-body text-ink-muted"
                style={{ fontSize: "var(--text-body-sm)" }}
              >
                {SOURCE_LABEL[lead.source]} · {timeAgo(lead.created_at)}
              </span>
            </div>

            <div
              className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-body"
              style={{ fontSize: "var(--text-body-sm)" }}
            >
              <a
                href={`https://wa.me/${lead.phone.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-accent"
              >
                {lead.phone}
              </a>
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="underline underline-offset-4 hover:text-accent"
                >
                  {lead.email}
                </a>
              )}
              {lead.city && <span className="text-ink-muted">{lead.city}</span>}
              {lead.product && (
                <span className="text-ink-muted">Re: {lead.product}</span>
              )}
            </div>

            {lead.message && (
              <p className="mt-4 whitespace-pre-wrap font-body leading-relaxed">
                {lead.message}
              </p>
            )}

            <StatefulForm action={updateLead} className="mt-5">
              <input type="hidden" name="id" value={lead.id} />
              <div className="grid gap-3 sm:grid-cols-[140px_1fr_auto] sm:items-start">
                <select
                  name="status"
                  defaultValue={lead.status}
                  aria-label="Status"
                  className={field}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s[0].toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  name="notes"
                  defaultValue={lead.notes ?? ""}
                  placeholder="Notes — quoted, following up, won…"
                  aria-label="Notes"
                  className={field}
                />
                <SaveButton className="px-6 py-2" pendingLabel="Saving…">
                  Save
                </SaveButton>
              </div>
            </StatefulForm>

            <form action={deleteLead} className="mt-3">
              <input type="hidden" name="delete_id" value={lead.id} />
              <button
                type="submit"
                className="font-body text-red-700 underline underline-offset-4 hover:text-red-900"
                style={{ fontSize: "var(--text-body-sm)" }}
              >
                Delete
              </button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
