"use client";

import { useState } from "react";
import { LOOKING_FOR_OPTIONS, ROLE_OPTIONS, recordLead } from "@/lib/leads";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type Props = {
  /** Called after the WhatsApp hand-off, so the dialog can close itself. */
  onSubmitted?: () => void;
};

/**
 * General enquiry form for the floating enquiry button.
 *
 * Distinct from B2bEnquiryForm: this one opens anywhere on the site, so the
 * visitor has not self-selected as a trade enquiry the way someone on the
 * Bulk | B2B page has. The two qualifying questions do that work instead —
 * they tell us who is asking and which side of the business they want before
 * anyone picks up the phone.
 *
 * Submitting records the lead first, then hands off to WhatsApp, so the
 * enquiry survives even when the drafted message is never sent.
 */
export default function EnquiryForm({ onSubmitted }: Props = {}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
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
      source: "contact",
      name: form.name,
      phone: form.phone,
      email: form.email,
      city: form.city,
      role: form.role,
      lookingFor: form.lookingFor,
      message: form.requirement,
    });

    const lines = [
      "Enquiry",
      `Name: ${form.name}`,
      form.email && `Email: ${form.email}`,
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
    <form onSubmit={handleSubmit}>
      <div className="grid gap-3">
        <input
          required
          value={form.name}
          onChange={set("name")}
          placeholder="Your name*"
          aria-label="Your name"
          className={field}
        />
        {/* type="email" gets the right keyboard on a phone and free browser
            validation. Optional — phone is the field we actually follow up on. */}
        <input
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="Email address"
          aria-label="Email address"
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

        {/*
          Selects rather than radio groups: nine options between them would add
          ~9 rows to a form that has to fit inside a dialog on a phone, and a
          native select is the better touch target there anyway.

          The muted class on an empty value makes the placeholder option read
          as placeholder text rather than a chosen answer.
        */}
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
        placeholder="Tell us what you need*"
        aria-label="Your requirement"
        rows={3}
        className={`${field} mt-3 resize-y`}
      />

      <button
        type="submit"
        className="mt-4 w-full bg-ink px-8 py-4 font-display font-semibold text-white transition-colors hover:bg-accent"
      >
        Send enquiry on WhatsApp
      </button>
    </form>
  );
}
