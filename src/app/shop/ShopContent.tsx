"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchProducts, fetchExtensions, type Extension } from "@/lib/store";
import type { Product } from "@/lib/data";

const categories = ["all", "dresses", "tops", "bottoms", "suits", "perfumes", "beddings", "accessories", "extensions"];

export default function ShopContent() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("cat") || "all";
  const [cat, setCat] = useState(initial);
  const [products, setProducts] = useState<Product[]>([]);
  const [extensions, setExtensions] = useState<Extension[]>([]);

  useEffect(() => {
    (async () => {
      const [p, x] = await Promise.all([fetchProducts(), fetchExtensions()]);
      setProducts(p);
      setExtensions(x);
    })();
  }, []);

  useEffect(() => {
    setCat(searchParams.get("cat") || "all");
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (cat === "extensions") return [];
    if (cat === "all") return products;
    return products.filter((p) => p.category === cat);
  }, [cat, products]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-sm tracking-widest uppercase text-taupe mb-2">Collection</p>
          <h1 className="font-serif text-3xl md:text-5xl">Shop</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm border capitalize transition ${
                cat === c
                  ? "border-charcoal bg-charcoal text-cream"
                  : "border-taupe/40 hover:border-charcoal"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {cat !== "extensions" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`} className="group">
              <div className="aspect-[3/4] overflow-hidden rounded-xl bg-taupe/10 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3 className="text-sm font-medium group-hover:text-terracotta transition">
                {p.name}
              </h3>
              <p className="text-sm text-taupe mt-1">ZMW {p.price.toLocaleString()}</p>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-taupe py-12">No products in this category.</p>
          )}
        </div>
      )}

      {(cat === "all" || cat === "extensions") && (
        <div className={cat === "all" ? "mt-16" : ""}>
          {cat === "all" && <h2 className="font-serif text-2xl mb-6">Hair Extensions</h2>}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {extensions.map((x) => (
              <div key={x.id} className="group">
                <div className="aspect-[3/4] overflow-hidden rounded-xl bg-taupe/10 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={x.image}
                    alt={x.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                  decoding="async"
                  />
                </div>
                <h3 className="text-sm font-medium">{x.name}</h3>
                <p className="text-xs text-taupe mt-0.5">
                  {x.texture}
                  {x.length ? ` · ${x.length}` : ""}
                </p>
                <p className="text-sm text-taupe mt-1">ZMW {x.price.toLocaleString()}</p>
                <a
                  href="tel:+260978974055"
                  className="inline-block mt-2 text-xs text-terracotta hover:underline"
                >
                  Call to order
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
