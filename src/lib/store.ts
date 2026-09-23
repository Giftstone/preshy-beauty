"use client";

import {
  products as defaultProducts,
  services as defaultServices,
  stylists as defaultStylists,
  type Product,
  type Service,
  type Stylist,
} from "./data";
import { getSupabase, isSupabaseConfigured } from "./supabase";

const KEYS = {
  products: "preshy-products",
  services: "preshy-services",
  stylists: "preshy-stylists",
  extensions: "preshy-extensions",
};

async function adminMutate(payload: {
  action: "upsert" | "delete" | "replace";
  table: string;
  rows?: unknown[];
  id?: number;
}): Promise<void> {
  if (!isSupabaseConfigured() || typeof window === "undefined") return;
  try {
    const res = await fetch("/api/admin/mutate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("admin mutate failed", data.error || res.status);
    }
  } catch (e) {
    console.error("admin mutate failed", e);
  }
}


export type Extension = {
  id: number;
  name: string;
  price: number;
  length?: string;
  texture?: string;
  image: string;
  description: string;
};

const defaultExtensions: Extension[] = [
  {
    id: 1,
    name: "Deep Wave Bundle (3pcs)",
    price: 1200,
    length: "18–22 inch",
    texture: "Deep Wave",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    description: "Soft deep wave bundles, natural look, easy to maintain.",
  },
  {
    id: 2,
    name: "Bone Straight Closure",
    price: 450,
    length: "16 inch",
    texture: "Bone Straight",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80",
    description: "Premium bone straight closure for seamless installs.",
  },
  {
    id: 3,
    name: "Spanish Curl Unit",
    price: 1800,
    length: "20 inch",
    texture: "Spanish Curls",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f785630b?w=600&q=80",
    description: "Ready-to-wear Spanish curl unit, full and bouncy.",
  },
];

function loadLocal<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal<T>(key: string, data: T[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: Number(row.id),
    name: String(row.name),
    price: Number(row.price),
    category: String(row.category || "tops"),
    image: String(row.image || ""),
    images: (row.images as string[]) || [String(row.image || "")],
    description: String(row.description || ""),
    sizes: (row.sizes as string[]) || ["S", "M", "L"],
    colors: (row.colors as string[]) || ["Black"],
  };
}

function mapService(row: Record<string, unknown>): Service {
  return {
    id: Number(row.id),
    name: String(row.name),
    duration: Number(row.duration || 60),
    price: Number(row.price),
    description: String(row.description || ""),
  };
}

function mapStylist(row: Record<string, unknown>): Stylist {
  return {
    id: Number(row.id),
    name: String(row.name),
    specialty: String(row.specialty || ""),
    image: String(row.image || ""),
    bio: String(row.bio || ""),
  };
}

function mapExtension(row: Record<string, unknown>): Extension {
  return {
    id: Number(row.id),
    name: String(row.name),
    price: Number(row.price),
    length: String(row.length || ""),
    texture: String(row.texture || ""),
    image: String(row.image || ""),
    description: String(row.description || ""),
  };
}

// ——— Products ———
export async function fetchProducts(): Promise<Product[]> {
  try {
    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb.from("products").select("*").order("id");
      if (!error && data && data.length > 0) return data.map(mapProduct);
    }
  } catch (e) {
    console.error("fetchProducts", e);
  }
  return loadLocal(KEYS.products, defaultProducts);
}

export function getProducts(): Product[] {
  return loadLocal(KEYS.products, defaultProducts);
}

export async function setProducts(data: Product[]): Promise<void> {
  saveLocal(KEYS.products, data);
  await adminMutate({
    action: "replace",
    table: "products",
    rows: data.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image,
      images: p.images,
      description: p.description,
      sizes: p.sizes,
      colors: p.colors,
      updated_at: new Date().toISOString(),
    })),
  });
}

export async function deleteProductRemote(id: number): Promise<void> {
  await adminMutate({ action: "delete", table: "products", id });
}

// ——— Services ———
export async function fetchServices(): Promise<Service[]> {
  try {
    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb.from("services").select("*").order("id");
      if (!error && data && data.length > 0) return data.map(mapService);
    }
  } catch (e) {
    console.error("fetchServices", e);
  }
  return loadLocal(KEYS.services, defaultServices);
}

export function getServices(): Service[] {
  return loadLocal(KEYS.services, defaultServices);
}

export async function setServices(data: Service[]): Promise<void> {
  saveLocal(KEYS.services, data);
  await adminMutate({
    action: "replace",
    table: "services",
    rows: data.map((s) => ({
      id: s.id,
      name: s.name,
      duration: s.duration,
      price: s.price,
      description: s.description,
    })),
  });
}

export async function deleteServiceRemote(id: number): Promise<void> {
  await adminMutate({ action: "delete", table: "services", id });
}

// ——— Stylists ———
export async function fetchStylists(): Promise<Stylist[]> {
  try {
    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb.from("stylists").select("*").order("id");
      if (!error && data && data.length > 0) return data.map(mapStylist);
    }
  } catch (e) {
    console.error("fetchStylists", e);
  }
  return loadLocal(KEYS.stylists, defaultStylists);
}

export function getStylists(): Stylist[] {
  return loadLocal(KEYS.stylists, defaultStylists);
}

export async function setStylists(data: Stylist[]): Promise<void> {
  saveLocal(KEYS.stylists, data);
  await adminMutate({
    action: "replace",
    table: "stylists",
    rows: data.map((s) => ({
      id: s.id,
      name: s.name,
      specialty: s.specialty,
      image: s.image,
      bio: s.bio,
    })),
  });
}

export async function deleteStylistRemote(id: number): Promise<void> {
  await adminMutate({ action: "delete", table: "stylists", id });
}

// ——— Extensions ———
export async function fetchExtensions(): Promise<Extension[]> {
  try {
    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb.from("extensions").select("*").order("id");
      if (!error && data && data.length > 0) return data.map(mapExtension);
    }
  } catch (e) {
    console.error("fetchExtensions", e);
  }
  return loadLocal(KEYS.extensions, defaultExtensions);
}

export function getExtensions(): Extension[] {
  return loadLocal(KEYS.extensions, defaultExtensions);
}

export async function setExtensions(data: Extension[]): Promise<void> {
  saveLocal(KEYS.extensions, data);
  await adminMutate({
    action: "replace",
    table: "extensions",
    rows: data.map((x) => ({
      id: x.id,
      name: x.name,
      price: x.price,
      length: x.length || "",
      texture: x.texture || "",
      image: x.image,
      description: x.description,
    })),
  });
}

export async function deleteExtensionRemote(id: number): Promise<void> {
  await adminMutate({ action: "delete", table: "extensions", id });
}

// ——— Bookings ———
export async function saveBooking(booking: {
  name: string;
  phone: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
}): Promise<void> {
  // Always keep local copy for admin offline
  const local = JSON.parse(
    typeof window !== "undefined"
      ? localStorage.getItem("preshy-bookings") || "[]"
      : "[]"
  );
  local.push({ ...booking, created: new Date().toISOString() });
  if (typeof window !== "undefined") {
    localStorage.setItem("preshy-bookings", JSON.stringify(local));
  }

  try {
    const sb = getSupabase();
    if (sb) {
      const { error } = await sb.from("bookings").insert({
        name: booking.name,
        phone: booking.phone,
        service: booking.service,
        stylist: booking.stylist,
        date: booking.date,
        time: booking.time,
        status: "confirmed",
      });
      if (error) console.error("saveBooking", error.message);
    }
  } catch (e) {
    console.error("saveBooking", e);
  }
}

export async function fetchBookings(): Promise<unknown[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return data;
  }
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("preshy-bookings") || "[]");
  }
  return [];
}

// ——— Orders ———
export async function saveOrder(order: {
  id: string;
  customer: Record<string, unknown>;
  items: unknown[];
  total: number;
  payment: string;
  payment_ref?: string;
  status: string;
}): Promise<void> {
  if (typeof window !== "undefined") {
    const local = JSON.parse(localStorage.getItem("preshy-orders") || "[]");
    local.push({ ...order, created: new Date().toISOString() });
    localStorage.setItem("preshy-orders", JSON.stringify(local));
  }
  try {
    const sb = getSupabase();
    if (sb) {
      const { error } = await sb.from("orders").upsert({
        id: order.id,
        customer: order.customer,
        items: order.items,
        total: order.total,
        payment: order.payment,
        payment_ref: order.payment_ref || "",
        status: order.status,
      });
      if (error) console.error("saveOrder", error.message);
    }
  } catch (e) {
    console.error("saveOrder", e);
  }
}

export async function fetchOrders(): Promise<unknown[]> {
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return data;
  }
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("preshy-orders") || "[]");
  }
  return [];
}

export function nextId(items: { id: number }[]): number {
  return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}

export { isSupabaseConfigured };
