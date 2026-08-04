"use client";

import { useState } from "react";
import { recordLead } from "@/lib/leads";
import { buildWhatsAppLink } from "@/lib/whatsapp";

/**
 * General contact form. Records the lead, then opens a pre-filled WhatsApp
 * message — see B2bEnquiryForm for why the write happens before the hand-off.
 */
export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    void recordLead({
      source: "contact",
      name: form.name,
      phone: form.phone,
      email: form.email,
      message: form.message,
    });

    const lines = [
      `Name: ${form.name}`,
      form.email && `Email: ${form.email}`,
      form.phone && `Phone: ${form.phone}`,
      "",
      form.message,
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
          placeholder="What's your good name?*"
          aria-label="Your name"
          className={field}
        />
        <input
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="Enter your email address"
          aria-label="Email address"
          className={field}
        />
        <input
          required
          type="tel"
          value={form.phone}
          onChange={set("phone")}
          placeholder="Enter your phone number*"
          aria-label="Phone number"
          className={`${field} sm:col-span-2`}
        />
      </div>

      <textarea
        required
        value={form.message}
        onChange={set("message")}
        placeholder="Enter your message*"
        aria-label="Your message"
        rows={5}
        className={`${field} mt-5 resize-y`}
      />

      <button
        type="submit"
        className="mt-6 w-full bg-ink px-8 py-4 font-display font-semibold text-white transition-colors hover:bg-accent sm:w-auto"
      >
        Send on WhatsApp
      </button>
    </form>
  );
}
