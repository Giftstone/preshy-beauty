import Link from "next/link";

export default function AboutPage() {
  return (
    <main>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm tracking-widest uppercase text-taupe mb-3">Our story</p>
            <h1 className="font-serif text-4xl md:text-5xl mb-6">
              Where style
              <br />
              meets self-care
            </h1>
            <p className="text-taupe leading-relaxed mb-6">
              Preshy Beauty was born from a simple belief: looking good and feeling good should live
              in the same space.
            </p>
            <p className="text-taupe leading-relaxed">
              Every piece is chosen for quality and timeless appeal. Every stylist is selected for
              skill and warmth — specialising in wigs, Spanish curls, fish tails, deep wave, bone
              straight and more.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
            className="rounded-2xl w-full h-[480px] object-cover"
            alt="Our space"
          />
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-10 text-center">
          <div>
            <p className="font-serif text-4xl text-terracotta mb-2">2019</p>
            <p className="text-sm text-taupe">Founded in Ndola</p>
          </div>
          <div>
            <p className="font-serif text-4xl text-terracotta mb-2">4</p>
            <p className="text-sm text-taupe">Expert hair stylists</p>
          </div>
          <div>
            <p className="font-serif text-4xl text-terracotta mb-2">4.9</p>
            <p className="text-sm text-taupe">Average client rating</p>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-3xl mb-6">Come visit us</h2>
        <p className="text-taupe mb-2">Ndola Town Centre, Ndola, Zambia</p>
        <p className="text-taupe mb-2">Mon – Sat · 09:00 – 18:00</p>
        <p className="text-taupe mb-1">
          <a href="tel:+260978974055" className="hover:text-charcoal">
            +260 978 974 055
          </a>
        </p>
        <p className="text-taupe mb-8">
          <a href="tel:+260962598440" className="hover:text-charcoal">
            +260 962 598 440
          </a>
        </p>
        <Link
          href="/book"
          className="inline-block bg-charcoal text-cream px-10 py-4 rounded-full font-medium"
        >
          Book a Visit
        </Link>
      </section>
    </main>
  );
}
