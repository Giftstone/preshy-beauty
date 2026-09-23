import Link from "next/link";
import { products } from "@/lib/data";

export default function Home() {
  const featured = products.slice(0, 4);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 to-charcoal/30 z-10" />
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80"
          alt="Fashion and beauty"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <p className="text-sm tracking-widest uppercase mb-4 opacity-90">
              New Season Collection
            </p>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight max-w-2xl mb-6">
              Style meets
              <br />
              self-care
            </h1>
            <p className="text-lg md:text-xl max-w-lg mb-8 opacity-90">
              Curated apparel and expert hair artistry in one serene space.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="bg-terracotta hover:bg-terracotta/90 text-white px-8 py-3.5 rounded-full text-sm font-medium transition"
              >
                Shop Collection
              </Link>
              <Link
                href="/book"
                className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/40 text-white px-8 py-3.5 rounded-full text-sm font-medium transition"
              >
                Book a Visit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              href: "/shop?cat=dresses",
              img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
              title: "Dresses",
              sub: "Effortless elegance",
            },
            {
              href: "/shop?cat=tops",
              img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
              title: "Tops & Blouses",
              sub: "Everyday luxury",
            },
            {
              href: "/salon",
              img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80",
              title: "Hair Studio",
              sub: "Book your transformation",
            },
          ].map((c) => (
            <Link key={c.title} href={c.href} className="group relative h-80 rounded-2xl overflow-hidden">
              <img
                src={c.img}
                alt={c.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="font-serif text-2xl">{c.title}</h3>
                <p className="text-sm opacity-80 mt-1">{c.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm tracking-widest uppercase text-taupe mb-2">Curated for you</p>
              <h2 className="font-serif text-3xl md:text-4xl">New Arrivals</h2>
            </div>
            <Link href="/shop" className="hidden sm:block text-sm font-medium hover:text-terracotta transition">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} className="group">
                <div className="aspect-[3/4] overflow-hidden rounded-xl bg-taupe/10 mb-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <h3 className="text-sm font-medium group-hover:text-terracotta transition">{p.name}</h3>
                <p className="text-sm text-taupe mt-1">ZMW {p.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Salon highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm tracking-widest uppercase text-taupe mb-3">Our Studio</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-6">
              Hair artistry
              <br />
              with intention
            </h2>
            <p className="text-taupe leading-relaxed mb-8">
              From wig installations and Spanish curls to fish tails, deep wave and bone straight —
              our stylists create looks that celebrate your beauty.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/book"
                className="bg-charcoal text-cream px-8 py-3.5 rounded-full text-sm font-medium hover:bg-charcoal/90 transition"
              >
                Book Appointment
              </Link>
              <Link
                href="/salon"
                className="border border-charcoal/20 px-8 py-3.5 rounded-full text-sm font-medium hover:border-charcoal transition"
              >
                View Services
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
              className="rounded-2xl w-full h-[420px] object-cover"
              alt="Salon experience"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-taupe/20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-sm text-taupe">
          <p className="font-serif text-lg text-charcoal mb-2">Preshy Beauty</p>
          <p>Ndola Town Centre, Ndola, Zambia</p>
          <p className="mt-2">
            <a href="tel:+260978974055" className="hover:text-charcoal">+260 978 974 055</a>
            {" · "}
            <a href="tel:+260962598440" className="hover:text-charcoal">+260 962 598 440</a>
          </p>
          <p className="mt-4">© 2026 Preshy Beauty</p>
        </div>
      </footer>
    </main>
  );
}
