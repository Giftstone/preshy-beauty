"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProducts } from "@/lib/store";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

export default function ProductPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [size, setSize] = useState("M");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await fetchProducts();
      const p = list.find((x) => x.id === id) || null;
      setProduct(p);
      if (p) setSize(p.sizes[0] || "M");
    })();
  }, [id]);

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Product not found</h1>
        <Link href="/shop" className="text-terracotta hover:underline">
          Back to shop
        </Link>
      </main>
    );
  }

  const handleAdd = () => {
    addToCart(product.id, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-taupe/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0] || product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-sm tracking-widest uppercase text-taupe mb-2">{product.category}</p>
          <h1 className="font-serif text-3xl md:text-4xl mb-3">{product.name}</h1>
          <p className="text-xl mb-6">ZMW {product.price.toLocaleString()}</p>
          <p className="text-taupe leading-relaxed mb-8">{product.description}</p>
          <div className="mb-6">
            <p className="text-sm font-medium mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`w-12 h-12 rounded-full border text-sm transition ${
                    size === s
                      ? "border-charcoal bg-charcoal text-cream"
                      : "border-taupe/40 hover:border-charcoal"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="w-full sm:w-auto bg-charcoal text-cream px-10 py-4 rounded-full font-medium hover:bg-charcoal/90 transition"
          >
            {added ? "Added to cart ✓" : "Add to Cart"}
          </button>
          <div className="mt-10 pt-8 border-t border-taupe/20 text-sm text-taupe space-y-2">
            <p>✓ Free shipping on orders over ZMW 1,500</p>
            <p>✓ Easy 14-day returns</p>
            <p>
              Questions?{" "}
              <a href="tel:+260978974055" className="text-terracotta">
                +260 978 974 055
              </a>
              {" · "}
              <a href="tel:+260962598440" className="text-terracotta">
                +260 962 598 440
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
