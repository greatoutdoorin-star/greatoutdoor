/**
 * Site-wide configuration.
 *
 * These are build-time defaults. Once the admin panel and database are wired up,
 * the WhatsApp number and message templates are read from the `settings` table so
 * they can be changed without a redeploy — these values act as the fallback.
 */

export const SITE = {
  name: "Great Outdoor",
  shortName: "GO.in",
  description:
    "Hand-woven outdoor furniture — chairs, tables and accessories built for gardens, patios and terraces.",
  url: "https://greatoutdoor.in",
} as const;

/** Digits only, country code first — the format wa.me expects. */
export const WHATSAPP_NUMBER = "917791927939";

/** Human-readable form, for display in the sidebar/footer. */
export const WHATSAPP_DISPLAY = "+91 77919 27939";

/**
 * Message templates. `{{token}}` placeholders are substituted at click time.
 * Available tokens: name, price, qty, url
 */
export const WHATSAPP_TEMPLATES = {
  product:
    "Hi, I'm interested in {{name}} ({{qty}} pcs) — {{price}}\n{{url}}",
  b2b: "Hi, I'd like to enquire about bulk / B2B pricing for Great Outdoor furniture.",
  general: "Hi, I'd like to know more about Great Outdoor furniture.",
} as const;

/** Primary nav — collections are merged in dynamically from the database. */
export const PRIMARY_NAV = [
  { label: "All", href: "/collections/all" },
] as const;

/**
 * Secondary nav — static pages, rendered smaller beneath the primary group.
 * Slugs mirror the existing site's URLs so inbound links keep working.
 */
export const SECONDARY_NAV = [
  { label: "Bulk | B2B", href: "/pages/b2b-leads" },
  { label: "FAQs", href: "/pages/faqs" },
  { label: "Materials", href: "/pages/materials" },
  { label: "Why GO.in?", href: "/pages/why-go-in" },
  { label: "Blogs", href: "/blogs" },
] as const;
