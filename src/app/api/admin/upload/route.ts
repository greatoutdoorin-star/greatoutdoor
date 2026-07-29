import { NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase/auth-server";

/**
 * Image upload endpoint for the admin panel.
 *
 * The proxy in src/proxy.ts only gates /admin/*, and the docs are explicit that
 * it is an optimistic check rather than authorization — so this route does its
 * own session check. Uploading runs as the signed-in user, which means the
 * storage RLS policies apply on top: an unauthenticated caller is refused twice.
 */

export const runtime = "nodejs";

/** Browsers may report WebP as image/webp or, older ones, not at all. */
const ALLOWED = new Set([
  "image/webp",
  "image/jpeg",
  "image/png",
  "image/avif",
]);

/**
 * 8MB. The uploader compresses to WebP in the browser first, so a real photo
 * lands well under 1MB — this ceiling only catches something pathological.
 */
const MAX_BYTES = 8 * 1024 * 1024;

/** Folders the admin forms are allowed to write into. */
const FOLDERS = new Set(["products", "hero", "blog", "collections"]);

/**
 * Strip anything that could escape the folder or produce an awkward URL.
 * Storage keys are path-like, so `..` and slashes must not survive.
 */
function safeName(name: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  const cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return cleaned || "image";
}

export async function POST(request: Request) {
  const db = await createAuthClient();

  const {
    data: { user },
  } = await db.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") ?? "products");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received" }, { status: 400 });
  }

  if (!FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Unknown folder" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type || "unknown"}` },
      { status: 415 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File is too large (max ${MAX_BYTES / 1024 / 1024}MB)` },
      { status: 413 },
    );
  }

  // A random suffix keeps same-named uploads from overwriting each other and
  // doubles as a cache-buster — the founder-photo incident was a stale file
  // being served under a name that had already been reused.
  const ext = file.type === "image/webp" ? "webp" : file.type.split("/")[1];
  const suffix = crypto.randomUUID().slice(0, 8);
  const key = `${folder}/${safeName(file.name)}-${suffix}.${ext}`;

  const { error } = await db.storage
    .from("media")
    .upload(key, file, { contentType: file.type, upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = db.storage.from("media").getPublicUrl(key);

  return NextResponse.json({ url: publicUrl, key });
}
