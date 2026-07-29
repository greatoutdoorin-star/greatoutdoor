import Image from "next/image";
import Link from "next/link";

type Panel = { label: string; image: string };

type Props = { panels: Panel[] };

/**
 * Stacked material panels (ROPE / CANE) with a centred label chip on each.
 * The reference stacks two full-width images vertically.
 */
export default function MaterialsSplit({ panels }: Props) {
  return (
    <section className="px-6 py-16 lg:px-14">
      <div className="flex flex-col">
        {panels.map((p) => (
          <Link
            key={p.label}
            href="/pages/materials"
            className="group relative block aspect-[21/9] w-full overflow-hidden"
          >
            <Image
              src={p.image}
              alt={p.label}
              fill
              sizes="(max-width: 1023px) 100vw, 80vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-canvas px-8 py-4 font-display font-semibold tracking-[0.08em]"
              style={{ fontSize: "var(--text-body-hd)" }}
            >
              {p.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
