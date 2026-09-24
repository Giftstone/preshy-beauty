"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { cart, removeFromCart, updateQty, total } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 bg-charcoal/40 z-40 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="font-serif text-xl">Your Cart</h3>
            <button onClick={onClose} className="p-2 hover:text-terracotta">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <p className="text-taupe text-center py-12">Your cart is empty</p>
            ) : (
              cart.map((item, idx) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-xs text-taupe mt-1">Size: {item.size}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(idx, -1)}
                          className="w-7 h-7 rounded-full border border-taupe/30 flex items-center justify-center text-sm"
                        >
                          −
                        </button>
                        <span className="text-sm w-6 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(idx, 1)}
                          className="w-7 h-7 rounded-full border border-taupe/30 flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-medium">
                        ZMW {(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(idx)}
                    className="text-taupe hover:text-terracotta self-start"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-medium">ZMW {total.toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className={`block w-full text-center py-4 rounded-full font-medium transition ${
                cart.length === 0
                  ? "bg-taupe/30 text-taupe pointer-events-none"
                  : "bg-charcoal text-cream hover:bg-charcoal/90"
              }`}
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
