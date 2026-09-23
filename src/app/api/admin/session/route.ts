import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/admin-session";

export async function GET(req: NextRequest) {
  return NextResponse.json({ authenticated: isRequestAuthenticated(req) });
}
