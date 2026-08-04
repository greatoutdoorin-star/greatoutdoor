import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/server";

/**
 * Lead capture.
 *
 * Public and unauthenticated by design — the enquiry forms are open to anyone.
 * It uses the anon client, so the `public insert leads` RLS policy is what
 * grants the write: this endpoint can create a lead and nothing else. It
 * cannot read the customer list back, which matters because the route is
 * reachable by anyone on the internet.
 */

export const runtime = "nodejs";

const SOURCES = new Set(["contact", "b2b", "product"]);

/** Trim, collapse whitespace, and cap length so one field cannot flood a row. */
function clean(value: unknown, max: number): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const source = clean(body.source, 20);
  if (!SOURCES.has(source)) {
    return NextResponse.json({ error: "Unknown source" }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);

  // Name and phone are the two fields that make a lead actionable; without
  // them there is nothing to follow up.
  if (!name || !phone) {
    return NextResponse.json(
      { error: "Name and phone are required" },
      { status: 400 },
    );
  }

  const lead = {
    source,
    name,
    phone,
    email: clean(body.email, 160) || null,
    company: clean(body.company, 160) || null,
    city: clean(body.city, 120) || null,
    message: clean(body.message, 2000) || null,
    product: clean(body.product, 200) || null,
    role: clean(body.role, 120) || null,
    looking_for: clean(body.lookingFor, 120) || null,
  };

  /*
    Two independent destinations, written in parallel.

    Neither depends on the other: if Supabase is unreachable the lead still
    reaches the sheet, and vice versa. A lead recorded in one place is far
    better than a lead lost because the other was down.
  */
  const [dbResult, sheetResult] = await Promise.allSettled([
    saveToSupabase(lead),
    saveToSheet(lead),
  ]);

  const savedDb = dbResult.status === "fulfilled" && dbResult.value;
  const savedSheet = sheetResult.status === "fulfilled" && sheetResult.value;

  if (!savedDb && !savedSheet) {
    // Both failed. Log the whole lead so it is at least recoverable from the
    // server logs rather than lost outright.
    console.error("[leads] ALL DESTINATIONS FAILED — lead:", JSON.stringify(lead));
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, savedDb, savedSheet });
}

type Lead = {
  source: string;
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  city: string | null;
  message: string | null;
  product: string | null;
  role: string | null;
  looking_for: string | null;
};

/** Insert into the `leads` table. Returns false if it did not land. */
async function saveToSupabase(lead: Lead): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return false;

  const db = createPublicClient();
  const { error } = await db.from("leads").insert(lead);

  if (error) {
    console.error("[leads] supabase insert failed:", error.message);
    return false;
  }
  return true;
}

/**
 * Append a row to the Google Sheet via its Apps Script web app.
 *
 * No-ops when the webhook URL is unset, so the site runs fine without it.
 * Timeboxed: Apps Script can be slow to cold-start, and the visitor is waiting
 * on this response before their WhatsApp message opens.
 */
async function saveToSheet(lead: Lead): Promise<boolean> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) return false;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...lead,
        secret: process.env.GOOGLE_SHEETS_SECRET ?? "",
        // Stamped server-side: a client clock cannot be trusted, and the sheet
        // should show when we received the lead.
        received_at: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error("[leads] sheet webhook returned", res.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[leads] sheet webhook failed:", (err as Error).message);
    return false;
  }
}
