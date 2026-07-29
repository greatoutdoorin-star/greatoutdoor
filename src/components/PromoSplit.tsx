import Image from "next/image";
import ProductCarousel from "./ProductCarousel";
import type { Product } from "./ProductCard";

type Props = {
  image: string;
  products: Product[];
};

/**
 * Split row directly beneath the hero: promo artwork on the left,
 * a compact product carousel on the right.
 */
export default function PromoSplit({ image, products }: Props) {
  return (
    <section className="grid items-center gap-10 px-6 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12 lg:px-14">
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={image}
          alt="Get a confirmation call for every order with our landscape stylist within 24 hours"
          fill
          sizes="(max-width: 1023px) 100vw, 40vw"
          className="object-contain"
        />
      </div>

      {/* Two-up: this column is roughly half the row, so the four-up default
          would render the cards at an eighth of the page. */}
      <div className="min-w-0">
        <ProductCarousel products={products} perView={2} />
      </div>
    </section>
  );
}
