import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

/**
 * Paystack webhook — marks orders paid when charge.success fires.
 * Dashboard → Settings → API Keys & Webhooks →
 *   URL: https://YOUR_DOMAIN/api/paystack/webhook
 *
 * Set PAYSTACK_SECRET_KEY (same secret used to verify signature).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") || "";

  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: {
    event?: string;
    data?: {
      reference?: string;
      status?: string;
      amount?: number;
      metadata?: { order_id?: string };
    };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data?.status === "success") {
    const reference = event.data.reference || "";
    const orderId = event.data.metadata?.order_id || reference;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && serviceKey) {
      const sb = createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      // Try update by order id first, then by payment_ref
      const { error: e1 } = await sb
        .from("orders")
        .update({
          status: "paid",
          payment: "card",
          payment_ref: reference,
        })
        .eq("id", orderId);

      if (e1) {
        await sb
          .from("orders")
          .update({ status: "paid", payment: "card", payment_ref: reference })
          .eq("payment_ref", reference);
      }
    }
  }

  // Always 200 so Paystack stops retrying
  return NextResponse.json({ received: true });
}
