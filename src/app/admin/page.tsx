"use client";

import { useEffect, useRef, useState } from "react";
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
  customer?: { name?: string; email?: string };
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

const PRODUCT_CATEGORIES = [
  "dresses",
  "tops",
  "bottoms",
  "suits",
  "perfumes",
  "beddings",
  "accessories",
  "outerwear",
];

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80";

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

  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<Tab>("products");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  const openAdd = (type: Tab) => {
    setFormType(type);
    setEditingId(null);
    setImagePreview("");
    setShowForm(true);
  };

  const openEdit = (type: Tab, id: number) => {
    setFormType(type);
    setEditingId(id);
    if (type === "products") {
      const p = products.find((x) => x.id === id);
      setImagePreview(p?.image || "");
    } else if (type === "stylists") {
      const s = stylists.find((x) => x.id === id);
      setImagePreview(s?.image || "");
    } else if (type === "extensions") {
      const x = extensions.find((e) => e.id === id);
      setImagePreview(x?.image || "");
    } else {
      setImagePreview("");
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setImagePreview("");
  };

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const img = imagePreview || DEFAULT_IMG;

    if (formType === "products") {
      const item: Product = {
        id: editingId ?? nextId(products),
        name: String(fd.get("name")),
        price: Number(fd.get("price")),
        category: String(fd.get("category") || "tops"),
        image: img,
        images: [img],
        description: String(fd.get("description") || ""),
        sizes: String(fd.get("sizes") || "S,M,L")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        colors: String(fd.get("colors") || "Black")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const next = editingId
        ? products.map((p) => (p.id === editingId ? item : p))
        : [...products, item];
      await setProducts(next);
      setProductsState(next);
    } else if (formType === "services") {
      const item: Service = {
        id: editingId ?? nextId(services),
        name: String(fd.get("name")),
        price: Number(fd.get("price")),
        duration: Number(fd.get("duration") || 60),
        description: String(fd.get("description") || ""),
      };
      const next = editingId
        ? services.map((s) => (s.id === editingId ? item : s))
        : [...services, item];
      await setServices(next);
      setServicesState(next);
    } else if (formType === "stylists") {
      const item: Stylist = {
        id: editingId ?? nextId(stylists),
        name: String(fd.get("name")),
        specialty: String(fd.get("specialty") || ""),
        image: img,
        bio: String(fd.get("bio") || ""),
      };
      const next = editingId
        ? stylists.map((s) => (s.id === editingId ? item : s))
        : [...stylists, item];
      await setStylists(next);
      setStylistsState(next);
    } else if (formType === "extensions") {
      const item: Extension = {
        id: editingId ?? nextId(extensions),
        name: String(fd.get("name")),
        price: Number(fd.get("price")),
        length: String(fd.get("length") || ""),
        texture: String(fd.get("texture") || ""),
        image: img,
        description: String(fd.get("description") || ""),
      };
      const next = editingId
        ? extensions.map((x) => (x.id === editingId ? item : x))
        : [...extensions, item];
      await setExtensions(next);
      setExtensionsState(next);
    }
    closeForm();
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

  const editProduct = editingId != null ? products.find((p) => p.id === editingId) : null;
  const editService = editingId != null ? services.find((s) => s.id === editingId) : null;
  const editStylist = editingId != null ? stylists.find((s) => s.id === editingId) : null;
  const editExtension = editingId != null ? extensions.find((x) => x.id === editingId) : null;

  return (
    <div className="min-h-screen bg-cream">
      <nav className="border-b border-taupe/20 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-serif text-xl">
              Preshy Beauty
            </Link>
            <span className="text-xs tracking-widest uppercase text-taupe">Admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <button onClick={handleLogout} className="opacity-60 hover:opacity-100">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
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

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                tab === t.id
                  ? "border-charcoal bg-charcoal text-cream"
                  : "border-taupe/40 hover:border-charcoal"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "bookings" && (
          <section>
            <h2 className="font-serif text-xl mb-4">Appointments</h2>
            {bookings.length === 0 ? (
              <p className="text-taupe text-sm">No appointments yet.</p>
            ) : (
              <div className="overflow-x-auto bg-white rounded-2xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-taupe border-b border-taupe/20">
                      <th className="px-5 py-3">Name</th>
                      <th className="px-5 py-3">Service</th>
                      <th className="px-5 py-3">Stylist</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => (
                      <tr key={i} className="border-b border-taupe/10">
                        <td className="px-5 py-3">{b.name}</td>
                        <td className="px-5 py-3">{b.service}</td>
                        <td className="px-5 py-3">{b.stylist}</td>
                        <td className="px-5 py-3">{b.date}</td>
                        <td className="px-5 py-3">{b.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {tab === "orders" && (
          <section>
            <h2 className="font-serif text-xl mb-4">Orders</h2>
            {orders.length === 0 ? (
              <p className="text-taupe text-sm">No orders yet.</p>
            ) : (
              <div className="overflow-x-auto bg-white rounded-2xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-taupe border-b border-taupe/20">
                      <th className="px-5 py-3">ID</th>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">Total</th>
                      <th className="px-5 py-3">Payment</th>
                      <th className="px-5 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o, i) => (
                      <tr key={i} className="border-b border-taupe/10">
                        <td className="px-5 py-3 font-mono text-xs">{o.id}</td>
                        <td className="px-5 py-3">{o.customer?.name}</td>
                        <td className="px-5 py-3">ZMW {(o.total || 0).toLocaleString()}</td>
                        <td className="px-5 py-3 capitalize">{o.payment}</td>
                        <td className="px-5 py-3">
                          {new Date(o.created_at || o.created || Date.now()).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {tab === "products" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-xl">Shop listings</h2>
              <button
                type="button"
                onClick={() => openAdd("products")}
                className="bg-charcoal text-cream px-5 py-2 rounded-full text-sm font-medium"
              >
                + Add product
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-xl p-4 flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} className="w-16 h-20 object-cover rounded-lg" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{p.name}</p>
                    <p className="text-xs text-taupe capitalize">{p.category}</p>
                    <p className="text-sm mt-1">ZMW {p.price.toLocaleString()}</p>
                    <div className="flex gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => openEdit("products", p.id)}
                        className="text-xs text-terracotta hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProduct(p.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "services" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-xl">Hair & makeup services</h2>
              <button
                type="button"
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
                  <div className="flex gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit("services", s.id)}
                      className="text-xs text-terracotta hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeService(s.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "stylists" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-xl">Team stylists</h2>
              <button
                type="button"
                onClick={() => openAdd("stylists")}
                className="bg-charcoal text-cream px-5 py-2 rounded-full text-sm font-medium"
              >
                + Add stylist
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stylists.map((st) => (
                <div key={st.id} className="bg-white rounded-xl p-4 flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={st.image} className="w-16 h-16 object-cover rounded-full" alt="" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{st.name}</p>
                    <p className="text-xs text-terracotta">{st.specialty}</p>
                    <p className="text-xs text-taupe mt-1">{st.bio}</p>
                    <div className="flex gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => openEdit("stylists", st.id)}
                        className="text-xs text-terracotta hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStylist(st.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "extensions" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-xl">Hair extensions for sale</h2>
              <button
                type="button"
                onClick={() => openAdd("extensions")}
                className="bg-charcoal text-cream px-5 py-2 rounded-full text-sm font-medium"
              >
                + Add extension
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {extensions.map((x) => (
                <div key={x.id} className="bg-white rounded-xl p-4 flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={x.image} className="w-16 h-20 object-cover rounded-lg" alt="" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{x.name}</p>
                    <p className="text-xs text-taupe">
                      {x.texture} · {x.length}
                    </p>
                    <p className="text-sm mt-1">ZMW {x.price.toLocaleString()}</p>
                    <div className="flex gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => openEdit("extensions", x.id)}
                        className="text-xs text-terracotta hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeExtension(x.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-charcoal/40 z-50 flex items-center justify-center p-4">
          <form
            key={`${formType}-${editingId ?? "new"}`}
            onSubmit={handleSave}
            className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-serif text-xl">
              {editingId ? "Edit" : "Add"}{" "}
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
              <input
                name="name"
                required
                defaultValue={
                  editProduct?.name ||
                  editService?.name ||
                  editStylist?.name ||
                  editExtension?.name ||
                  ""
                }
                className="w-full px-3 py-2 rounded-lg border border-taupe/30"
              />
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
                  defaultValue={
                    editProduct?.price ??
                    editService?.price ??
                    editExtension?.price ??
                    ""
                  }
                  className="w-full px-3 py-2 rounded-lg border border-taupe/30"
                />
              </div>
            )}

            {formType === "products" && (
              <>
                <div>
                  <label className="block text-sm mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={editProduct?.category || "tops"}
                    className="w-full px-3 py-2 rounded-lg border border-taupe/30"
                  >
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Sizes (comma separated)</label>
                  <input
                    name="sizes"
                    placeholder="XS,S,M,L,XL"
                    defaultValue={editProduct?.sizes?.join(",") || ""}
                    className="w-full px-3 py-2 rounded-lg border border-taupe/30"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Colors (comma separated)</label>
                  <input
                    name="colors"
                    placeholder="Black,Ivory"
                    defaultValue={editProduct?.colors?.join(",") || ""}
                    className="w-full px-3 py-2 rounded-lg border border-taupe/30"
                  />
                </div>
              </>
            )}

            {formType === "services" && (
              <div>
                <label className="block text-sm mb-1">Duration (minutes)</label>
                <input
                  name="duration"
                  type="number"
                  defaultValue={editService?.duration ?? 60}
                  className="w-full px-3 py-2 rounded-lg border border-taupe/30"
                />
              </div>
            )}

            {formType === "stylists" && (
              <>
                <div>
                  <label className="block text-sm mb-1">Specialty</label>
                  <input
                    name="specialty"
                    defaultValue={editStylist?.specialty || ""}
                    className="w-full px-3 py-2 rounded-lg border border-taupe/30"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Bio</label>
                  <textarea
                    name="bio"
                    rows={2}
                    defaultValue={editStylist?.bio || ""}
                    className="w-full px-3 py-2 rounded-lg border border-taupe/30"
                  />
                </div>
              </>
            )}

            {formType === "extensions" && (
              <>
                <div>
                  <label className="block text-sm mb-1">Texture</label>
                  <input
                    name="texture"
                    placeholder="Deep Wave, Bone Straight…"
                    defaultValue={editExtension?.texture || ""}
                    className="w-full px-3 py-2 rounded-lg border border-taupe/30"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Length</label>
                  <input
                    name="length"
                    placeholder="18 inch"
                    defaultValue={editExtension?.length || ""}
                    className="w-full px-3 py-2 rounded-lg border border-taupe/30"
                  />
                </div>
              </>
            )}

            {(formType === "products" ||
              formType === "stylists" ||
              formType === "extensions") && (
              <div>
                <label className="block text-sm mb-2">Image</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickImage}
                />
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="px-4 py-2 rounded-full border border-taupe/40 text-sm hover:border-charcoal"
                  >
                    {imagePreview ? "Change image" : "Add image"}
                  </button>
                  {imagePreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                  )}
                </div>
                <p className="text-xs text-taupe mt-1">JPG or PNG, max 2MB</p>
              </div>
            )}

            {(formType === "products" ||
              formType === "services" ||
              formType === "extensions") && (
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={
                    editProduct?.description ||
                    editService?.description ||
                    editExtension?.description ||
                    ""
                  }
                  className="w-full px-3 py-2 rounded-lg border border-taupe/30"
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-charcoal text-cream py-2.5 rounded-full text-sm font-medium"
              >
                {editingId ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={closeForm}
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
