import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";
import SiteShell from "@/components/SiteShell";
import { getCollections } from "@/lib/catalog";
import { FAQ_GROUPS } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers on materials, customization, delivery, warranty and bulk orders for Great Outdoor handwoven furniture.",
};

export default async function FaqsPage() {
  const collections = await getCollections();

  return (
    <SiteShell collections={collections}>
      <section className="px-6 pb-8 pt-16 lg:px-14 lg:pt-20">
        <h1 style={{ fontSize: "var(--text-h0)" }}>
          Frequently Asked Questions
        </h1>
      </section>

      <div className="px-6 pb-20 lg:px-14">
        {FAQ_GROUPS.map((group) => (
          <section key={group.category} className="mb-14">
            <h2 className="mb-4" style={{ fontSize: "var(--text-h2)" }}>
              {group.category}
            </h2>
            <FaqAccordion items={group.items} />
          </section>
        ))}
      </div>
    </SiteShell>
  );
}
