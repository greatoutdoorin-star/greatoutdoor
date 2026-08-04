import Image from "next/image";

type Props = { logos: string[] };

/**
 * Continuously scrolling clientele strip.
 *
 * Replaces the paged carousel: with 15 logos, paging meant five clicks to see
 * the roster and most visitors saw only the first three. A marquee shows all of
 * them without interaction.
 *
 * The list is rendered twice and the track translates by -50%, so one cycle
 * ends exactly where the second copy begins and the loop is seamless. Pure CSS
 * — no scroll listener, no state, so this stays a server component.
 */
export default function ClienteleCarousel({ logos }: Props) {
  if (logos.length === 0) return null;

  return (
    // group/marquee: hovering anywhere on the strip pauses it, so a logo can be
    // looked at without chasing it across the screen.
    <div className="group/marquee relative overflow-hidden">
      {/* Soft edges so logos fade rather than clip at the boundary. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-canvas to-transparent lg:w-24"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-canvas to-transparent lg:w-24"
      />

      <div className="marquee-track marquee-track--logos flex w-max items-center group-hover/marquee:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            // The second copy exists only to make the loop seamless.
            aria-hidden={copy === 1}
          >
            {logos.map((src, i) => (
              <div
                key={`${copy}-${src}`}
                // Gap as horizontal margin rather than flex `gap`: the track is
                // two copies laid end to end, and a gap would not be applied
                // between the last item of one copy and the first of the next,
                // putting a visible hitch in an otherwise seamless loop.
                className="relative mx-5 h-16 w-32 shrink-0 sm:mx-7 sm:h-20 sm:w-40 lg:mx-8 lg:h-24 lg:w-48"
              >
                <Image
                  src={src}
                  alt={copy === 0 ? `Client ${i + 1}` : ""}
                  fill
                  sizes="(max-width: 640px) 128px, (max-width: 1023px) 160px, 192px"
                  className="object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
