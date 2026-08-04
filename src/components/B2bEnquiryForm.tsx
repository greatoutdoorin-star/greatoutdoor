"use client";

import { useState } from "react";
import { recordLead } from "@/lib/leads";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/**
 * Bulk / B2B enquiry form.
 *
 * Submitting records the lead, then opens a pre-filled WhatsApp message. The
 * database write is what makes the enquiry recoverable — plenty of visitors
 * reach wa.me and never press send, and before this the only record of them
 * was a conversation that never happened.
 */
type Props = {
  /** Tighter spacing and a full-width button, for use inside the modal. */
  compact?: boolean;
  /** Called after the WhatsApp hand-off, so the modal can close itself. */
  onSubmitted?: () => void;
};

export default function B2bEnquiryForm({ compact, onSubmitted }: Props = {}) {
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

    // Fire-and-forget: never await, so a slow or failing save cannot delay the
    // WhatsApp hand-off. window.open must also stay in the same tick as the
    // submit gesture or popup blockers reject it.
    void recordLead({
      source: "b2b",
      name: form.name,
      phone: form.phone,
      company: form.company,
      city: form.city,
      message: form.requirement,
    });

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
    onSubmitted?.();
  };

  const field =
    "w-full border border-hairline bg-canvas px-4 py-3 font-body outline-none transition-colors focus:border-ink";

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? "" : "mt-10 max-w-3xl"}
    >
      <div className={`grid ${compact ? "gap-3" : "gap-5 sm:grid-cols-2"}`}>
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
        rows={compact ? 3 : 5}
        className={`${field} ${compact ? "mt-3" : "mt-5"} resize-y`}
      />

      <button
        type="submit"
        className={`bg-ink px-8 py-4 font-display font-semibold text-white transition-colors hover:bg-accent ${
          compact ? "mt-4 w-full" : "mt-6 w-full sm:w-auto"
        }`}
      >
        Send enquiry on WhatsApp
      </button>
    </form>
  );
}
