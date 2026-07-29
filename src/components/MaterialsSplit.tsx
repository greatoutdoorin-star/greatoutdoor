"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

type Panel = { label: string; image: string };

type Props = { panels: Panel[] };

/**
 * Before/after comparison wipe for the two weave materials.
 *
 * The reference theme's `before-after` section: a vertical wipe where dragging
 * the handle reveals more of one material and less of the other. Measured from
 * its stylesheet rather than guessed — height is 80vh (not an aspect ratio),
 * the handle is a 3px full-width bar at `bottom: var(--position)` with a 44px
 * circular grip, and the input carries cursor: row-resize.
 *
 * A range input drives it, so keyboard and touch work without extra handling —
 * the same reason the product carousel leans on native scroll-snap.
 */
export default function MaterialsSplit({ panels }: Props) {
  // Percentage of the *bottom* panel that is visible, matching the theme's
  // `--position`. 50 means an even split.
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  /**
   * Map a viewport Y coordinate to the bottom panel's share of the frame.
   * Measured per event rather than cached, so it stays correct after a resize
   * or a scroll mid-drag.
   */
  function updateFromPointer(clientY: number) {
    const frame = frameRef.current;
    if (!frame) return;

    const { top: frameTop, height } = frame.getBoundingClientRect();
    if (height === 0) return;

    const fromBottom = 1 - (clientY - frameTop) / height;
    setPosition(Math.min(100, Math.max(0, fromBottom * 100)));
  }

  const [top, bottom] = panels;
  if (!top || !bottom) return null;

  return (
    <section className="px-6 py-16 lg:px-14">
      <div
        ref={frameRef}
        className="relative h-[70vh] max-h-[760px] min-h-[420px] w-full select-none overflow-hidden lg:h-[80vh]"
      >
        {/* Bottom layer: fills the frame, revealed as the handle moves up. */}
        <PanelImage panel={bottom} align="bottom" />

        {/* Top layer, clipped to the area above the handle. inset() keeps the
            image at full frame size so it does not squash as the clip moves. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 ${position}% 0)` }}
        >
          <PanelImage panel={top} align="top" />
        </div>

        {/* Handle: 3px bar with a 44px grip, per the reference. */}
        <div
          className="pointer-events-none absolute inset-x-0 z-20 h-[3px] bg-canvas"
          style={{ bottom: `${position}%` }}
        >
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-canvas shadow-md">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 text-ink"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 9l4-4 4 4" />
              <path d="M16 15l-4 4-4-4" />
            </svg>
          </span>
        </div>

        {/*
          Drag surface. Pointer events set the position directly from the
          cursor's Y within the frame, rather than relying on a vertical range
          input — `-webkit-appearance: slider-vertical` (what the reference
          theme uses) is non-standard and was dropped in Chrome 121, so a
          rotated input drags erratically or not at all in current browsers.
          Pointer capture keeps the drag alive if the cursor leaves the frame.
        */}
        <div
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragging(true);
            updateFromPointer(e.clientY);
          }}
          onPointerMove={(e) => {
            if (!dragging) return;
            updateFromPointer(e.clientY);
          }}
          onPointerUp={(e) => {
            e.currentTarget.releasePointerCapture(e.pointerId);
            setDragging(false);
          }}
          onPointerCancel={() => setDragging(false)}
          className="absolute inset-0 z-30 cursor-row-resize touch-none"
        />

        {/*
          Keyboard equivalent. Visually hidden but focusable, so the comparison
          is operable without a pointer — the drag surface above cannot be
          tabbed to or driven with arrow keys.
        */}
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label="Drag to compare rope and cane weaves"
          className="sr-only"
        />
      </div>
    </section>
  );
}

/**
 * One material layer: full-bleed photo with its label chip.
 *
 * The chips sit in opposite quarters rather than both dead-centre — centred,
 * they would overlap at the default 50% split and the top one would be sliced
 * in half by the clip as the handle moves.
 */
function PanelImage({
  panel,
  align,
}: {
  panel: Panel;
  align: "top" | "bottom";
}) {
  return (
    <div className="absolute inset-0">
      <Image
        src={panel.image}
        alt={panel.label}
        fill
        sizes="(max-width: 1023px) 100vw, 80vw"
        className="object-cover"
        priority={false}
      />
      {/* z-40 puts the chip above the drag surface so it stays clickable; the
          surface covers the whole frame, which would otherwise swallow it. */}
      <Link
        href="/pages/materials"
        className={`absolute left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 bg-canvas px-8 py-4 font-display font-semibold tracking-[0.08em] transition-colors hover:text-accent ${
          align === "top" ? "top-1/4" : "top-3/4"
        }`}
        style={{ fontSize: "var(--text-body-hd)" }}
      >
        {panel.label}
      </Link>
    </div>
  );
}
