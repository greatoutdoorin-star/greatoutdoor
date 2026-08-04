export type LeadSource = "contact" | "b2b" | "product";

export type LeadPayload = {
  source: LeadSource;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  city?: string;
  message?: string;
  product?: string;
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
