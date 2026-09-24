"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchProducts, fetchExtensions, type Extension } from "@/lib/store";
import type { Product } from "@/lib/data";

const categories = [
  "all",
  "dresses",
  "tops",
  "bottoms",
  "suits",
  "perfumes",
  "beddings",
  "accessories",
  "extensions",
];

const LENGTH_OPTIONS = ["14\"", "16\"", "18\"", "20\"", "22\"", "24\"", "26\"", "28\"", "30\""];
const COLOR_OPTIONS = [
  "Natural Black (1)",
  "1B Off Black",
  "2 Darkest Brown",
  "4 Medium Brown",
  "27 Honey Blonde",
  "30 Light Auburn",
  "33 Dark Auburn",
  "Burgundy",
  "Ombre",
  "Custom (specify on WhatsApp)",
];

export default function ShopContent() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("cat") || "all";
  const [cat, setCat] = useState(initial);
  const [products, setProducts] = useState<Product[]>([]);
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [orderItem, setOrderItem] = useState<Extension | null>(null);
  const [inches, setInches] = useState("18\"");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [pieces, setPieces] = useState(1);

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

  const openOrder = (x: Extension) => {
    setOrderItem(x);
    setInches(x.length?.includes("20") ? "20\"" : x.length?.includes("16") ? "16\"" : "18\"");
    setColor(COLOR_OPTIONS[0]);
    setPieces(1);
  };

  const closeOrder = () => setOrderItem(null);

  const itemNumber = orderItem ? `EXT-${String(orderItem.id).padStart(3, "0")}` : "";

  const orderMessage = orderItem
    ? [
        `Hi Preshy Beauty! I want to order a hair extension:`,
        ``,
        `Item number: ${itemNumber}`,
        `Product: ${orderItem.name}`,
        `Inches: ${inches}`,
        `Colour: ${color}`,
        `Pieces (quantity): ${pieces}`,
        `Listed price: ZMW ${orderItem.price.toLocaleString()}`,
        ``,
        `Please confirm availability and total.`,
      ].join("\n")
    : "";

  const waHref = `https://wa.me/260978974055?text=${encodeURIComponent(orderMessage)}`;
  const telHref = "tel:+260978974055";

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
                <p className="text-xs text-taupe">Item #{`EXT-${String(x.id).padStart(3, "0")}`}</p>
                <p className="text-sm text-taupe mt-1">ZMW {x.price.toLocaleString()}</p>
                <button
                  type="button"
                  onClick={() => openOrder(x)}
                  className="mt-2 text-xs font-medium text-terracotta hover:underline"
                >
                  Order now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extension order modal */}
      {orderItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40">
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
            role="dialog"
            aria-labelledby="order-title"
          >
            <h2 id="order-title" className="font-serif text-xl mb-1">
              Order extension
            </h2>
            <p className="text-sm text-taupe mb-4">{orderItem.name}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Item number</label>
                <input
                  readOnly
                  value={itemNumber}
                  className="w-full px-3 py-2.5 rounded-xl border border-taupe/30 bg-cream text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Inches (length)</label>
                <select
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-taupe/30 bg-cream text-sm"
                >
                  {LENGTH_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Colour</label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-taupe/30 bg-cream text-sm"
                >
                  {COLOR_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Pieces (quantity)</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={pieces}
                  onChange={(e) => setPieces(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full px-3 py-2.5 rounded-xl border border-taupe/30 bg-cream text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-[#25D366] text-white py-3 rounded-full text-sm font-medium"
              >
                Order on WhatsApp
              </a>
              <a
                href={telHref}
                className="w-full text-center border border-charcoal py-3 rounded-full text-sm font-medium"
              >
                Call to order
              </a>
              <button
                type="button"
                onClick={closeOrder}
                className="w-full text-center text-sm text-taupe py-2 hover:text-charcoal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
