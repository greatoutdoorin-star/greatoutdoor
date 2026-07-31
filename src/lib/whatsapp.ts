import { SITE, WHATSAPP_NUMBER, WHATSAPP_TEMPLATES } from "./site";

type TemplateTokens = {
  name?: string;
  price?: string;
  qty?: number | string;
  url?: string;
};

/** Replace `{{token}}` placeholders; unknown tokens collapse to an empty string. */
function fill(template: string, tokens: TemplateTokens): string {
  const filled = template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = tokens[key as keyof TemplateTokens];
    return value === undefined || value === null ? "" : String(value);
  });

  // A dropped token can strand its separator — the default product template
  // reads "… ({{qty}} pcs) — {{price}}", which leaves a trailing em-dash once
  // prices are hidden. Tidy that rather than making the admin edit the
  // template to match a code-level switch.
  return filled
    .split("\n")
    .map((line) => line.replace(/[\s]*[—–-]\s*$/, "").trimEnd())
    .join("\n");
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
 * so the message mirrors exactly what the customer saw on the page — which is
 * why it is dropped entirely while SHOW_PRICES is off, rather than sending a
 * figure the customer was never shown.
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
    price: SHOW_PRICES ? opts.price : undefined,
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

/**
 * Whether public pages show prices.
 *
 * Prices are quoted over WhatsApp instead, so visitors see "Enquire for price".
 * The values stay in the database and remain editable in the admin panel —
 * flip this to true to show them again everywhere at once.
 */
export const SHOW_PRICES = false;

/** Shown wherever a price would otherwise appear. */
export const PRICE_PLACEHOLDER = "Enquire for price";

/** Format paise-free rupee amounts the way the reference site does. */
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Price as shown to visitors. Admin screens call formatPrice directly, since
 * you still need to see the real figure there.
 */
export function displayPrice(amount: number): string {
  return SHOW_PRICES ? formatPrice(amount) : PRICE_PLACEHOLDER;
}
