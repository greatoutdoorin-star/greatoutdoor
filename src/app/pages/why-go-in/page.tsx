import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { getCollections } from "@/lib/catalog";
import WhyCarousel, { type WhyCard } from "@/components/WhyCarousel";

export const metadata: Metadata = {
  title: "Why GO.in?",
  description:
    "Durability, craftsmanship, customisation and care — the reasons customers and brands choose Great Outdoor.",
};

/** Image/copy pairing taken from the live page's document order. */
const REASONS: WhyCard[] = [
  {
    title: "Packed for Perfection",
    image: "/why/packed.webp",
    body: "Our triple-layer protection features bubble wrap, sturdy cardboard, and a protective film, which prevents any damage during transit. We are dedicated to our delivery timeline ensuring your order reaches you within two weeks.",
  },
  {
    title: "Trust people who trust us!",
    image: "/why/trust.webp",
    body: "Join a community of satisfied customers who have chosen us for their outdoor furniture, including over 50 brands and industry giants like Taj Hotels, Raffles and more. We invite you to experience the same reliability and satisfaction that countless others have enjoyed.",
  },
  {
    title: "Built to Brave the Outdoors",
    image: "/why/brave.webp",
    body: "Crafted to withstand the elements, our furniture is designed with durability in mind. Whether it's sun, rain, or wind, our products are built to last. With proper care and protection, they can last up to a decade.",
  },
  {
    title: "Guaranteed for the Long Haul",
    image: "/why/warranty.webp",
    body: "Our confidence in our products comes with a promise. Each item is backed by a warranty of 5 years that ensures long-lasting performance, giving you peace of mind for years to come.",
  },
  {
    title: "Craftsmanship You Can Trust!",
    image: "/why/craft.webp",
    body: "Our furniture features exceptional craftsmanship, with each piece hand-woven by skilled artisans. Their attention to detail ensures that every item combines beauty with durability, providing you with furniture you can trust for years to come.",
  },
  {
    title: "Designed Your Way",
    image: "/why/designed.webp",
    body: "We understand that every space is unique. With customizable colors, fabrics, and dimensions, we ensure your furniture fits perfectly. Choose from our curated collection or create a bespoke piece tailored to your vision.",
  },
  {
    title: "Own It Now, Pay at Your Pace",
    image: "/why/emi.webp",
    body: "We understand that investing in quality pieces is important, which is why we offer easy and affordable payment plans. With our flexible EMI options, you can bring home your ideal outdoor furniture anyday without the financial strain.",
  },
  {
    title: "Decades of Experience in Every Detail",
    image: "/why/experience.webp",
    body: "With over 32+ of experience, we take pride in the superior craftsmanship that goes into each piece. Every product is handcrafted with care, using the highest quality materials to provide unmatched durability and style.",
  },
  {
    title: "Customer Care That Cares",
    image: "/why/care.webp",
    body: "We go beyond just sales with landscape stylists and a dedicated CRM team ready to assist you at every step. Whether you need design advice or support throughout your journey, we ensure your experience with us is hassle-free.",
  },
];

export default async function WhyGoInPage() {
  const collections = await getCollections();

  return (
    <SiteShell collections={collections}>
      <section className="px-6 pb-10 pt-16 lg:px-14 lg:pt-20">
        <h1 style={{ fontSize: "var(--text-h0)" }}>Why GO.in?</h1>
      </section>

      <section className="px-6 pb-16 lg:px-14 lg:pb-24">
        <WhyCarousel cards={REASONS} />
      </section>
    </SiteShell>
  );
}
