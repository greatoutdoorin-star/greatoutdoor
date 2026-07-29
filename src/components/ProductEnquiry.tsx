"use client";

import { useState } from "react";
import { formatPrice, productEnquiryLink } from "@/lib/whatsapp";

type Props = {
  name: string;
  slug: string;
  price: number;
};

/**
 * Replaces the reference theme's quantity + "Add to cart" block.
 * Quantity is kept because "I want 6 of these" is a materially better lead for
 * furniture at these prices — it is passed through into the WhatsApp message.
 */
export default function ProductEnquiry({ name, slug, price }: Props) {
  const [qty, setQty] = useState(1);

  const href = productEnquiryLink({
    name,
    price: formatPrice(price),
    qty,
    slug,
  });

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-stretch gap-4">
        <div className="flex items-center border border-hairline">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="px-4 py-3 text-lg transition-colors hover:text-accent"
          >
            −
          </button>
          <span
            className="w-10 text-center font-body"
            aria-live="polite"
            aria-label={`Quantity ${qty}`}
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
            className="px-4 py-3 text-lg transition-colors hover:text-accent"
          >
            +
          </button>
        </div>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-3 bg-ink px-8 py-4 text-center font-display font-semibold text-white transition-colors hover:bg-accent"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.83 9.83 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.945c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.9 11.9 0 0 0 5.71 1.454h.006c6.585 0 11.946-5.359 11.949-11.945a11.9 11.9 0 0 0-3.45-8.406" />
          </svg>
          Enquire on WhatsApp
        </a>
      </div>

      <p
        className="mt-4 font-body text-ink-muted"
        style={{ fontSize: "var(--text-body-sm)" }}
      >
        Our landscape stylist will help you choose cane, rope and upholstery
        options.
      </p>
    </div>
  );
}
