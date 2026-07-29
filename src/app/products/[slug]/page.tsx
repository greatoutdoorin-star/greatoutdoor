import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCarousel from "@/components/ProductCarousel";
import ProductEnquiry from "@/components/ProductEnquiry";
import ProductGallery from "@/components/ProductGallery";
import SiteShell from "@/components/SiteShell";
import SpecsAccordion from "@/components/SpecsAccordion";
import {
  getAllProducts,
  getCollection,
  getCollections,
  getProduct,
  getRelatedProducts,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/whatsapp";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: product.images[0] ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [navCollections, collection, related] = await Promise.all([
    getCollections(),
    getCollection(product.collection),
    getRelatedProducts(product),
  ]);

  return (
    <SiteShell collections={navCollections}>
      <div className="grid gap-10 px-6 pt-8 lg:grid-cols-2 lg:gap-16 lg:px-14 lg:pt-14">
        {/*
          Copy column. On desktop it sits left with the gallery on the right,
          as on the reference page. On mobile the gallery comes first (order-1
          below) so the product is visible before any text.
        */}
        {/* min-w-0: grid items default to min-width:auto, so a wide child (the
            spec lines, the thumbnail strip) forces the track wider than the
            viewport and the whole page pans sideways on mobile. */}
        <div className="order-2 min-w-0 lg:order-1">
          <nav
            className="flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-ink-muted"
            style={{ fontSize: "var(--text-body-sm)" }}
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
            <span className="mx-2">/</span>
            {collection && (
              <>
                <Link
                  href={`/collections/${collection.slug}`}
                  className="hover:text-accent"
                >
                  {collection.name}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-ink">{product.name}</span>
          </nav>

          <p
            className="mt-8 font-body text-ink-muted"
            style={{ fontSize: "var(--text-body-sm)" }}
          >
            Great Outdoor
          </p>

          <h1 className="mt-2" style={{ fontSize: "var(--text-h0)" }}>
            {product.name}
          </h1>

          <p
            className="mt-4 font-body"
            style={{ fontSize: "var(--text-body-hd)" }}
          >
            {formatPrice(product.price)}
          </p>

          <ProductEnquiry
            name={product.name}
            slug={product.slug}
            price={product.price}
          />

          {product.description && (
            <div className="prose-go mt-10 max-w-xl font-body leading-relaxed">
              {product.description.split("\n\n").map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>
          )}

          {product.material && (
            <p className="mt-6 font-body text-ink-muted">
              <span className="font-display font-semibold text-ink">
                Material:{" "}
              </span>
              {product.material}
            </p>
          )}

          <SpecsAccordion
            specs={product.specs}
            variantLabel={product.variantLabel}
            variants={product.variants}
          />
        </div>

        <div className="order-1 min-w-0 lg:order-2">
          <ProductGallery images={product.images} name={product.name} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="px-6 py-20 lg:px-14">
          <h2 className="mb-10" style={{ fontSize: "var(--text-h0)" }}>
            You May Also Like
          </h2>
          <ProductCarousel
            products={related.map((p) => ({
              name: p.name,
              slug: p.slug,
              price: p.price,
              image: p.images[0],
            }))}
          />
        </section>
      )}
    </SiteShell>
  );
}
