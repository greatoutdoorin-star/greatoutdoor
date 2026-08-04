"use client";

import { useState } from "react";
import {
  LOOKING_FOR_OPTIONS,
  ROLE_OPTIONS,
  recordLead,
} from "@/lib/leads";
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
    role: "",
    lookingFor: "",
    requirement: "",
  });

  const set =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
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
      role: form.role,
      lookingFor: form.lookingFor,
      message: form.requirement,
    });

    const lines = [
      "Bulk / B2B enquiry",
      `Name: ${form.name}`,
      form.company && `Company: ${form.company}`,
      `Phone: ${form.phone}`,
      form.city && `City: ${form.city}`,
      form.role && `I am a: ${form.role}`,
      form.lookingFor && `Looking for: ${form.lookingFor}`,
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

      {/*
        Qualifying questions. Required, because knowing whether this is a
        homeowner or an architect — and indoor or outdoor — is what lets an
        enquiry be routed before anyone picks up the phone.

        Rendered as selects rather than radio groups: five options each would
        add ~9 rows to a form that has to work inside the FAB dialog on a
        phone. A native select is also the better touch target there.
      */}
      <div className={`grid ${compact ? "mt-3 gap-3" : "mt-5 gap-5 sm:grid-cols-2"}`}>
        <select
          required
          value={form.role}
          onChange={set("role")}
          aria-label="Who are you?"
          className={`${field} ${form.role ? "" : "text-ink-muted"}`}
        >
          <option value="" disabled>
            Who are you?*
          </option>
          {ROLE_OPTIONS.map((o) => (
            <option key={o} value={o} className="text-ink">
              {o}
            </option>
          ))}
        </select>

        <select
          required
          value={form.lookingFor}
          onChange={set("lookingFor")}
          aria-label="What are you looking for?"
          className={`${field} ${form.lookingFor ? "" : "text-ink-muted"}`}
        >
          <option value="" disabled>
            What are you looking for?*
          </option>
          {LOOKING_FOR_OPTIONS.map((o) => (
            <option key={o} value={o} className="text-ink">
              {o}
            </option>
          ))}
        </select>
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
