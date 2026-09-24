"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { saveOrder } from "@/lib/store";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [payment, setPayment] = useState("mobile_money");
  const [error, setError] = useState("");
  const [customerSnap, setCustomerSnap] = useState({ name: "", phone: "" });

  const shipping = total >= 1500 ? 0 : 120;
  const grand = total + shipping;

  if (cart.length === 0 && !success) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-taupe mb-4">Your cart is empty</p>
        <a href="/shop" className="text-terracotta hover:underline">
          Continue shopping
        </a>
      </main>
    );
  }

  if (success) {
    const waText = encodeURIComponent(
      `Hi Preshy Beauty! I placed order ${orderId} (${payment === "mobile_money" ? "Mobile Money" : "Payment on Delivery"}). Name: ${customerSnap.name}. Phone: ${customerSnap.phone}. Total: ZMW ${grand.toLocaleString()}.`
    );
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-sage">
          ✓
        </div>
        <h2 className="font-serif text-3xl mb-3">Order confirmed!</h2>
        <p className="text-taupe mb-2">Order reference: {orderId}</p>
        <p className="text-sm text-taupe mb-6 max-w-md mx-auto">
          {payment === "mobile_money"
            ? "Send payment via Airtel Money, MTN MoMo or Zamtel, then message us on WhatsApp with your order reference."
            : "Pay when your order arrives in Ndola. We’ll confirm delivery details on WhatsApp."}
        </p>
        <a
          href={`https://wa.me/260978974055?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#25D366] text-white px-8 py-3 rounded-full text-sm font-medium mb-4"
        >
          Confirm on WhatsApp
        </a>
        <div className="text-sm text-taupe space-y-1 mb-8">
          <p>
            <a href="tel:+260978974055" className="text-terracotta">
              +260 978 974 055
            </a>
            {" · "}
            <a href="tel:+260962598440" className="text-terracotta">
              +260 962 598 440
            </a>
          </p>
        </div>
        <a
          href="/"
          className="inline-block bg-charcoal text-cream px-8 py-3 rounded-full text-sm font-medium"
        >
          Back to Home
        </a>
      </main>
    );
  }

  const finalizeOrder = async (
    customer: Record<string, string>,
    paymentMethod: string
  ) => {
    const id = "PB" + Date.now().toString().slice(-8);
    await saveOrder({
      id,
      items: cart,
      total: grand,
      customer,
      payment: paymentMethod,
      payment_ref: "",
      status: "pending",
    });
    clearCart();
    setCustomerSnap({ name: customer.name || "", phone: customer.phone || "" });
    setOrderId(id);
    setSuccess(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setProcessing(true);
    const fd = new FormData(e.target as HTMLFormElement);
    const customer = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      address: String(fd.get("address") || ""),
      city: String(fd.get("city") || ""),
    };
    try {
      await finalizeOrder(customer, payment);
    } catch {
      setError("Something went wrong. Please try again or call us.");
    }
    setProcessing(false);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <h1 className="font-serif text-3xl md:text-4xl mb-10 text-center">Checkout</h1>
      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="bg-white rounded-2xl p-6 sticky top-28">
            <h2 className="font-medium mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    className="w-16 h-20 object-cover rounded-lg"
                    alt=""
                    loading="lazy"
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-taupe text-xs">
                      Size {item.size} · Qty {item.qty}
                    </p>
                    <p className="mt-1">ZMW {(item.price * item.qty).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-taupe/20 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-taupe">Subtotal</span>
                <span>ZMW {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-taupe">Shipping</span>
                <span>{shipping === 0 ? "Free" : `ZMW ${shipping}`}</span>
              </div>
              <div className="flex justify-between font-medium text-base pt-2">
                <span>Total</span>
                <span>ZMW {grand.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 order-1 lg:order-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 space-y-6">
            <div>
              <h2 className="font-medium mb-4">Contact & Delivery</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1.5">Full Name</label>
                  <input
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-taupe/30 bg-cream focus:outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-taupe/30 bg-cream focus:outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1.5">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+260 …"
                    className="w-full px-4 py-3 rounded-xl border border-taupe/30 bg-cream focus:outline-none focus:border-terracotta"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1.5">City</label>
                  <input
                    name="city"
                    required
                    defaultValue="Ndola"
                    className="w-full px-4 py-3 rounded-xl border border-taupe/30 bg-cream focus:outline-none focus:border-terracotta"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm mb-1.5">Address</label>
                  <input
                    name="address"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-taupe/30 bg-cream focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-medium mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  {
                    value: "mobile_money",
                    label: "Mobile Money",
                    desc: "Airtel Money, MTN MoMo, Zamtel — confirm on WhatsApp after ordering",
                  },
                  {
                    value: "cod",
                    label: "Payment on Delivery",
                    desc: "Pay cash or mobile money when you receive your order",
                  },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                      payment === opt.value
                        ? "border-terracotta bg-terracotta/5"
                        : "border-taupe/30 hover:border-taupe"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={payment === opt.value}
                      onChange={() => setPayment(opt.value)}
                      className="accent-terracotta"
                    />
                    <div>
                      <p className="font-medium text-sm">{opt.label}</p>
                      <p className="text-xs text-taupe">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-charcoal text-cream py-4 rounded-full font-medium hover:bg-charcoal/90 transition text-lg disabled:opacity-60"
            >
              {processing ? "Processing…" : `Place order · ZMW ${grand.toLocaleString()}`}
            </button>
            <p className="text-xs text-center text-taupe">
              Ndola Town Centre · +260 978 974 055 · +260 962 598 440
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
