import Link from "next/link";
import { SITE } from "@/lib/site";

const COMPANY_LINKS = [
  { label: "About Us", href: "/pages/about" },
  { label: "Contact", href: "/pages/contact" },
  { label: "FAQs", href: "/pages/faqs" },
  { label: "Instagram", href: "https://www.instagram.com/greatoutdoor.in/", external: true },
];

/** Slugs mirror the existing site's URLs so inbound links keep working. */
const QUICK_LINKS = [
  { label: "Privacy Policy", href: "/pages/privacy-policy" },
  { label: "Shipping Policy", href: "/pages/shipping" },
  { label: "Returns & Refund", href: "/pages/returns" },
];

export default function Footer() {
  return (
    <footer className="bg-ink px-6 py-16 text-white lg:px-14 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p
            className="font-display tracking-[0.12em]"
            style={{ fontSize: "var(--text-body-sm)" }}
          >
            GREAT OUTDOOR
          </p>
          <p className="mt-10 font-display" style={{ fontSize: "var(--text-h0)" }}>
            Enhance your Landscape.
          </p>
        </div>

        <nav>
          <p
            className="font-display tracking-[0.12em]"
            style={{ fontSize: "var(--text-body-sm)" }}
          >
            COMPANY
          </p>
          <ul className="mt-8 space-y-4 font-body">
            {COMPANY_LINKS.map((l) => (
              <li key={l.label}>
                {l.external ? (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-accent"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    href={l.href}
                    className="underline underline-offset-4 hover:text-accent"
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <nav>
          <p
            className="font-display tracking-[0.12em]"
            style={{ fontSize: "var(--text-body-sm)" }}
          >
            QUICK LINKS
          </p>
          <ul className="mt-8 space-y-4 font-body">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="underline underline-offset-4 hover:text-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p
        className="mt-20 font-body text-white/70"
        style={{ fontSize: "var(--text-body-sm)" }}
      >
        Copyright © {new Date().getFullYear()} {SITE.name}
      </p>
    </footer>
  );
}
