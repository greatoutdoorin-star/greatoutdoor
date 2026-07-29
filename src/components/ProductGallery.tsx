"use client";

import Image from "next/image";
import { useState } from "react";

type Props = { images: string[]; name: string };

/** Main image with a thumbnail strip beneath, mirroring the reference layout. */
export default function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  return (
    <div>
      <div className="relative aspect-square w-full">
        <Image
          src={images[active]}
          alt={name}
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 45vw"
          className="object-contain"
        />
      </div>

      {images.length > 1 && (
        <div className="no-scrollbar mt-6 flex gap-3 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${images.length}`}
              aria-current={i === active}
              className={`relative h-20 w-20 shrink-0 border transition-colors ${
                i === active ? "border-ink" : "border-hairline hover:border-ink/40"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
