import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isRequestAuthenticated } from "@/lib/admin-session";

function getAdminClient() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !key) return null;
  // Reject common misconfiguration: URL must be project root, not /rest/v1
  if (url.includes("/rest/") || url.includes("/auth/")) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function friendlyError(message: string, code?: string): string {
  const m = (message || "").toLowerCase();
  if (
    m.includes("invalid path") ||
    m.includes("does not exist") ||
    m.includes("relation") ||
    m.includes("could not find") ||
    code === "PGRST205" ||
    code === "42P01"
  ) {
    return (
      "Cannot reach table in Supabase API. Tables may exist in Table Editor but API cannot see them. " +
      "Fix: 1) Confirm Vercel NEXT_PUBLIC_SUPABASE_URL is the Project URL of THIS project (Settings → API). " +
      "2) Confirm SUPABASE_SERVICE_ROLE_KEY is the service_role secret from the SAME project. " +
      "3) Settings → API → Reload schema (or wait 1–2 minutes). " +
      "Raw: " +
      message
    );
  }
  if (m.includes("jwt") || m.includes("api key") || m.includes("invalid api") || code === "PGRST301") {
    return "Invalid API key. SUPABASE_SERVICE_ROLE_KEY must be the service_role secret (not the anon key).";
  }
  if (m.includes("permission") || m.includes("policy") || m.includes("rls")) {
    return "Permission denied by RLS. Service role should bypass RLS — check you used service_role key.";
  }
  if (m.includes("payload") || m.includes("too large") || m.includes("entity too large")) {
    return "Payload too large (image). Use a smaller photo.";
  }
  return message || "Cloud sync failed";
}

const TABLES = ["products", "services", "stylists", "extensions"] as const;
type Table = (typeof TABLES)[number];

export async function POST(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json(
      { error: "Unauthorized — log in again at /admin/login" },
      { status: 401 }
    );
  }

  const sb = getAdminClient();
  if (!sb) {
    return NextResponse.json(
      {
        error:
          "Cloud not configured or URL invalid. Set NEXT_PUBLIC_SUPABASE_URL (https://xxxx.supabase.co only — no /rest/v1) and SUPABASE_SERVICE_ROLE_KEY, then Redeploy.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const table = body.table as Table;
    const action = body.action as string;

    if (!TABLES.includes(table)) {
      return NextResponse.json({ error: `Invalid table: ${table}` }, { status: 400 });
    }

    if (action === "upsert") {
      const rows = body.rows;
      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json({ error: "rows required" }, { status: 400 });
      }
      // Avoid sending enormous base64 if accidental; still allow reasonable images
      const cleaned = rows.map((r: Record<string, unknown>) => {
        const row = { ...r };
        if (typeof row.image === "string" && row.image.length > 1_500_000) {
          row.image = "";
        }
        if (Array.isArray(row.images) && row.images.length > 0) {
          row.images = (row.images as string[]).map((im) =>
            typeof im === "string" && im.length > 1_500_000 ? "" : im
          );
        }
        return row;
      });

      const { data, error } = await sb
        .from(table)
        .upsert(cleaned, { onConflict: "id" })
        .select();

      if (error) {
        console.error("upsert error", table, error);
        return NextResponse.json(
          {
            error: friendlyError(error.message, error.code),
            code: error.code,
            details: error.details,
            hint: error.hint,
          },
          { status: 400 }
        );
      }
      return NextResponse.json({ ok: true, data });
    }

    if (action === "delete") {
      const id = body.id;
      if (id == null) return NextResponse.json({ error: "id required" }, { status: 400 });
      const { error } = await sb.from(table).delete().eq("id", id);
      if (error) {
        console.error("delete error", table, error);
        return NextResponse.json(
          { error: friendlyError(error.message, error.code), code: error.code },
          { status: 400 }
        );
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
