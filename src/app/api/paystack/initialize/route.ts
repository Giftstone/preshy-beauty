import { NextRequest, NextResponse } from "next/server";

/**
 * Initialize Paystack transaction (ZMW).
 * Uses PAYSTACK_SECRET_KEY (server only).
 * Test keys: sk_test_...  Live: sk_live_...
 */
export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      {
        error: "Paystack not configured",
        hint: "Add PAYSTACK_SECRET_KEY (use sk_test_ first). Checkout falls back to demo mode.",
      },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { email, amount, reference, metadata, callback_url } = body;

    if (!email || amount == null || Number(amount) <= 0) {
      return NextResponse.json({ error: "Valid email and amount required" }, { status: 400 });
    }

    const amountMinor = Math.round(Number(amount) * 100);
    const ref = reference || `PB-${Date.now()}`;
    const site = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: String(email).trim(),
        amount: amountMinor,
        currency: "ZMW",
        reference: ref,
        callback_url: callback_url || `${site}/checkout?paid=1&reference=${ref}`,
        metadata: {
          ...((metadata && typeof metadata === "object") ? metadata : {}),
          order_id: metadata?.order_id || ref,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Paystack init failed", data);
      return NextResponse.json(
        { error: data?.message || "Paystack initialize failed", details: data },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
