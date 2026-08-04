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
                /*
                  Fixed HEIGHT, natural width — the standard way to set a logo
                  strip, and the only way to give marks equal visual weight now
                  that the assets are trimmed. Before trimming every file was a
                  uniform 2:1, but only because each held 60-75% transparent
                  padding; the real marks range from 0.71 to 4.32, so a fixed
                  width would render a wide wordmark tiny and a square emblem
                  huge.

                  max-w caps the extremes: one asset is 4.32:1 and would
                  otherwise run 242px wide against a 40px neighbour.

                  Gap as horizontal margin rather than flex `gap`: the track is
                  two copies laid end to end, and a gap would not apply between
                  the last item of one copy and the first of the next, putting a
                  visible hitch in an otherwise seamless loop.
                */
                className="mx-4 flex h-14 w-auto max-w-[180px] shrink-0 items-center sm:mx-5 sm:h-16 sm:max-w-[210px] lg:mx-6 lg:h-20 lg:max-w-[260px]"
              >
                <Image
                  src={src}
                  alt={copy === 0 ? `Client ${i + 1}` : ""}
                  width={400}
                  height={200}
                  sizes="(max-width: 640px) 180px, (max-width: 1023px) 210px, 260px"
                  className="h-full w-auto max-w-full object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
