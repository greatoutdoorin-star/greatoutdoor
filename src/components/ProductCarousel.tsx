"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard, { type Product } from "./ProductCard";

type Props = { products: Product[] };

/**
 * Four-up product carousel with dot pagination, matching the reference's
 * "Weather-Proof Patio Furniture" and "You May Also Like" rows.
 * Native scroll-snap drives paging so touch and trackpad work for free.
 */
export default function ProductCarousel({ products }: Props) {
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

  return (
    <div>
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth"
      >
        {products.map((p) => (
          <div
            key={p.slug}
            className="w-[calc(50%-1rem)] shrink-0 snap-start sm:w-[45%] lg:w-[calc(25%-1.5rem)]"
          >
            <ProductCard product={p} />
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
