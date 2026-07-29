"use client";

import { useState } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/**
 * Bulk / B2B enquiry form.
 *
 * There is no server-side lead store on this site — submitting composes a
 * pre-filled WhatsApp message and hands the conversation off to wa.me, matching
 * the site's WhatsApp-only conversion model.
 */
export default function B2bEnquiryForm() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    city: "",
    requirement: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      "Bulk / B2B enquiry",
      `Name: ${form.name}`,
      form.company && `Company: ${form.company}`,
      `Phone: ${form.phone}`,
      form.city && `City: ${form.city}`,
      "",
      form.requirement,
    ].filter(Boolean);
    window.open(buildWhatsAppLink(lines.join("\n")), "_blank", "noopener");
  };

  const field =
    "w-full border border-hairline bg-canvas px-4 py-3 font-body outline-none transition-colors focus:border-ink";

  return (
    <form onSubmit={handleSubmit} className="mt-10 max-w-3xl">
      <div className="grid gap-5 sm:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={set("name")}
          placeholder="Your name*"
          aria-label="Your name"
          className={field}
        />
        <input
          value={form.company}
          onChange={set("company")}
          placeholder="Company / property"
          aria-label="Company or property"
          className={field}
        />
        <input
          required
          type="tel"
          value={form.phone}
          onChange={set("phone")}
          placeholder="Phone number*"
          aria-label="Phone number"
          className={field}
        />
        <input
          value={form.city}
          onChange={set("city")}
          placeholder="City"
          aria-label="City"
          className={field}
        />
      </div>

      <textarea
        required
        value={form.requirement}
        onChange={set("requirement")}
        placeholder="Tell us about your requirement — quantity, product types, timeline*"
        aria-label="Your requirement"
        rows={5}
        className={`${field} mt-5 resize-y`}
      />

      <button
        type="submit"
        className="mt-6 w-full bg-ink px-8 py-4 font-display font-semibold text-white transition-colors hover:bg-accent sm:w-auto"
      >
        Send enquiry on WhatsApp
      </button>
    </form>
  );
}
