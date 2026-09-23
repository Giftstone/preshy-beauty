import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isRequestAuthenticated } from "@/lib/admin-session";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const TABLES = ["products", "services", "stylists", "extensions"] as const;
type Table = (typeof TABLES)[number];

/**
 * POST { action: "upsert"|"delete"|"replace", table, rows?, id? }
 * Auth: httpOnly admin session cookie (from /api/admin/login)
 */
export async function POST(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getAdminClient();
  if (!sb) {
    return NextResponse.json({ error: "Supabase service role not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const table = body.table as Table;
    const action = body.action as string;

    if (!TABLES.includes(table)) {
      return NextResponse.json({ error: "Invalid table" }, { status: 400 });
    }

    if (action === "upsert") {
      const rows = body.rows;
      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json({ error: "rows required" }, { status: 400 });
      }
      const { error } = await sb.from(table).upsert(rows);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }

    if (action === "delete") {
      const id = body.id;
      if (id == null) return NextResponse.json({ error: "id required" }, { status: 400 });
      const { error } = await sb.from(table).delete().eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }

    if (action === "replace") {
      const rows = body.rows;
      if (!Array.isArray(rows)) {
        return NextResponse.json({ error: "rows required" }, { status: 400 });
      }
      await sb.from(table).delete().neq("id", -1);
      if (rows.length > 0) {
        const { error } = await sb.from(table).upsert(rows);
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
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
