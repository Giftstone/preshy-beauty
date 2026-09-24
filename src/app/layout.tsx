import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://preshybeauty.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Preshy Beauty — Apparel & Hair Salon | Ndola",
    template: "%s | Preshy Beauty",
  },
  description:
    "Preshy Beauty in Ndola Town Centre — curated apparel, wig installations, Spanish curls, fish tails, deep wave, bone straight and more. Call +260 978 974 055.",
  keywords: [
    "Preshy Beauty",
    "Ndola hair salon",
    "wig installation Ndola",
    "Spanish curls",
    "fish tail braids",
    "bone straight",
    "hair extensions Zambia",
  ],
  openGraph: {
    title: "Preshy Beauty — Apparel & Hair Salon",
    description: "Style and self-care in Ndola Town Centre.",
    locale: "en_ZM",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-cream text-charcoal`}
      >
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
