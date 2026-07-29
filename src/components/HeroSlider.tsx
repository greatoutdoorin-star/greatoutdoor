"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type HeroSlide = {
  image: string;
  alt: string;
  headline?: string;
  subtext?: string;
  href?: string;
};

type Props = {
  slides: HeroSlide[];
  /** Autoplay interval in ms; set to 0 to disable. */
  interval?: number;
};

/**
 * Full-bleed hero carousel with dot pagination, mirroring the reference layout.
 * Slides are 16:9 (2100x1181). Autoplay pauses on hover and respects
 * prefers-reduced-motion.
 */
export default function HeroSlider({ slides, interval = 6000 }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const go = useCallback(
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (!interval || paused || reducedMotion.current || slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [interval, paused, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-surface"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured"
    >
      {/* Source art is 16:9. At phone widths that collapses to a ~210px strip,
          so crop to 4:3 on mobile and restore the native ratio from sm up. */}
      <div className="relative aspect-[4/3] w-full sm:aspect-[2100/1181]">
        {slides.map((slide, i) => {
          const content = (
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              // Content area is viewport minus the sidebar rail on desktop.
              sizes="(max-width: 1023px) 100vw, calc(100vw - clamp(240px, 20vw, 360px))"
              priority={i === 0}
              className="object-cover"
            />
          );

          return (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden={i !== index}
            >
              {slide.href ? (
                <Link href={slide.href} className="block h-full w-full">
                  {content}
                </Link>
              ) : (
                content
              )}

              {(slide.headline || slide.subtext) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                  {slide.headline && (
                    <h2
                      className="font-display text-ink"
                      style={{ fontSize: "var(--text-hh)" }}
                    >
                      {slide.headline}
                    </h2>
                  )}
                  {slide.subtext && (
                    <p
                      className="mt-3 font-body text-ink-muted"
                      style={{ fontSize: "var(--text-body-lg)" }}
                    >
                      {slide.subtext}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === index ? "bg-ink" : "bg-ink/30 hover:bg-ink/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
