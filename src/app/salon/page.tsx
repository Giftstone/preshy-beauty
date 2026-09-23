"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchServices, fetchStylists } from "@/lib/store";
import type { Service, Stylist } from "@/lib/data";

export default function SalonPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);

  useEffect(() => {
    (async () => {
      const [s, st] = await Promise.all([fetchServices(), fetchStylists()]);
      setServices(s);
      setStylists(st);
    })();
  }, []);

  return (
    <main>
      <section className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-charcoal/50 z-10" />
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1400&q=80"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Salon"
        />
        <div className="relative z-20 h-full flex items-center justify-center text-center text-white px-4">
          <div>
            <p className="text-sm tracking-widest uppercase mb-3 opacity-90">Hair Studio</p>
            <h1 className="font-serif text-4xl md:text-6xl">Hair artistry for every look</h1>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <p className="text-sm tracking-widest uppercase text-taupe mb-2">What we offer</p>
          <h2 className="font-serif text-3xl md:text-4xl">Hair Services</h2>
          <p className="text-taupe mt-3 max-w-xl mx-auto text-sm">
            Wig installations, Spanish curls, fish tails, deep wave, bone straight, braids and more.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-6 border border-taupe/10 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-serif text-xl">{s.name}</h3>
                <span className="text-sm text-taupe">{s.duration} min</span>
              </div>
              <p className="text-taupe text-sm leading-relaxed mb-4">{s.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-medium">ZMW {s.price.toLocaleString()}</span>
                <Link
                  href={`/book?service=${s.id}`}
                  className="text-sm text-terracotta hover:underline"
                >
                  Book →
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/book"
            className="inline-block bg-charcoal text-cream px-10 py-4 rounded-full font-medium hover:bg-charcoal/90 transition"
          >
            Book an Appointment
          </Link>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm tracking-widest uppercase text-taupe mb-2">The team</p>
            <h2 className="font-serif text-3xl md:text-4xl">Our Stylists</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stylists.map((st) => (
              <div key={st.id} className="text-center">
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-taupe/10">
                  <img src={st.image} alt={st.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-serif text-xl">{st.name}</h3>
                <p className="text-sm text-terracotta mt-1">{st.specialty}</p>
                <p className="text-sm text-taupe mt-2">{st.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
