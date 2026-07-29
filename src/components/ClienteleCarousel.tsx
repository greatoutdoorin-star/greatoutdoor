"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = { logos: string[] };

/**
 * Clientele logo strip with prev/next controls and an "n/total" counter,
 * matching the reference layout. Logos are greyscale until hovered, which
 * keeps a row of mismatched brand colours visually calm.
 */
export default function ClienteleCarousel({ logos }: Props) {
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

  const step = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory items-center gap-10 overflow-x-auto scroll-smooth lg:gap-14"
      >
        {logos.map((src, i) => (
          <div
            key={src}
            className="relative h-24 w-[45%] shrink-0 snap-start sm:w-[30%] lg:h-28 lg:w-[18%]"
          >
            <Image
              src={src}
              alt={`Client ${i + 1}`}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1023px) 30vw, 18vw"
              className="object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            />
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous clients"
            className="text-2xl leading-none text-ink-muted transition-colors hover:text-accent"
          >
            ‹
          </button>
          <span
            className="font-body text-ink-muted"
            style={{ fontSize: "var(--text-body-sm)" }}
            aria-live="polite"
          >
            {page + 1}/{pages}
          </span>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next clients"
            className="text-2xl leading-none text-ink-muted transition-colors hover:text-accent"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
