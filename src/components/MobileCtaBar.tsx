"use client";

import { useEffect, useState } from "react";

type Props = {
  /** Opens the enquiry dialog owned by EnquiryFab. */
  onEnquire: () => void;
  whatsappHref: string;
};

/**
 * Fixed bottom action bar, mobile only.
 *
 * Replaces the two stacked circular FABs below `lg`. On a phone those covered
 * the content they floated over and gave no indication of what either one did;
 * a split bar labels both actions and stops obscuring the page.
 *
 * Slides up shortly after mount rather than appearing instantly, so it reads as
 * arriving rather than as part of the initial paint. That is the only motion
 * here — a bar the user will tap should not be animating while they aim at it.
 */
export default function MobileCtaBar({ onEnquire, whatsappHref }: Props) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // A beat after paint, so it does not compete with the hero rendering.
    const t = setTimeout(() => setShown(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-hairline bg-canvas transition-transform duration-500 ease-out lg:hidden ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
      // Respects the iOS home-indicator inset so the bar is not half-covered.
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button
        type="button"
        onClick={onEnquire}
        aria-haspopup="dialog"
        className="flex items-center justify-center gap-2 border-r border-hairline py-4 font-display font-semibold text-ink transition-colors active:bg-surface"
        style={{ fontSize: "var(--text-body-hd)" }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-5 w-5"
        >
          {/* Clipboard — reads as "form", not "message". */}
          <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1Z" />
          <path d="M16 5h1.5A1.5 1.5 0 0 1 19 6.5v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-13A1.5 1.5 0 0 1 6.5 5H8" />
          <path d="M9 11h6M9 15h4" />
        </svg>
        Enquire
      </button>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-whatsapp py-4 font-display font-semibold text-white transition-colors active:bg-whatsapp-hover"
        style={{ fontSize: "var(--text-body-hd)" }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.83 9.83 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.945c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.9 11.9 0 0 0 5.71 1.454h.006c6.585 0 11.946-5.359 11.949-11.945a11.9 11.9 0 0 0-3.45-8.406" />
        </svg>
        WhatsApp
      </a>
    </div>
  );
}
