import Link from "next/link";
import CategoryCarousel, { type Category } from "@/components/CategoryCarousel";
import HeroSlider, { type HeroSlide } from "@/components/HeroSlider";
import Marquee from "@/components/Marquee";
import MaterialsSplit from "@/components/MaterialsSplit";
import ProductCarousel from "@/components/ProductCarousel";
import PromoSplit from "@/components/PromoSplit";
import SiteShell from "@/components/SiteShell";
import {
  getAllProducts,
  getCollections,
  getHeroSlides,
  getSettings,
  type Product,
} from "@/lib/catalog";

/** Which catalogue rows to surface on the home page, by slug. */
const FEATURED_SLUGS = [
  "urban-filter-chair",
  "zebra-chic-chair",
  "hollow-haven-chair",
  "mystic-courtyard-chair",
];
const PROMO_SLUGS = ["rustic-braided-bar-chair", "willow-canopy-swing"];

const toCard = (p: Product) => ({
  name: p.name,
  slug: p.slug,
  price: p.price,
  image: p.images[0],
});

/** Resolve slugs in the given order, skipping any that are no longer active. */
const pick = (products: Product[], slugs: string[]) =>
  slugs
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p))
    .map(toCard);

const CATEGORIES: Category[] = [
  {
    title: "Chairs",
    blurb:
      "Made with Aluminium frame & High quality PE Rope/ Cane handweaves",
    image: "/home/cat-chairs.webp",
    href: "/collections/chairs",
  },
  {
    title: "Tables",
    blurb: "Choose between diverse tabletop and dimension options",
    image: "/home/cat-tables.webp",
    href: "/collections/tables",
  },
  {
    title: "Sofas",
    blurb:
      "Switch any chairs to multi-seater sofa WhatsApp for assistance..",
    image: "/home/cat-sofas.webp",
    href: "/collections/sofas",
  },
  {
    title: "Add-Ons",
    blurb:
      "Artificial Grass, Swings, Outdoor Planters, Umbrellas and more..",
    image: "/home/cat-addons.webp",
    href: "/collections/additions",
  },
];

const MATERIAL_PANELS = [
  { label: "ROPE", image: "/home/mat-rope.webp" },
  { label: "CANE", image: "/home/mat-cane.webp" },
];

export default async function Home() {
  const [products, navCollections, heroSlides, settings] = await Promise.all([
    getAllProducts(),
    getCollections(),
    getHeroSlides(),
    getSettings(),
  ]);

  const featured = pick(products, FEATURED_SLUGS);
  const promo = pick(products, PROMO_SLUGS);

  const slides = heroSlides.map((s) => ({
    image: s.image,
    alt: s.headline ?? "Great Outdoor furniture",
    headline: s.headline ?? undefined,
    subtext: s.subtext ?? undefined,
    href: s.link ?? undefined,
  }));

  return (
    <SiteShell collections={navCollections}>
      <HeroSlider slides={slides} />

      <PromoSplit image="/home/promo.webp" products={promo} />

      <section className="px-6 pb-16 lg:px-14">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
          <h2 style={{ fontSize: "var(--text-h0)" }}>
            Weather-Proof Patio Furniture
          </h2>
          <Link
            href="/collections/all"
            className="font-body underline underline-offset-4 hover:text-accent"
          >
            View all products
          </Link>
        </div>
        <ProductCarousel products={featured} />
      </section>

      <Marquee
        text={
          settings.marquee_text ??
          "From Sun to Storm — Our Products Are Backed by a 5-Year Guarantee*"
        }
      />

      <section className="px-6 py-16 lg:px-14">
        <h2 style={{ fontSize: "var(--text-h0)" }}>Our Clientele</h2>
        <p className="mt-6 max-w-3xl font-body leading-relaxed text-ink-muted">
          Trusted by leading hotels, resorts and hospitality groups across the
          country.
        </p>
      </section>

      <MaterialsSplit panels={MATERIAL_PANELS} />

      <section className="px-6 py-16 lg:px-14">
        <h2 className="mb-10" style={{ fontSize: "var(--text-h0)" }}>
          Shop Categories
        </h2>
        <CategoryCarousel categories={CATEGORIES} />
      </section>
    </SiteShell>
  );
}
