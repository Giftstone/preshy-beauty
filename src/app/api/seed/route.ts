import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/admin-session";
import { createClient } from "@supabase/supabase-js";
import {
  products as defaultProducts,
  services as defaultServices,
  stylists as defaultStylists,
} from "@/lib/data";

const defaultExtensions = [
  {
    id: 1,
    name: "Deep Wave Bundle (3pcs)",
    price: 1200,
    length: "18–22 inch",
    texture: "Deep Wave",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    description: "Soft deep wave bundles, natural look, easy to maintain.",
  },
  {
    id: 2,
    name: "Bone Straight Closure",
    price: 450,
    length: "16 inch",
    texture: "Bone Straight",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80",
    description: "Premium bone straight closure for seamless installs.",
  },
  {
    id: 3,
    name: "Spanish Curl Unit",
    price: 1800,
    length: "20 inch",
    texture: "Spanish Curls",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f785630b?w=600&q=80",
    description: "Ready-to-wear Spanish curl unit, full and bouncy.",
  },
];

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * POST /api/seed
 * Body optional: { force?: boolean }
 * Seeds catalog tables if empty (or force=true).
 * Requires SUPABASE_SERVICE_ROLE_KEY.
 * Protected by x-seed-secret header matching SEED_SECRET env (or admin password).
 */
export async function POST(req: NextRequest) {
  // Prefer admin session cookie; allow SEED_SECRET header for CI/scripts only
  const headerSecret = req.headers.get("x-seed-secret") || "";
  const seedSecret = process.env.SEED_SECRET || process.env.ADMIN_PASSWORD || "";
  const okCookie = isRequestAuthenticated(req);
  const okHeader = Boolean(seedSecret && headerSecret && headerSecret === seedSecret);
  if (!okCookie && !okHeader) {
    return NextResponse.json({ error: "Unauthorized — log in as admin first" }, { status: 401 });
  }

  const sb = getAdminClient();
  if (!sb) {
    return NextResponse.json(
      {
        error: "Supabase not configured",
        hint: "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
      },
      { status: 503 }
    );
  }

  let force = false;
  try {
    const body = await req.json().catch(() => ({}));
    force = Boolean(body?.force);
  } catch {
    /* empty body ok */
  }

  const results: Record<string, string> = {};

  try {
    // Products
    const { count: pCount } = await sb
      .from("products")
      .select("*", { count: "exact", head: true });
    if (force || !pCount) {
      if (force) await sb.from("products").delete().neq("id", 0);
      const rows = defaultProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        image: p.image,
        images: p.images,
        description: p.description,
        sizes: p.sizes,
        colors: p.colors,
      }));
      const { error } = await sb.from("products").upsert(rows);
      results.products = error ? `error: ${error.message}` : `seeded ${rows.length}`;
    } else {
      results.products = `skipped (${pCount} rows)`;
    }

    // Services
    const { count: sCount } = await sb
      .from("services")
      .select("*", { count: "exact", head: true });
    if (force || !sCount) {
      if (force) await sb.from("services").delete().neq("id", 0);
      const rows = defaultServices.map((s) => ({
        id: s.id,
        name: s.name,
        duration: s.duration,
        price: s.price,
        description: s.description,
      }));
      const { error } = await sb.from("services").upsert(rows);
      results.services = error ? `error: ${error.message}` : `seeded ${rows.length}`;
    } else {
      results.services = `skipped (${sCount} rows)`;
    }

    // Stylists
    const { count: stCount } = await sb
      .from("stylists")
      .select("*", { count: "exact", head: true });
    if (force || !stCount) {
      if (force) await sb.from("stylists").delete().neq("id", 0);
      const rows = defaultStylists.map((s) => ({
        id: s.id,
        name: s.name,
        specialty: s.specialty,
        image: s.image,
        bio: s.bio,
      }));
      const { error } = await sb.from("stylists").upsert(rows);
      results.stylists = error ? `error: ${error.message}` : `seeded ${rows.length}`;
    } else {
      results.stylists = `skipped (${stCount} rows)`;
    }

    // Extensions
    const { count: eCount } = await sb
      .from("extensions")
      .select("*", { count: "exact", head: true });
    if (force || !eCount) {
      if (force) await sb.from("extensions").delete().neq("id", 0);
      const rows = defaultExtensions.map((x) => ({
        id: x.id,
        name: x.name,
        price: x.price,
        length: x.length,
        texture: x.texture,
        image: x.image,
        description: x.description,
      }));
      const { error } = await sb.from("extensions").upsert(rows);
      results.extensions = error ? `error: ${error.message}` : `seeded ${rows.length}`;
    } else {
      results.extensions = `skipped (${eCount} rows)`;
    }

    return NextResponse.json({ ok: true, results });
  } catch (e) {
    console.error("seed error", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Seed failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "POST with header x-seed-secret to seed the database",
  });
}
