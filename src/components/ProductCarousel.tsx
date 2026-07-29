"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard, { type Product } from "./ProductCard";

type Props = {
  products: Product[];
  /**
   * Cards visible per page on desktop. The default suits a full-bleed row;
   * PromoSplit passes 2 because its carousel sits in a half-width column, where
   * 25% of the container would be an eighth of the page and the cards shrink to
   * thumbnails.
   */
  perView?: 2 | 4;
};

/**
 * Four-up product carousel with dot pagination, matching the reference's
 * "Weather-Proof Patio Furniture" and "You May Also Like" rows.
 * Native scroll-snap drives paging so touch and trackpad work for free.
 */
export default function ProductCarousel({ products, perView = 4 }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const total = Math.max(1, Math.round(el.scrollWidth / el.clientWidth));
    setPages(total);
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  // Written out in full rather than composed — Tailwind only sees class names
  // that appear literally in the source, so a built-up string emits no CSS.
  const slideWidth =
    perView === 2
      ? "w-[calc(50%-1rem)] shrink-0 snap-start"
      : "w-[calc(50%-1rem)] shrink-0 snap-start sm:w-[45%] lg:w-[calc(25%-1.5rem)]";

  // Two-up cards sit in a ~half-width column, so they render wider than the
  // four-up row's 22vw; telling next/image that avoids an upscaled, soft source.
  const cardSizes =
    perView === 2
      ? "(max-width: 640px) 45vw, (max-width: 1023px) 45vw, 28vw"
      : "(max-width: 640px) 80vw, (max-width: 1023px) 45vw, 22vw";

  return (
    // min-w-0 on the root as well as the track: without it this div sizes to
    // its content as a flex/grid item, so the "scroll area" grew to the full
    // width of all slides and pushed the document sideways instead of
    // scrolling inside itself. Measured at 1428px on a 375px viewport.
    <div className="w-full min-w-0">
      <div
        ref={trackRef}
        className="no-scrollbar flex w-full min-w-0 snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth"
      >
        {products.map((p) => (
          <div key={p.slug} className={slideWidth}>
            <ProductCard product={p} sizes={cardSizes} />
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to page ${i + 1}`}
              aria-current={i === page}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === page ? "bg-ink" : "bg-ink/25 hover:bg-ink/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
