export type LeadSource = "contact" | "b2b" | "product";

/**
 * Qualifying questions. Defined here so the form, the WhatsApp message and the
 * admin screen all read from one list — an option added here appears
 * everywhere without a second edit.
 */
export const ROLE_OPTIONS = [
  "Homeowner",
  "Architect / Interior Designer",
  "Builder / Contractor",
  "Business Owner (Hotel, Café, Restaurant, Office)",
  "Other",
] as const;

export const LOOKING_FOR_OPTIONS = [
  "Indoor Solutions",
  "Outdoor Solutions",
  "Both Indoor & Outdoor",
  "Open to Exploring / Consultation",
] as const;

export type LeadPayload = {
  source: LeadSource;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  city?: string;
  message?: string;
  product?: string;
  /** "Who are you?" */
  role?: string;
  /** "What are you looking for?" */
  lookingFor?: string;
};

/**
 * Record a lead, then hand off to WhatsApp.
 *
 * The save is deliberately best-effort: if the database is unreachable the
 * visitor still gets their WhatsApp message. Losing a row is bad; blocking an
 * enquiry because of it would be worse.
 *
 * `keepalive` matters — the tab is about to open wa.me, and without it the
 * browser is free to cancel an in-flight request during that navigation.
 */
export async function recordLead(payload: LeadPayload): Promise<void> {
  try {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Swallowed on purpose — see above.
  }
}
