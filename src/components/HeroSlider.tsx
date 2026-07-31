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
  /** Where a swipe began, or null when no drag is in progress. */
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  /** Set when the last gesture was a swipe, so it does not also fire a click. */
  const swiped = useRef(false);
  /** Last pointer position seen during a drag; pointercancel has none. */
  const last = useRef<{ x: number; y: number } | null>(null);

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

  /**
   * Swipe handling. The slides cross-fade rather than sitting in a scroll
   * container, so there is nothing for touch to grab — without this the
   * carousel is only operable via the 8px dots on a phone.
   *
   * The gesture is only treated as a swipe when it is clearly horizontal,
   * so an ordinary vertical scroll that starts on the hero still scrolls
   * the page instead of being swallowed.
   */
  /**
   * Travel before a drag counts as a swipe. Deliberately small: the browser
   * cancels the pointer within ~26px of horizontal movement, so a larger
   * threshold is never reached. Still far beyond the few px of wobble in a tap.
   */
  const SWIPE_MIN = 20;

  const onPointerDown = (e: React.PointerEvent) => {
    swipeStart.current = { x: e.clientX, y: e.clientY };
    swiped.current = false;
    setPaused(true);
  };

  /**
   * Commit the swipe as soon as it is unambiguous, and again when the gesture
   * ends — including on `pointercancel`.
   *
   * With `touch-action: pan-y` the browser hands the gesture to the scroller
   * the moment it reads as horizontal, firing `pointercancel` and no
   * `pointerup`. Traced in a real browser: only one `pointermove` arrived (26px
   * of travel, under the threshold) before the cancel, so deciding on either
   * move-alone or up-alone dropped every swipe. Tracking the last position and
   * evaluating on cancel too is what makes it land.
   */
  const commitSwipe = (x: number, y: number) => {
    const start = swipeStart.current;
    if (!start || swiped.current || slides.length < 2) return;

    const dx = x - start.x;
    const dy = y - start.y;
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) <= Math.abs(dy)) return;

    swiped.current = true;
    swipeStart.current = null;
    go(index + (dx < 0 ? 1 : -1));
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!swipeStart.current) return;
    last.current = { x: e.clientX, y: e.clientY };
    commitSwipe(e.clientX, e.clientY);
  };

  const endGesture = () => {
    // On cancel the event carries no useful coordinates (clientX is 0), so
    // fall back to the last position seen during the move.
    if (last.current) commitSwipe(last.current.x, last.current.y);
    swipeStart.current = null;
    last.current = null;
    setPaused(false);
  };

  return (
    <section
      className="relative w-full touch-pan-y overflow-hidden bg-surface"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endGesture}
      onPointerCancel={endGesture}
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
                <Link
                  href={slide.href}
                  className="block h-full w-full"
                  // A swipe ends as a click on the link underneath, which would
                  // navigate away mid-gesture. Suppress it when the pointer
                  // travelled far enough to count as a swipe.
                  onClick={(e) => {
                    if (swiped.current) {
                      e.preventDefault();
                      swiped.current = false;
                    }
                  }}
                >
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
