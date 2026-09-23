import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  getAdminCredentials,
  setSessionCookie,
} from "@/lib/admin-session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    const { user, password: expected } = getAdminCredentials();

    if (!expected) {
      return NextResponse.json(
        {
          error:
            "Admin password not configured. Set ADMIN_PASSWORD in Vercel env (not NEXT_PUBLIC_).",
        },
        { status: 503 }
      );
    }

    if (username !== user || password !== expected) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const token = createSessionToken();
    const res = NextResponse.json({ ok: true });
    setSessionCookie(res, token);
    return res;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
