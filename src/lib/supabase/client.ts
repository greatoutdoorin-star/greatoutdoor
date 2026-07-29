"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client for the admin panel.
 *
 * Uses the anon key and stores the session in cookies so server components and
 * middleware can read it. Row Level Security still governs every write: the
 * `admin write` policies require an authenticated role.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
