import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isRequestAuthenticated } from "@/lib/admin-session";

export async function GET(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized — log in as admin first" }, { status: 401 });
  }

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "").trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

  const report: Record<string, unknown> = {
    url_set: Boolean(url),
    url_looks_valid: url.includes("supabase.co") && !url.includes("/rest/"),
    url_host: url ? url.replace(/^https?:\/\//, "").split("/")[0] : null,
    service_role_set: Boolean(serviceKey),
    service_role_length: serviceKey.length,
    anon_key_set: Boolean(anonKey),
    tables: {} as Record<string, string>,
  };

  if (!url || !serviceKey) {
    return NextResponse.json({
      ok: false,
      report,
      fix: "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Vercel, then Redeploy.",
    });
  }

  const sb = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const tables = ["products", "services", "stylists", "extensions", "bookings", "orders"];
  for (const table of tables) {
    try {
      const { error, count } = await sb.from(table).select("*", { count: "exact", head: true });
      if (error) {
        (report.tables as Record<string, string>)[table] =
          `ERROR: ${error.message} (code: ${error.code || "n/a"})`;
      } else {
        (report.tables as Record<string, string>)[table] = `OK (count≈${count ?? 0})`;
      }
    } catch (e) {
      (report.tables as Record<string, string>)[table] =
        `EXCEPTION: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  const tableResults = report.tables as Record<string, string>;
  const allOk = Object.values(tableResults).every((v) => v.startsWith("OK"));

  return NextResponse.json({
    ok: allOk,
    report,
    fix: allOk
      ? null
      : "Vercel URL/key must match THIS Supabase project (Settings → API). After creating tables: Settings → API → Reload schema, or wait 1–2 minutes.",
  });
}
