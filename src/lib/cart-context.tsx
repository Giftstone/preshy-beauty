"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getProducts } from "./store";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (productId: number, size?: string, qty?: number) => void;
  removeFromCart: (index: number) => void;
  updateQty: (index: number, delta: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("preshy-cart");
    if (saved) setCart(JSON.parse(saved));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("preshy-cart", JSON.stringify(cart));
    }
  }, [cart, hydrated]);

  const addToCart = (productId: number, size = "M", qty = 1) => {
    const product = getProducts().find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === productId && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.id === productId && i.size === size
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }
      return [
        ...prev,
        {
          id: productId,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          qty,
        },
      ];
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQty = (index: number, delta: number) => {
    setCart((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], qty: next[index].qty + delta };
      if (next[index].qty <= 0) return next.filter((_, i) => i !== index);
      return next;
    });
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
