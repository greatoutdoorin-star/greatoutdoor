import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { getCollections } from "@/lib/catalog";
import B2bEnquiryForm from "@/components/B2bEnquiryForm";

export const metadata: Metadata = {
  title: "Bulk | B2B",
  description:
    "Custom outdoor furniture for hotels, cafes and hospitality. Trusted by Taj Group, Marriott, Hilton and 70+ cafes and bars across India.",
};

const OFFERINGS = [
  "Custom Designs & Dimensions",
  "Tailor-Made for every budget",
  "Endless Material Options to choose from",
];

export default async function B2bPage() {
  const collections = await getCollections();

  return (
    <SiteShell collections={collections}>
      <section className="px-6 pb-12 pt-16 lg:px-14 lg:pt-20">
        <h1 className="max-w-4xl" style={{ fontSize: "var(--text-h0)" }}>
          Bulk &amp; B2B Orders
        </h1>
        <p className="mt-6 max-w-4xl font-body leading-relaxed">
          Trusted by renowned brands like Taj Group, Raffles, Fairmont,
          Rajasthali Resorts, Marriott, Hilton, and over 70+ cafes and bars
          around the Nation — let us bring the same excellence to your space.
        </p>
      </section>

      {/*
        The form leads the page. This is the site's highest-intent screen —
        someone arriving here already wants a quote, so making them scroll past
        the pitch first only adds friction. Records the lead, then hands off to
        WhatsApp.
      */}
      <section className="bg-surface px-6 py-16 lg:px-14 lg:py-20">
        <h2 style={{ fontSize: "var(--text-h0)" }}>
          Share the details below, and help us provide a custom solution for
          your space.
        </h2>
        <B2bEnquiryForm />
      </section>

      <section className="px-6 py-16 lg:px-14 lg:py-20">
        <p
          className="font-body text-ink-muted"
          style={{ fontSize: "var(--text-body-hd)" }}
        >
          Our B2B offerings are broader and more versatile as compared to our
          e-commerce range.
        </p>
        <ul className="mt-8 grid gap-8 lg:grid-cols-3">
          {OFFERINGS.map((o) => (
            <li key={o}>
              <span className="block h-6 w-6 rounded-full bg-accent" />
              <p
                className="mt-6 font-display font-semibold"
                style={{ fontSize: "var(--text-h3)" }}
              >
                {o}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-6 pb-16 lg:px-14 lg:pb-20">
        <h2 style={{ fontSize: "var(--text-h0)" }}>Our Esteemed Clientele</h2>
        <p className="mt-6 max-w-4xl font-body leading-relaxed">
          A distinguished roster of clients who trust us for exceptional
          craftsmanship, innovative designs, and timeless furniture solutions
          tailored to elevate their outdoor spaces.
        </p>
      </section>
    </SiteShell>
  );
}
