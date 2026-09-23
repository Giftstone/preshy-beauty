import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const reference = req.nextUrl.searchParams.get("reference");

  if (!secret) {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 503 });
  }
  if (!reference) {
    return NextResponse.json({ error: "reference required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
      }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
