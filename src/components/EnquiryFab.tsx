"use client";

import { useEffect, useRef, useState } from "react";
import EnquiryForm from "./EnquiryForm";

/**
 * Floating enquiry button, sitting above the WhatsApp FAB.
 *
 * Opens an enquiry form in a dialog, so a visitor can start one from wherever
 * they are — usually a product page — without losing their place.
 *
 * Uses EnquiryForm rather than the B2B page's form: this opens site-wide, so
 * it carries the "Who are you?" / "What are you looking for?" qualifiers that
 * the B2B page does not need.
 */
export default function EnquiryFab() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll while the dialog is open, so the page behind stays put.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes — expected of anything covering the viewport.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Move focus into the dialog on open, and back to the button on close —
  // without this, keyboard focus stays stranded on the page behind.
  //
  // Deliberately the first *input*, not the first focusable: the close button
  // precedes the form in DOM order, so a generic selector lands focus on "×"
  // and the first thing a keyboard user hears is how to leave.
  useEffect(() => {
    if (open) {
      panelRef.current
        ?.querySelector<HTMLElement>("input, textarea")
        ?.focus();
    } else {
      openerRef.current?.focus();
    }
  }, [open]);

  return (
    <>
      {/* bottom-24 clears the 56px WhatsApp FAB plus its 24px offset. */}
      <button
        ref={openerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open enquiry form"
        aria-haspopup="dialog"
        className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink shadow-lg transition-transform hover:scale-105 hover:bg-accent"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-7 w-7 text-white"
        >
          {/* Clipboard with a pen — reads as "form", not "message". */}
          <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1Z" />
          <path d="M16 5h1.5A1.5 1.5 0 0 1 19 6.5v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-13A1.5 1.5 0 0 1 6.5 5H8" />
          <path d="M9 11h6M9 15h4" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-dialog-title"
          className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-6"
          // Click the backdrop to dismiss; clicks inside the panel must not
          // bubble up and close it.
          onClick={() => setOpen(false)}
        >
          <div
            ref={panelRef}
            onClick={(e) => e.stopPropagation()}
            className="no-scrollbar max-h-[92vh] w-full max-w-lg overflow-y-auto bg-canvas px-6 pb-8 pt-6 sm:px-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="enquiry-dialog-title"
                  style={{ fontSize: "var(--text-h2)" }}
                >
                  Send an Enquiry
                </h2>
                <p
                  className="mt-2 font-body text-ink-muted"
                  style={{ fontSize: "var(--text-body-sm)" }}
                >
                  Tell us what you need and we&rsquo;ll come back with pricing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close enquiry form"
                className="-mr-2 -mt-1 shrink-0 p-2 text-2xl leading-none text-ink-muted transition-colors hover:text-accent"
              >
                ×
              </button>
            </div>

            <div className="mt-6">
              <EnquiryForm onSubmitted={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
