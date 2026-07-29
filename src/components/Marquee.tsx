/**
 * Dark scrolling ticker band. The text is repeated so the track can loop
 * seamlessly; the animation is defined in globals.css.
 */
export default function Marquee({ text }: { text: string }) {
  return (
    <div className="overflow-hidden bg-ink py-5">
      <div className="marquee-track flex w-max gap-16">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="whitespace-nowrap font-body italic text-white"
            style={{ fontSize: "var(--text-body-hd)" }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
