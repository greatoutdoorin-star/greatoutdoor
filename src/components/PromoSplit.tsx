import ProductCarousel from "./ProductCarousel";
import type { Product } from "./ProductCard";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/site";

type Props = {
  products: Product[];
};

/**
 * Split row directly beneath the hero: the confirmation-call promise on the
 * left, a compact product carousel on the right.
 *
 * The promise used to be a flat WebP. Set as real text it stays sharp at every
 * size, reflows on a phone instead of shrinking to illegibility, is readable by
 * search engines and screen readers, and — most usefully — makes the phone
 * number a tap-to-call link rather than a picture of a number.
 */
export default function PromoSplit({ products }: Props) {
  return (
    <section className="grid items-center gap-10 px-6 py-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12 lg:px-14">
      {/* `@container` establishes the query context that --text-promo's cqw
          units resolve against — the column, not the viewport. */}
      <div className="@container min-w-0">
        {/* Line breaks mirror the original artwork. `text-balance` is
            deliberately not used — the breaks are art-directed, not automatic. */}
        <p
          className="font-display font-bold uppercase leading-[1.15] tracking-[0.01em]"
          style={{ fontSize: "var(--text-promo)" }}
        >
          <span className="block">Get a</span>
          <span className="block text-accent">Confirmation</span>
          <span className="block">Call for every</span>
          <span className="block">Order with our</span>
          <span className="block text-accent">Landscape Stylist</span>
        </p>

        <p
          className="mt-3 font-body text-ink-muted"
          style={{ fontSize: "var(--text-body-lg)" }}
        >
          within 24 hours..
        </p>

        <a
          href={`tel:+${WHATSAPP_NUMBER}`}
          className="mt-8 inline-flex items-center gap-2 font-display font-semibold transition-colors hover:text-accent"
          style={{ fontSize: "var(--text-body-hu)" }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="h-5 w-5 shrink-0"
          >
            <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
          </svg>
          {WHATSAPP_DISPLAY}
        </a>
      </div>

      {/* Two-up: this column is roughly half the row, so the four-up default
          would render the cards at an eighth of the page. */}
      <div className="min-w-0">
        <ProductCarousel products={products} perView={2} />
      </div>
    </section>
  );
}
