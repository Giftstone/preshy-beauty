"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAdminLoggedIn, logoutAdmin } from "@/lib/admin-auth";
import {
  setProducts,
  setServices,
  setStylists,
  setExtensions,
  fetchProducts,
  fetchServices,
  fetchStylists,
  fetchExtensions,
  fetchBookings,
  fetchOrders,
  deleteProductRemote,
  deleteServiceRemote,
  deleteStylistRemote,
  deleteExtensionRemote,
  nextId,
  isSupabaseConfigured,
  type Extension,
} from "@/lib/store";
import type { Product, Service, Stylist } from "@/lib/data";

type Tab = "orders" | "bookings" | "products" | "services" | "stylists" | "extensions";

type AdminOrder = {
  id?: string;
  total?: number;
  payment?: string;
  created?: string;
  created_at?: string;
  customer?: {
    name?: string;
    email?: string;
  };
};

type AdminBooking = {
  name?: string;
  service?: string;
  stylist?: string;
  date?: string;
  time?: string;
  created?: string;
  created_at?: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("bookings");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [products, setProductsState] = useState<Product[]>([]);
  const [services, setServicesState] = useState<Service[]>([]);
  const [stylists, setStylistsState] = useState<Stylist[]>([]);
  const [extensions, setExtensionsState] = useState<Extension[]>([]);

  // Form state for add
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<Tab>("products");

  useEffect(() => {
    (async () => {
      const loggedIn = await isAdminLoggedIn();
      if (!loggedIn) {
        router.replace("/admin/login");
        return;
      }
      const [o, b, p, s, st, x] = await Promise.all([
        fetchOrders(),
        fetchBookings(),
        fetchProducts(),
        fetchServices(),
        fetchStylists(),
        fetchExtensions(),
      ]);
      setOrders(o as AdminOrder[]);
      setBookings(b as AdminBooking[]);
      setProductsState(p);
      setServicesState(s);
      setStylistsState(st);
      setExtensionsState(x);
      setReady(true);
    })();
  }, [router]);

  const [seedMsg, setSeedMsg] = useState("");
  const [seeding, setSeeding] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  const seedDatabase = async (force = false) => {
    if (!isSupabaseConfigured()) {
      setSeedMsg("Supabase is not configured. Add env vars on Vercel first.");
      return;
    }
    if (force && !confirm("Force re-seed will replace catalog tables. Continue?")) return;
    setSeeding(true);
    setSeedMsg("");
    try {
      const res = await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ force }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSeedMsg(data.error || "Seed failed");
      } else {
        setSeedMsg(
          `Seeded: ${Object.entries(data.results || {})
            .map(([k, v]) => `${k}=${v}`)
            .join(", ")}`
        );
        const [p, s, st, x] = await Promise.all([
          fetchProducts(),
          fetchServices(),
          fetchStylists(),
          fetchExtensions(),
        ]);
        setProductsState(p);
        setServicesState(s);
        setStylistsState(st);
        setExtensionsState(x);
      }
    } catch {
      setSeedMsg("Network error while seeding");
    }
    setSeeding(false);
  };

  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  const openAdd = (type: Tab) => {
    setFormType(type);
    setShowForm(true);
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    if (formType === "products") {
      const item: Product = {
        id: nextId(products),
        name: String(fd.get("name")),
        price: Number(fd.get("price")),
        category: String(fd.get("category") || "tops"),
        image: String(fd.get("image") || "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80"),
        images: [String(fd.get("image") || "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80")],
        description: String(fd.get("description") || ""),
        sizes: String(fd.get("sizes") || "S,M,L").split(",").map((s) => s.trim()),
        colors: String(fd.get("colors") || "Black").split(",").map((s) => s.trim()),
      };
      const next = [...products, item];
      await setProducts(next);
      setProductsState(next);
    } else if (formType === "services") {
      const item: Service = {
        id: nextId(services),
        name: String(fd.get("name")),
        price: Number(fd.get("price")),
        duration: Number(fd.get("duration") || 60),
        description: String(fd.get("description") || ""),
      };
      const next = [...services, item];
      await setServices(next);
      setServicesState(next);
    } else if (formType === "stylists") {
      const item: Stylist = {
        id: nextId(stylists),
        name: String(fd.get("name")),
        specialty: String(fd.get("specialty") || ""),
        image: String(fd.get("image") || "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80"),
        bio: String(fd.get("bio") || ""),
      };
      const next = [...stylists, item];
      await setStylists(next);
      setStylistsState(next);
    } else if (formType === "extensions") {
      const item: Extension = {
        id: nextId(extensions),
        name: String(fd.get("name")),
        price: Number(fd.get("price")),
        length: String(fd.get("length") || ""),
        texture: String(fd.get("texture") || ""),
        image: String(fd.get("image") || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80"),
        description: String(fd.get("description") || ""),
      };
      const next = [...extensions, item];
      await setExtensions(next);
      setExtensionsState(next);
    }
    setShowForm(false);
  };

  const removeProduct = async (id: number) => {
    if (!confirm("Remove this product?")) return;
    const next = products.filter((p) => p.id !== id);
    await setProducts(next);
    await deleteProductRemote(id);
    setProductsState(next);
  };
  const removeService = async (id: number) => {
    if (!confirm("Remove this service?")) return;
    const next = services.filter((s) => s.id !== id);
    await setServices(next);
    await deleteServiceRemote(id);
    setServicesState(next);
  };
  const removeStylist = async (id: number) => {
    if (!confirm("Remove this stylist?")) return;
    const next = stylists.filter((s) => s.id !== id);
    await setStylists(next);
    await deleteStylistRemote(id);
    setStylistsState(next);
  };
  const removeExtension = async (id: number) => {
    if (!confirm("Remove this extension?")) return;
    const next = extensions.filter((x) => x.id !== id);
    await setExtensions(next);
    await deleteExtensionRemote(id);
    setExtensionsState(next);
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center text-taupe">
        Loading…
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "bookings", label: "Appointments" },
    { id: "orders", label: "Orders" },
    { id: "products", label: "Shop" },
    { id: "services", label: "Services" },
    { id: "stylists", label: "Stylists" },
    { id: "extensions", label: "Extensions" },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <nav className="bg-charcoal text-cream">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3 h-auto py-3 md:h-16">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl">Preshy Beauty</span>
            <span className="text-xs bg-terracotta px-2 py-0.5 rounded">Admin</span>
          </div>
          <div className="flex flex-wrap gap-3 text-sm items-center">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={tab === t.id ? "opacity-100 font-medium" : "opacity-60 hover:opacity-100"}
              >
                {t.label}
              </button>
            ))}
            <Link href="/" className="opacity-60 hover:opacity-100">
              Storefront
            </Link>
            <button onClick={handleLogout} className="opacity-60 hover:opacity-100">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <p className="text-xs text-taupe">
            Database:{" "}
            <span className={isSupabaseConfigured() ? "text-sage font-medium" : "text-taupe"}>
              {isSupabaseConfigured()
                ? "Supabase connected"
                : "Local only (add Supabase env to sync)"}
            </span>
          </p>
          {isSupabaseConfigured() && (
            <>
              <button
                type="button"
                disabled={seeding}
                onClick={() => seedDatabase(false)}
                className="text-xs bg-charcoal text-cream px-3 py-1.5 rounded-full disabled:opacity-50"
              >
                {seeding ? "Seeding…" : "Seed catalog (if empty)"}
              </button>
              <button
                type="button"
                disabled={seeding}
                onClick={() => seedDatabase(true)}
                className="text-xs border border-taupe/40 px-3 py-1.5 rounded-full disabled:opacity-50"
              >
                Force re-seed
              </button>
            </>
          )}
        </div>
        {seedMsg && <p className="text-xs text-taupe mb-4">{seedMsg}</p>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm text-taupe">Appointments</p>
            <p className="font-serif text-3xl mt-1">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm text-taupe">Orders</p>
            <p className="font-serif text-3xl mt-1">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm text-taupe">Revenue</p>
            <p className="font-serif text-3xl mt-1">ZMW {revenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-5">
            <p className="text-sm text-taupe">Listings</p>
            <p className="font-serif text-3xl mt-1">{products.length + extensions.length}</p>
          </div>
        </div>

        {/* Appointments */}
        {tab === "bookings" && (
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-taupe/10">
              <h2 className="font-serif text-xl">Appointments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream text-left">
                  <tr>
                    <th className="px-5 py-3">Client</th>
                    <th className="px-5 py-3">Service</th>
                    <th className="px-5 py-3">Stylist</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-taupe/10">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-taupe">
                        No appointments yet
                      </td>
                    </tr>
                  ) : (
                    bookings
                      .slice()
                      .reverse()
                      .map((b, i) => (
                        <tr key={i}>
                          <td className="px-5 py-4 font-medium">{b.name}</td>
                          <td className="px-5 py-4">{b.service}</td>
                          <td className="px-5 py-4">{b.stylist}</td>
                          <td className="px-5 py-4">{b.date}</td>
                          <td className="px-5 py-4">{b.time}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-taupe/10">
              <h2 className="font-serif text-xl">Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream text-left">
                  <tr>
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">Payment</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-taupe/10">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-taupe">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    orders
                      .slice()
                      .reverse()
                      .map((o) => (
                        <tr key={o.id}>
                          <td className="px-5 py-4 font-medium">{o.id}</td>
                          <td className="px-5 py-4">
                            {o.customer?.name}
                            <br />
                            <span className="text-xs text-taupe">{o.customer?.email}</span>
                          </td>
                          <td className="px-5 py-4">ZMW {(o.total || 0).toLocaleString()}</td>
                          <td className="px-5 py-4 capitalize">{o.payment}</td>
                          <td className="px-5 py-4 text-taupe">
                            {new Date(o.created_at || o.created || Date.now()).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products */}
        {tab === "products" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-xl">Shop listings</h2>
              <button
                onClick={() => openAdd("products")}
                className="bg-charcoal text-cream px-5 py-2 rounded-full text-sm font-medium"
              >
                + Add product
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-xl p-4 flex gap-4">
                  <img src={p.image} className="w-16 h-20 object-cover rounded-lg" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{p.name}</p>
                    <p className="text-xs text-taupe capitalize">{p.category}</p>
                    <p className="text-sm mt-1">ZMW {p.price.toLocaleString()}</p>
                    <button
                      onClick={() => removeProduct(p.id)}
                      className="text-xs text-red-600 mt-2 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Services */}
        {tab === "services" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-xl">Hair services</h2>
              <button
                onClick={() => openAdd("services")}
                className="bg-charcoal text-cream px-5 py-2 rounded-full text-sm font-medium"
              >
                + Add service
              </button>
            </div>
            <div className="space-y-3">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-xl p-4 flex justify-between items-start gap-4"
                >
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-taupe mt-1">
                      {s.duration} min · ZMW {s.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-taupe mt-1">{s.description}</p>
                  </div>
                  <button
                    onClick={() => removeService(s.id)}
                    className="text-xs text-red-600 hover:underline shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Stylists */}
        {tab === "stylists" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-xl">Team stylists</h2>
              <button
                onClick={() => openAdd("stylists")}
                className="bg-charcoal text-cream px-5 py-2 rounded-full text-sm font-medium"
              >
                + Add stylist
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stylists.map((st) => (
                <div key={st.id} className="bg-white rounded-xl p-4 flex gap-4">
                  <img src={st.image} className="w-16 h-16 object-cover rounded-full" alt="" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{st.name}</p>
                    <p className="text-xs text-terracotta">{st.specialty}</p>
                    <p className="text-xs text-taupe mt-1">{st.bio}</p>
                    <button
                      onClick={() => removeStylist(st.id)}
                      className="text-xs text-red-600 mt-2 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Extensions */}
        {tab === "extensions" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-xl">Hair extensions for sale</h2>
              <button
                onClick={() => openAdd("extensions")}
                className="bg-charcoal text-cream px-5 py-2 rounded-full text-sm font-medium"
              >
                + Add extension
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {extensions.map((x) => (
                <div key={x.id} className="bg-white rounded-xl p-4 flex gap-4">
                  <img src={x.image} className="w-16 h-20 object-cover rounded-lg" alt="" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{x.name}</p>
                    <p className="text-xs text-taupe">
                      {x.texture} · {x.length}
                    </p>
                    <p className="text-sm mt-1">ZMW {x.price.toLocaleString()}</p>
                    <button
                      onClick={() => removeExtension(x.id)}
                      className="text-xs text-red-600 mt-2 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Add modal */}
      {showForm && (
        <div className="fixed inset-0 bg-charcoal/40 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-serif text-xl">
              Add{" "}
              {formType === "products"
                ? "product"
                : formType === "services"
                ? "service"
                : formType === "stylists"
                ? "stylist"
                : "extension"}
            </h3>

            <div>
              <label className="block text-sm mb-1">Name</label>
              <input name="name" required className="w-full px-3 py-2 rounded-lg border border-taupe/30" />
            </div>

            {(formType === "products" ||
              formType === "services" ||
              formType === "extensions") && (
              <div>
                <label className="block text-sm mb-1">Price (ZMW)</label>
                <input
                  name="price"
                  type="number"
                  required
                  min={0}
                  className="w-full px-3 py-2 rounded-lg border border-taupe/30"
                />
              </div>
            )}

            {formType === "products" && (
              <>
                <div>
                  <label className="block text-sm mb-1">Category</label>
                  <select name="category" className="w-full px-3 py-2 rounded-lg border border-taupe/30">
                    <option value="dresses">Dresses</option>
                    <option value="tops">Tops</option>
                    <option value="bottoms">Bottoms</option>
                    <option value="accessories">Accessories</option>
                    <option value="outerwear">Outerwear</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Sizes (comma separated)</label>
                  <input name="sizes" placeholder="XS,S,M,L,XL" className="w-full px-3 py-2 rounded-lg border border-taupe/30" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Colors (comma separated)</label>
                  <input name="colors" placeholder="Black,Ivory" className="w-full px-3 py-2 rounded-lg border border-taupe/30" />
                </div>
              </>
            )}

            {formType === "services" && (
              <div>
                <label className="block text-sm mb-1">Duration (minutes)</label>
                <input name="duration" type="number" defaultValue={60} className="w-full px-3 py-2 rounded-lg border border-taupe/30" />
              </div>
            )}

            {formType === "stylists" && (
              <>
                <div>
                  <label className="block text-sm mb-1">Specialty</label>
                  <input name="specialty" className="w-full px-3 py-2 rounded-lg border border-taupe/30" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Bio</label>
                  <textarea name="bio" rows={2} className="w-full px-3 py-2 rounded-lg border border-taupe/30" />
                </div>
              </>
            )}

            {formType === "extensions" && (
              <>
                <div>
                  <label className="block text-sm mb-1">Texture</label>
                  <input name="texture" placeholder="Deep Wave, Bone Straight…" className="w-full px-3 py-2 rounded-lg border border-taupe/30" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Length</label>
                  <input name="length" placeholder="18 inch" className="w-full px-3 py-2 rounded-lg border border-taupe/30" />
                </div>
              </>
            )}

            {(formType === "products" || formType === "stylists" || formType === "extensions") && (
              <div>
                <label className="block text-sm mb-1">Image URL</label>
                <input name="image" placeholder="https://…" className="w-full px-3 py-2 rounded-lg border border-taupe/30" />
              </div>
            )}

            {(formType === "products" || formType === "services" || formType === "extensions") && (
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea name="description" rows={2} className="w-full px-3 py-2 rounded-lg border border-taupe/30" />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-charcoal text-cream py-2.5 rounded-full text-sm font-medium">
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 border border-taupe/40 py-2.5 rounded-full text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
