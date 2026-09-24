import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isRequestAuthenticated } from "@/lib/admin-session";

function getAdminClient() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function friendlyError(message: string): string {
  const m = (message || "").toLowerCase();
  if (
    m.includes("invalid path") ||
    m.includes("does not exist") ||
    m.includes("relation") ||
    m.includes("could not find")
  ) {
    return "Database tables missing. In Supabase → SQL Editor, run supabase/schema.sql (creates products, services, stylists, extensions).";
  }
  if (m.includes("jwt") || m.includes("api key") || m.includes("invalid api")) {
    return "Invalid SUPABASE_SERVICE_ROLE_KEY. Copy service_role secret from Supabase → Settings → API.";
  }
  if (m.includes("permission") || m.includes("policy") || m.includes("rls")) {
    return "Permission denied. Re-run supabase/schema.sql in SQL Editor.";
  }
  if (m.includes("payload") || m.includes("too large") || m.includes("entity too large")) {
    return "Image too large. Use a smaller photo (under 500KB) or a short image URL.";
  }
  return message || "Cloud sync failed";
}

const TABLES = ["products", "services", "stylists", "extensions"] as const;
type Table = (typeof TABLES)[number];

/**
 * POST { action: "upsert"|"delete", table, rows?, id? }
 * Auth: httpOnly admin session cookie
 * Writes go ONLY to Supabase (service role).
 */
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
          "Cloud not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Vercel, then Redeploy.",
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
      // Single-row upsert is fast; strip huge fields if needed
      const { data, error } = await sb.from(table).upsert(rows).select();
      if (error) {
        console.error("upsert error", table, error);
        return NextResponse.json({ error: friendlyError(error.message) }, { status: 400 });
      }
      return NextResponse.json({ ok: true, data });
    }

    if (action === "delete") {
      const id = body.id;
      if (id == null) return NextResponse.json({ error: "id required" }, { status: 400 });
      const { error } = await sb.from(table).delete().eq("id", id);
      if (error) {
        console.error("delete error", table, error);
        return NextResponse.json({ error: friendlyError(error.message) }, { status: 400 });
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action (use upsert or delete)" }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
