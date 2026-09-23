"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchServices, fetchStylists, saveBooking } from "@/lib/store";
import type { Service, Stylist } from "@/lib/data";

export default function BookContent() {
  const searchParams = useSearchParams();
  const preService = searchParams.get("service") || "";
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);

  useEffect(() => {
    (async () => {
      const [s, st] = await Promise.all([fetchServices(), fetchStylists()]);
      setServices(s);
      setStylists(st);
    })();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const serviceId = fd.get("service") as string;
    const service = services.find((s) => s.id === parseInt(serviceId, 10));
    const stylistId = fd.get("stylist") as string;
    const stylist = stylists.find((s) => s.id === parseInt(stylistId, 10));
    const name = fd.get("name") as string;
    const date = fd.get("date") as string;
    const time = fd.get("time") as string;
    const phone = fd.get("phone") as string;

    void saveBooking({
      name,
      phone,
      service: service?.name || "",
      stylist: stylist?.name || "Any",
      date,
      time,
    }).then(() => {
      setMsg(`${name}, your ${service?.name} is confirmed for ${date} at ${time}.`);
      setDone(true);
    });
  };

  const today = new Date().toISOString().split("T")[0];

  if (done) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-sage">
          ✓
        </div>
        <h2 className="font-serif text-3xl mb-3">You&apos;re booked!</h2>
        <p className="text-taupe mb-4">{msg}</p>
        <p className="text-sm text-taupe mb-8">
          Questions? Call{" "}
          <a href="tel:+260978974055" className="text-terracotta">
            +260 978 974 055
          </a>{" "}
          or{" "}
          <a href="tel:+260962598440" className="text-terracotta">
            +260 962 598 440
          </a>
        </p>
        <a href="/" className="text-terracotta hover:underline">
          Return home
        </a>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center mb-12">
        <p className="text-sm tracking-widest uppercase text-taupe mb-2">Reserve your time</p>
        <h1 className="font-serif text-3xl md:text-5xl mb-4">Book an Appointment</h1>
        <p className="text-sm text-taupe">
          Call us:{" "}
          <a href="tel:+260978974055" className="hover:text-charcoal">
            +260 978 974 055
          </a>{" "}
          ·{" "}
          <a href="tel:+260962598440" className="hover:text-charcoal">
            +260 962 598 440
          </a>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-10 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Service</label>
          <select
            name="service"
            required
            defaultValue={preService}
            className="w-full px-4 py-3.5 rounded-xl border border-taupe/30 bg-cream focus:outline-none focus:border-terracotta"
          >
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — ZMW {s.price.toLocaleString()} ({s.duration} min)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Preferred Stylist (optional)</label>
          <select
            name="stylist"
            className="w-full px-4 py-3.5 rounded-xl border border-taupe/30 bg-cream focus:outline-none focus:border-terracotta"
          >
            <option value="">Any available</option>
            {stylists.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} — {st.specialty}
              </option>
            ))}
          </select>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              name="date"
              required
              min={today}
              className="w-full px-4 py-3.5 rounded-xl border border-taupe/30 bg-cream focus:outline-none focus:border-terracotta"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <select
              name="time"
              required
              className="w-full px-4 py-3.5 rounded-xl border border-taupe/30 bg-cream focus:outline-none focus:border-terracotta"
            >
              <option value="">Select time</option>
              {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map(
                (t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3.5 rounded-xl border border-taupe/30 bg-cream focus:outline-none focus:border-terracotta"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone / WhatsApp</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="+260 ..."
              className="w-full px-4 py-3.5 rounded-xl border border-taupe/30 bg-cream focus:outline-none focus:border-terracotta"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-charcoal text-cream py-4 rounded-full font-medium hover:bg-charcoal/90 transition text-lg"
        >
          Confirm Booking
        </button>
      </form>
    </main>
  );
}
