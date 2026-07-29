import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { getCollections } from "@/lib/catalog";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Great Outdoor — address, email and phone numbers, or send us a message on WhatsApp.",
};

export default async function ContactPage() {
  const collections = await getCollections();

  return (
    <SiteShell collections={collections}>
      <section className="px-6 pb-10 pt-16 lg:px-14 lg:pt-20">
        <h1 style={{ fontSize: "var(--text-h0)" }}>Contact</h1>
        <p
          className="mt-3 font-body text-ink-muted"
          style={{ fontSize: "var(--text-body-sm)" }}
        >
          An entity of Great Indoors
        </p>
      </section>

      <section className="grid gap-12 px-6 pb-20 lg:grid-cols-3 lg:px-14">
        <div>
          <h2 style={{ fontSize: "var(--text-h2)" }}>Address</h2>
          <p className="mt-4 font-body leading-relaxed">
            272A Frontier Colony, Adarsh Nagar, Jaipur, 302004
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)" }}>Send a message</h2>
          <p className="mt-4 font-body">
            <a
              href="mailto:greatoutdoor.in@gmail.com"
              className="underline underline-offset-4 hover:text-accent"
            >
              greatoutdoor.in@gmail.com
            </a>
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: "var(--text-h2)" }}>Call us directly</h2>
          <ul className="mt-4 space-y-2 font-body">
            <li>
              <a
                href="tel:+919829012090"
                className="underline underline-offset-4 hover:text-accent"
              >
                +91-98290 12090
              </a>
            </li>
            <li>
              <a
                href="tel:+917791927939"
                className="underline underline-offset-4 hover:text-accent"
              >
                +91-77919 27939
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-surface px-6 py-16 lg:px-14 lg:py-20">
        <h2 style={{ fontSize: "var(--text-h0)" }}>Do you need help?</h2>
        <ContactForm />
      </section>
    </SiteShell>
  );
}
