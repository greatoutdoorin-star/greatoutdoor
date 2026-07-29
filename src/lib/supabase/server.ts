import { createClient } from "@supabase/supabase-js";

/**
 * Read-only Supabase client for server components.
 *
 * Uses the anon key, so Row Level Security applies — this client can only see
 * what an anonymous visitor is allowed to see. That is exactly right for the
 * public catalogue, and means a policy mistake fails closed rather than leaking.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
