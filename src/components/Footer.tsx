import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-taupe/20 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <p className="font-serif text-2xl mb-3">Preshy Beauty</p>
            <p className="text-sm text-taupe leading-relaxed">
              Apparel, hair dressing &amp; makeup in the heart of Ndola Town Centre.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-3 tracking-wide uppercase text-taupe">Explore</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:text-terracotta transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/salon" className="hover:text-terracotta transition">
                  Salon
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-terracotta transition">
                  Book appointment
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-terracotta transition">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium mb-3 tracking-wide uppercase text-taupe">Visit</p>
            <p className="text-sm text-taupe leading-relaxed">
              Ndola Town Centre
              <br />
              Ndola, Zambia
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-3 tracking-wide uppercase text-taupe">Contact</p>
            <ul className="space-y-2 text-sm text-taupe">
              <li>
                <a href="tel:+260978974055" className="hover:text-terracotta transition">
                  +260 978 974 055
                </a>
              </li>
              <li>
                <a href="tel:+260962598440" className="hover:text-terracotta transition">
                  +260 962 598 440
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/260978974055"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-terracotta transition"
                >
                  WhatsApp us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-taupe/20 flex flex-col sm:flex-row justify-between gap-3 text-xs text-taupe">
          <p>© {new Date().getFullYear()} Preshy Beauty. All rights reserved.</p>
          <p>ZMW · Ndola Town Centre</p>
        </div>
      </div>
    </footer>
  );
}
