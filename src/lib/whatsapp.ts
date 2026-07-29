import { SITE, WHATSAPP_NUMBER, WHATSAPP_TEMPLATES } from "./site";

type TemplateTokens = {
  name?: string;
  price?: string;
  qty?: number | string;
  url?: string;
};

/** Replace `{{token}}` placeholders; unknown tokens collapse to an empty string. */
function fill(template: string, tokens: TemplateTokens): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = tokens[key as keyof TemplateTokens];
    return value === undefined || value === null ? "" : String(value);
  });
}

/** Build a wa.me deep link with a pre-filled message. */
export function buildWhatsAppLink(
  message: string,
  number: string = WHATSAPP_NUMBER,
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Product enquiry link. Price is passed already-formatted (e.g. "Rs. 15,500.00")
 * so the message mirrors exactly what the customer saw on the page.
 */
export function productEnquiryLink(opts: {
  name: string;
  price: string;
  qty?: number;
  slug: string;
  template?: string;
  number?: string;
}): string {
  const message = fill(opts.template ?? WHATSAPP_TEMPLATES.product, {
    name: opts.name,
    price: opts.price,
    qty: opts.qty ?? 1,
    url: `${SITE.url}/products/${opts.slug}`,
  });
  return buildWhatsAppLink(message, opts.number);
}

/** Bulk / B2B enquiry — distinct template so these leads are recognisable. */
export function b2bEnquiryLink(template?: string, number?: string): string {
  return buildWhatsAppLink(template ?? WHATSAPP_TEMPLATES.b2b, number);
}

/** Generic enquiry, used by the floating action button. */
export function generalEnquiryLink(template?: string, number?: string): string {
  return buildWhatsAppLink(template ?? WHATSAPP_TEMPLATES.general, number);
}

/** Format paise-free rupee amounts the way the reference site does. */
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
