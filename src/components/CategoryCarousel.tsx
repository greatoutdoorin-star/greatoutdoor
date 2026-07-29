"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type Category = {
  title: string;
  blurb: string;
  image: string;
  href: string;
};

type Props = { categories: Category[] };

/**
 * "Shop Categories" — two cards per view on desktop, one on mobile,
 * with a pill progress indicator beneath.
 */
export default function CategoryCarousel({ categories }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setPages(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
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
        {categories.map((c) => (
          <article
            key={c.title}
            className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-[calc(50%-1rem)]"
          >
            <Link href={c.href} className="block">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(max-width: 640px) 85vw, (max-width: 1023px) 60vw, 45vw"
                  className="object-cover"
                />
              </div>
            </Link>
            <h3 className="mt-6 text-center" style={{ fontSize: "var(--text-h2)" }}>
              {c.title}
            </h3>
            <p className="mt-3 text-center font-body leading-relaxed">
              {c.blurb}
            </p>
            <p className="mt-5 text-center">
              <Link
                href={c.href}
                className="font-display font-semibold tracking-[0.08em] underline underline-offset-8 hover:text-accent"
                style={{ fontSize: "var(--text-body-sm)" }}
              >
                EXPLORE
              </Link>
            </p>
          </article>
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to page ${i + 1}`}
              aria-current={i === page}
              className={`h-2 rounded-full transition-all ${
                i === page ? "w-8 bg-ink" : "w-2 bg-ink/25 hover:bg-ink/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
