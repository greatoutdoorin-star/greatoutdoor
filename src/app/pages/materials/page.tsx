import Image from "next/image";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import { getCollections } from "@/lib/catalog";
import { b2bEnquiryLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Materials",
  description:
    "Rust-free aluminium frames, UV-resistant PE cane, outdoor-grade rope and performance upholstery — the materials behind Great Outdoor furniture.",
};

const MATERIALS = [
  {
    title: "Aluminium Frame",
    image: "/materials/m1.webp",
    body: "Our frames are expertly crafted from durable, rust-resistant aluminium, offering both light-weighted strength and lasting beauty. For select frames, we've perfected a wood-textured polish that mimics the wooden textures, but doesn't compromise with rust and overall durability. These frames are designed to withstand all weather conditions. Iron Frames are available on Bulk/Custom Order.",
    cta: "Know More",
  },
  {
    title: "Polyethylene Rope",
    image: "/materials/m2.webp",
    body: "Our outdoor rope is crafted from UV-resistant PE fibers, designed to withstand harsh sun, rain, and everyday wear. Woven with precision, it offers both strength and flexibility — adding texture and comfort to the outdoor furniture, without compromising on durability or performance across seasons. Budget friendly options available in Bulk/Custom Order.",
    cta: "Download Swatches",
  },
  {
    title: "Polyethylene Cane",
    image: "/materials/m3.webp",
    body: "Our German grade PE Cane mimics the beauty of natural wicker while offering superior durability. Made from weather-resistant polyethylene, it is UV-stabilized, washable, and built to endure sun, rain, and temperature changes, making it the perfect choice for long-lasting outdoor furniture with timeless appeal. Budget friendly Indian Cane available on Bulk/Custom Order.",
    cta: "Know More",
  },
  {
    title: "Upholstery",
    image: "/materials/m4.webp",
    body: "Dive into our diverse collection of fabrics, featuring 100% solution-dyed acrylics for a distinct textile experience. Our comprehensive range includes fire-resistant, waterproof, and highly durable materials, crafted to endure even the toughest conditions. Designed for performance and style, our fabrics offer exceptional resilience for all your outdoor needs.",
    cta: "Enquire",
  },
];

export default async function MaterialsPage() {
  const collections = await getCollections();

  return (
    <SiteShell collections={collections}>
      <section className="px-6 pb-10 pt-16 lg:px-14 lg:pt-20">
        <h1 className="max-w-4xl" style={{ fontSize: "var(--text-h0)" }}>
          From frame to fabric, every material is chosen to withstand the test
          of nature,
        </h1>
        <p
          className="mt-4 max-w-4xl font-body leading-relaxed text-ink-muted"
          style={{ fontSize: "var(--text-body-hd)" }}
        >
          with rust-free aluminium frames, UV-resistant PE Cane, outdoor-grade
          rope, and performance upholstery built to last across seasons.
        </p>
      </section>

      {MATERIALS.map((m, i) => (
        <section
          key={m.title}
          className="grid items-center gap-10 px-6 pb-16 lg:grid-cols-2 lg:gap-16 lg:px-14"
        >
          <div
            className={`relative aspect-[4/3] w-full ${
              i % 2 === 0 ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <Image
              src={m.image}
              alt={m.title}
              fill
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="object-cover"
            />
          </div>

          <div className={i % 2 === 0 ? "lg:order-2" : "lg:order-1"}>
            <h2 style={{ fontSize: "var(--text-h0)" }}>{m.title}</h2>
            <p className="mt-5 font-body leading-relaxed">{m.body}</p>
            <a
              href={b2bEnquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block font-display font-semibold underline underline-offset-4 hover:text-accent"
            >
              {m.cta} &gt;&gt;
            </a>
          </div>
        </section>
      ))}
    </SiteShell>
  );
}
