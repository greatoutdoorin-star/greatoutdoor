"use client";

import { useState } from "react";

type Props = {
  specs: string[];
  variantLabel?: string | null;
  variants?: string[];
};

/**
 * "PRODUCT SPECIFICATIONS" disclosure, matching the reference product page.
 * Variant options are listed here as text rather than as a selector — this site
 * has no cart, so the choice is made in the WhatsApp conversation.
 */
export default function SpecsAccordion({ specs, variantLabel, variants }: Props) {
  const [open, setOpen] = useState(false);
  const hasVariants = Boolean(variants && variants.length > 0);

  if (specs.length === 0 && !hasVariants) return null;

  return (
    <div className="mt-10 border-t border-hairline">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-accent"
      >
        <span
          className="font-display font-semibold tracking-[0.06em]"
          style={{ fontSize: "var(--text-body-hd)" }}
        >
          PRODUCT SPECIFICATIONS
        </span>
        <span className="relative block h-4 w-4 shrink-0">
          <span className="absolute left-0 top-1/2 block h-px w-4 -translate-y-1/2 bg-current" />
          <span
            className={`absolute left-1/2 top-0 block h-4 w-px -translate-x-1/2 bg-current transition-transform ${
              open ? "scale-y-0" : "scale-y-100"
            }`}
          />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {specs.length > 0 && (
            <ul className="space-y-2 font-body text-ink-muted">
              {specs.map((s) => (
                <li key={s} className="flex gap-3">
                  <span aria-hidden="true">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          )}

          {hasVariants && (
            <div className={specs.length > 0 ? "mt-6" : ""}>
              <p className="font-display font-semibold">
                {variantLabel || "Options"}
              </p>
              <p className="mt-2 font-body text-ink-muted">
                {variants!.join(" · ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
