import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/** True when Supabase env vars are configured */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && anon && !url.includes("your-project"));
}

let browserClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (typeof window === "undefined") {
    // Server: fresh client per call is fine for anon
    return createClient(url, anon);
  }
  if (!browserClient) {
    browserClient = createClient(url, anon);
  }
  return browserClient;
}

/** Server-only client with service role (never expose to browser) */
export function getSupabaseAdmin(): SupabaseClient | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
