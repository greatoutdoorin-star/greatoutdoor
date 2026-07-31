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
        className="no-scrollbar flex w-full min-w-0 snap-x snap-mandatory items-center gap-6 overflow-x-auto scroll-smooth sm:gap-10 lg:gap-14"
      >
        {/*
          Fewer, larger logos per view — at 18% width they were unreadable.
          Two per screen on mobile: the width subtracts half the 1.5rem gap so
          the pair lands exactly on the track width, which keeps snap-start
          paging aligned. Desktop stays at three.
        */}
        {logos.map((src, i) => (
          <div
            key={src}
            className="relative h-20 w-[calc(50%-0.75rem)] shrink-0 snap-start sm:h-40 sm:w-[42%] lg:h-44 lg:w-[30%]"
          >
            <Image
              src={src}
              alt={`Client ${i + 1}`}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1023px) 42vw, 30vw"
              className="object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
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
