"use client";

import Image from "next/image";
import { useState } from "react";
import ImageUploader from "./ImageUploader";

/**
 * A single image path input with an uploader and live preview.
 *
 * Server components (the hero and post editors) submit through plain form
 * actions, so the path still travels as a named form field — uploading just
 * fills it in rather than replacing the mechanism.
 */

type Props = {
  name: string;
  defaultValue?: string;
  folder: "products" | "hero" | "blog" | "collections";
  label?: string;
  placeholder?: string;
  /** Preview box aspect; hero slides are wide, blog covers are wide too. */
  aspect?: string;
};

export default function ImageField({
  name,
  defaultValue = "",
  folder,
  label = "Upload image",
  placeholder,
  aspect = "aspect-video",
}: Props) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div>
      <input
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Image path"
        className="w-full border border-hairline bg-canvas px-4 py-3 font-mono outline-none transition-colors focus:border-ink"
        style={{ fontSize: "var(--text-body-sm)" }}
      />

      <ImageUploader
        folder={folder}
        label={label}
        onUploaded={(urls) => setValue(urls[0])}
      />

      {value && (
        <div className={`relative mt-3 w-full ${aspect} bg-surface`}>
          <Image
            src={value}
            alt=""
            fill
            sizes="(min-width: 640px) 400px, 100vw"
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
