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
    <section className="grid items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-14 lg:px-14">
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={image}
          alt="Get a confirmation call for every order with our landscape stylist within 24 hours"
          fill
          sizes="(max-width: 1023px) 100vw, 45vw"
          className="object-contain"
        />
      </div>

      <div>
        <ProductCarousel products={products} />
      </div>
    </section>
  );
}
