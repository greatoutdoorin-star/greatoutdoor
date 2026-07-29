import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { getCollections } from "@/lib/catalog";

type Props = {
  title: string;
  /** Optional line under the title, e.g. "Effective Date: 30th April 2025". */
  meta?: string;
  children: React.ReactNode;
};

/**
 * Shared frame for policy pages (Shipping, Returns, Privacy).
 * Breadcrumb + title + a readable single-column measure.
 */
export default async function PolicyPage({ title, meta, children }: Props) {
  const collections = await getCollections();

  return (
    <SiteShell collections={collections}>
      <section className="px-6 pb-6 pt-16 lg:px-14 lg:pt-20">
        <nav
          className="font-body text-ink-muted"
          style={{ fontSize: "var(--text-body-sm)" }}
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>{title}</span>
        </nav>

        <h1 className="mt-6" style={{ fontSize: "var(--text-h0)" }}>
          {title}
        </h1>

        {meta && (
          <p
            className="mt-3 font-body text-ink-muted"
            style={{ fontSize: "var(--text-body-sm)" }}
          >
            {meta}
          </p>
        )}
      </section>

      <section className="policy-body max-w-4xl px-6 pb-20 lg:px-14">
        {children}
      </section>
    </SiteShell>
  );
}
