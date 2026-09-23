"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-taupe/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="font-serif text-2xl md:text-3xl tracking-tight">
              Preshy Beauty
            </Link>

            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <Link href="/" className="hover:text-terracotta transition">
                Home
              </Link>
              <Link href="/shop" className="hover:text-terracotta transition">
                Shop
              </Link>
              <Link href="/salon" className="hover:text-terracotta transition">
                Salon
              </Link>
              <Link href="/book" className="hover:text-terracotta transition">
                Book
              </Link>
              <Link href="/about" className="hover:text-terracotta transition">
                About
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:text-terracotta transition"
                aria-label="Open cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-terracotta text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                className="md:hidden p-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-taupe/20 bg-cream">
            <div className="px-4 py-4 space-y-3 text-sm font-medium">
              <Link href="/" className="block py-2" onClick={() => setMobileOpen(false)}>
                Home
              </Link>
              <Link href="/shop" className="block py-2" onClick={() => setMobileOpen(false)}>
                Shop
              </Link>
              <Link href="/salon" className="block py-2" onClick={() => setMobileOpen(false)}>
                Salon
              </Link>
              <Link href="/book" className="block py-2" onClick={() => setMobileOpen(false)}>
                Book Appointment
              </Link>
              <Link href="/about" className="block py-2" onClick={() => setMobileOpen(false)}>
                About
              </Link>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
