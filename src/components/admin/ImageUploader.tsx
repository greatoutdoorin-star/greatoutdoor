"use client";

import { useRef, useState } from "react";

/**
 * Drag-and-drop image uploader.
 *
 * Files are resized and re-encoded to WebP in the browser before upload. A
 * 6MB phone photo becomes ~150KB, which keeps the route handler well inside
 * Vercel's request body limit and means the server needs no image library —
 * `sharp` was only ever a dependency of the one-off migration scripts.
 */

type Props = {
  /** Storage folder — must match the allowlist in the upload route. */
  folder: "products" | "hero" | "blog" | "collections";
  /** Called with the public URL of each finished upload, in order. */
  onUploaded: (urls: string[]) => void;
  /** Accept several files at once (product galleries). */
  multiple?: boolean;
  label?: string;
};

/** Longest edge, in px. Matches the width the migration script used. */
const MAX_EDGE = 1600;
const QUALITY = 0.82;

/**
 * Draw the image to a canvas at a capped size and re-encode as WebP.
 * Falls back to the original file if the browser refuses to encode.
 */
async function compress(file: File): Promise<File> {
  // SVGs have no meaningful raster size and would be destroyed by this.
  if (file.type === "image/svg+xml") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALITY),
  );

  if (!blob) return file;

  return new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
    type: "image/webp",
  });
}

export default function ImageUploader({
  folder,
  onUploaded,
  multiple = false,
  label = "Upload images",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    setBusy(true);
    setError("");

    const urls: string[] = [];
    const failed: string[] = [];

    for (const [i, file] of files.entries()) {
      setProgress(`Uploading ${i + 1} of ${files.length}…`);

      try {
        const compressed = await compress(file);

        const body = new FormData();
        body.append("file", compressed);
        body.append("folder", folder);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body,
        });

        const json = await res.json();

        if (!res.ok) {
          failed.push(`${file.name}: ${json.error ?? res.statusText}`);
          continue;
        }

        urls.push(json.url);
      } catch (err) {
        failed.push(`${file.name}: ${(err as Error).message}`);
      }
    }

    if (urls.length > 0) onUploaded(urls);
    // Report partial failure rather than silently dropping files — a gallery
    // that quietly loses image 4 of 7 is worse than an explicit error.
    if (failed.length > 0) setError(failed.join(" · "));

    setBusy(false);
    setProgress("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="mt-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center border border-dashed px-6 py-8 text-center transition-colors ${
          dragging
            ? "border-accent bg-accent/5"
            : "border-hairline bg-surface hover:border-ink"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <span className="font-display font-semibold">
          {busy ? progress : label}
        </span>
        <span
          className="mt-1 font-body text-ink-muted"
          style={{ fontSize: "var(--text-body-sm)" }}
        >
          {busy
            ? "Please wait…"
            : `Drag ${multiple ? "images" : "an image"} here, or click to browse`}
        </span>
      </div>

      {error && (
        <p
          className="mt-2 font-body text-red-700"
          style={{ fontSize: "var(--text-body-sm)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
