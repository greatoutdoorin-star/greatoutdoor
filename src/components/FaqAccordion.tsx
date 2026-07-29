"use client";

import { useState } from "react";
import type { Faq } from "@/lib/faqs";

type Props = { items: Faq[] };

/** Accordion list; one item open at a time within its category group. */
export default function FaqAccordion({ items }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="border-t border-hairline">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="border-b border-hairline">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-accent"
            >
              <span
                className="font-display font-semibold"
                style={{ fontSize: "var(--text-body-hd)" }}
              >
                {item.q}
              </span>
              {/* Plus turns to minus when open */}
              <span className="relative mt-1 block h-4 w-4 shrink-0">
                <span className="absolute left-0 top-1/2 block h-px w-4 -translate-y-1/2 bg-current" />
                <span
                  className={`absolute left-1/2 top-0 block h-4 w-px -translate-x-1/2 bg-current transition-transform ${
                    isOpen ? "scale-y-0" : "scale-y-100"
                  }`}
                />
              </span>
            </button>

            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-4xl font-body leading-relaxed text-ink-muted">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
