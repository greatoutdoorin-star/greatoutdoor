"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type WhyCard = { title: string; image: string; body: string };

type Props = { cards: WhyCard[] };

/**
 * Horizontal carousel: two cards per view on desktop, one on mobile.
 * Native scroll-snap drives the track; the progress bar underneath reflects
 * scroll position and is draggable-free (matches the reference behaviour).
 */
export default function WhyCarousel({ cards }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <div>
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth"
      >
        {cards.map((c) => (
          <article
            key={c.title}
            className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-[calc(50%-1rem)]"
          >
            <div className="relative aspect-[3/2] w-full">
              <Image
                src={c.image}
                alt={c.title}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 1023px) 60vw, 45vw"
                className="object-cover"
              />
            </div>
            <h2
              className="mt-6 text-center font-display font-semibold"
              style={{ fontSize: "var(--text-body-hd)" }}
            >
              {c.title}
            </h2>
            <p className="mt-3 text-center font-body leading-relaxed">
              {c.body}
            </p>
          </article>
        ))}
      </div>

      {/* Scroll progress indicator */}
      <div className="mx-auto mt-10 h-0.5 w-full max-w-md bg-hairline">
        <div
          className="h-full bg-ink transition-[width] duration-150"
          style={{ width: `${Math.max(12, progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
