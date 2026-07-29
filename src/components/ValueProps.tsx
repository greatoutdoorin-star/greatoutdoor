import Link from "next/link";

/**
 * Three value props on a grey band, sitting directly above the footer on
 * every page. Orange dot marker over each heading.
 */
export default function ValueProps() {
  return (
    <section className="bg-surface px-6 py-16 lg:px-14 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-3">
        <div>
          <span className="block h-6 w-6 rounded-full bg-accent" />
          <h3 className="mt-8" style={{ fontSize: "var(--text-h2)" }}>
            Weather Proof
          </h3>
          <p className="mt-4 max-w-sm font-body leading-relaxed">
            We strive to provide high-quality{" "}
            <Link
              href="/pages/materials"
              className="underline underline-offset-4 hover:text-accent"
            >
              Materials
            </Link>{" "}
            that withstand every season and embrace durability.
          </p>
        </div>

        <div>
          <span className="block h-6 w-6 rounded-full bg-accent" />
          <h3 className="mt-8" style={{ fontSize: "var(--text-h2)" }}>
            Hand Crafted
          </h3>
          <p className="mt-4 max-w-sm font-body leading-relaxed">
            Each piece is created with care, making all sales final. Read our{" "}
            <Link
              href="/pages/returns"
              className="underline underline-offset-4 hover:text-accent"
            >
              Return &amp; Refund
            </Link>{" "}
            policy.
          </p>
        </div>

        <div>
          <span className="block h-6 w-6 rounded-full bg-accent" />
          <h3 className="mt-8" style={{ fontSize: "var(--text-h2)" }}>
            Customisable
          </h3>
          <p className="mt-4 max-w-sm font-body leading-relaxed">
            For your commercial orders drop your{" "}
            <Link
              href="/pages/b2b-leads"
              className="underline underline-offset-4 hover:text-accent"
            >
              B2B
            </Link>{" "}
            inquiry, for our Landscape Stylist to assist you!
          </p>
        </div>
      </div>
    </section>
  );
}
