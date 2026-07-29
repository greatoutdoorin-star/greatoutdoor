import Image from "next/image";
import Link from "next/link";
import { formatPrice, productEnquiryLink } from "@/lib/whatsapp";

export type Product = {
  name: string;
  slug: string;
  price: number;
  image: string;
};

/**
 * Product card. The reference theme reveals "Add to cart" over the image on
 * hover; here that slot becomes the WhatsApp enquiry, which is this site's
 * only conversion action.
 */
export default function ProductCard({
  product,
  sizes = "(max-width: 640px) 80vw, (max-width: 1023px) 45vw, 22vw",
}: {
  product: Product;
  /**
   * Overridden where the card sits in a narrower column than the standard
   * four-up row, so next/image picks a source matched to the rendered size.
   */
  sizes?: string;
}) {
  const enquiryHref = productEnquiryLink({
    name: product.name,
    price: formatPrice(product.price),
    slug: product.slug,
  });

  return (
    <article className="group">
      {/* 5:6 portrait — the live theme renders these cards at
          padding-top: 120%, measured from its markup, not eyeballed. */}
      <div className="relative aspect-[5/6] w-full overflow-hidden">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={sizes}
            className="object-contain"
          />
        </Link>

        {/*
          Mobile: a round icon button pinned to the image corner (always
          tappable — :hover never fires on touch, so a hover-only control would
          make the site's single conversion action unreachable on phones).
          Desktop (lg+): the full-width bar that slides up on hover, matching
          the reference theme.
        */}
        <a
          href={enquiryHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Enquire about ${product.name} on WhatsApp`}
          className="absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white shadow-md transition-colors hover:bg-accent lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="h-5 w-5"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.83 9.83 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.945c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.9 11.9 0 0 0 5.71 1.454h.006c6.585 0 11.946-5.359 11.949-11.945a11.9 11.9 0 0 0-3.45-8.406" />
          </svg>
        </a>

        <a
          href={enquiryHref}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-ink py-4 text-center font-display font-semibold text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 lg:block"
        >
          Enquire on WhatsApp
        </a>
      </div>

      <div className="border-t border-hairline pt-4">
        <h3
          className="font-display font-semibold"
          style={{ fontSize: "var(--text-body-hd)" }}
        >
          <Link href={`/products/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 font-body text-ink-muted">
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  );
}
