import Image from "next/image";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { getCollections } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "About GO.in",
  description:
    "Born from the legacy of Great Indoors, GreatOutdoor.in crafts hand-woven outdoor furniture from its factory in Delhi NCR.",
};

const FOUNDERS = [
  {
    name: "Mr. Tarun Bhatia",
    role: "Chief Executive Officer",
    image: "/about/tarun-bhatia.webp",
    bio: "Since starting his entrepreneurial journey in 1993, he has built a legacy of trust and innovation in the furniture industry. With over 30 years of hands-on experience, Mr. Bhatia's deep understanding of materials, design, and production has redefined perceptions of quality in the market. His ability to balance executive leadership with on-ground expertise has made him a respected figure, earning the loyalty of clients and brands alike. Today, his vision drives GreatOutdoor.in, bringing his unmatched dedication and craftsmanship to a national platform.",
    /** Image sits left of the copy, as on the reference page. */
    imageFirst: true,
  },
  {
    name: "Ms. Divisha Bhatia",
    role: "Chief Marketing Officer",
    image: "/about/divisha-bhatia.webp",
    bio: "With 10 years of marketing experience and a portfolio of over 60 brands, she has established herself as a skilled business enabler. After running her own successful agency, she decided to channel her expertise into a product she genuinely believes in. Backed by the trust their furniture has earned in her hometown, Divisha brings her skills and team together to introduce this well-tested product to a national audience. Combining her passion for marketing with her father's, decades of craftsmanship, GreatOutdoor.in is a seamless blend of passion and legacy.",
    imageFirst: false,
  },
];

const PROCESS = [
  {
    title: "Designing: An Eye for Detail",
    image: "/about/process-design.webp",
    body: "Our landscape stylists and product designers collaborate to create unique, functional designs. They choose the perfect cane, upholstery, and PE rope knits, ensuring harmony and durability. Every detail is refined and perfected in precise dimensions before moving to the factory for production.",
  },
  {
    title: "Welding: Forging Strength and Durability",
    image: "/about/process-welding.webp",
    body: "We use aluminum as the base frame for every piece, meticulously measuring pipe widths for precision. Aluminum's rust-resistant and lightweight properties make our furniture durable and easy to move, perfectly balancing functionality and longevity.",
  },
  {
    title: "Weaving: Crafting Every Strand",
    image: "/about/process-weaving.webp",
    body: "Weaving is where our craftsmanship truly shines. Each strand is handwoven, creating intricate patterns that reflect our dedication to quality. This step requires patience, skill, and precision, resulting in furniture that's both beautiful and built to last.",
  },
  {
    title: "Packaging: Our Hands to Your Home",
    image: "/about/process-packaging.webp",
    body: "After passing our rigorous quality checks, each piece is packed to ensure it arrives at your doorstep in perfect condition. We utilize a triple-layer protection system, safeguarding your furniture during transit and ensuring you receive product and trust that's unbreakable.",
  },
];

export default async function AboutPage() {
  const collections = await getCollections();

  return (
    <SiteShell collections={collections}>
      {/* Hero — full-bleed image with overlaid title and intro */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden lg:min-h-[70vh]">
        <Image
          src="/about/hero.webp"
          alt="Craftsmanship at the Great Outdoor factory"
          fill
          priority
          sizes="(max-width: 1023px) 100vw, calc(100vw - clamp(240px, 20vw, 360px))"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center text-white">
          <h1 className="font-display" style={{ fontSize: "var(--text-hh)" }}>
            Journey of GreatOutdoor.in
          </h1>
          <p
            className="mx-auto mt-6 max-w-3xl font-body leading-relaxed"
            style={{ fontSize: "var(--text-body-hd)" }}
          >
            Born from the legacy of Great Indoors where we spent over three
            decade perfecting interiors and outdoor spaces, GreatOutdoor.in is
            our next chapter, crafted to celebrate the beauty of life under open
            skies.
          </p>
        </div>
      </section>

      {/* Founders */}
      <section className="px-6 py-16 lg:px-14 lg:py-20">
        <h2 style={{ fontSize: "var(--text-h0)" }}>About the Founders:</h2>
      </section>

      {FOUNDERS.map((f) => (
        <section
          key={f.name}
          className="grid items-center gap-10 px-6 pb-16 lg:grid-cols-2 lg:gap-16 lg:px-14 lg:pb-20"
        >
          <div
            className={`relative aspect-[2/3] w-full ${
              f.imageFirst ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <Image
              src={f.image}
              alt={f.name}
              fill
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="object-cover"
            />
          </div>

          <div
            className={`text-center ${f.imageFirst ? "lg:order-2" : "lg:order-1"}`}
          >
            <h3 style={{ fontSize: "var(--text-h0)" }}>{f.name}</h3>
            <p
              className="mt-4 font-display font-semibold"
              style={{ fontSize: "var(--text-body-hd)" }}
            >
              {f.role}
            </p>
            <p className="mt-6 font-body leading-relaxed text-ink">{f.bio}</p>
          </div>
        </section>
      ))}

      {/* Process */}
      <section className="px-6 py-16 text-center lg:px-14 lg:py-20">
        <h2 style={{ fontSize: "var(--text-h0)" }}>
          The Process of Bringing Everything Together
        </h2>
        <p className="mx-auto mt-6 max-w-4xl font-body leading-relaxed">
          Our factory is set in the interiors of Delhi NCR where our skilled
          labor works with full dedication to make the best, handcrafted, and
          durable furniture range which will hold and behold the memories of our
          clients for the years to come.
        </p>
      </section>

      <section className="grid gap-x-12 gap-y-14 px-6 pb-16 lg:grid-cols-2 lg:px-14 lg:pb-24">
        {PROCESS.map((step) => (
          <article key={step.title}>
            <div className="relative aspect-square w-full">
              <Image
                src={step.image}
                alt={step.title}
                fill
                sizes="(max-width: 1023px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <h3 className="mt-6" style={{ fontSize: "var(--text-h2)" }}>
              {step.title}
            </h3>
            <p className="mt-4 font-body leading-relaxed">{step.body}</p>
          </article>
        ))}
      </section>

    </SiteShell>
  );
}
